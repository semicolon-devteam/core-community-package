#!/bin/bash

# 🎯 Gitmoji 기반 버전 관리 스크립트
# 로컬에서 수동으로 버전을 업데이트할 때 사용

set -e

echo "🔍 Analyzing commits for version bump..."

# 현재 버전 가져오기
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: v$CURRENT_VERSION"

# 최신 태그 가져오기
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v$CURRENT_VERSION")
echo "Latest tag: $LATEST_TAG"

# 커밋 분석
if [ "$LATEST_TAG" == "v$CURRENT_VERSION" ]; then
  echo "No new commits since last version"
  COMMITS=$(git log HEAD~1..HEAD --pretty=format:"%s" 2>/dev/null || echo "")
else
  COMMITS=$(git log ${LATEST_TAG}..HEAD --pretty=format:"%s")
fi

if [ -z "$COMMITS" ]; then
  echo "ℹ️ No commits to analyze. Manual version selection required."
  echo ""
  echo "Select version bump type:"
  echo "1) Patch (bug fixes)"
  echo "2) Minor (new features)"
  echo "3) Major (breaking changes)"
  echo "4) Skip"
  read -p "Enter choice (1-4): " choice

  case $choice in
    1) VERSION_BUMP="patch" ;;
    2) VERSION_BUMP="minor" ;;
    3) VERSION_BUMP="major" ;;
    4) echo "Skipping version bump"; exit 0 ;;
    *) echo "Invalid choice"; exit 1 ;;
  esac
else
  # Gitmoji 기반 자동 결정
  VERSION_BUMP="patch"

  # Breaking changes (Major)
  if echo "$COMMITS" | grep -q "💥\|:boom:"; then
    VERSION_BUMP="major"
    echo "💥 Breaking changes detected"
  # New features (Minor)
  elif echo "$COMMITS" | grep -q "✨\|:sparkles:\|🚀\|:rocket:"; then
    VERSION_BUMP="minor"
    echo "✨ New features detected"
  # Bug fixes (Patch)
  elif echo "$COMMITS" | grep -q "🐛\|:bug:\|🔧\|:wrench:\|📝\|:memo:\|♻️\|:recycle:\|🎨\|:art:"; then
    VERSION_BUMP="patch"
    echo "🐛 Bug fixes/improvements detected"
  fi

  echo ""
  echo "📊 Commit Analysis:"
  echo "$COMMITS" | head -10
  echo ""
fi

echo "📈 Version bump type: $VERSION_BUMP"

# 새 버전 계산
IFS='.' read -r -a version_parts <<< "$CURRENT_VERSION"
MAJOR="${version_parts[0]}"
MINOR="${version_parts[1]}"
PATCH="${version_parts[2]}"

case $VERSION_BUMP in
  major)
    NEW_VERSION="$((MAJOR + 1)).0.0"
    ;;
  minor)
    NEW_VERSION="${MAJOR}.$((MINOR + 1)).0"
    ;;
  patch)
    NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
    ;;
esac

echo "🆕 New version: v$NEW_VERSION"
echo ""

# 확인
read -p "Do you want to update to v$NEW_VERSION? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Version update cancelled"
  exit 0
fi

# 버전 업데이트
echo "📝 Updating package.json..."
npm version $NEW_VERSION --no-git-tag-version

# Git 커밋 및 태그
echo "📋 Creating git commit and tag..."
git add package.json package-lock.json
git commit -m "🔖 Release v$NEW_VERSION

Bump version from v$CURRENT_VERSION to v$NEW_VERSION"

git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo ""
echo "✅ Version updated successfully!"
echo ""
echo "📌 Next steps:"
echo "1. Review the changes: git show HEAD"
echo "2. Push to remote: git push origin main --follow-tags"
echo "3. Publish to NPM: npm publish --access public"
echo ""
echo "Or use GitHub Actions for automated release!"