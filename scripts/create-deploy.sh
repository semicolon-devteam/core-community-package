#!/bin/bash

# 스크립트 실행 위치를 프로젝트 루트로 설정
cd "$(dirname "$0")/.."

echo "🚀 배포용 압축파일 생성을 시작합니다..."

# 임시 deploy 디렉토리가 이미 존재하면 삭제
if [ -d "deploy_temp" ]; then
    echo "📁 기존 임시 디렉토리를 삭제합니다..."
    rm -rf deploy_temp
fi

# 기존 압축파일이 존재하면 삭제
if [ -f "deploy.tar.gz" ]; then
    echo "📦 기존 압축파일을 삭제합니다..."
    rm -f deploy.tar.gz
fi

# 임시 deploy 디렉토리 생성
echo "📁 임시 디렉토리를 생성합니다..."
mkdir deploy_temp

# 제외할 파일/폴더 목록
EXCLUDE_PATTERNS=(
    ".github"
    ".git"
    ".next"
    "node_modules"
    "README.md"
    "deploy"
    "deploy_temp"
    ".env"
    ".env.local"
    ".env.development"
    ".env.production"
    "*.log"
    ".DS_Store"
    "Thumbs.db"
    ".vscode"
    ".idea"
    "coverage"
    ".nyc_output"
    "*.tgz"
    "*.tar.gz"
    "CLAUDE.md"
    ".claude"
    "claude.json"
    ".claude.json"
)

# rsync를 사용하여 파일 복사 (제외 패턴 적용)
echo "📂 파일을 복사합니다..."
rsync -av \
    --exclude=".github" \
    --exclude=".git" \
    --exclude=".next" \
    --exclude="node_modules" \
    --exclude="README.md" \
    --exclude="deploy" \
    --exclude="deploy_temp" \
    --exclude=".env" \
    --exclude=".env.local" \
    --exclude=".env.development" \
    --exclude=".env.production" \
    --exclude="*.log" \
    --exclude=".DS_Store" \
    --exclude="Thumbs.db" \
    --exclude=".vscode" \
    --exclude=".idea" \
    --exclude="coverage" \
    --exclude=".nyc_output" \
    --exclude="*.tgz" \
    --exclude="*.tar.gz" \
    --exclude="scripts" \
    --exclude="CLAUDE.md" \
    --exclude=".claude" \
    --exclude="claude.json" \
    --exclude=".claude.json" \
    . deploy_temp/

# 배포용 README 생성
echo "📝 배포용 README.md를 생성합니다..."
cat > deploy_temp/README.md << 'EOF'
# 배포용 프로젝트

이 폴더는 배포를 위해 생성된 복제본입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 주의사항

- 이 폴더는 자동 생성된 것으로, 직접 수정하지 마세요.
- 원본 프로젝트에서 수정 후 다시 배포용 압축파일을 생성하세요.
EOF

# 압축파일 생성
echo "📦 압축파일을 생성합니다..."
tar -czf deploy.tar.gz -C deploy_temp .

# 임시 디렉토리 삭제
echo "🧹 임시 디렉토리를 정리합니다..."
rm -rf deploy_temp

echo "✅ 배포용 압축파일 생성이 완료되었습니다!"
echo "📍 위치: $(pwd)/deploy.tar.gz"
echo ""
echo "다음 단계:"
echo "1. tar -xzf deploy.tar.gz -C [배포할_디렉토리]"
echo "2. cd [배포할_디렉토리]"
echo "3. npm install"
echo "4. npm run build"
echo "5. 배포 환경으로 전송" 