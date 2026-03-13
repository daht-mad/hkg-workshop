---
hidden: true
---

# Zoom API 설정 가이드

Zoom 워크플로를 사용하기 위한 Server-to-Server OAuth 앱 설정 가이드입니다.

> **참고**: 이 가이드는 [Zoom Developers 공식 문서](https://developers.zoom.us/docs/internal-apps/s2s-oauth/)를 기반으로 작성되었습니다.

---

## Server-to-Server OAuth란?

Server-to-Server OAuth는 사용자 상호작용 없이 서버 간 통신을 위한 인증 방식입니다.
- 액세스 토큰 유효 시간: **1시간**
- Refresh Token 없음 (만료 시 새로 발급)
- 내부 자동화 워크플로에 적합

---

## 1. Zoom App Marketplace 접속

1. [Zoom App Marketplace](https://marketplace.zoom.us/) 접속
2. 우측 상단 **Develop** → **Build App** 클릭
3. Zoom 계정으로 로그인

---

## 2. Server-to-Server OAuth 앱 생성

1. 앱 유형 선택 화면에서 **Server-to-Server OAuth** 찾기
2. **Create** 클릭
3. **App Name**: 원하는 이름 입력 (예: "워크플로 자동화")
4. **Create** 클릭

---

## 3. App Credentials 복사

**App Credentials** 탭에서 다음 값들을 복사합니다:

| 항목 | 설명 | 예시 |
|------|------|------|
| **Account ID** | Zoom 계정 ID | `5yiPLwmTTpQVBnMxOlf32q` |
| **Client ID** | 클라이언트 ID | `qJ50gRn2QHiknOCcT0ygRg` |
| **Client Secret** | 클라이언트 시크릿 | `aGwbwxOgK6eGHEO0W1DOCv...` |

---

## 4. Scopes (권한) 추가

**Scopes** 탭에서 **Add Scopes** 클릭 후 다음 권한 추가:

| Scope | 용도 | 필수 |
|-------|------|------|
| `cloud_recording:read:list_user_recordings:admin` | 사용자별 녹화 목록 조회 | O |
| `cloud_recording:read:list_recording_files:admin` | 녹화 파일 목록 조회 | O |
| `user:read:list_users:admin` | 사용자 목록 조회 | O |
| `group:read:list_groups:admin` | 그룹 목록 조회 | O |
| `group:read:list_members:admin` | 그룹 멤버 조회 | O |

> **Tip**: Scope 검색창에서 `cloud_recording`, `user`, `group` 등으로 검색하면 쉽게 찾을 수 있습니다.

---

## 5. 앱 활성화

1. **Activation** 탭으로 이동
2. **Activate your app** 클릭
3. 활성화 상태가 **Active**로 변경되었는지 확인

---

## 6. 환경변수 설정

프로젝트 루트의 `.env` 파일에 다음 추가:

```bash
ZOOM_ACCOUNT_ID=your_account_id
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret
```

---

## 인증 흐름 (참고)

우리 워크플로에서 자동으로 처리되지만, 참고로 인증 흐름은 다음과 같습니다:

```bash
# 액세스 토큰 요청
POST https://zoom.us/oauth/token?grant_type=account_credentials&account_id={ACCOUNT_ID}
Authorization: Basic Base64(CLIENT_ID:CLIENT_SECRET)
```

```json
// 응답
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "scope": "cloud_recording:read:list_user_recordings:admin user:read:list_users:admin"
}
```

---

## 설정 완료 체크리스트

- [ ] Zoom App Marketplace에서 **Server-to-Server OAuth** 앱 생성
- [ ] App Credentials 복사 (Account ID, Client ID, Client Secret)
- [ ] Scopes 추가 (cloud_recording, user, group 관련 5개)
- [ ] 앱 활성화 (Activation 탭)
- [ ] `.env` 파일에 환경변수 3개 추가

---

## 문제 해결

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `Invalid client_id or client_secret` | 자격증명 오류 | Account ID, Client ID, Secret 다시 확인 |
| `Scope not allowed` | 권한 부족 | Scopes 탭에서 필요한 권한 추가 |
| `App is not activated` | 앱 미활성화 | Activation 탭에서 앱 활성화 |

---

## 설정 완료 후

위 설정을 모두 완료하셨으면 Claude Code에게 알려주세요!
