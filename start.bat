@echo off
chcp 65001 > nul
title SyncBridge 통합 서버 실행 도우미

echo.
echo ========================================================
echo        SyncBridge 전용 서버 실행 도우미
echo ========================================================
echo.

:: 1. 도커 상태 정밀 확인
echo [1/4] Docker 엔진 상태 확인 중...
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo --------------------------------------------------------
    echo [경고] Docker Desktop이 실행되고 있지 않습니다!
    echo.
    echo [조치 방법]
    echo 1. 시작 메뉴에서 'Docker Desktop'을 실행하세요.
    echo 2. 오른쪽 하단 고래 아이콘이 'Running' 상태가 되면
    echo 3. 이 창을 다시 실행해 주세요.
    echo --------------------------------------------------------
    echo.
    pause
    exit /b 1
)
echo       Docker 엔진이 정상 작동 중입니다.
echo.

:: 2. MySQL (Docker Compose)
echo [2/4] MySQL 데이터베이스 컨테이너 구동 중...
docker compose up -d
if %errorlevel% neq 0 (
    echo [오류] docker-compose.yml 파일에 문제가 있거나 이미 포트가 사용 중입니다.
    pause
    exit /b 1
)
echo       MySQL 컨테이너 준비 완료.
echo.

:: 3. 백엔드 (Spring Boot) - 새 창
echo [3/4] 백엔드(Spring Boot) 서버를 새 창에서 실행합니다...
start "SyncBridge Backend (Port 8080)" cmd /k "cd /d %~dp0backend && gradlew.bat bootRun"
echo       백엔드 창이 열렸습니다. (부팅 완료까지 약 20~30초 소요)
echo.

:: 4. 프론트엔드 (Vite + React) - 새 창
echo [4/4] 프론트엔드(Vite) 서버를 새 창에서 실행합니다...
start "SyncBridge Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"
echo       프론트엔드 창이 열렸습니다.
echo.

echo ========================================================
echo  모든 서버 실행 명령이 전달되었습니다!
echo.
echo  - 백엔드 주소: http://localhost:8080
echo  - 프론트엔드 주소: http://localhost:5173
echo.
echo  각 창의 로그를 확인하며 부팅 완료를 기다려 주세요.
echo ========================================================
echo.
echo 이 창은 닫으셔도 서버는 계속 유지됩니다.
pause
