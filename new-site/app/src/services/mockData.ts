import type { Article } from '@/types';

let articleCounter = 1;

// 中文来源名称
const rssSources = [
  '科技 crunch', '边缘科技', 'Ars 技术', '连线杂志', 'MIT 科技评论',
  '自然 AI', '科学日报', 'VentureBeat', 'AI 新闻', 'DeepMind 博客'
];

const aiHotSources = [
  'OpenAI 博客', '谷歌 AI', '微软研究院', 'Meta AI', 'Anthropic',
  'Stability AI', 'Hugging Face', '英伟达博客', 'IBM 研究院', '亚马逊科学'
];

const chineseTitles = [
  'GPT-5：下一代语言模型震撼发布',
  '突破：新AI模型达到人类水平推理能力',
  'AI的未来：2024年值得关注的十大趋势',
  '革命性神经网络架构揭晓，性能提升300%',
  'AI驱动的药物发现显示出有希望的结果',
  '自动驾驶汽车：前方的道路与挑战',
  '医疗保健中的机器学习：新时代开启',
  'AI伦理：平衡创新与社会责任',
  '量子计算与机器学习的结合带来突破',
  '计算机视觉突破：看见不可见之物',
  '自然语言处理：超越聊天机器人的应用',
  '强化学习：从游戏到现实世界的跨越',
  'AI在教育中的应用：个性化学习路径',
  '多模态AI系统的崛起与前景',
  '边缘AI：将智能带到设备端',
  '联邦学习：保护隐私的AI新范式',
  '生成式AI：创造力与技术的完美结合',
  'AI应对气候变化：可持续未来的解决方案',
  '机器人技术与AI：完美的合作伙伴',
  '深度学习：理解神经网络的黑盒',
];

// 30秒速读内容（简短摘要）
const quickSummaries = [
  '研究人员开发了一种训练大型语言模型的新方法，显著降低了计算需求，同时保持性能。这项突破可能改变AI行业的格局。',
  '神经网络架构搜索的突破导致了更高效的模型设计的发现，其性能优于现有的最先进系统，为实际应用铺平道路。',
  '多模态AI的最新进展展示了在理解和生成跨文本、图像和音频内容方面的前所未有的能力，开启了新的应用场景。',
  '无监督学习的新技术使AI系统能够以惊人的准确性从未标记数据中学习，大幅降低训练成本。',
  '最近的研究表明，AI模型现在可以解决以前被认为超出机器能力的复杂数学问题，标志着推理能力的重大飞跃。',
  'Transformer架构的创新正在推动自然语言理解的可能性边界，使得模型能够处理更长的上下文和更复杂的任务。',
  '符号推理与神经网络的整合为可解释的AI系统开辟了新的可能性，让AI的决策过程更加透明可信。',
  '少样本学习的进步通过减少所需训练数据的数量，使AI技术更加民主化，小型团队也能开发强大的AI应用。',
  '新研究揭示了如何优化注意力机制以获得更好的性能和效率，这一发现将直接影响下一代AI模型的设计。',
  '最新的AI基准测试显示在推理和问题解决能力方面有显著改进，表明AI正在向通用人工智能迈进。',
];

// 全文摘要（详细摘要）
const fullSummaries = [
  '在一项突破性进展中，研究人员揭示了一种有望彻底改变人工智能领域的新架构。这个新模型建立在Transformer技术的基础上，引入了多项关键创新，解决了当前系统的局限性。由全球顶尖机构专家组成的研究团队花费了两年多的时间来开发和完善这一方法。他们的工作专注于提高注意力机制的效率，同时保持模型捕捉长距离依赖关系的能力。该研究已经过同行评审，将在即将举行的国际机器学习会议上发表。',
  '人工智能继续重塑全球各行各业，新应用以前所未有的速度涌现。从医疗保健到金融，从教育到娱乐，人工智能技术正在改变我们工作、学习和与周围世界互动的方式。大型语言模型的最新发展特别引起了公众的关注。这些系统在大量文本数据上进行训练，可以生成类似人类的回复，协助写作任务，甚至参与创造性工作。现代AI系统越来越多模态化，能够处理和生成包括文本、图像、音频和视频在内的不同格式的内容。',
  '自诞生以来，机器学习已经走过了漫长的道路，从一个小众的学术学科发展成为触及现代生活几乎方方面面的变革性技术。这种演变是由算法、硬件和数据可用性的进步推动的。深度学习的最新成功尤其引人注目，它是机器学习的一个子集，基于人工神经网络。这些网络受到人脑结构的启发，可以通过多层处理来学习数据的复杂表示。展望未来，机器学习与机器人技术、物联网和量子计算等其他技术的整合有望开辟新的前沿。',
];

