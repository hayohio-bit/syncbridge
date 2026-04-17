# SyncBridge Backend - Getting Started

이 문서는 SyncBridge 백엔드 프로젝트의 기술 스택 및 개발을 위한 공식 문서 링크를 제공합니다.

### 핵심 기술 스택 (Current Version: Spring Boot 3.4.0 / Java 17)

현재 프로젝트에서 사용 중인 주요 기술들에 대한 레퍼런스 가이드입니다.

*   [Spring Boot 3.4.0 Reference Documentation](https://docs.spring.io/spring-boot/docs/3.4.0/reference/html/)
*   [Official Gradle Documentation](https://docs.gradle.org)
*   [Spring Web (Servlet)](https://docs.spring.io/spring-boot/docs/3.4.0/reference/html/web.html#web.servlet)
*   [Spring Data JPA](https://docs.spring.io/spring-boot/docs/3.4.0/reference/html/data.html#data.sql.jpa-and-spring-data)
*   [Spring Security](https://docs.spring.io/spring-boot/docs/3.4.0/reference/html/web.html#web.security)
*   [Validation](https://docs.spring.io/spring-boot/docs/3.4.0/reference/html/io.html#io.validation)

### 주요 연동 및 기능

프로젝트의 핵심 기능을 구현하는 데 사용된 라이브러리 및 도구입니다.

*   **Spring AI (OpenAI)**: AI 기반 용어 해석 및 소통 지원을 위한 연동 가이드입니다.
    *   [Spring AI Reference Guide](https://docs.spring.io/spring-ai/reference/index.html)
    *   [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
*   **WebSocket**: 실시간 알림 및 협업 기능을 위한 통신 방식입니다.
    *   [Spring WebSocket Reference](https://docs.spring.io/spring-boot/docs/3.4.0/reference/html/web.html#web.websocket)
*   **API Documentation (Swagger/OpenAPI)**: API 명세 자동화 및 테스트 도구입니다.
    *   [SpringDoc OpenAPI Starter](https://springdoc.org/)
    *   **로컬 접속 주소**: `http://localhost:8080/swagger-ui/index.html` (서버 구동 시)
*   **Security & JWT**: 토큰 기반 인증 및 인가 방식입니다.
    *   [jjwt (Java JWT library)](https://github.com/jwtk/jjwt)

### 주요 개발 가이드

실제 기능을 구현할 때 참고할 수 있는 공식 가이드입니다.

*   [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
*   [Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)
*   [Securing a Web Application](https://spring.io/guides/gs/securing-web/)
*   [Using WebSocket to build an interactive web application](https://spring.io/guides/gs/messaging-stomp-websocket/)

### 추가 설정 및 도구

*   **Dotenv**: `.env` 파일을 통한 환경 변수 관리 (`spring-dotenv`)
*   **Lombok**: 보일러플레이트 코드 제거를 위한 어노테이션 기반 라이브러리
*   **MySQL & H2**: 데이터베이스 연동 (MySQL: 운영/개발, H2: 테스트)

---
*이 문서는 실제 프로젝트 환경(build.gradle)을 바탕으로 업데이트되었습니다.*
