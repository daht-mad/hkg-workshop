
# Google Drive API 설정 가이드

Google Drive 워크플로를 사용하기 위한 OAuth 설정 가이드입니다.

> **참고**: 이 가이드는 [Google Workspace Drive 공식 문서](https://developers.google.com/workspace/drive)를 기반으로 작성되었습니다.


## 1. Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인
3. **기존 프로젝트가 있으면 그 프로젝트를 선택**하세요 (새로 만들 필요 없음)
4. 프로젝트가 없는 경우에만 새 프로젝트 생성


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


## 설정 완료 체크리스트

- [ ] Google Cloud Console 프로젝트 선택/생성
- [ ] Google Drive API 활성화
- [ ] OAuth 동의 화면 설정 (처음인 경우)
- [ ] OAuth 클라이언트 ID 생성 (데스크톱 앱)
- [ ] JSON 파일 다운로드
- [ ] 파일을 `workflows/_services/google_drive/`에 저장
- [ ] 파일명을 `google-drive-credentials.json`으로 변경


## 설정 완료 후

위 설정을 모두 완료하셨으면 Claude Code에게 알려주세요!
