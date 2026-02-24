# /done - Session Summary Skill

## Purpose
会话结束时自动生成总结，沉淀到情景记忆。

## Usage
在会话结束时运行：
```bash
done
```

## What it does
1. 生成会话总结模板
2. 提取关键讨论点
3. 记录决策和后续任务
4. 保存到 `memory/sessions/`
5. 关联会话ID便于追溯

## Template includes
- Session ID
- Date/Time
- Key Discussion Points
- Decisions Made
- Action Items/TODO
- Context & Notes
- Related Sessions (for linking)

## Integration
可以与 AGENTS.md 结合，每次会话结束时自动触发。
