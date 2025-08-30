# 프로젝트별 Supabase MCP 설정 가이드

이 가이드는 **세미콜론 커뮤니티 프로젝트**에서 **Supabase MCP Server를 프로젝트별로 설정**하는 방법을 안내합니다.

> 📋 **하이브리드 MCP 전략**: PostgreSQL은 글로벌 설정, Supabase는 프로젝트별 설정
> - 🌍 **PostgreSQL MCP**: [글로벌 설정 가이드](MCP_GLOBAL_SETUP.md) 참고
> - 🏢 **Supabase MCP**: 이 문서에서 안내 (프로젝트별)

## 🎯 프로젝트별 Supabase MCP의 장점

### 왜 Supabase를 프로젝트별로 설정하는가?
- **보안 격리**: 각 커뮤니티 서비스별로 독립적인 액세스 제어
- **프로젝트 특화**: 각 서비스의 고유한 스키마와 설정에 최적화
- **개발 효율성**: 해당 프로젝트에서만 관련된 Supabase 데이터에 접근
- **유지보수성**: 서비스별로 독립적인 관리와 업데이트

## 🚀 Supabase MCP Server 기능

### 프로젝트별 Supabase MCP가 제공하는 기능:
- **프로젝트 관리**: 현재 프로젝트의 Supabase 설정 관리
- **스키마 설계**: 프로젝트별 테이블 구조 설계 및 수정
- **TypeScript 타입 생성**: 현재 프로젝트 스키마 기반 타입 자동 생성
- **데이터 쿼리**: 프로젝트별 데이터베이스 안전한 쿼리 (읽기 전용)
- **로그 조회**: 해당 프로젝트의 디버깅 및 모니터링

## 🔧 프로젝트별 환경 변수 설정

이 프로젝트에서만 사용할 Supabase MCP 서버를 위한 환경 변수를 설정합니다:

### Supabase 프로젝트별 설정
```bash
# Supabase 개인 액세스 토큰 (https://supabase.com/dashboard/account/tokens에서 생성)
export SUPABASE_ACCESS_TOKEN="sbp_your_personal_access_token_here"

# 이 프로젝트의 Supabase 프로젝트 참조 ID
export SUPABASE_PROJECT_REF="your_community_project_ref"
```

### 다른 커뮤니티 서비스별 예시
```bash
# 세미콜론 메인 커뮤니티
SUPABASE_PROJECT_REF="semicolon-main-ref"

# 세미콜론 포럼
SUPABASE_PROJECT_REF="semicolon-forum-ref"  

# 세미콜론 학습 플랫폼
SUPABASE_PROJECT_REF="semicolon-learning-ref"
```

> 📋 **참고**: PostgreSQL MCP는 글로벌 설정을 사용합니다. [글로벌 설정 가이드](MCP_GLOBAL_SETUP.md)를 참고하세요.

## 📋 프로젝트별 설정 단계

### 1. Supabase 개인 액세스 토큰 생성
1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. 우상단 프로필 → Account Settings
3. Access Tokens 탭 → New Token
4. 토큰 이름 입력 (예: "Community Core Package")
5. 적절한 권한 설정 후 Generate Token
6. 생성된 토큰을 안전하게 보관

### 2. 이 프로젝트의 Supabase 참조 ID 확인
1. 해당 커뮤니티 서비스의 Supabase 프로젝트 대시보드
2. Settings → General 
3. Project Settings에서 Reference ID 확인
4. 이 프로젝트 전용 ID임을 확인

### 3. 프로젝트 환경 변수 파일 설정
```bash
# 1. 환경 변수 템플릿 복사
cp .env.mcp.example .env.mcp

# 2. 실제 값으로 편집
nano .env.mcp  # 또는 다른 에디터 사용

# 3. 다음 값들을 실제 정보로 변경:
# SUPABASE_ACCESS_TOKEN=sbp_실제_토큰_여기에
# SUPABASE_PROJECT_REF=실제_프로젝트_참조_ID

# 4. 환경 변수 로드 (이 프로젝트에서만)
source .env.mcp
```

### 4. 자동 설정 스크립트 사용
```bash
# MCP 설정 스크립트 실행 (권장)
npm run mcp:setup

# 또는 직접 실행
./scripts/setup-mcp.sh
```

## 🔍 프로젝트별 Supabase MCP 활용 방법

### Claude Code에서 프로젝트별 Supabase 사용
1. 이 프로젝트 디렉토리에서 Claude Code 실행: `claude`
2. 프로젝트별 Supabase MCP 서버가 자동으로 연결됨
3. 이 프로젝트에 특화된 작업 수행:

