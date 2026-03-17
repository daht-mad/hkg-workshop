
# Google Sheets 연동 가이드

> Claude Code가 내 Google Sheets를 읽고 쓸 수 있도록 "로봇 계정"을 만드는 가이드입니다.
> 예상 소요 시간: 10~15분


## Step 1. Google Cloud 프로젝트 만들기

1. **[Google Cloud Console](https://console.cloud.google.com) 접속** (Google 계정 로그인)

2. **새 프로젝트 만들기**
   - 상단 프로젝트 선택 드롭다운 클릭 → **"새 프로젝트"**
   - 프로젝트 이름: `sheets-automation` (아무 이름)
   - **"만들기"** 클릭

3. **만든 프로젝트 선택** (상단에 프로젝트 이름 보이면 OK)


## Step 3. 로봇 계정 만들기

1. 좌측 메뉴(☰) → **"IAM 및 관리자"** → **"서비스 계정"**

2. **"+ 서비스 계정 만들기"** 클릭

3. 이름 입력: `sheets-bot` (아무 이름) → **"만들고 계속하기"**

4. 나머지는 **건너뛰기** → **"완료"**

5. **이메일 주소 복사해두기** (예: `sheets-bot@my-project.iam.gserviceaccount.com`)


## Step 5. 내 시트에 로봇 초대하기

1. **Google Sheets 열기** (연동할 시트)

2. **"공유"** 버튼 클릭

3. Step 3에서 복사한 **이메일 주소 붙여넣기**
   ```
   sheets-bot@my-project.iam.gserviceaccount.com
   ```

4. **"편집자"** 권한 선택 → **"보내기"**

**각 시트마다 이 작업 필요** (공유 안 한 시트는 접근 불가)


## 체크리스트

- [ ] Google Cloud 프로젝트 생성
- [ ] Google Sheets API 켜기
- [ ] 서비스 계정 만들기 (이메일 복사해두기!)
- [ ] JSON 키 다운로드 → 이름을 `credentials.json`으로 변경
- [ ] 작업 폴더 맨 바깥에 `credentials.json` 넣기
- [ ] Google Sheets에서 로봇 이메일로 공유 (편집자 권한)
- [ ] Claude Code에서 테스트


## 주의사항

- **credentials.json은 비밀번호입니다** - 절대 다른 사람에게 공유하지 마세요
- GitHub에 올리면 안 됩니다 (Claude Code에게 ".gitignore에 추가해줘" 요청)
