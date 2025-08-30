#!/bin/bash

# MCP (Model Context Protocol) 설정 스크립트
# 세미콜론 커뮤니티 프로젝트용
# - PostgreSQL: 글로벌 설정
# - Supabase: 프로젝트별 설정

echo "🚀 MCP (Model Context Protocol) 하이브리드 설정을 시작합니다..."
echo ""
echo "📋 설정 전략:"
echo "  🌍 PostgreSQL MCP: 글로벌 설정 (모든 프로젝트에서 사용)"
echo "  🏢 Supabase MCP: 프로젝트별 설정 (이 프로젝트에서만 사용)"
echo ""

# 색깔 설정
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 현재 디렉토리 확인
if [ ! -f ".mcp.json" ]; then
    echo -e "${RED}❌ .mcp.json 파일을 찾을 수 없습니다.${NC}"
    echo "프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

echo -e "${GREEN}✅ 프로젝트별 .mcp.json 파일이 확인되었습니다.${NC}"
echo -e "${BLUE}   → Supabase MCP 서버 설정 포함${NC}"
echo ""

# 1. 프로젝트별 Supabase 환경 변수 파일 확인
echo -e "${BLUE}1️⃣  프로젝트별 Supabase MCP 설정${NC}"

if [ ! -f ".env.mcp" ]; then
    echo -e "${YELLOW}⚠️  .env.mcp 파일이 없습니다.${NC}"
    echo "예시 파일을 복사하시겠습니까? (y/n)"
    read -r response
    
    if [[ $response =~ ^[Yy]$ ]]; then
        if [ -f ".env.mcp.example" ]; then
            cp .env.mcp.example .env.mcp
            echo -e "${GREEN}✅ .env.mcp 파일이 생성되었습니다.${NC}"
            echo -e "${YELLOW}📝 .env.mcp 파일을 편집해서 실제 Supabase 정보를 입력해주세요.${NC}"
            echo ""
        else
            echo -e "${RED}❌ .env.mcp.example 파일을 찾을 수 없습니다.${NC}"
        fi
    fi
fi

# 2. 글로벌 PostgreSQL MCP 설정 확인
echo -e "${PURPLE}2️⃣  글로벌 PostgreSQL MCP 설정${NC}"

# 글로벌 설정 파일 확인
GLOBAL_MCP_PATH="$HOME/.config/claude/mcp.json"
if [ -f "$GLOBAL_MCP_PATH" ]; then
    echo -e "${GREEN}✅ 글로벌 MCP 설정 파일 존재: ${GLOBAL_MCP_PATH}${NC}"
    
    # PostgreSQL MCP 서버 확인
    if grep -q "postgres" "$GLOBAL_MCP_PATH" 2>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL MCP 서버 설정 확인됨${NC}"
    else
        echo -e "${YELLOW}⚠️  PostgreSQL MCP 서버가 설정되지 않은 것 같습니다${NC}"
        echo -e "${BLUE}   → docs/MCP_GLOBAL_SETUP.md를 참고하여 설정해주세요${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  글로벌 MCP 설정 파일이 없습니다${NC}"
    echo -e "${BLUE}   → docs/MCP_GLOBAL_SETUP.md를 참고하여 PostgreSQL 글로벌 설정을 해주세요${NC}"
fi

# 글로벌 PostgreSQL 환경 변수 확인
if [ -n "$POSTGRES_CONNECTION_STRING" ]; then
    echo -e "${GREEN}✅ 글로벌 POSTGRES_CONNECTION_STRING 확인됨${NC}"
else
    echo -e "${YELLOW}⚠️  POSTGRES_CONNECTION_STRING 환경 변수가 설정되지 않았습니다${NC}"
    echo -e "${BLUE}   → 셸 설정 파일 (~/.zshrc 등)에 export 구문을 추가해주세요${NC}"
fi

echo ""

# 3. 필수 패키지 확인
echo -e "${BLUE}3️⃣  시스템 요구사항 확인${NC}"

# Node.js 버전 확인
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js ${NODE_VERSION} 확인됨${NC}"

# Claude Code 설치 확인
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>/dev/null || echo "버전 확인 불가")
    echo -e "${GREEN}✅ Claude Code 설치 확인됨 (${CLAUDE_VERSION})${NC}"
else
    echo -e "${YELLOW}⚠️  Claude Code CLI가 설치되지 않은 것 같습니다${NC}"
    echo -e "${BLUE}   → https://claude.ai/code 에서 설치해주세요${NC}"
fi

# MCP 서버 패키지 상태 (실제로는 필요시에만 설치)
echo "📋 MCP 서버 패키지 (필요시 자동 설치):"
echo "  🏢 @supabase/mcp-server-supabase (프로젝트별)"
echo "  🌍 @modelcontextprotocol/server-postgres (글로벌)"
echo ""

# 4. 프로젝트별 Supabase 환경 변수 확인
echo -e "${BLUE}4️⃣  프로젝트별 Supabase 환경 변수 확인${NC}"

