---
hidden: false
---

# Google Calendar MCP 설정 가이드

Google Calendar MCP를 설치하면 Claude가 캘린더 일정을 조회/생성/수정할 수 있습니다.

> **패키지**: [`@cocal/google-calendar-mcp`](https://github.com/nspady/google-calendar-mcp)

---

## 이 MCP로 할 수 있는 것

| 기능 | 설명 | 사용 예시 |
|------|------|----------|
| 일정 조회 | 오늘/이번 주 일정 확인 | "오늘 일정 알려줘" |
| 일정 생성 | 새 일정 추가 | "내일 오후 2시에 팀미팅 잡아줘" |
| 일정 수정 | 기존 일정 변경 | "내일 미팅을 3시로 옮겨줘" |
| 일정 삭제 | 일정 제거 | "금요일 점심약속 삭제해줘" |
| 일정 검색 | 텍스트로 일정 찾기 | "다음 주 '워크샵' 일정 찾아줘" |
| 빈 시간 확인 | 가용 시간 조회 | "이번 주 비어있는 시간 알려줘" |

---

## 전체 설정 흐름

```
1. Google Cloud Console에서 프로젝트 설정     (5분)
2. Google Calendar API 활성화                 (1분)
3. OAuth 동의 화면 설정                       (3분)
4. 테스트 사용자 등록                         (1분)
5. OAuth 클라이언트 ID 생성 + JSON 다운로드    (2분)
6. Claude Code에 MCP 설정 추가               (2분)
7. 최초 인증 (브라우저 로그인)                 (1분)
```

> 처음이면 15분 정도 소요됩니다. 이미 다른 Google API를 설정한 적 있으면 5분이면 됩니다.

---

## 1. Google Cloud Console 프로젝트 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인
3. 상단 프로젝트 선택 드롭다운 클릭

**이미 프로젝트가 있는 경우:**
- 기존 프로젝트 선택 (예: Google Drive 설정 시 만든 프로젝트)
- 다음 단계로 바로 이동

**프로젝트가 없는 경우:**
1. **새 프로젝트** 클릭
2. 프로젝트 이름 입력 (예: "워크플로 자동화")
3. **만들기** 클릭
4. 생성 완료까지 10-20초 대기

> 💡 **팁**: Google Drive MCP를 이미 설정했다면 같은 프로젝트를 사용하세요!

---

## 2. Google Calendar API 활성화

1. 좌측 메뉴 **API 및 서비스** → **라이브러리** 클릭
2. 검색창에 **Google Calendar API** 입력
3. **Google Calendar API** 선택
4. **사용** 버튼 클릭

> 이미 활성화되어 있으면 "관리" 버튼이 보입니다. 그러면 이 단계는 완료!

---

## 3. OAuth 동의 화면 설정

> **이미 다른 Google API(Drive, Sheets 등)를 위해 설정했다면 이 단계를 건너뛰세요.**

> ℹ️ Google Cloud Console UI가 **"Google 인증 플랫폼"**으로 변경되었습니다. 아래는 새 UI 기준 안내입니다.

1. 좌측 메뉴 **Google 인증 플랫폼** → **개요** 클릭
2. **시작하기** 버튼 클릭
3. 4단계 마법사가 시작됩니다:

### 1단계: 앱 정보

| 항목 | 입력값 |
|------|--------|
| **앱 이름** | 원하는 이름 (예: "워크플로 자동화") |
| **사용자 지원 이메일** | 본인 이메일 |

→ **다음** 클릭

### 2단계: 대상

- **외부** 선택

→ **다음** 클릭

### 3단계: 연락처 정보

| 항목 | 입력값 |
|------|--------|
| **이메일 주소** | 본인 이메일 |

→ **다음** 클릭

### 4단계: 완료

- **Google API 서비스: 사용자 데이터 정책** 체크박스에 동의 체크
- **계속** 클릭
- **만들기** 클릭

> 💡 **범위(Scopes)는 수동 설정 불필요**: MCP가 최초 인증 시 필요한 Calendar 범위를 자동으로 요청합니다.

---

## 4. 테스트 사용자 등록

OAuth 동의 화면이 "테스트" 모드이므로, 본인 이메일을 테스트 사용자로 등록해야 합니다.

1. 좌측 메뉴 **Google 인증 플랫폼** → **대상** 클릭
2. **테스트 사용자** 섹션에서 **사용자 추가** 클릭
3. **본인 Gmail 주소** 입력
4. **저장** 클릭

> ⚠️ **중요**: 테스트 사용자에 본인 이메일을 추가하지 않으면 인증이 안 됩니다!

---

## 5. OAuth 클라이언트 ID 생성

1. 좌측 메뉴 **Google 인증 플랫폼** → **클라이언트** 클릭
2. **+ 클라이언트 만들기** 클릭
3. 설정:

| 항목 | 선택/입력 |
|------|----------|
| **애플리케이션 유형** | **데스크톱 앱** (반드시!) |
| **이름** | 원하는 이름 (예: "Google Calendar MCP") |

4. **만들기** 클릭
5. 팝업이 나타나면 **JSON 다운로드** 버튼 클릭

> ⚠️ **반드시 "데스크톱 앱"을 선택하세요!** 웹 앱으로 만들면 작동하지 않습니다.

---

## 6. JSON 파일 저장

다운로드한 JSON 파일을 안전한 위치에 저장합니다.

### 추천 저장 위치

```
~/.config/google-calendar-mcp/gcp-oauth.keys.json
```

### 저장 방법 (Finder)

1. Finder에서 `Cmd + Shift + G` 누르기
2. `~/.config` 입력 → **이동** 클릭
3. 폴더가 없으면 **새 폴더** 만들기: `google-calendar-mcp`
4. 다운로드한 JSON 파일을 이 폴더에 드래그 앤 드롭
5. 파일명을 `gcp-oauth.keys.json`으로 변경

### 저장 방법 (터미널)

```bash
# 폴더 생성
mkdir -p ~/.config/google-calendar-mcp

# 다운로드 폴더에서 복사 (파일명은 실제 다운로드된 이름으로 변경)
cp ~/Downloads/client_secret_*.json ~/.config/google-calendar-mcp/gcp-oauth.keys.json
```

**최종 파일 위치:**
```
~/.config/google-calendar-mcp/gcp-oauth.keys.json
```

---

## 7. Claude Code에 MCP 설정 추가

### 방법 A: Claude에게 요청하기 (추천)

Claude 채팅창에 입력:

```
Google Calendar MCP 설치해줘.
OAuth 키 파일 위치는 ~/.config/google-calendar-mcp/gcp-oauth.keys.json 이야.
```

Claude가 `.mcp.json` 파일을 자동으로 수정해줍니다.

### 방법 B: 직접 설정하기

`~/.mcp.json` 파일을 열어서 아래 내용을 추가:

```json
{
  "mcpServers": {
    "google-calendar": {
      "command": "npx",
      "args": ["-y", "@cocal/google-calendar-mcp"],
      "env": {
        "GOOGLE_OAUTH_CREDENTIALS": "/Users/본인이름/.config/google-calendar-mcp/gcp-oauth.keys.json"
      }
    }
  }
}
```

> ⚠️ **`본인이름` 부분을 실제 Mac 사용자명으로 변경하세요!**
>
> 확인 방법: 터미널에서 `whoami` 입력

> 💡 이미 다른 MCP가 있다면 `mcpServers` 안에 `"google-calendar": {...}` 부분만 추가하세요.

---

## 8. 최초 인증 (1회만)

MCP를 처음 사용할 때 Google 계정 인증이 필요합니다.

### 인증 실행

터미널에서:

```bash
GOOGLE_OAUTH_CREDENTIALS=~/.config/google-calendar-mcp/gcp-oauth.keys.json npx @cocal/google-calendar-mcp auth
```

### 인증 과정

1. 브라우저가 자동으로 열립니다
2. Google 계정으로 로그인
3. **"이 앱은 Google에서 확인하지 않았습니다"** 경고가 나오면:
   - **고급** 클릭
   - **[앱 이름](으)로 이동(안전하지 않음)** 클릭
4. 요청된 권한 확인:
   - "Google Calendar의 일정 보기 및 수정" → **허용** 클릭
5. "인증이 완료되었습니다" 메시지가 나오면 성공!

### 인증 완료 확인

토큰 파일이 자동 생성됩니다:
```
~/.config/google-calendar-mcp/tokens.json
```

> ⚠️ **토큰 만료 주의**: 테스트 모드에서는 토큰이 **7일 후 만료**됩니다.
> 만료되면 위 인증 과정을 다시 수행하면 됩니다.

---

## 9. 작동 테스트

Claude Code를 재시작한 후 채팅창에 입력:

```
설치된 MCP 목록 보여줘
```

`google-calendar`가 목록에 있으면 설정 성공!

이어서 테스트:

```
Google Calendar에서 오늘 일정 알려줘
```

일정이 나오면 모든 설정이 완료된 것입니다!

---

## 설정 완료 체크리스트

- [ ] Google Cloud Console 프로젝트 선택/생성
- [ ] Google Calendar API 활성화
- [ ] OAuth 동의 화면 설정 (처음인 경우)
- [ ] 테스트 사용자 등록 (본인 이메일)
- [ ] OAuth 클라이언트 ID 생성 (**데스크톱 앱**)
- [ ] JSON 파일 다운로드
- [ ] JSON 파일을 `~/.config/google-calendar-mcp/gcp-oauth.keys.json`에 저장
- [ ] `.mcp.json`에 google-calendar MCP 설정 추가
- [ ] 최초 인증 (브라우저 로그인) 완료
- [ ] Claude에서 "오늘 일정 알려줘" 테스트 성공

---

## 문제 해결

| 증상 | 원인 | 해결 방법 |
|------|------|----------|
| `credentials file not found` | JSON 파일 위치가 잘못됨 | 파일 경로 확인. `~` 대신 절대 경로 사용 |
| `invalid_grant` | 토큰 만료 (7일) | `tokens.json` 삭제 후 `npx @cocal/google-calendar-mcp auth` 재실행 |
| `access_denied` | 테스트 사용자 미등록 | Google 인증 플랫폼 → 대상 → 테스트 사용자에 이메일 추가 |
| `The requested scope is invalid` | Calendar API 미활성화 | API 라이브러리에서 Google Calendar API 활성화 |
| 브라우저가 안 열림 | 인증 명령어 오류 | 터미널에서 직접 auth 명령어 실행 |
| MCP 목록에 안 보임 | `.mcp.json` 설정 오류 | JSON 형식 확인 (콤마, 괄호 등) |

### 토큰 초기화 방법

문제가 계속되면 토큰을 삭제하고 처음부터 인증:

```bash
# 토큰 삭제
rm ~/.config/google-calendar-mcp/tokens.json

# 재인증
GOOGLE_OAUTH_CREDENTIALS=~/.config/google-calendar-mcp/gcp-oauth.keys.json npx @cocal/google-calendar-mcp auth
```

---

## 참고: 주요 Tools 목록

설치 후 Claude가 사용할 수 있는 기능들:

| Tool | 기능 | 사용 예시 |
|------|------|----------|
| `list-events` | 일정 목록 조회 | "오늘 일정 알려줘" |
| `search-events` | 일정 검색 | "'팀미팅' 일정 찾아줘" |
| `create-event` | 일정 생성 | "내일 2시에 미팅 잡아줘" |
| `update-event` | 일정 수정 | "미팅을 3시로 옮겨줘" |
| `delete-event` | 일정 삭제 | "금요일 약속 삭제해줘" |
| `get-freebusy` | 빈 시간 조회 | "이번 주 비어있는 시간 알려줘" |
| `list-calendars` | 캘린더 목록 | "내 캘린더 목록 보여줘" |
| `respond-to-event` | 초대 응답 | "내일 미팅 수락해줘" |

---

## 설정 완료 후

위 설정을 모두 완료하셨으면 Claude Code에서 바로 사용할 수 있습니다!

```
"오늘 일정 알려줘"
"내일 오후 3시에 팀 회의 잡아줘"
"이번 주 비어있는 시간 알려줘"
```
