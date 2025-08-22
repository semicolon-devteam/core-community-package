# GlobalPopup 컴포넌트

Redux를 사용한 글로벌 레이어 팝업 컴포넌트입니다.

## 기능

- 화면 전체를 가리는 검은색 반투명 배경
- 중앙에 위치한 팝업 모달
- 부드러운 페이드 인/아웃 애니메이션
- 다양한 팝업 타입 지원 (info, warning, error, success, confirm)
- 여러 팝업 동시 표시 가능
- Redux를 통한 전역 상태 관리

## 사용 방법

### 1. Alert 사용법

```typescript
import { useGlobalPopup } from "@hooks/common";

const { alert } = useGlobalPopup();
alert("안녕하세요!", "알림");
```

### 2. Confirm 사용법

```typescript
const { confirm } = useGlobalPopup();
const result = await confirm("정말로 삭제하시겠습니까?", "삭제 확인");
if (result) {
  // 확인 클릭
}
```

### 3. 타입별 팝업

```typescript
const { success, error, warning } = useGlobalPopup();
success("작업이 완료되었습니다!");
error("오류가 발생했습니다.");
warning("주의가 필요합니다.");
```### 4. 커스텀 팝업

```typescript
const { popup } = useGlobalPopup();
popup({
  title: "커스텀 팝업",
  content: <div>커스텀 내용</div>,
  confirmText: "저장",
  width: "500px",
  onConfirm: () => console.log("저장"),
});
```

### 5. 모든 팝업 닫기

```typescript
const { closeAll } = useGlobalPopup();
closeAll();
```

## 설정 옵션

- `title`: 팝업 제목
- `content`: 팝업 내용 (문자열 또는 React 컴포넌트)
- `confirmText`: 확인 버튼 텍스트 (기본: "확인")
- `cancelText`: 취소 버튼 텍스트 (기본: "취소")
- `type`: 팝업 타입 (info, warning, error, success, confirm)
- `width`, `height`: 팝업 크기
- `closable`: X 버튼 표시 여부 (기본: true)
- `backdrop`: 배경 클릭으로 닫기 (기본: true)
- `onConfirm`, `onCancel`, `onClose`: 이벤트 핸들러