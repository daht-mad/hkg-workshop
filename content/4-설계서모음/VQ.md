
나의 워크샵 스킬 설계서
 이 설계서는 VQ 명세서를 바탕으로 작성되었습니다.

> ⚠️ 이 설계서는 초안입니다!
> 정답이 아니에요. 워크샵 당일 강사님과 함께 범위를 더 좁히거나, 더 구체화할 수 있습니다.
> 사전과제의 목적:
>  * 스킬을 설치해서 한 번 써본 것 ✅
>  * 나만의 스킬 설계서를 만들어서 "아, 내 작업이 이렇게 자동화되겠구나", "이런 흐름이겠구나" 감 잡기 ✅
> 이 정도면 충분해요! 나머지는 워크샵에서 함께 다듬어봐요 😊
> 
목차
 * 0. 선언
 * 한눈에 보기
 * Core (필수)
   * 1. 언제 쓰나요?
   * 2. 사용법
   * 3. 입력/출력 명세
   * 4. 범위
   * 5. 데이터/도구/권한
   * 6. 실패/예외 처리
   * 7. 대화 시나리오
   * 8. 테스트 & 완료 기준
 * Optional
   * B. 외부 API 연동
   * C. 다단계 워크플로우
 * 나중에 더 발전시킬 아이디어
0. 선언
 * 스킬 이름: vq-vision-analyst
 * 한 줄 설명: 위성 이미지의 VQ(Vector Quantization) 클러스터링 분석을 통해 지표면 변화를 감지하고 데이터화
 * 만드는 사람: V (KIFT Director)
 * 스킬 유형: [x] 다단계 워크플로우 / [x] 외부 API (Sentinel Hub)
 * MVP 목표: "특정 좌표와 시점을 입력하면 두 시점 사이의 변화 영역을 감지하고 분석 리포트를 생성한다"
한눈에 보기
외부 연동
| 서비스 | 용도 | 연동 방식 | 복잡도 | 가이드 |
|---|---|---|---|---|
| Sentinel Hub | 위성 이미지 데이터 수집 | API | 중간 | 📘 설정 가이드 |
워크플로 시각화
flowchart TD
    Start([🚀 시작]) --> Input[📍 좌표 및\n분석 연도 입력]
    Input --> Fetch[🛰️ Sentinel Hub\n이미지 로딩]
    Fetch --> VQ[🤖 VQ Clustering\n알고리즘 분석]
    VQ --> Regions[🔍 변화 영역\nVQChangeRegion 생성]
    Regions --> Report[📊 분석 결과\nAnalysisResult 요약]
    Report --> Check{분석 만족?}
    Check -->|Yes| End([🏁 분석 완료])
    Check -->|No| ReParam[⚙️ 파라미터\n임계값 조정]
    ReParam --> VQ

    style VQ fill:#fff4e1
    style Regions fill:#fff4e1
    style Fetch fill:#e8d5f5,stroke:#9c27b0,stroke-width:2px
    style Report fill:#e8f5e9

Core (필수)
1. 언제 쓰나요?
대표 상황:
도시 개발, 산림 벌채, 재난 피해 등 특정 지역의 지표면 변화를 정밀하게 추적하고 싶을 때. 육안으로 확인하기 힘든 미세한 변화를 수치화된 데이터로 추출해야 하는 상황.
왜 필요한가 (불편/비용/시간):
 * 위성 사진을 일일이 비교하며 변화 지점을 수동으로 찾는 데 막대한 시간 소요
 * 변화의 강도나 면적을 객관적인 수치로 환산하기 어려움
 * 분석 파라미터를 조정하며 반복 테스트하는 과정이 복잡함
2. 사용법
이렇게 부르면:
 * /analyze-vq
 * "서울 시청 근처 2018년이랑 2024년 변화 분석해줘"
 * "이 좌표(lat, lng)의 산림 변화율 알려줘"
