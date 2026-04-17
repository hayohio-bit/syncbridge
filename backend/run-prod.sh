#!/bin/bash
# SyncBridge Backend 서버 실행기 (Mac/Linux용)
# MySQL 연동 (local-mysql 프로파일)
#
# 사용 방법:
#   chmod +x run-prod.sh   (최초 1회만)
#   ./run-prod.sh

set -e  # 오류 발생 시 즉시 종료

echo "==========================================="
echo "  SyncBridge Backend 서버 실행기 (MySQL 연동)"
echo "==========================================="
echo ""

# .env 파일 존재 확인
if [ ! -f ".env" ]; then
  echo "[오류] .env 파일을 찾을 수 없습니다."
  echo ".env.template 파일을 복사하여 .env 파일을 만들고 DB 비밀번호를 입력해주세요:"
  echo ""
  echo "  cp .env.template .env"
  echo "  vi .env   # (또는 nano .env)"
  echo ""
  exit 1
fi

# .env 파일 로드 (주석 제외, 빈 줄 제외)
echo "[.env] 환경변수 파일을 로드합니다..."
export $(grep -v '^#' .env | grep -v '^$' | xargs)

# Spring 프로파일 설정
export SPRING_PROFILES_ACTIVE=local-mysql

echo ""
echo "[설정 확인]"
echo "  - Profile : $SPRING_PROFILES_ACTIVE"
echo "  - DB Host : ${DB_HOST:-localhost}"
echo "  - DB Port : ${DB_PORT:-3306}"
echo "  - DB Name : ${DB_NAME:-syncbridge}"
echo "  - DB User : ${DB_USERNAME:-sbuser}"
echo ""

# Docker MySQL 실행 여부 확인
if command -v docker &> /dev/null; then
  if ! docker ps | grep -q "syncbridge-mysql"; then
    echo "[경고] Docker MySQL 컨테이너(syncbridge-mysql)가 실행 중이지 않습니다."
    echo "       프로젝트 루트에서 다음 명령어를 먼저 실행해주세요:"
    echo ""
    echo "  docker-compose up -d"
    echo ""
    read -p "계속 진행하시겠습니까? (y/N): " choice
    if [[ ! "$choice" =~ ^[Yy]$ ]]; then
      echo "종료합니다."
      exit 0
    fi
  else
    echo "[OK] Docker MySQL 컨테이너가 실행 중입니다."
  fi
fi

echo ""
echo "Spring Boot 서버를 'local-mysql' 모드로 시작합니다..."
echo ""
./gradlew bootRun
