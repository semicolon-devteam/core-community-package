# Tooltip Component

다양한 스타일과 위치 옵션을 제공하는 툴팁 컴포넌트입니다.

## 기능

- 4방향 위치 지원 (top, bottom, left, right)
- 커스텀 배경색 및 텍스트 색상
- 지연 시간 설정
- 화면 경계 자동 조정
- 반응형 위치 계산

## 사용법

```tsx
import Tooltip from '@molecules/Tooltip';

// 기본 사용법
<Tooltip content="기본 툴팁입니다">
  <button>버튼</button>
</Tooltip>

// 위치 지정
<Tooltip content="상단 툴팁" position="top">
  <span>상단 툴팁</span>
</Tooltip>

// 커스텀 스타일
<Tooltip 
  content="커스텀 툴팁" 
  backgroundColor="#007bff" 
  textColor="#fff"
  position="right"
>
  <div>커스텀 스타일</div>
</Tooltip>

// 지연 시간 설정
<Tooltip content="지연된 툴팁" delay={1000}>
  <button>1초 후 표시</button>
</Tooltip>

// 비활성화
<Tooltip content="표시되지 않음" disabled>
  <button>비활성화된 툴팁</button>
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | 툴팁을 트리거할 자식 요소 |
| content | string | - | 툴팁에 표시될 내용 |
| position | 'top' \| 'bottom' \| 'left' \| 'right' | 'top' | 툴팁 표시 위치 |
| backgroundColor | string | '#333' | 툴팁 배경색 |
| textColor | string | '#fff' | 툴팁 텍스트 색상 |
| delay | number | 500 | 툴팁 표시 지연 시간 (ms) |
| disabled | boolean | false | 툴팁 비활성화 여부 |
| className | string | '' | 커스텀 CSS 클래스 |
| maxWidth | number | 200 | 툴팁 최대 너비 |

## 특징

- **자동 위치 조정**: 화면 경계를 벗어나는 경우 자동으로 위치 조정
- **반응형**: 윈도우 리사이즈 시 위치 재계산
- **접근성**: 마우스 호버로 표시/숨김
- **성능 최적화**: 불필요한 렌더링 방지