```
# 이 프로젝트의 Supabase 스키마 탐색
"현재 커뮤니티 프로젝트의 데이터베이스 테이블 구조를 보여줘"

# 프로젝트별 데이터 분석
"이 커뮤니티의 사용자 통계를 분석해줘"

# 프로젝트별 TypeScript 타입 생성
"현재 프로젝트 스키마를 기반으로 TypeScript 인터페이스를 생성해줘"

# 프로젝트 설정 확인
"이 Supabase 프로젝트의 설정과 상태를 확인해줘"

# 스키마 변경 제안
"커뮤니티 게시판 기능을 위한 테이블 설계를 제안해줘"
```

### 다른 커뮤니티 서비스와의 분리
- 각 프로젝트는 고유한 `.mcp.json`과 `.env.mcp` 파일을 가짐
- 서비스별로 독립적인 Supabase 프로젝트에 연결
- 보안과 데이터 격리 자동 보장

### 글로벌 PostgreSQL과 함께 사용
```
# 프로젝트별 Supabase 데이터 + 글로벌 PostgreSQL 분석
"현재 커뮤니티의 Supabase 데이터를 PostgreSQL 관점에서 분석해줘"

# 크로스 플랫폼 데이터 비교
"이 커뮤니티와 다른 PostgreSQL 데이터베이스의 성능을 비교해줘"
```

## ⚠️ 프로젝트별 보안 주의사항

### 커뮤니티 서비스별 보안
- **프로젝트 격리**: 각 커뮤니티 서비스는 독립적인 Supabase 프로젝트 사용
- **토큰 관리**: 서비스별로 별도의 액세스 토큰 생성 및 관리
- **읽기 전용**: 기본적으로 읽기 전용 모드 사용
- **환경 분리**: 개발/스테이징/프로덕션 환경별 별도 설정

### 팀 협업 보안
- **`.env.mcp` 파일**: 절대 Git 커밋 금지 (`.gitignore`에 포함됨)
- **토큰 공유**: 개인 액세스 토큰은 안전한 채널로만 공유
- **권한 최소화**: 필요한 최소 권한만 부여

## 🚨 프로젝트별 문제 해결

### Supabase 연결 문제
1. **프로젝트 참조 ID 확인**: 올바른 커뮤니티 서비스의 프로젝트인지 확인
2. **액세스 토큰 유효성**: 해당 프로젝트에 대한 권한이 있는 토큰인지 확인
3. **Supabase 프로젝트 상태**: 대시보드에서 프로젝트가 정상 상태인지 확인
4. **네트워크 연결**: Supabase 서비스 연결 상태 확인

### 환경 변수 문제
```bash
# 설정 상태 확인
npm run mcp:check

# 환경 변수 직접 확인
echo $SUPABASE_ACCESS_TOKEN
echo $SUPABASE_PROJECT_REF

# 설정 스크립트 재실행
npm run mcp:setup
```

### Claude Code 연결 문제
1. **프로젝트 디렉토리 확인**: `.mcp.json` 파일이 있는 디렉토리에서 실행
2. **환경 변수 로드**: `source .env.mcp` 실행
3. **Claude Code 재시작**: 설정 변경 후 재시작 필요
4. **MCP 서버 상태**: Claude Code에서 MCP 서버 연결 상태 확인

## 🔗 다른 커뮤니티 서비스에 적용

이 설정을 다른 세미콜론 커뮤니티 서비스에도 동일하게 적용할 수 있습니다:

```bash
# 1. 다른 프로젝트로 이동
cd ../other-community-service

# 2. 이 설정 파일들을 복사
cp ../community-package/.mcp.json .
cp ../community-package/.env.mcp.example .

# 3. 해당 서비스의 Supabase 정보로 수정
cp .env.mcp.example .env.mcp
nano .env.mcp  # 해당 서비스의 PROJECT_REF로 수정

# 4. Claude Code에서 해당 서비스 전용 MCP 사용
claude
```

## 📚 관련 문서 및 리소스

### 핵심 문서
- **[글로벌 PostgreSQL MCP 설정](MCP_GLOBAL_SETUP.md)**: 모든 프로젝트에서 사용할 PostgreSQL 설정
- **환경 변수 템플릿**: `.env.mcp.example`
- **프로젝트 MCP 설정**: `.mcp.json`

### 외부 리소스
- [Supabase MCP 공식 문서](https://supabase.com/docs/guides/getting-started/mcp)
- [Claude Code MCP 가이드](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Supabase Dashboard](https://supabase.com/dashboard)

### 커뮤니티 리소스
- [세미콜론 개발 가이드](https://semicolon.dev/docs)
- [Supabase 커뮤니티 포럼](https://github.com/supabase/supabase/discussions)

이제 각 커뮤니티 서비스마다 독립적이면서도 통합된 MCP 환경을 구축할 수 있습니다! 🚀