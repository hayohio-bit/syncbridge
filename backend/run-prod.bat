@echo off
chcp 65001 > nul
echo ===========================================
echo   SyncBridge Backend 서버 실행기 (MySQL 연동)
echo ===========================================
echo.

if not exist ".env" (
    echo [오류] .env 파일을 찾을 수 없습니다.
    echo .env.template 파일을 복사하여 .env 파일을 만들고 비밀번호를 입력해주세요.
    echo.
    pause
    exit /b 1
)

echo [.env] 환경변수 파일을 로드합니다...
setlocal enabledelayedexpansion
for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
    set "key=%%A"
    set "val=%%B"
    if not "!key!"=="" (
        set "!key!=!val!"
    )
)
endlocal & (
    for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do (
        set "%%A=%%B"
    )
)

set SPRING_PROFILES_ACTIVE=prod

echo.
echo Spring Boot 서버를 'prod(운영)' 모드로 실행합니다...
call gradlew.bat bootRun

pause
