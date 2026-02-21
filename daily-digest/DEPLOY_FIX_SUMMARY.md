# Daily Digest Deployment Fix Summary

## What I checked

1. Local project directory: `C:\Users\帅哥\Desktop\小颜二号的任务\daily-digest`
2. Live site and GitHub Pages origin:
   - `https://xyan.xin`
   - `https://rimengx1.github.io/daily-digest/`
3. Repository branches and deployment state:
   - `main` at `26dc22e3`
   - `gh-pages` at `e79ff9f6`
   - Latest deploy workflow run succeeded for commit `26dc22e3`

## Feature verification

Verified these features are present in deployed code and/or generated assets:

- AI Smart Summary tabs:
  - `30秒速读`
  - `标准摘要`
  - `小白解释`
- Trend Chart:
  - sparkline (`trend-sparkline`)
  - fire tag logic for `>50%` growth (`🔥`)
- Event Timeline:
  - `Related Progress` section
  - timeline rendering in article modal

## Root cause found

Deployment workflow was publishing repository root (`publish_dir: .`), while the working site artifacts that include recent feature updates are under:

- `daily-digest/dist`

This mismatch can cause pushes in the `daily-digest` app folder to not reliably appear on the live site.

## Fix applied

Updated workflow file:

- `.github/workflows/deploy.yml`

Changes:

1. Deploy source changed from repo root to app build output:
   - `publish_dir: ./daily-digest/dist`
2. Preserved custom domain during deploy by copying CNAME into publish output:
   - `cp CNAME daily-digest/dist/CNAME`

## Notes

- `gh` CLI is not installed in this environment, so GitHub status/workflow checks were completed via GitHub API and git commands.
- `xyan.xin` is currently served by GitHub Pages (response headers show `Server: GitHub.com`).
