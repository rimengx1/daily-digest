"""
Scheduled RSS fetch script with AI enrichment.

Main upgrades:
1. Crawl full article text from source URL before AI summarization.
2. Generate quick/full/explanation/broadcast in one structured AI call.
3. Enforce Chinese output and strip raw arXiv metadata artifacts.
"""

import json
import os
import re
import sys
import time
from html import unescape
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

# Add project path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.database import init_database, save_articles
from app.services.rss_fetcher import fetch_all_rss


HTTP_TIMEOUT: Tuple[int, int] = (6, 15)
MAX_AI_INPUT_CHARS = int(os.environ.get("MAX_AI_INPUT_CHARS", "12000"))
MAX_STORED_FULLTEXT_CHARS = int(os.environ.get("MAX_STORED_FULLTEXT_CHARS", "24000"))
MIN_VALID_CRAWL_CHARS = int(os.environ.get("MIN_VALID_CRAWL_CHARS", "350"))

HTTP_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
}

http = requests.Session()
http.headers.update(HTTP_HEADERS)

_crawl_cache: Dict[str, str] = {}


def clean_plain_text(value: str) -> str:
    if not value:
        return ""
    text = unescape(value)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[\t\r\n]+", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"(?i)^arxiv:\S+\s*", "", text)
    text = re.sub(r"(?i)announce\s*type:\s*\w+\s*", "", text)
    text = re.sub(r"(?i)^abstract:\s*", "", text)
    return text.strip(" -|:;,.")


def cleanup_ai_text(value: str, max_chars: int = 0) -> str:
    text = clean_plain_text(value or "")
    text = re.sub(r"(?i)\b(arxiv:\S+|announce type:\s*\w+|abstract:)\b", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    if max_chars > 0:
        text = text[:max_chars].strip()
    return text


def extract_json_object(raw: str) -> Optional[Dict[str, Any]]:
    if not raw:
        return None

    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()

    for candidate in [text]:
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, dict):
                return parsed
        except Exception:
            pass

    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        return None
    try:
        parsed = json.loads(match.group(0))
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        return None
    return None


def extract_readable_text_from_html(html: str, page_url: str) -> str:
    if not html:
        return ""

    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "svg", "iframe", "footer", "nav"]):
        tag.decompose()

    # arXiv has a stable abstract block.
    if "arxiv.org" in (page_url or ""):
        abstract = soup.select_one("blockquote.abstract")
        if abstract:
            return cleanup_ai_text(abstract.get_text(" ", strip=True), max_chars=4000)

    candidates: List[str] = []
    selectors = [
        "article",
        "main",
        "[itemprop='articleBody']",
        ".article-content",
        ".entry-content",
        ".post-content",
        ".article-body",
        "#content",
    ]
    for selector in selectors:
        for node in soup.select(selector):
            text = cleanup_ai_text(node.get_text(" ", strip=True))
            if len(text) >= 300:
                candidates.append(text)

    if not candidates:
        paragraphs = []
        for p in soup.find_all("p"):
            p_text = cleanup_ai_text(p.get_text(" ", strip=True))
            if len(p_text) >= 40:
                paragraphs.append(p_text)
        if paragraphs:
            candidates.append(" ".join(paragraphs))

    if not candidates and soup.body:
        candidates.append(cleanup_ai_text(soup.body.get_text(" ", strip=True)))

    if not candidates:
        return ""

    best = max(candidates, key=len)
    return best[:MAX_STORED_FULLTEXT_CHARS]


def crawl_full_text(url: str) -> str:
    if not url:
        return ""
    if url in _crawl_cache:
        return _crawl_cache[url]

    if not url.startswith(("http://", "https://")):
        _crawl_cache[url] = ""
        return ""

    try:
        response = http.get(url, timeout=HTTP_TIMEOUT, allow_redirects=True)
        if response.status_code >= 400:
            print(f"    [WARN] crawl failed {response.status_code}: {url}")
            _crawl_cache[url] = ""
            return ""

        html = response.text or ""
        full_text = extract_readable_text_from_html(html, response.url or url)
        _crawl_cache[url] = full_text
        return full_text
    except Exception as exc:
        host = urlparse(url).netloc or "unknown-host"
        print(f"    [WARN] crawl exception ({host}): {exc}")
        _crawl_cache[url] = ""
        return ""


