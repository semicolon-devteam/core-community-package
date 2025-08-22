# 🚨 미디어 프로세서 팀 - 수정된 API 스펙 가이드

## ❌ 기존 가이드의 문제점들

1. **잘못된 API 응답 구조**: 프론트엔드에서 사용하는 `CommonResponse<T>` 래퍼 구조를 무시함
2. **불일치하는 필드명**: 프론트엔드 FileAttachment 인터페이스와 맞지 않는 필드들
3. **누락된 중요 API**: 재시도, 취소 기능의 잘못된 구현
4. **잘못된 상태 관리**: 게시글 상태 변경 로직 오류

## ✅ 수정된 정확한 API 스펙

### 1. POST `/api/media/upload-async`

#### 요청 형식 (FormData)
```typescript
// FormData로 전송
const formData = new FormData();
formData.append('postId', '123');
formData.append('needWatermark', 'true');
formData.append('watermarkPosition', 'bottom-right');
formData.append('watermarkOpacity', '0.7');
// 파일들 (여러개 가능)
formData.append('files', file1);
formData.append('files', file2);
```

#### 응답 형식 (CommonResponse 래퍼 사용 필수)
```json
{
  "success": true,
  "message": "파일 업로드가 시작되었습니다",
  "data": {
    "uploadId": "upload-session-uuid-12345",
    "postId": 123,
    "totalFiles": 2,
    "estimatedDuration": 180
  }
}
```

### 2. GET `/api/media/upload-progress/{postId}`

#### 응답 형식
```json
{
  "success": true,
  "message": "진행도 조회 성공",
  "data": {
    "postId": 123,
    "overallProgress": 75,
    "status": "processing",
    "totalFiles": 2,
    "completedFiles": 1,
    "files": [
      {
        "fileName": "sample_image.jpg",
        "fileSize": 3145728,
        "fileType": "image/jpeg",
        "fullPath": "/uploads/images/sample_image.jpg",
        "uuid": "file-uuid-1",
        "url": "/storage/uploads/images/sample_image.jpg",
        "thumbnailUrl": "/storage/uploads/images/thumbnails/sample_image_thumb.jpg",
        "status": "completed",
        "progress": 100,
        "uploadedAt": "2024-01-15T10:30:00Z"
      },
      {
        "fileName": "large_video.mp4",
        "fileSize": 27262976,
        "fileType": "video/mp4",
        "fullPath": "/uploads/videos/large_video.mp4",
        "uuid": "file-uuid-2",
        "url": "/storage/uploads/videos/large_video.mp4",
        "thumbnailUrl": "/storage/uploads/videos/thumbnails/large_video_thumb.jpg",
        "status": "watermarking",
        "progress": 75,
        "error": null,
        "uploadedAt": null
      }
    ]
  }
}
```

### 3. POST `/api/media/retry-upload/{postId}`

#### 요청 형식
```json
{
  "failedFileUuids": ["file-uuid-3", "file-uuid-4"]
}
```

#### 응답 형식
```json
{
  "success": true,
  "message": "2개 파일 재업로드를 시작했습니다",
  "data": {
    "totalRetried": 2,
    "retriedFileUuids": ["file-uuid-3", "file-uuid-4"]
  }
}
```

### 4. DELETE `/api/media/cancel-upload/{postId}`

#### 응답 형식
```json
{
  "success": true,
  "message": "업로드가 취소되었습니다",
  "data": {
    "cancelledFiles": 3,
    "postStatus": "DRAFT"
  }
}
```

## 🔧 중요한 구현 포인트

### 1. FileAttachment 필드 정확히 맞춰야 함
```typescript
interface FileAttachment {
  fileName: string;        // ✅ 정확
  fileSize: number;        // ✅ 정확
  fileType: string;        // ✅ 정확
  fullPath: string;        // ✅ 정확
  uuid: string;           // ✅ 정확
  url: string;            // ✅ 정확
  thumbnailUrl?: string;   // ✅ 선택사항
  
  // 업로드 진행도 관련 (필수)
  status?: 'pending' | 'watermarking' | 'uploading' | 'completed' | 'failed';
  progress?: number;       // 0-100
  error?: string;         // 실패시에만
  uploadedAt?: string;    // ISO 8601 형식, 완료시에만
}
```

### 2. 게시글 상태 관리 로직 수정

