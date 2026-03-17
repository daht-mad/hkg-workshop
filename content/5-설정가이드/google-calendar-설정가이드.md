
# Google Calendar MCP 설정 가이드

Google Calendar MCP를 설치하면 Claude가 캘린더 일정을 조회/생성/수정할 수 있습니다.

> **패키지**: [`@cocal/google-calendar-mcp`](https://github.com/nspady/google-calendar-mcp)


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


## 2. Google Calendar API 활성화

1. 좌측 메뉴 **API 및 서비스** → **라이브러리** 클릭
2. 검색창에 **Google Calendar API** 입력
3. **Google Calendar API** 선택
4. **사용** 버튼 클릭

> 이미 활성화되어 있으면 "관리" 버튼이 보입니다. 그러면 이 단계는 완료!


## 4. 테스트 사용자 등록

OAuth 동의 화면이 "테스트" 모드이므로, 본인 이메일을 테스트 사용자로 등록해야 합니다.

1. 좌측 메뉴 **Google 인증 플랫폼** → **대상** 클릭
2. **테스트 사용자** 섹션에서 **사용자 추가** 클릭
3. **본인 Gmail 주소** 입력
4. **저장** 클릭

> ⚠️ **중요**: 테스트 사용자에 본인 이메일을 추가하지 않으면 인증이 안 됩니다!


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

