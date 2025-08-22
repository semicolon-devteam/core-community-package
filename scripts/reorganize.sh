#!/bin/bash

echo "🚀 커뮤니티 코어 패키지 재구성 시작..."

# 컴포넌트 이동
echo "📦 컴포넌트 이동 중..."
if [ -d "src/component/atoms" ]; then
  cp -r src/component/atoms/* lib/components/atoms/ 2>/dev/null || true
fi
if [ -d "src/component/molecules" ]; then
  cp -r src/component/molecules/* lib/components/molecules/ 2>/dev/null || true
fi
if [ -d "src/component/organisms" ]; then
  cp -r src/component/organisms/* lib/components/organisms/ 2>/dev/null || true
fi

# 훅 이동
echo "🪝 훅 이동 중..."
if [ -d "src/hooks" ]; then
  cp -r src/hooks/* lib/hooks/ 2>/dev/null || true
fi

# 서비스 이동
echo "⚙️ 서비스 이동 중..."
if [ -d "src/services" ]; then
  cp src/services/baseService.ts lib/services/ 2>/dev/null || true
  cp src/services/userService.ts lib/services/ 2>/dev/null || true
  cp src/services/postService.ts lib/services/ 2>/dev/null || true
  cp src/services/boardService.ts lib/services/ 2>/dev/null || true
  # 기타 필요한 서비스들 추가
fi

# 유틸리티 이동
echo "🔧 유틸리티 이동 중..."
if [ -d "src/util" ]; then
  cp -r src/util/* lib/utils/ 2>/dev/null || true
fi

# 타입 정의 이동
echo "📝 타입 정의 이동 중..."
if [ -d "src/model" ]; then
  cp -r src/model/* lib/types/ 2>/dev/null || true
fi

# Redux 이동
echo "🔄 Redux 이동 중..."
if [ -d "src/redux/Features" ]; then
  cp -r src/redux/Features/* lib/redux/ 2>/dev/null || true
fi
if [ -d "src/redux/stores" ]; then
  cp -r src/redux/stores/* lib/redux/ 2>/dev/null || true
fi

# 설정 파일 이동
echo "⚙️ 설정 파일 이동 중..."
if [ -d "src/config" ]; then
  cp -r src/config/* lib/config/ 2>/dev/null || true
fi

# 상수 이동
echo "📌 상수 이동 중..."
if [ -d "src/constants" ]; then
  cp -r src/constants/* lib/constants/ 2>/dev/null || true
fi

# 스타일 이동
echo "🎨 스타일 이동 중..."
if [ -f "src/app/globals.css" ]; then
  cp src/app/globals.css lib/styles/ 2>/dev/null || true
fi

echo "✅ 파일 이동 완료!"