-- SyncBridge MySQL 초기화 스크립트
-- docker-compose up 시 DB가 처음 생성될 때만 자동 실행됩니다.

-- 문자셋 확인
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;

-- syncbridge DB가 없으면 생성 (docker-compose의 MYSQL_DATABASE로 이미 생성되므로 중복 방지)
CREATE DATABASE IF NOT EXISTS `syncbridge`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `syncbridge`;

-- sbuser 에게 syncbridge DB 권한 부여 (MYSQL_USER로 생성되었지만 명시적으로 부여)
GRANT ALL PRIVILEGES ON syncbridge.* TO 'sbuser'@'%';
FLUSH PRIVILEGES;
