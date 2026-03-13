---
hidden: true
---

# 2.4 실습: MCP 설치하고 확인하기

> ⭐ 핵심 실습
> 
> - Part A: Context7 확인
> - Part B: Chrome DevTools 설치
> - Part C: Google Calendar 설치

---

## Part A: Context7 MCP 확인

> Context7은 사전에 설치하셨습니다. 잘 작동하는지 확인합니다.

### Step 1: 설치 확인 질문하기

Claude 채팅창에 입력:

```
설치된 MCP 목록 보여줘
```

### Step 2: 결과 확인

- `context7` 또는 `Context7`이 목록에 있으면 성공
- 없으면 → Claude에게 "Context7 설치해줘"라고 요청

### Step 3: 작동 테스트

Claude 채팅창에 입력:

```
Context7으로 Claude Code 공식 문서에서 스킬 만드는 방법 찾아줘
```

- 스킬(Skill) 관련 문서 내용이 나오면 성공
- SKILL.md 파일 구조, 스킬 폴더 구조 등의 설명이 나옵니다

**완료 체크**:
- [ ] Context7이 MCP 목록에 있음
- [ ] Claude Code 스킬 문서 검색 결과가 나옴

> **안 되면**: Claude에게 "계속 시도해줘"라고 요청하세요. 그래도 안 되면 강사에게 질문하세요.

---

## Part B: Chrome DevTools MCP 설치

> Chrome DevTools MCP = Claude가 Chrome 브라우저를 직접 조작할 수 있게 해주는 도구

### Step 1: 설치 요청하기

Claude 채팅창에 입력:

```
Chrome DevTools MCP 설치해줘
```

### Step 2: 안내 따르기

- Claude가 설치 방법을 안내해줍니다
- **"승인"**, **"허용"**, **"Yes"** 등 확인 버튼이 나오면 클릭
- 설치에 1-2분 소요될 수 있음

### Step 3: 설치 확인

다시 입력:

```
설치된 MCP 목록 보여줘
```

- `chrome-devtools` 또는 `Chrome DevTools`가 목록에 있으면 성공

### Step 4: 작동 테스트

Claude 채팅창에 입력:

```
쿠팡에서 '맥북에어' 검색해서 검색결과 스크린샷 찍어줘
```

- Chrome 브라우저가 열리고 쿠팡 검색 결과 스크린샷이 나오면 성공

**완료 체크**:
- [ ] Chrome DevTools MCP가 목록에 있음
- [ ] 쿠팡 검색결과 스크린샷이 나옴

> **안 되면**: Claude에게 "계속 시도해줘"라고 요청하세요. 그래도 안 되면 강사에게 질문하세요.
>
> 💡 **팁**: 설치가 잘 안 되면 일단 넘어가세요. 고도화 시간에 다시 시도합니다.

---

## Part C: Google Calendar MCP 설치

> Google Calendar MCP = Claude가 Google 캘린더에 접근할 수 있게 해주는 도구
>
> 일정 조회, 생성, 수정이 가능!

### Step 1: 설정 가이드 열기

> ⚠️ **Google Calendar MCP는 OAuth 설정이 필요합니다.**
> [Google Calendar 설정 가이드](../../5-설정가이드/google-calendar-설정가이드.md)를 참고하세요.

### Step 2: 가이드 따라 설치하기

가이드 문서를 보면서 Google Calendar MCP를 설치합니다.
- Google Cloud Console에서 API 활성화
- OAuth 인증 설정
- Claude에 MCP 연결

### Step 3: 설치 확인

Claude 채팅창에 입력:

```
설치된 MCP 목록 보여줘
```

- `google-calendar`가 목록에 있으면 성공

### Step 4: 작동 테스트

Claude 채팅창에 입력:

```
Google Calendar에서 오늘 일정 알려줘
```

- 일정이 나오면 성공

**완료 체크**:
- [ ] Google Calendar MCP가 목록에 있음
- [ ] 캘린더 일정 조회 성공

> **안 되면**: 가이드 문서를 다시 확인하거나, 강사에게 질문하세요.
>
> 💡 **팁**: OAuth 설정이 어려우면 고도화 시간에 다시 시도합니다.

---

> 📖 **다음**: Claude Code의 필수 기능 6가지를 빠르게 익힙니다.

---

