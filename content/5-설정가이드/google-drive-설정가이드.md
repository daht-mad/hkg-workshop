---
hidden: false
---

# Google Drive API 설정 가이드

Google Drive 워크플로를 사용하기 위한 OAuth 설정 가이드입니다.

> **참고**: 이 가이드는 [Google Workspace Drive 공식 문서](https://developers.google.com/workspace/drive)를 기반으로 작성되었습니다.

---

## OAuth 스코프 정보

이 워크플로에서 사용하는 OAuth 스코프:

| Scope | 용도 |
|-------|------|
| `https://www.googleapis.com/auth/drive.file` | 앱에서 생성하거나 연 파일만 접근 |

> **보안 참고**: `drive.file` 스코프는 앱이 직접 생성/열기한 파일만 접근할 수 있어 보안적으로 안전합니다.

---

## 1. Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인
3. **기존 프로젝트가 있으면 그 프로젝트를 선택**하세요 (새로 만들 필요 없음)
4. 프로젝트가 없는 경우에만 새 프로젝트 생성

---

## 2. Google Drive API 활성화

1. 좌측 메뉴 **API 및 서비스** → **라이브러리** 클릭
2. 검색창에 "Google Drive API" 입력
3. **Google Drive API** 선택 → **사용** 버튼 클릭

---

## 3. OAuth 동의 화면 설정

> 이미 다른 Google API를 위해 설정했다면 이 단계를 건너뛰세요.

1. 좌측 메뉴 **API 및 서비스** → **OAuth 동의 화면** 클릭
2. **외부** 선택 → **만들기** 클릭
3. 앱 정보 입력:
   - **앱 이름**: 원하는 이름 (예: "워크플로 자동화")
   - **사용자 지원 이메일**: 본인 이메일
   - **개발자 연락처 정보**: 본인 이메일
4. **저장 후 계속** 클릭
5. **범위(Scopes)** 페이지: **저장 후 계속** 클릭
6. **테스트 사용자** 페이지:
   - **ADD USERS** 클릭
   - 본인 이메일 추가
   - **저장 후 계속** 클릭

---

## 4. OAuth 클라이언트 ID 생성

1. 좌측 메뉴 **API 및 서비스** → **사용자 인증 정보** 클릭
2. 상단 **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID** 클릭
3. **애플리케이션 유형**: **데스크톱 앱** 선택
4. **이름**: 원하는 이름 (예: "Google Drive 워크플로")
5. **만들기** 클릭
6. **JSON 다운로드** 버튼 클릭

---

## 5. JSON 파일 저장

1. 다운로드 폴더에서 방금 다운로드한 JSON 파일 찾기
2. 파일을 다음 위치로 **드래그 앤 드롭**:

   ```
   workflows/_services/google_drive/
   ```

3. 파일 이름을 `google-drive-credentials.json`으로 변경

**최종 파일 위치:**

```
workflows/_services/google_drive/google-drive-credentials.json
```

---

## 6. 최초 인증 (1회만)

워크플로를 처음 실행하면 브라우저가 열리며 Google 로그인을 요청합니다:

1. Google 계정으로 로그인
2. "이 앱은 Google에서 확인하지 않았습니다" 경고가 나오면:
   - **고급** 클릭
   - **[앱 이름](으)로 이동(안전하지 않음)** 클릭
3. 요청된 권한 **허용** 클릭

인증 완료 후 `google-drive-token.json` 파일이 자동 생성됩니다.

---

## 설정 완료 체크리스트

- [ ] Google Cloud Console 프로젝트 선택/생성
- [ ] Google Drive API 활성화
- [ ] OAuth 동의 화면 설정 (처음인 경우)
- [ ] OAuth 클라이언트 ID 생성 (데스크톱 앱)
- [ ] JSON 파일 다운로드
- [ ] 파일을 `workflows/_services/google_drive/`에 저장
- [ ] 파일명을 `google-drive-credentials.json`으로 변경

---

## 문제 해결

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `credentials file not found` | JSON 파일 위치 오류 | 파일 경로와 이름 확인 |
| `invalid_grant` | 토큰 만료/손상 | `google-drive-token.json` 삭제 후 재인증 |
| `access_denied` | 테스트 사용자 미등록 | OAuth 동의 화면에서 이메일 추가 |

---

## 설정 완료 후

위 설정을 모두 완료하셨으면 Claude Code에게 알려주세요!
