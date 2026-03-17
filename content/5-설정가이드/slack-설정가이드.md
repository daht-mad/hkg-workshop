
# Slack API 설정 가이드

Slack 워크플로를 사용하기 위한 Bot 설정 가이드입니다.

> **참고**: 이 가이드는 [Slack API 공식 문서](https://api.slack.com/)와 [Python Slack SDK](https://github.com/slackapi/python-slack-sdk) 문서를 기반으로 작성되었습니다.


## 2. Bot Token Scopes 설정

1. 좌측 메뉴에서 **OAuth & Permissions** 클릭
2. **Scopes** 섹션으로 스크롤
3. **Bot Token Scopes**에서 **Add an OAuth Scope** 클릭
4. 다음 권한 추가:

| Scope | 용도 | 필수 |
|-------|------|------|
| `chat:write` | 채널에 메시지 전송 | O |
| `chat:write.public` | 봇이 참여하지 않은 공개 채널에 메시지 전송 | O |

> **Tip**: `chat:write.public` 권한이 있으면 봇을 채널에 초대하지 않아도 공개 채널에 메시지를 보낼 수 있습니다.


## 4. 환경변수 설정

프로젝트 루트의 `.env` 파일에 다음 추가:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
```

> **주의**: 토큰은 `xoxb-`로 시작해야 합니다. `xoxp-`로 시작하는 User Token이 아닌 Bot Token을 사용하세요.


## 설정 완료 체크리스트

- [ ] Slack App 생성 완료
- [ ] Bot Token Scopes 추가 (`chat:write`, `chat:write.public`)
- [ ] 워크스페이스에 앱 설치 완료
- [ ] Bot User OAuth Token 복사 (`xoxb-`로 시작)
- [ ] `.env` 파일에 `SLACK_BOT_TOKEN` 추가


## 문제 해결

| 오류 | 원인 | 해결 방법 |
|------|------|----------|
| `invalid_auth` | 토큰이 잘못됨 | `.env`의 토큰이 `xoxb-`로 시작하는지 확인 |
| `channel_not_found` | 채널이 없거나 접근 불가 | 채널명 확인, 비공개 채널이면 봇 추가 |
| `not_in_channel` | 봇이 채널에 없음 | 채널에 봇 추가 또는 `chat:write.public` 권한 확인 |