결과물 형태: [x] 분석 리포트 (JSON/Text) 및 시각화 데이터
결과물 예시:
> 📊 [서울 도시 개발] 분석 결과
> 분석 요약:
>  * 변화율: 78.4% (변화 유형: Urbanization)
>  * 감지된 영역: 12개 (VQChangeRegion)
> 주요 변화 영역 (Top 1):
>  * 위치: (x: 512, y: 384)
>  * 강도: 74.7 (High Confidence)
>  * 면적: 약 1,228,800㎡
> 사용된 파라미터: Threshold: 30, Downscale: 4x
> 
3. 입력/출력 명세
| 구분 | 내용 |
|---|---|
| 사용자 입력 | 분석 지역(이름 또는 좌표), 비교 대상 연도(Before/After) |
| 필수 옵션 | lat, lng, yearBefore, yearAfter |
| 선택 옵션 | threshold (기본 30), bandMode (RGB/NDVI/NIR) |
| 출력 규칙 | AnalysisResult 인터페이스 형식에 맞춘 요약 데이터 출력 |
4. 범위
하는 것 (3개 이내):
 * Sentinel Hub에서 지정된 좌표/시간의 이미지 로드
 * VQ 클러스터링을 통한 변화 영역(VQChangeRegion) 추출
 * 전체 변화율 및 처리 시간을 포함한 분석 리포트 생성
안 하는 것 (2개 이내):
 * 실시간 동영상 변화 감지 (정지 영상 분석만 지원)
 * 고해상도 이미지 파일로의 결과물 내보내기 (데이터 분석에 집중)
5. 데이터/도구/권한
| 항목 | 내용 |
|---|---|
| 읽는 데이터 | Scenario 정보 (좌표, 연도), 위성 원격 탐사 이미지 |
| 쓰는 위치 | AnalysisResult (로컬 상태 또는 임시 스토리지) |
| 외부 서비스 | Sentinel Hub API |
| 민감정보 | SENTINEL_HUB_CLIENT_ID, CLIENT_SECRET |
6. 실패/예외 처리
예상되는 실패 상황:
 * 해당 좌표에 구름이 너무 많아 분석 불가 → "구름 차폐율이 너무 높습니다. 다른 날짜를 선택해볼까요?"
 * API 호출 한도 초과 → "Sentinel Hub API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요."
 * 잘못된 좌표 입력 → "위도(-90~90)와 경도(-180~180) 범위를 확인해주세요."
7. 대화 시나리오
정상 케이스:
나: "서울 강남역 인근 변화 분석해줘. 2020년이랑 2025년 비교해줘."
스킬:
> 🛰️ 이미지를 불러오는 중입니다... (Sentinel Hub 연결 완료)
> 🤖 VQ 분석 알고리즘 가동 중 (Downscale: 4x 적용)
> ✅ 분석이 완료되었습니다!
>  * 시나리오: 서울 강남역 개발 분석
>  * 전체 변화율: 15.3%
>  * 감지 영역: 5개 핫스팟 발견
> 상세한 변화 영역 리스트를 확인하시겠어요?
> 
8. 테스트 & 완료 기준
Done 기준:
"특정 지역의 Before/After 시점을 입력했을 때, VQ 알고리즘이 작동하여 1개 이상의 유효한 VQChangeRegion 데이터를 포함한 AnalysisResult를 반환한다."
Optional
B. 외부 API 연동인 경우
환경변수 요약
| 변수명 | 서비스 | 발급 방법 |
|---|---|---|
| SH_CLIENT_ID | Sentinel Hub | apps.sentinel-hub.com/dashboard에서 발급 |
| SH_CLIENT_SECRET | Sentinel Hub | 위와 동일 |
C. 다단계 워크플로우인 경우
단계 목록:
 * Scenario 설정: 분석 대상지와 기간 정의
 * Data Acquisition: 위성 이미지 밴드별 수집 (RGB, NDVI 등)
 * VQ Processing: 픽셀 단위 클러스터링 및 변화 추출
 * Final Reporting: 수치화된 분석 결과 요약 및 제시
나중에 더 발전시킬 아이디어
 * [ ] NDVI(식생지수)를 활용한 산림 파괴 정밀 모니터링 기능
 * [ ] 과거 분석 결과(AnalysisResult)를 IndexedDB에 저장하여 타임라인 뷰 제공
 * [ ] 감지된 변화 영역에 대해 AI가 "신축 건물 생성", "도로 확장" 등의 레이블 자동 추천
