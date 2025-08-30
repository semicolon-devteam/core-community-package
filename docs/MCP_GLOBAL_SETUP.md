# 글로벌 MCP 설정 가이드

PostgreSQL MCP 서버를 글로벌하게 설정하여 모든 Claude Code 프로젝트에서 사용할 수 있도록 설정하는 가이드입니다.

## 🌍 글로벌 vs 프로젝트별 설정 전략

### 📊 PostgreSQL MCP (글로벌 설정)
- **적용 범위**: 모든 Claude Code 프로젝트
- **목적**: 데이터베이스 분석, 성능 최적화, 스키마 탐색
- **장점**: 
  - 여러 프로젝트에서 공통 DB 인프라 관리
  - 일관된 분석 환경 제공
  - 설정 한 번으로 모든 곳에서 사용

### 🏢 Supabase MCP (프로젝트별 설정)  
- **적용 범위**: 각 커뮤니티 서비스별
- **목적**: 프로젝트별 스키마 관리, TypeScript 타입 생성
- **장점**:
  - 서비스별 독립적 관리
  - 보안 격리
  - 프로젝트 특화된 설정

## 🔧 글로벌 PostgreSQL MCP 설정

### 방법 1: Claude Code CLI를 통한 설정 (권장)

```bash
# PostgreSQL MCP 서버를 글로벌하게 추가
claude mcp add postgres-global \
  --global \
  --env POSTGRES_CONNECTION_STRING=postgresql://username:password@hostname:port/database \
  -- npx -y @modelcontextprotocol/server-postgres

# 설정 확인
claude mcp list --global
```

### 방법 2: 글로벌 설정 파일 생성

**macOS/Linux:**
```bash
# 글로벌 설정 디렉토리 생성
mkdir -p ~/.config/claude

# 글로벌 MCP 설정 파일 생성
cat > ~/.config/claude/mcp.json << 'EOF'
{
  "mcpServers": {
    "postgres-global": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${POSTGRES_CONNECTION_STRING}"
      ]
    }
  }
}
EOF
```

**Windows:**
```cmd
# 글로벌 설정 디렉토리 생성
mkdir %APPDATA%\claude

# 글로벌 MCP 설정 파일 생성 (PowerShell)
@"
{
  "mcpServers": {
    "postgres-global": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${POSTGRES_CONNECTION_STRING}"
      ]
    }
  }
}
"@ | Out-File -FilePath "$env:APPDATA\claude\mcp.json" -Encoding UTF8
```

## 🔐 글로벌 환경 변수 설정

### macOS/Linux - 영구 환경 변수 설정

**~/.zshrc (또는 ~/.bashrc)에 추가:**
```bash
# PostgreSQL 글로벌 연결 설정
export POSTGRES_CONNECTION_STRING="postgresql://username:password@hostname:port/database"

# 여러 DB 환경별 설정 (선택사항)
export POSTGRES_DEV="postgresql://postgres:dev@localhost:5432/dev_db"
export POSTGRES_STAGING="postgresql://postgres:staging@staging-host:5432/staging_db"
export POSTGRES_PROD="postgresql://postgres:prod@prod-host:5432/prod_db"
```

**적용:**
```bash
source ~/.zshrc  # 또는 source ~/.bashrc
```

### Windows - 영구 환경 변수 설정

**PowerShell (관리자 권한):**
```powershell
# 시스템 환경 변수 설정
[Environment]::SetEnvironmentVariable("POSTGRES_CONNECTION_STRING", "postgresql://username:password@hostname:port/database", "User")

# 환경 변수 확인
[Environment]::GetEnvironmentVariable("POSTGRES_CONNECTION_STRING", "User")
```

## 📋 다양한 PostgreSQL 연결 설정 예시

### 1. 로컬 개발 환경
```bash
export POSTGRES_CONNECTION_STRING="postgresql://postgres:password@localhost:5432/myapp"
```

