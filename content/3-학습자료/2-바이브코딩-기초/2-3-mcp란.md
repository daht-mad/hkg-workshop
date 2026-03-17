
# 2.3 MCP란?

> Model Context Protocol - AI용 USB-C 포트

CLAUDE.md로 Claude의 "기억"을 설정했으니, 이번에는 Claude의 "손발"을 달아줄 차례입니다.


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


## 어떻게 작동하나요?

```
여러분 요청 → Claude 판단 → MCP 호출 → 외부 서비스 → 결과 반환
```

1. **설치**: MCP 서버를 컴퓨터에 설치 (한 번만)
2. **인식**: Claude가 설치된 MCP 목록을 자동으로 인식
3. **사용**: 대화 중 필요하면 Claude가 알아서 호출
4. **결과**: 외부 서비스 데이터를 가져오거나 작업 수행

> 💡 **비개발자 관점**: MCP 내부 작동 방식은 몰라도 됩니다. **"설치하면 Claude가 알아서 쓴다"**만 기억하세요.

