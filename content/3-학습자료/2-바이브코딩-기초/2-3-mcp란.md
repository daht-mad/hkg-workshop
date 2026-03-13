---
hidden: true
---

# 2.3 MCP란?

> Model Context Protocol - AI용 USB-C 포트

CLAUDE.md로 Claude의 "기억"을 설정했으니, 이번에는 Claude의 "손발"을 달아줄 차례입니다.

---

## MCP = Claude가 외부 세계와 소통하는 표준 방식

쉽게 말해 **"AI용 USB-C 포트"**입니다.
USB-C 하나로 충전기, 모니터, 키보드 다 연결하듯이,
MCP 하나로 Slack, Airtable, 브라우저 등 다양한 서비스에 연결합니다.

![](../../../public/images/Pasted%20image%2020260222033034.png)

---

## MCP 안에는 뭐가 있나요?

각 MCP 서버 안에는 **Tools(도구)**가 들어있습니다.

| MCP 서버 | 안에 있는 Tools 예시 |
|----------|---------------------|
| **Google Drive MCP** 📁 | 파일 검색, 파일 업로드/다운로드, 폴더 생성, 공유 설정 |
| **Google Sheets MCP** 📊 | 시트 읽기/쓰기, 셀 업데이트, 행 추가/삭제 |
| Chrome DevTools MCP | 페이지 열기, 클릭하기, 스크린샷 찍기, 텍스트 입력하기 |
| Context7 MCP | 라이브러리 문서 검색, 코드 예시 찾기 |

> 💡 **Google 서비스별로 각각 MCP가 있어요!**
>
> | MCP 서버 | 하는 일 |
> |---------|--------|
> | Google Drive MCP | 파일 검색, 업로드/다운로드, 공유 설정 |
> | Google Sheets MCP | 시트 읽기/쓰기, 데이터 조회/수정 |
> | Google Calendar MCP | 일정 조회/생성, 참석자 관리 |
> | Gmail MCP | 이메일 검색, 보내기, 라벨 관리 |
>
> 하나의 "Google MCP"가 아니라, **서비스마다 따로** 설치합니다.
> Claude가 "Drive에서 파일 찾아줘"라고 하면 → Google Drive MCP의 `search_files` Tool 자동 호출!

> 💡 **비유**: MCP는 "앱", Tools는 앱 안의 "기능 버튼"이라고 생각하세요.

---

## 언제 호출되나요?

**Claude가 대화 중에 "이건 내 힘만으로 안 되겠다" 싶을 때 자동으로 호출합니다.**

```
여러분: "네이버 열어서 오늘 날씨 알려줘"
         ↓
Claude 생각: "브라우저를 열어야 하네... Chrome DevTools MCP 써야겠다"
         ↓
Claude: Chrome DevTools MCP의 "페이지 열기" Tool 호출
         ↓
결과: 브라우저가 열리고 날씨 정보를 가져옴
```

| 여러분이 하는 말 | Claude가 판단 | 호출하는 Tool |
|-----------------|--------------|---------------|
| "Gmail에서 오늘 온 메일 알려줘" | 이메일 필요 → Gmail MCP | `search_emails` |
| "Google Sheets에서 이번 주 데이터 가져와" | 시트 필요 → Sheets MCP | `read_spreadsheet` |
| "이 사이트 열어서 스크린샷 찍어줘" | 브라우저 필요 → Chrome DevTools | `take_screenshot` |
| "Next.js 공식 문서에서 찾아봐" | 문서 검색 필요 → Context7 | `query-docs` |

> 🎯 **핵심**: 여러분은 **자연어로 요청**만 하면 됩니다. 
> 어떤 MCP의 어떤 Tool을 쓸지는 Claude가 알아서 판단합니다.

---

## 어떻게 작동하나요?

```
여러분 요청 → Claude 판단 → MCP 호출 → 외부 서비스 → 결과 반환
```

1. **설치**: MCP 서버를 컴퓨터에 설치 (한 번만)
2. **인식**: Claude가 설치된 MCP 목록을 자동으로 인식
3. **사용**: 대화 중 필요하면 Claude가 알아서 호출
4. **결과**: 외부 서비스 데이터를 가져오거나 작업 수행

> 💡 **비개발자 관점**: MCP 내부 작동 방식은 몰라도 됩니다. **"설치하면 Claude가 알아서 쓴다"**만 기억하세요.

---

> 📖 **다음**: 실제로 MCP를 설치하고 작동을 확인해봅니다.

