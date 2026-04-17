# SyncBridge 프로젝트 실행 가이드 (최종본)

이 문서는 SyncBridge 프로젝트를 로컬 환경에서 구동하기 위한 통합 가이드입니다.

---

## 0. 가장 빠른 시작 방법 (추천)
윈도우 사용자를 위해 도커 체크부터 모든 서버 구동을 한 번의 클릭으로 수행하는 스크립트를 제공합니다.

1.  **Docker Desktop**을 실행합니다.
2.  프로젝트 루트 디렉토리의 **`start.bat`** 파일을 실행합니다.
3.  도커 컨테이너, 백엔드, 프론트엔드 서버가 각각 새 창에서 실행됩니다.

---

## 1. 사전 준비

### A. Docker 실행
- **Docker Desktop** 앱이 'Running' 상태인지 확인하세요.
- MySQL 컨테이너를 구동합니다. (프로젝트 루트)
```powershell
docker compose up -d
```

### B. 환경 변수 설정 (.env)
- 프로젝트 루트의 `.env.template` 파일을 복사하여 `.env` 파일을 생성하세요.
- 기본값으로도 구동은 가능하며, AI 기능을 위해 `OPENAI_API_KEY` 설정을 권장합니다.

---

## 2. 각 서비스별 구동 방법 (수동 실행 시)

각 서비스를 개별적으로 제어하고 싶을 때 사용하세요.

### A. AI 서비스 구동 (FastAPI)
- 백엔드의 AI 요청을 처리하는 엔진입니다.
```powershell
cd ai-service
# 가상환경 생성 및 활성화 (최초 1회)
python -m venv venv
.\venv\Scripts\activate
# 의존성 설치 및 실행
pip install -r requirements.txt
python main.py
```
- 접속 주소: `http://localhost:8000`

### B. 백엔드 서버 구동 (Spring Boot)
- **로컬 H2 모드** (데이터 초기화): `./gradlew.bat bootRun`
- **로컬 MySQL 모드** (데이터 유지): 
```powershell
cd backend
$env:SPRING_PROFILES_ACTIVE="local-mysql"; ./gradlew.bat bootRun
```
- 접속 주소: `http://localhost:8080`

### C. 프론트엔드 서버 구동 (Vite + React)
```powershell
cd frontend
npm install  # (최초 1회)
npm run dev
```
- 접속 주소: `http://localhost:5173`

---

## 3. 서버 정상 작동 확인
브라우저에서 아래 주소에 접속하여 확인하세요.

1.  **백엔드 API**: [http://localhost:8080/api/jargons/keywords](http://localhost:8080/api/jargons/keywords) (JSON 데이터 응답 시 정상)
2.  **프론트엔드 UI**: [http://localhost:5173](http://localhost:5173) (로그인 화면 노출 시 정상)
3.  **H2 콘솔 (H2 모드 시)**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:syncbridge`)
4.  **Swagger API 문서**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 4. 문제 해결 (Troubleshooting)

### Docker 연결 오류
- `docker info` 명령어로 Docker 엔진 상태를 확인하세요.
- "failed to connect..." 메시지가 나오면 **Docker Desktop 앱**을 직접 다시 실행해야 합니다.

### 포트 충돌
- 8080(백엔드), 5173(프론트), 8000(AI), 3306(MySQL) 포트가 이미 사용 중인지 확인하세요.

### 의존성 문제
- 백엔드: `./gradlew.bat clean build`
- 프론트엔드: `rm -r node_modules`, `package-lock.json` 삭제 후 `npm install`
