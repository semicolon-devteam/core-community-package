#!/bin/bash

# GitHub MCP 설정 스크립트

echo "🔧 GitHub MCP 설정을 시작합니다..."

# .env.mcp 파일 확인
if [ ! -f ".env.mcp" ]; then
    echo "⚠️  .env.mcp 파일이 없습니다. 생성합니다..."
    cat > .env.mcp << 'EOF'
# GitHub MCP Configuration
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
EOF
    echo "📝 .env.mcp 파일이 생성되었습니다. GitHub Personal Access Token을 입력해주세요."
else
    echo "✅ .env.mcp 파일이 이미 존재합니다."
fi

# .mcp.json 파일 확인
if [ ! -f ".mcp.json" ]; then
    echo "⚠️  .mcp.json 파일이 없습니다. 생성합니다..."
    cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
EOF
    echo "✅ .mcp.json 파일이 생성되었습니다."
else
    echo "✅ .mcp.json 파일이 이미 존재합니다."
fi

# 환경 변수 로드 테스트
if [ -f ".env.mcp" ]; then
    source .env.mcp
    if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ] || [ "$GITHUB_PERSONAL_ACCESS_TOKEN" = "your_github_token_here" ]; then
        echo "⚠️  GitHub Personal Access Token이 설정되지 않았습니다."
        echo "📝 .env.mcp 파일에 토큰을 입력해주세요:"
        echo "   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx"
    else
        echo "✅ GitHub Personal Access Token이 설정되어 있습니다."
        echo "🚀 GitHub MCP 설정이 완료되었습니다!"
    fi
fi

echo ""
echo "📚 사용 방법:"
echo "1. Claude Desktop을 재시작하세요"
echo "2. 프로젝트를 다시 열어주세요"
echo "3. GitHub 리포지토리에 접근이 가능합니다"