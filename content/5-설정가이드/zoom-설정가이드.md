
# Zoom API 설정 가이드

Zoom 워크플로를 사용하기 위한 Server-to-Server OAuth 앱 설정 가이드입니다.

> **참고**: 이 가이드는 [Zoom Developers 공식 문서](https://developers.zoom.us/docs/internal-apps/s2s-oauth/)를 기반으로 작성되었습니다.


## 1. Zoom App Marketplace 접속

1. [Zoom App Marketplace](https://marketplace.zoom.us/) 접속
2. 우측 상단 **Develop** → **Build App** 클릭
3. Zoom 계정으로 로그인


## 3. App Credentials 복사

**App Credentials** 탭에서 다음 값들을 복사합니다:

| 항목 | 설명 | 예시 |
|------|------|------|
| **Account ID** | Zoom 계정 ID | `5yiPLwmTTpQVBnMxOlf32q` |
| **Client ID** | 클라이언트 ID | `qJ50gRn2QHiknOCcT0ygRg` |
| **Client Secret** | 클라이언트 시크릿 | `aGwbwxOgK6eGHEO0W1DOCv...` |


## 5. 앱 활성화

1. **Activation** 탭으로 이동
2. **Activate your app** 클릭
3. 활성화 상태가 **Active**로 변경되었는지 확인


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


## 문제 해결

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `Invalid client_id or client_secret` | 자격증명 오류 | Account ID, Client ID, Secret 다시 확인 |
| `Scope not allowed` | 권한 부족 | Scopes 탭에서 필요한 권한 추가 |
| `App is not activated` | 앱 미활성화 | Activation 탭에서 앱 활성화 |