def get_best_article_text(article: Dict[str, Any]) -> Tuple[str, str]:
    url = article.get("url", "") or ""
    rss_text = clean_plain_text(article.get("content", "") or article.get("summary", ""))
    crawled = crawl_full_text(url)

    if crawled:
        text = crawled
        source = "crawl"
    else:
        text = rss_text
        source = "rss"

    text = text[:MAX_STORED_FULLTEXT_CHARS]
    return text, source


def call_deepseek(messages: List[Dict[str, str]], api_key: str, temperature: float, max_tokens: int) -> Optional[str]:
    if not api_key:
        return None
    try:
        response = http.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-chat",
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            },
            timeout=60,
        )
        if response.status_code != 200:
            print(f"    [WARN] DeepSeek API error: {response.status_code}")
            return None
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as exc:
        print(f"    [WARN] DeepSeek request failed: {exc}")
        return None


def generate_ai_core_content(title: str, full_text: str, api_key: str) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    if not api_key:
        return None, None, None, None

    system_prompt = (
        "你是科技新闻中文编辑。你必须基于提供的“全文正文”写作，不得照抄原文，不得编造事实。"
        "严格返回 JSON 对象，不要 markdown，不要多余文本。JSON 格式："
        '{"quick":"", "full":"", "explanation":"", "broadcast":""}。'
        "要求："
        "1) 全部使用简体中文。"
        "2) quick：90-130字，适合30秒读完。"
        "3) full：280-420字，必须出现“为什么重要”与“影响面”两个部分。"
        "4) “影响面”至少覆盖5个维度中的4个：技术、商业、产业链、监管/安全、用户/社会。"
        "5) explanation：60-90字，给非专业用户看得懂。"
        "6) broadcast 必须严格四段并保留标签："
        "[这条是什么]、[翻成人话]、[为什么重要]、[下一步确认点]。"
        "7) 禁止输出这些原始字段：arXiv:、Announce Type:、Abstract:。"
    )
    user_prompt = f"标题：{title}\n\n全文正文：\n{full_text[:MAX_AI_INPUT_CHARS]}"
    raw = call_deepseek(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        api_key=api_key,
        temperature=0.4,
        max_tokens=1000,
    )
    if not raw:
        return None, None, None, None

    payload = extract_json_object(raw)
    if not payload:
        fallback = cleanup_ai_text(raw, max_chars=240)
        return fallback, cleanup_ai_text(raw, max_chars=500), None, None

    quick = cleanup_ai_text(str(payload.get("quick", "") or ""), max_chars=220)
    full = cleanup_ai_text(str(payload.get("full", "") or ""), max_chars=900)
    explanation = cleanup_ai_text(str(payload.get("explanation", "") or ""), max_chars=180)
    broadcast = str(payload.get("broadcast", "") or "").strip()
    broadcast = re.sub(r"(?i)\b(arxiv:\S+|announce type:\s*\w+|abstract:)\b", "", broadcast).strip()

    return (
        quick or None,
        full or None,
        explanation or None,
        broadcast or None,
    )


def generate_simple_explanation(title: str, content: str, api_key: str) -> Optional[str]:
    raw = call_deepseek(
        messages=[
            {
                "role": "system",
                "content": "请用简体中文解释文章核心内容，让非专业用户也能理解。60-90字，直接输出解释。",
            },
            {"role": "user", "content": f"标题：{title}\n\n正文：{content[:3000]}"},
        ],
        api_key=api_key,
        temperature=0.4,
        max_tokens=180,
    )
    return cleanup_ai_text(raw or "", max_chars=180) or None


def extract_and_analyze_stocks(title: str, content: str, api_key: str) -> List[Dict[str, Any]]:
    if not api_key:
        return []

    raw = call_deepseek(
        messages=[
            {
                "role": "system",
                "content": (
                    "你是金融分析助手。识别文中提到的上市公司/股票，返回 JSON 数组。"
                    '格式：[{"symbol":"AAPL","name":"Apple","reason":"20字内原因","change":2.3}]。'
                    "change 取值 -5 到 5。最多返回3项。没有就返回 []。"
                ),
            },
            {"role": "user", "content": f"标题：{title}\n\n正文：{content[:5000]}"},
        ],
        api_key=api_key,
        temperature=0.3,
        max_tokens=350,
    )
    if not raw:
        return []

    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()

    try:
        parsed = json.loads(text)
        if not isinstance(parsed, list):
            return []
    except Exception:
        match = re.search(r"\[[\s\S]*\]", text)
        if not match:
            return []
        try:
            parsed = json.loads(match.group(0))
            if not isinstance(parsed, list):
                return []
        except Exception:
            return []

    result: List[Dict[str, Any]] = []
    for item in parsed[:3]:
        if not isinstance(item, dict):
            continue
        symbol = str(item.get("symbol", "")).upper().strip()[:16]
        name = cleanup_ai_text(str(item.get("name", "")), max_chars=40)
        reason = cleanup_ai_text(str(item.get("reason", "")), max_chars=50)
        try:
            change = float(item.get("change", 0))
        except Exception:
            change = 0.0
        change = max(-5.0, min(5.0, change))
        if symbol and name:
            result.append({"symbol": symbol, "name": name, "reason": reason, "change": round(change, 2)})
    return result