### 2. Supabase PostgreSQL 직접 연결
```bash
export POSTGRES_CONNECTION_STRING="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 3. AWS RDS
```bash
export POSTGRES_CONNECTION_STRING="postgresql://username:password@mydb.123456789.us-west-2.rds.amazonaws.com:5432/mydb"
```

### 4. Google Cloud SQL
```bash
export POSTGRES_CONNECTION_STRING="postgresql://username:password@10.1.2.3:5432/mydb"
```

### 5. Docker 컨테이너
```bash
export POSTGRES_CONNECTION_STRING="postgresql://postgres:password@localhost:5433/myapp"
```

## 🚦 동적 환경 전환

여러 DB 환경을 쉽게 전환할 수 있는 스크립트를 생성할 수 있습니다:

```bash
# ~/.zshrc에 추가
function switch-db() {
  case $1 in
    dev)
      export POSTGRES_CONNECTION_STRING=$POSTGRES_DEV
      echo "🔧 개발 DB로 전환: $POSTGRES_DEV"
      ;;
    staging)
      export POSTGRES_CONNECTION_STRING=$POSTGRES_STAGING  
      echo "🚦 스테이징 DB로 전환: $POSTGRES_STAGING"
      ;;
    prod)
      export POSTGRES_CONNECTION_STRING=$POSTGRES_PROD
      echo "🚀 프로덕션 DB로 전환 (주의!): $POSTGRES_PROD"
      ;;
    *)
      echo "사용법: switch-db [dev|staging|prod]"
      ;;
  esac
}
```

**사용법:**
```bash
switch-db dev      # 개발 DB로 전환
switch-db staging  # 스테이징 DB로 전환  
switch-db prod     # 프로덕션 DB로 전환
```

## 🔍 설정 확인 및 테스트

### 1. 글로벌 MCP 설정 확인
```bash
# Claude Code 글로벌 MCP 서버 목록
claude mcp list --global

# 설정 파일 직접 확인
cat ~/.config/claude/mcp.json  # macOS/Linux
type %APPDATA%\claude\mcp.json  # Windows
```

### 2. 환경 변수 확인
```bash
echo $POSTGRES_CONNECTION_STRING  # macOS/Linux
echo %POSTGRES_CONNECTION_STRING%  # Windows CMD
$env:POSTGRES_CONNECTION_STRING   # Windows PowerShell
```

### 3. Claude Code에서 테스트
```bash
# 임의의 프로젝트 디렉토리에서 Claude Code 실행
cd ~/any-project
claude

# Claude Code에서 테스트 쿼리
"현재 연결된 데이터베이스의 테이블 목록을 보여줘"
"데이터베이스 스키마 정보를 분석해줘"
```

## ⚠️ 보안 주의사항

### 글로벌 설정의 보안 고려사항
- **읽기 전용 사용자 권장**: 분석용 읽기 전용 DB 사용자 생성
- **프로덕션 접근 제한**: 실수로 프로덕션 데이터 변경 방지
- **연결 문자열 암호화**: 가능하면 연결 정보를 암호화하여 저장
- **정기적 비밀번호 갱신**: DB 비밀번호 정기적 변경

### 안전한 읽기 전용 사용자 생성 예시
```sql
-- PostgreSQL에서 읽기 전용 사용자 생성
CREATE USER claude_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE your_database TO claude_readonly;
GRANT USAGE ON SCHEMA public TO claude_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO claude_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO claude_readonly;
```

## 🎯 활용 예시

글로벌 PostgreSQL MCP가 설정되면 모든 프로젝트에서 다음과 같은 작업이 가능합니다:

```
# 어느 프로젝트에서든
"현재 DB의 성능 병목 지점을 분석해줘"
"테이블별 데이터 크기를 조회해줘"
"인덱스 사용 현황을 보고서로 만들어줘"
"쿼리 실행 계획을 분석해줘"
"데이터베이스 건강 상태를 체크해줘"
```

## 🔄 문제 해결

### MCP 서버가 인식되지 않는 경우
1. 환경 변수 설정 확인
2. Claude Code 재시작
3. 글로벌 설정 파일 권한 확인
4. 네트워크 연결 상태 확인

### 연결 오류가 발생하는 경우
1. PostgreSQL 서버 상태 확인
2. 방화벽 설정 확인
3. 연결 문자열 문법 검증
4. DB 사용자 권한 확인

이제 PostgreSQL은 글로벌하게, Supabase는 프로젝트별로 효율적으로 관리할 수 있습니다! 🚀