// 小白解释（通俗易懂的解释）
const simpleExplanations = [
  '想象一下，你有一个超级聪明的助手，它可以帮你写文章、回答问题、甚至帮你写代码。这个研究就是让这种助手变得更聪明、更快、更省电。科学家们发明了一种新方法，让AI学习的时候不需要看那么多例子，但是学得更好。就像你学骑自行车，以前需要练100次，现在只需要练10次就能骑得很好。',
  'AI就像是一个很会学习的学生。以前，这个学生只能看书学习，现在它还能看图、听声音、看视频，就像一个全能的学习者。这项研究让这个学生变得更厉害，它不仅能理解你说的话，还能理解你的意思，甚至能猜到你接下来想说什么。这对我们的生活会有很大帮助，比如更好的翻译软件、更聪明的语音助手。',
  '机器学习就是让电脑像人一样会学习。以前，你要告诉电脑每一步怎么做，现在你只需要给它看很多例子，它自己就能学会。深度学习是机器学习的一种，它模仿人脑的工作方式，让电脑能够识别图片、理解语言、甚至下棋赢过世界冠军。这项技术正在改变我们的世界，从手机上的语音助手到自动驾驶汽车，都在用它。',
];

// 完整的文章内容
const fullContents = [
  `在一项突破性进展中，研究人员揭示了一种有望彻底改变人工智能领域的新架构。这个新模型建立在Transformer技术的基础上，引入了多项关键创新，解决了当前系统的局限性。

由全球顶尖机构专家组成的研究团队花费了两年多的时间来开发和完善这一方法。他们的工作专注于提高注意力机制的效率，同时保持模型捕捉长距离依赖关系的能力。

"我们在这里取得的成就代表了一个重大飞跃，"该项目首席研究员陈莎拉博士说。"我们的模型不仅在标准基准测试中优于现有系统，而且仅使用了一小部分计算资源。"

这项研究的影响远远超出了学术兴趣的范畴。行业专家预测，这些进步可能会带来更易获取的AI工具、减少训练大型模型的环境影响，以及以前因资源限制而不切实际的新应用。

研究的主要发现包括：
- 训练时间减少40%
- 内存需求减少50%
- 推理任务性能提升
- 更好地处理长上下文场景

该研究已经过同行评审，将在即将举行的国际机器学习会议上发表。`,

  `人工智能继续重塑全球各行各业，新应用以前所未有的速度涌现。从医疗保健到金融，从教育到娱乐，人工智能技术正在改变我们工作、学习和与周围世界互动的方式。

大型语言模型的最新发展特别引起了公众的关注。这些系统在大量文本数据上进行训练，可以生成类似人类的回复，协助写作任务，甚至参与创造性工作。然而，它们的能力远远超出了简单的文本生成。

现代AI系统越来越多模态化，能够处理和生成包括文本、图像、音频和视频在内的不同格式的内容。这种能力的融合为人机交互和创造性表达开辟了新的可能性。

这些进步背后的技术很复杂，涉及复杂的神经网络架构、海量数据集和大量计算资源。然而，其基本原理植根于数十年来在机器学习、统计学和认知科学方面的研究。

随着这些技术的不断发展，关于它们对社会、经济和个人生活影响的重要问题也随之出现。确保AI造福人类同时最小化潜在危害，需要仔细考虑伦理原则、监管框架和社会价值观。

AI的未来不是预先确定的。它将由我们今天做出的关于如何开发、部署和管理这些强大技术的选择所塑造。`,

  `自诞生以来，机器学习已经走过了漫长的道路，从一个小众的学术学科发展成为触及现代生活几乎方方面面的变革性技术。这种演变是由算法、硬件和数据可用性的进步推动的。

从本质上讲，机器学习是关于创建能够从经验中学习的系统。这些系统不是被明确编程来执行特定任务，而是识别数据中的模式并使用这些模式进行预测或决策。

深度学习的最新成功尤其引人注目，它是机器学习的一个子集，基于人工神经网络。这些网络受到人脑结构的启发，可以通过多层处理来学习数据的复杂表示。

深度学习兴起的关键因素之一是大型数据集和强大计算资源的可用性。大数据和GPU的结合使研究人员能够训练具有数百万甚至数十亿参数的模型。

然而，该领域继续面临重大挑战。数据隐私、模型可解释性和算法偏见等问题需要持续关注和创新解决方案。研究人员正在积极探索新方法，包括联邦学习、可解释AI和公平感知机器学习。

展望未来，机器学习与机器人技术、物联网和量子计算等其他技术的整合有望开辟新的前沿。随着这些技术的成熟和更广泛的应用，未来十年可能会看到更深远的影响。`,
];