❌ **잘못된 방식**: 업로드 완료 시 자동으로 PUBLISHED로 변경
```typescript
// 🚫 이렇게 하면 안됨
if (allFilesCompleted) {
  await updatePostStatus(postId, 'PUBLISHED');
}
```

✅ **올바른 방식**: DRAFT 상태 유지, 프론트엔드에서 발행 버튼 클릭시에만 PUBLISHED
```typescript
// ✅ 파일 업로드 완료 후에도 DRAFT 유지
// 사용자가 명시적으로 발행 버튼을 클릭해야 PUBLISHED로 변경
if (allFilesCompleted) {
  // attachments 필드만 업데이트, status는 그대로 DRAFT
  await updatePostAttachments(postId, completedFiles);
}
```

### 3. 에러 응답 형식
```json
{
  "success": false,
  "message": "파일 업로드에 실패했습니다",
  "error": {
    "code": "UPLOAD_FAILED",
    "details": "네트워크 연결 오류"
  },
  "data": null
}
```

### 4. 필수 검증사항

#### 파일 크기 제한
- 이미지: 10MB
- 비디오: 100MB
- 기타: 5MB

#### 지원 파일 형식
- 이미지: JPG, PNG, GIF, WebP
- 비디오: MP4, AVI, MOV, WebM

#### 보안 검증
- 파일 시그니처 검증 (매직 넘버)
- postId 소유권 검증
- JWT 토큰 검증

## 🚀 올바른 구현 플로우

### 1. 파일 업로드 시작
```
1. FormData 수신 및 검증
2. postId 소유권 확인
3. 파일 형식/크기 검증
4. Redis에 진행도 초기화
5. 백그라운드 큐에 작업 추가
6. 즉시 success 응답 반환
```

### 2. 백그라운드 처리
```
1. 파일별로 수파베이스 업로드 (청크 단위)
2. 진행도를 Redis에 실시간 업데이트
3. 업로드 완료 시 썸네일/워터마크 처리
4. 최종적으로 posts.attachments 필드 업데이트
```

### 3. 진행도 조회
```
1. Redis에서 실시간 진행도 조회
2. CommonResponse 래퍼로 응답
3. 1초 미만 응답 시간 보장
```

## 🧪 테스트 가이드

### 필수 테스트 케이스
1. **정상 업로드**: 이미지 + 비디오 혼합
2. **대용량 파일**: 90MB 비디오 파일  
3. **동시 업로드**: 5개 파일 동시 처리
4. **네트워크 불안정**: 중간에 연결 끊김 시나리오
5. **재시도**: 실패한 파일만 선택적 재업로드
6. **취소**: 진행 중 업로드 취소

### API 응답 시간 검증
- 업로드 시작: < 3초
- 진행도 조회: < 1초  
- 재시도 요청: < 2초
- 취소 요청: < 2초

## 📋 체크리스트

### API 구현 완료 확인
- [ ] POST `/api/media/upload-async` - FormData 처리
- [ ] GET `/api/media/upload-progress/{postId}` - 실시간 조회
- [ ] POST `/api/media/retry-upload/{postId}` - 선택적 재시도
- [ ] DELETE `/api/media/cancel-upload/{postId}` - 업로드 취소

### 데이터 구조 확인
- [ ] CommonResponse 래퍼 적용
- [ ] FileAttachment 인터페이스 정확히 구현
- [ ] 모든 필드명 프론트엔드와 일치
- [ ] 에러 응답 구조 통일

### 기능 구현 확인
- [ ] FormData 파일 처리
- [ ] Redis 진행도 캐싱
- [ ] 백그라운드 큐 시스템
- [ ] 재시도 로직 (최대 3회)
- [ ] 파일 검증 (크기, 형식, 보안)
- [ ] 워터마크/썸네일 생성

### 성능 최적화 확인
- [ ] 청크 단위 업로드
- [ ] 병렬 처리 (최대 5개)
- [ ] Redis 캐싱 활용
- [ ] 응답 시간 최적화

---

**중요**: 기존 가이드의 API 스펙을 그대로 따르면 프론트엔드와 연동이 되지 않습니다. 반드시 이 수정된 가이드를 따라 구현해주세요.

**연락처**: 프론트엔드 팀에 API 스펙 관련 질문시 즉시 연락 바랍니다.