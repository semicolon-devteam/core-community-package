# Vercel 배포 및 캐시 문제 해결 가이드

## 문제 상황
Board 컴포넌트 스토리가 로컬에서는 정상 작동하지만 Vercel 배포 버전에서는 보이지 않는 문제

## 원인 분석
1. **강력한 캐시 정책**: 이전 `vercel.json` 설정에서 모든 파일에 `max-age=31536000`(1년) 캐시 적용
2. **브라우저 캐시**: 사용자 브라우저에 오래된 버전 캐시됨
3. **CDN 캐시**: Vercel의 Edge Network에 이전 빌드 결과 캐시됨

## 해결 방법

### 1. 캐시 정책 최적화 (완료 ✅)
`vercel.json` 파일을 다음과 같이 수정했습니다:

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css|json|svg|ico|woff|woff2|ttf|eot))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, must-revalidate"
        }
      ]
    },
    {
      "source": "/(index\\.html|stories\\.json|index\\.json|project\\.json)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

**변경사항:**
- `stories.json`, `index.json` 등 메타데이터 파일: 캐시 없음 (`max-age=0`)
- JavaScript/CSS 등 정적 자산: 1일 캐시 (`max-age=86400`)
- `/assets/` 내 해시된 파일들만 1년 캐시 유지

### 2. 강제 캐시 무효화 방법

#### A. Vercel Dashboard에서 캐시 무효화
1. Vercel Dashboard → 프로젝트 → Settings → Functions
2. "Purge Cache" 또는 "Clear Cache" 버튼 클릭

#### B. 브라우저 캐시 강제 무효화
사용자들에게 다음 방법 안내:
- **Chrome/Firefox**: `Ctrl+Shift+R` (Windows) 또는 `Cmd+Shift+R` (Mac)
- **개발자도구에서**: F12 → Network 탭 → "Disable cache" 체크
- **완전 캐시 삭제**: 브라우저 설정에서 캐시 및 쿠키 삭제

#### C. URL 파라미터를 통한 캐시 우회 (임시)
배포된 URL에 버전 파라미터 추가:
```
https://your-storybook.vercel.app/?v=1.3.1
```

### 3. 배포 후 확인 사항

#### 로컬 확인
1. `npm run build-storybook` 실행
2. `storybook-static/stories.json` 파일에서 Board 스토리 존재 확인
3. `storybook-static/index.json` 파일에서 Board 엔트리 존재 확인

#### 배포된 버전 확인
1. https://your-storybook.vercel.app/stories.json 직접 접근
2. Board 관련 엔트리가 포함되어 있는지 확인
3. 브라우저에서 강제 새로고침으로 최신 버전 로드

### 4. 향후 예방 조치

#### 배포 워크플로우
1. **로컬 빌드 검증**: 항상 `npm run build-storybook` 후 결과 확인
2. **점진적 배포**: 새로운 컴포넌트 추가 시 단계별 검증
3. **캐시 정책 모니터링**: 불필요한 장기 캐싱 방지

#### 모니터링
- 배포 후 5분 내에 실제 사이트에서 새 컴포넌트 확인
- 여러 브라우저에서 검증 (Chrome, Firefox, Safari)
- 모바일 환경에서도 확인

## 현재 상태
✅ **빌드 성공**: Board.stories-Bi2DltDs.js (37.03 kB) 생성됨  
✅ **메타데이터 포함**: stories.json과 index.json에 모든 Board 스토리 포함  
✅ **캐시 정책 최적화**: vercel.json 수정 완료  
⏳ **배포 대기**: 다음 commit & push 후 자동 배포됨  

## 다음 단계
1. 이 수정사항을 git에 commit & push
2. Vercel 자동 배포 완료 대기 (약 2-3분)
3. 강제 새로고침으로 최신 버전 확인
4. Board 컴포넌트 스토리 정상 표시 확인