def generate_ai_score(title: str, content: str, api_key: str) -> Optional[int]:
    raw = call_deepseek(
        messages=[
            {
                "role": "system",
                "content": (
                    "你是科技新闻价值评估助手。请按 0-100 打分，只返回整数。"
                    "评估维度：信息价值、时效性、影响力、可验证性。"
                ),
            },
            {"role": "user", "content": f"标题：{title}\n\n正文：{content[:3000]}"},
        ],
        api_key=api_key,
        temperature=0.2,
        max_tokens=12,
    )
    if not raw:
        return None

    match = re.search(r"\d{1,3}", raw)
    if not match:
        return None
    score = int(match.group(0))
    return max(0, min(100, score))


def process_article_with_ai(article: Dict[str, Any], api_key: str) -> Dict[str, Any]:
    if not api_key:
        return article

    title = str(article.get("title", "") or "")
    if not title:
        return article

    print(f"  Processing AI: {title[:60]}...")

    best_text, text_source = get_best_article_text(article)
    if len(best_text) < MIN_VALID_CRAWL_CHARS:
        # Still keep content for short posts, but report weak context.
        print(f"    [WARN] short content ({len(best_text)} chars), source={text_source}")
    else:
        print(f"    [OK] content source={text_source}, chars={len(best_text)}")

    if best_text:
        article["fullText"] = best_text
        article["content"] = best_text
        article["fullTextSource"] = text_source

    quick_summary, full_summary, explanation, broadcast = generate_ai_core_content(title, best_text, api_key)
    if quick_summary:
        article["aiSummary"] = quick_summary
        print("    [OK] aiSummary updated")
    if full_summary:
        article["aiInterpretation"] = full_summary
        print("    [OK] aiInterpretation updated")
    if explanation:
        article["aiExplanation"] = explanation
        print("    [OK] aiExplanation updated")
    if broadcast:
        article["aiBroadcastScript"] = broadcast
        print("    [OK] aiBroadcastScript updated")

    # Fallback only when core generation misses explanation.
    if not article.get("aiExplanation"):
        ai_explanation = generate_simple_explanation(title, best_text, api_key)
        if ai_explanation:
            article["aiExplanation"] = ai_explanation
            print("    [OK] aiExplanation fallback updated")

    ai_score = generate_ai_score(title, best_text, api_key)
    if ai_score is not None:
        article["aiScore"] = ai_score
        print(f"    [OK] aiScore={ai_score}")

    stocks = extract_and_analyze_stocks(title, best_text, api_key)
    if stocks:
        article["aiStocks"] = stocks
        print(f"    [OK] aiStocks={len(stocks)}")

    return article


def main() -> None:
    print("=" * 56)
    print("RSS Fetcher with AI (Full-Text Crawl) - xyan.xin")
    print("=" * 56)

    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        print("\n[WARN] DEEPSEEK_API_KEY is missing; AI enrichment will be skipped.")
    else:
        print("\n[OK] DEEPSEEK_API_KEY detected")

    init_database()

    print("\n[STEP] Fetching RSS feeds...")
    articles = fetch_all_rss()
    print(f"  fetched articles: {len(articles)}")

    if api_key and articles:
        print("\n[STEP] Processing articles with full-text AI pipeline...")
        processed_articles: List[Dict[str, Any]] = []
        for index, article in enumerate(articles, start=1):
            print(f"\n[{index}/{len(articles)}]")
            try:
                processed = process_article_with_ai(article, api_key)
                processed_articles.append(processed)
                time.sleep(0.35)  # reduce API burst failures
            except Exception as exc:
                print(f"    [ERR] processing failed: {exc}")
                processed_articles.append(article)
        articles = processed_articles

    print("\n[STEP] Saving merged articles...")
    inserted = save_articles(articles)

    print("\n" + "=" * 56)
    print(f"[DONE] Completed. New inserted articles: {inserted}")
    print("=" * 56)


if __name__ == "__main__":
    main()
