# Google Sheets 연동 가이드

> Claude Code가 내 Google Sheets를 읽고 쓸 수 있도록 "로봇 계정"을 만드는 가이드입니다.
> 예상 소요 시간: 10~15분

---

## 핵심 개념 (30초)

| 용어 | 설명 |
|------|------|
| **Service Account** | Google이 만들어주는 "로봇 계정". 내 시트에 이 로봇을 초대하면 Claude Code가 접근 가능 |
| **JSON 키 파일** | 로봇의 비밀번호 파일. 이걸 Claude Code가 읽어서 인증함 |

**흐름**: 로봇 계정 생성 → 비밀번호(JSON) 다운 → 내 시트에 로봇 초대 → 끝!

---

## Step 1. Google Cloud 프로젝트 만들기

1. **[Google Cloud Console](https://console.cloud.google.com) 접속** (Google 계정 로그인)

2. **새 프로젝트 만들기**
   - 상단 프로젝트 선택 드롭다운 클릭 → **"새 프로젝트"**
   - 프로젝트 이름: `sheets-automation` (아무 이름)
   - **"만들기"** 클릭

3. **만든 프로젝트 선택** (상단에 프로젝트 이름 보이면 OK)

---

## Step 2. Google Sheets API 켜기

1. 좌측 메뉴(☰) → **"API 및 서비스"** → **"라이브러리"**

2. 검색창에 **"Google Sheets API"** 입력

3. **"Google Sheets API"** 클릭 → **"사용"** 버튼 클릭

---

## Step 3. 로봇 계정 만들기

1. 좌측 메뉴(☰) → **"IAM 및 관리자"** → **"서비스 계정"**

2. **"+ 서비스 계정 만들기"** 클릭

3. 이름 입력: `sheets-bot` (아무 이름) → **"만들고 계속하기"**

4. 나머지는 **건너뛰기** → **"완료"**

5. **이메일 주소 복사해두기** (예: `sheets-bot@my-project.iam.gserviceaccount.com`)

---

## Step 4. 비밀번호(JSON) 다운로드

1. 방금 만든 서비스 계정 클릭

2. **"키"** 탭 클릭

3. **"키 추가"** → **"새 키 만들기"** → **JSON** 선택 → **"만들기"**

4. 파일이 자동 다운로드됨 (이름이 길고 복잡함)

5. **파일 이름을 `credentials.json`으로 변경**

6. **지금 Claude Code로 작업 중인 폴더의 맨 바깥에 이 파일 넣기**

---

## Step 5. 내 시트에 로봇 초대하기

1. **Google Sheets 열기** (연동할 시트)

2. **"공유"** 버튼 클릭

3. Step 3에서 복사한 **이메일 주소 붙여넣기**
   ```
   sheets-bot@my-project.iam.gserviceaccount.com
   ```

4. **"편집자"** 권한 선택 → **"보내기"**

**각 시트마다 이 작업 필요** (공유 안 한 시트는 접근 불가)

---

## Step 6. 테스트하기

Claude Code에게 자연어로 요청:

```
credentials.json으로 Google Sheets 연동 테스트해줘.
시트 URL: https://docs.google.com/spreadsheets/d/xxxxx/edit
```

Claude Code가 알아서 필요한 패키지 설치하고 테스트합니다.

---

## 체크리스트

- [ ] Google Cloud 프로젝트 생성
- [ ] Google Sheets API 켜기
- [ ] 서비스 계정 만들기 (이메일 복사해두기!)
- [ ] JSON 키 다운로드 → 이름을 `credentials.json`으로 변경
- [ ] 작업 폴더 맨 바깥에 `credentials.json` 넣기
- [ ] Google Sheets에서 로봇 이메일로 공유 (편집자 권한)
- [ ] Claude Code에서 테스트

---

## 문제 해결

| 에러 | 해결 |
|------|------|
| "권한이 없습니다" | 시트에 로봇 이메일 공유했는지 확인 |
| "API가 활성화되지 않았습니다" | Step 2 다시 확인 |
| "파일을 찾을 수 없습니다" | credentials.json이 작업 폴더 맨 바깥에 있는지 확인 |

---

## 주의사항

- **credentials.json은 비밀번호입니다** - 절대 다른 사람에게 공유하지 마세요
- GitHub에 올리면 안 됩니다 (Claude Code에게 ".gitignore에 추가해줘" 요청)
