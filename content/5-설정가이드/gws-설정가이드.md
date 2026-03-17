# Google Workspace CLI (gws) 설치 및 설정 가이드

> 작성일: 260317 | 대상: macOS (Apple Silicon)

---

## 목차

1. [gws CLI란?](#1-gws-cli란)
2. [사전 준비사항 체크리스트](#2-사전-준비사항-체크리스트)
3. [Step 1: gcloud CLI 설치](#step-1-gcloud-cli-설치)
4. [Step 2: gws CLI 설치](#step-2-gws-cli-설치)
5. [Step 3: 인증 설정 (Auth Setup)](#step-3-인증-설정-auth-setup)
6. [Step 4: 수동 OAuth 설정 (대안)](#step-4-수동-oauth-설정-대안)
7. [설치 검증](#설치-검증)
8. [트러블슈팅](#트러블슈팅)
9. [Headless/CI 환경용 설정 (참고)](#headlessci-환경용-설정-참고)

---

## 1. gws CLI란?

Google Workspace의 모든 API(Gmail, Calendar, Drive, Contacts, Sheets, Docs 등)를 하나의 CLI로 통합 제어하는 도구. JSON 출력을 지원하여 스크립트/자동화에 적합하다.

---

## 2. 사전 준비사항 체크리스트

설치 전 아래 항목을 확인하세요:

| 항목 | 현재 상태 | 필요 여부 |
|------|-----------|-----------|
| **Node.js** (v18+) | v25.2.1 ✅ | npm 설치 시 필요 |
| **npm** | 11.6.2 ✅ | npm 설치 시 필요 |
| **Homebrew** | 5.0.14 ✅ | brew로 gcloud 설치 시 필요 |
| **gcloud CLI** | ❌ 미설치 | `gws auth setup` 자동 설정 시 **필수** |
| **Google 계정** | — | **필수** (Google Workspace 또는 개인 Gmail) |
| **웹 브라우저** | — | **필수** (OAuth 인증 시 브라우저 팝업) |

### 핵심: 당신이 반드시 해야 할 것

> **gws CLI는 설치만으로 동작하지 않습니다.**
> Google Cloud 프로젝트 생성 + OAuth 인증을 사람이 직접 브라우저에서 승인해야 합니다.

---

## Step 1: gcloud CLI 설치

`gws auth setup`이 Google Cloud 프로젝트를 자동 생성하려면 **gcloud CLI가 필수**입니다.

```bash
# Homebrew로 설치 (권장)
brew install --cask google-cloud-sdk
```

설치 후 초기화:

```bash
gcloud init
```

이 명령을 실행하면:
1. 브라우저가 열림 → **Google 계정으로 로그인**
2. 프로젝트 선택 또는 새 프로젝트 생성
3. 기본 리전 설정 (아무거나 선택 OK)

**확인:**
```bash
gcloud --version
gcloud auth list   # 로그인된 계정 확인
```

---

## Step 2: gws CLI 설치

### 방법 A: npm (권장 — 가장 간단)

```bash
npm install -g @googleworkspace/cli
```

### 방법 B: Homebrew

```bash
brew install googleworkspace-cli
```

> ⚠️ **주의**: Homebrew에는 `gws`라는 다른 패키지(git workspace 관리 도구)가 있습니다.
> 반드시 `googleworkspace-cli`를 설치하세요. 둘은 `gws` 바이너리 이름이 충돌합니다.

### 방법 C: 소스 빌드 (Rust/Cargo)

```bash
git clone https://github.com/googleworkspace/cli.git
cd cli
cargo install --path .
```

**설치 확인:**
```bash
gws --version
which gws
```

> ⚠️ 기존에 `gog`이 `/opt/homebrew/bin/gog`에 설치되어 있습니다.
> `gws`와 `gog`이 동일한 도구인지, 또는 별개인지 확인 후 충돌을 피하세요.

---

## Step 3: 인증 설정 (Auth Setup)

### 자동 설정 (권장)

```bash
gws auth setup
```

이 명령이 **자동으로 처리하는 것**:
- Google Cloud 프로젝트 생성
- 필요한 Google Workspace API 활성화 (Gmail, Calendar, Drive 등)
- OAuth consent screen 구성
- OAuth 클라이언트 생성
- 브라우저에서 로그인 진행

### 🧑‍💻 당신이 직접 해야 하는 것 (자동 설정 중)

1. **브라우저 팝업에서 Google 계정 선택** → 로그인
2. **"이 앱은 확인되지 않았습니다" 경고** → `고급` → `(앱 이름)(으)로 이동` 클릭
3. **권한 동의 화면** → 요청하는 모든 scope에 **"허용"** 클릭
   - Gmail 읽기/쓰기
   - Calendar 읽기/쓰기
   - Drive 파일 접근
   - Contacts 읽기/쓰기
   - 기타 Workspace API 접근
4. **"인증이 완료되었습니다" 페이지** 확인 → 브라우저 탭 닫기

### 이후 재로그인

토큰이 만료되면:

```bash
gws auth login
```

---

## Step 4: 수동 OAuth 설정 (대안)

`gws auth setup`이 실패하거나, 기존 Google Cloud 프로젝트를 사용하고 싶은 경우:

### 4-1. Google Cloud Console에서 프로젝트 설정

1. https://console.cloud.google.com 접속
2. 프로젝트 선택 또는 새 프로젝트 생성
3. **API 및 서비스 > 라이브러리** 에서 필요한 API 활성화:
   - Gmail API
   - Google Calendar API
   - Google Drive API
   - Google Sheets API
   - Google Docs API
   - People API (Contacts)
   - Admin SDK (필요 시)

### 4-2. OAuth 동의 화면 구성

1. **API 및 서비스 > OAuth 동의 화면**
2. 사용자 유형: **외부** (개인 계정) 또는 **내부** (Workspace 조직)
3. 앱 이름, 이메일 등 기본 정보 입력
4. 범위(Scope) 추가 — 위 API들의 scope 선택

### 4-3. OAuth 클라이언트 ID 생성

1. **API 및 서비스 > 사용자 인증 정보**
2. **+ 사용자 인증 정보 만들기 > OAuth 클라이언트 ID**
3. 애플리케이션 유형: **데스크톱 앱**
4. 생성 후 **JSON 다운로드**

### 4-4. 클라이언트 시크릿 파일 배치

```bash
# 디렉토리 생성 (없으면)
mkdir -p ~/.config/gws

# 다운로드한 JSON을 아래 경로에 저장
mv ~/Downloads/client_secret_*.json ~/.config/gws/client_secret.json
```

### 4-5. 로그인

```bash
gws auth login
```

브라우저에서 동의 후 완료.

---

## 설치 검증

모든 설정이 끝난 후 아래 명령으로 정상 동작 확인:

```bash
# 버전 확인
gws --version

# 인증 상태 확인
gws auth login

# Gmail 테스트 — 최근 메일 5개 조회
gws gmail messages list --max-results 5

# Calendar 테스트 — 오늘 일정 조회
gws calendar events list --calendar-id primary

# Drive 테스트 — 파일 목록
gws drive files list --page-size 5
```

---

## 트러블슈팅

### `accessNotConfigured` (403) 에러

```
ERROR 403: API has not been used in project ... or it is disabled.
```

→ 에러 메시지에 포함된 `enable_url` 링크를 브라우저에서 열어 API 활성화
→ 또는 `gws auth setup` 재실행

### `gws` 명령어를 못 찾는 경우

```bash
# npm 글로벌 bin 경로 확인
npm config get prefix
# 해당 경로/bin이 PATH에 있는지 확인
echo $PATH
```

필요하면 `.zshrc`에 추가:
```bash
export PATH="$(npm config get prefix)/bin:$PATH"
```

### Homebrew `gws` 충돌

```bash
# 기존 gws (git workspace) 제거
brew uninstall gws

# Google Workspace CLI 설치
brew install googleworkspace-cli
```

### OAuth 토큰 만료/갱신 실패

```bash
# 기존 인증 정보 삭제 후 재로그인
rm -rf ~/.config/gws/tokens/
gws auth login
```

---

## Headless/CI 환경용 설정 (참고)

로컬에서 인증 후 CI 서버 등에서 사용할 경우:

```bash
# 로컬에서 credential 내보내기
gws auth export --unmasked > credentials.json

# 원격 서버에서 사용
export GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/path/to/credentials.json
gws drive files list
```

### Service Account 사용

```bash
export GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/path/to/service-account.json
gws drive files list
```

### Domain-Wide Delegation (관리자 위임)

```bash
export GOOGLE_WORKSPACE_CLI_IMPERSONATED_USER=admin@example.com
```

### 기존 gcloud 토큰 활용

```bash
export GOOGLE_WORKSPACE_CLI_TOKEN=$(gcloud auth print-access-token)
```

---

## 요약: 당신이 직접 해야 할 작업 흐름

```
1. brew install --cask google-cloud-sdk   ← gcloud 설치
2. gcloud init                             ← 브라우저에서 Google 로그인
3. npm install -g @googleworkspace/cli     ← gws 설치
4. gws auth setup                          ← 브라우저에서 OAuth 동의
5. gws gmail messages list                 ← 동작 확인!
```

> 모든 브라우저 인증 단계는 **사람이 직접** 수행해야 합니다.
> Claude Code에서는 `gws auth setup`이나 `gws auth login` 실행 시
> 브라우저 팝업을 처리할 수 없으므로, 터미널에서 직접 실행하세요.
