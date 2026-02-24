#!/bin/bash
# /done - Session Summary Skill
# 会话结束时自动总结并记录到情景记忆

SESSION_ID=$(date +%Y%m%d-%H%M%S)
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
MEMORY_DIR="$HOME/.openclaw/workspace/memory/sessions"

# 确保目录存在
mkdir -p "$MEMORY_DIR"

# 创建会话总结文件
FILENAME="$MEMORY_DIR/session-$SESSION_ID.md"

cat > "$FILENAME" << EOF
# Session Summary - $DATE $TIME

**Session ID:** $SESSION_ID  
**Date:** $DATE  
**Time:** $TIME

## Key Discussion Points
<!-- 关键讨论点 -->
- 

## Decisions Made
<!-- 做出的决策 -->
- 

## Action Items / TODO
<!-- 后续任务 -->
- [ ] 

## Context & Notes
<!-- 上下文和备注 -->

## Related Sessions
<!-- 相关会话ID -->

EOF

echo "✓ Session summary created: $FILENAME"
echo "请填写关键讨论点、决策和后续任务"