if [ -f ".env.mcp" ]; then
    source .env.mcp
    
    # Supabase 설정 확인
    if [ -n "$SUPABASE_ACCESS_TOKEN" ] && [ "$SUPABASE_ACCESS_TOKEN" != "sbp_your_personal_access_token_here" ]; then
        echo -e "${GREEN}✅ SUPABASE_ACCESS_TOKEN 설정됨${NC}"
    else
        echo -e "${RED}❌ SUPABASE_ACCESS_TOKEN이 설정되지 않았습니다${NC}"
        echo -e "${BLUE}   → Supabase Dashboard에서 Personal Access Token 생성 필요${NC}"
    fi
    
    if [ -n "$SUPABASE_PROJECT_REF" ] && [ "$SUPABASE_PROJECT_REF" != "your_project_reference_id" ]; then
        echo -e "${GREEN}✅ SUPABASE_PROJECT_REF 설정됨${NC}"
    else
        echo -e "${RED}❌ SUPABASE_PROJECT_REF가 설정되지 않았습니다${NC}"
        echo -e "${BLUE}   → 프로젝트 Settings > General에서 Reference ID 확인 필요${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  .env.mcp 파일이 없습니다${NC}"
    echo -e "${BLUE}   → 'npm run mcp:setup' 실행 시 생성 옵션 선택${NC}"
fi

echo ""

# 5. 빠른 글로벌 PostgreSQL 설정 가이드
echo -e "${PURPLE}5️⃣  빠른 글로벌 PostgreSQL 설정 (한 번만 실행)${NC}"
echo ""
echo -e "${BLUE}다음 명령어로 PostgreSQL을 글로벌하게 설정할 수 있습니다:${NC}"
echo ""
echo -e "${YELLOW}# 1. 환경 변수 설정 (셸 설정 파일에 추가)${NC}"
echo 'export POSTGRES_CONNECTION_STRING="postgresql://username:password@hostname:port/database"'
echo ""
echo -e "${YELLOW}# 2. Claude Code CLI를 통한 글로벌 설정${NC}"
echo 'claude mcp add postgres-global \'
echo '  --global \'
echo '  --env POSTGRES_CONNECTION_STRING \'
echo '  -- npx -y @modelcontextprotocol/server-postgres'
echo ""
echo -e "${YELLOW}# 3. 또는 수동으로 글로벌 설정 파일 생성${NC}"
echo 'mkdir -p ~/.config/claude'
echo 'echo \'{"mcpServers":{"postgres-global":{"command":"npx","args":["-y","@modelcontextprotocol/server-postgres","${POSTGRES_CONNECTION_STRING}"]}}}'\' > ~/.config/claude/mcp.json'
echo ""

# 6. 연결 테스트 가이드
echo -e "${BLUE}6️⃣  연결 테스트 (Claude Code에서 실행)${NC}"
echo ""
echo "설정 완료 후 Claude Code에서 다음을 시도해보세요:"
echo ""
echo -e "${GREEN}🏢 Supabase MCP (프로젝트별) 테스트:${NC}"
echo '"이 프로젝트의 Supabase 테이블 구조를 보여줘"'
echo '"Supabase 스키마를 기반으로 TypeScript 타입을 생성해줘"'
echo '"현재 프로젝트의 데이터베이스 설정을 확인해줘"'
echo ""
echo -e "${PURPLE}🌍 PostgreSQL MCP (글로벌) 테스트:${NC}"
echo '"연결된 PostgreSQL 데이터베이스의 테이블 목록을 보여줘"'
echo '"데이터베이스 성능 상태를 분석해줘"'
echo '"인덱스 사용 현황을 확인해줘"'
echo ""

# 설정 완료 안내
echo "🎉 하이브리드 MCP 설정 가이드 완료!"
echo ""
echo -e "${GREEN}✅ 완료된 설정:${NC}"
echo "  🏢 프로젝트별 Supabase MCP 설정 (.mcp.json)"
echo "  📄 환경 변수 템플릿 (.env.mcp.example)"
echo ""
echo -e "${YELLOW}📋 다음 단계:${NC}"
echo "  1. .env.mcp 파일에 실제 Supabase 정보 입력"
echo "  2. 글로벌 PostgreSQL MCP 설정 (위의 5️⃣  참고)"
echo "  3. Claude Code에서 연결 테스트 (위의 6️⃣  참고)"
echo ""
echo -e "${BLUE}📚 추가 정보:${NC}"
echo "  - 프로젝트별 설정: docs/MCP_SETUP.md"
echo "  - 글로벌 설정: docs/MCP_GLOBAL_SETUP.md"
echo "  - Supabase Dashboard: https://supabase.com/dashboard"
echo "  - MCP 공식 문서: https://modelcontextprotocol.io"
echo ""
echo -e "${GREEN}✨ 이제 Claude Code에서 프로젝트별 Supabase + 글로벌 PostgreSQL을 함께 사용할 수 있습니다!${NC}"