function generateArticleNumber(): number {
  return articleCounter++;
}

// Generate score between 60-99 (0-100 percentage, integer only)
function generateAIScore(): number {
  return Math.floor(60 + Math.random() * 40);
}

function generateQuickSummary(): string {
  return quickSummaries[Math.floor(Math.random() * quickSummaries.length)];
}

function generateFullSummary(): string {
  return fullSummaries[Math.floor(Math.random() * fullSummaries.length)];
}

function generateSimpleExplanation(): string {
  return simpleExplanations[Math.floor(Math.random() * simpleExplanations.length)];
}

function generateAITitle(index: number): string {
  const prefixes = ['【重磅】', '【前沿】', '【突破】', '【深度】', '【独家】'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return prefix + chineseTitles[index % chineseTitles.length];
}

export function generateMockArticles(count: number = 20): Article[] {
  const articles: Article[] = [];
  
  for (let i = 0; i < count; i++) {
    const isRSS = i < count / 2;
    
    articles.push({
      id: `article-${Date.now()}-${i}`,
      title: chineseTitles[i % chineseTitles.length],
      aiTitle: generateAITitle(i),
      summary: '',
      aiSummary: generateQuickSummary(),
      aiInterpretation: generateFullSummary(),
      aiExplanation: generateSimpleExplanation(),
      aiScore: generateAIScore(),
      content: fullContents[i % fullContents.length],
      url: `https://example.com/article-${i}`,
      source: isRSS ? rssSources[i % rssSources.length] : aiHotSources[i % aiHotSources.length],
      category: isRSS ? 'rss' : 'ai-hot',
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      isFavorited: false,
      language: 'zh',
      articleNumber: generateArticleNumber(),
    });
  }
  
  return articles;
}

export function generateMoreArticles(_existingArticles: Article[]): Article[] {
  const newArticles: Article[] = [];
  const count = 5;
  
  for (let i = 0; i < count; i++) {
    const isRSS = Math.random() > 0.5;
    const titleIndex = Math.floor(Math.random() * chineseTitles.length);
    
    newArticles.push({
      id: `article-${Date.now()}-${i}`,
      title: chineseTitles[titleIndex],
      aiTitle: generateAITitle(titleIndex),
      summary: '',
      aiSummary: generateQuickSummary(),
      aiInterpretation: generateFullSummary(),
      aiExplanation: generateSimpleExplanation(),
      aiScore: generateAIScore(),
      content: fullContents[Math.floor(Math.random() * fullContents.length)],
      url: `https://example.com/article-${Date.now()}-${i}`,
      source: isRSS ? rssSources[Math.floor(Math.random() * rssSources.length)] : aiHotSources[Math.floor(Math.random() * aiHotSources.length)],
      category: isRSS ? 'rss' : 'ai-hot',
      publishedAt: new Date(),
      isFavorited: false,
      language: 'zh',
      articleNumber: generateArticleNumber(),
    });
  }
  
  return newArticles;
}

export function generateRecommendedArticles(): Article[] {
  const articles: Article[] = [];
  const count = 10;
  
  for (let i = 0; i < count; i++) {
    articles.push({
      id: `recommended-${Date.now()}-${i}`,
      title: chineseTitles[i % chineseTitles.length],
      aiTitle: generateAITitle(i),
      summary: '',
      aiSummary: generateQuickSummary(),
      aiInterpretation: generateFullSummary(),
      aiExplanation: generateSimpleExplanation(),
      aiScore: generateAIScore(),
      content: fullContents[i % fullContents.length],
      url: `https://example.com/recommended-${i}`,
      source: '编辑精选',
      category: 'recommended',
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      isFavorited: false,
      language: 'zh',
      articleNumber: generateArticleNumber(),
    });
  }
  
  return articles;
}
