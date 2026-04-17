# SyncBridge (싱크브릿지) 🌉
> **"IT 부서와 비IT 부서 사이의 언어적 장벽을 허무는 전사적 협업 플랫폼"**
>
> 일반 사무직(요청자)의 언어를 개발자/디자이너(실무자)의 언어로, 실무자의 전문 용어를 요청자의 쉬운 언어로 실시간 '싱크'해주는 직무 맞춤형 업무 요청 시스템입니다.

---

## 🚀 1. 프로젝트 배경 (Problem Statement)
기업 내 협업 시, **IT 전문 용어에 대한 인지 격차**는 소통 오류, 리워킹(Rework), 그리고 프로젝트 지연의 핵심 원인이 됩니다. 
- **요청자**: "API 연동이 정확히 무엇인지, 왜 시간이 오래 걸리는지 이해하기 어렵습니다."
- **실무자**: "요청 사항이 너무 추상적이고 기술적 맥락이 부족하여 의도를 파악하기 힘듭니다."

SyncBridge는 이러한 **'인지적 부하(Cognitive Load)'**를 기술적으로 해결하기 위해 탄생했습니다.

## ✨ 2. 핵심 차별화 기능 (Core Features)

### 🔍 직무 맞춤형 용어 번역기 (Jargon Translator)
- **Role-Based Tooltip**: 사용자의 직무(Role)를 JWT 토큰에서 자동 식별하여, 본문 내 IT 용어에 대해 각자의 눈높이에 맞는 설명을 제공합니다.
  - *예: 'API'를 기획자가 보면 '데이터 통로'로, 백엔드 개발자가 보면 'RESTful 인터페이스'로 설명.*
- **Auto-Highlighter**: 티켓 본문 내 등록된 IT 용어를 실시간으로 감지하여 시각적으로 강조합니다.

### 🤖 AI 자동 번역 및 캐싱 파이프라인 연동
- **Spring AI Integration**: 관리자가 시스템에 일일이 IT 용어를 수동 주입할 필요가 없습니다. 새로운 기술 용어 조회 시, 서버에 내장된 AI 엔진(OpenAI 연동)이 자동으로 각 직무별 맞춤형 정의를 실시간으로 생성하고 자체 DB에 영구 보관(캐싱)하여 응답 속도를 높입니다.

### 📋 가이드형 업무 요청 템플릿 및 뷰 체인지
- **Structured Request**: '목적', '타겟', '상세 내용' 등 구조화된 폼(템플릿)을 제공하여 업무 요청의 해상도를 상향 평준화합니다.
- **Job-Specific Views**: 요청자는 직관적인 리스트 뷰를, 실무자(개발·디자인)는 애자일 관리에 최적화된 칸반(Kanban) 보드 창을 기본 제공합니다.

## 🛠 3. 기술 스택 (Tech Stack)

### Backend
- **Framework**: Spring Boot 3.4.0 (Java 17)
- **Database**: MySQL 8.0, H2 DB (운영 체제 단에 최적화된 Profile 이원화 운영)
- **Persistence**: Spring Data JPA (Hibernate)
- **Security**: Spring Security 6, JWT 헤더 기반의 제로 트러스트(Zero-Trust) 인가 구조
- **AI**: Spring AI (GPT 기반 번역 에이전트 내장)
- **Real-time**: WebSocket (STOMP) 기반의 이벤트 알림 아키텍처

### Frontend
- **Library**: React 19 (TypeScript)
- **State Management**: Zustand (전역 상태), TanStack Query (서버 상태 및 캐싱 관리)
- **Styling**: Framer Motion, Lucide React 적용 (사용자 인터랙션 고도화 UX)
- **Build Tool**: Vite

## 🏗 4. 도메인 아키텍처 (Domain-Driven Structure)

백엔드 시스템은 철저한 도메인 주도 설계(DDD) 패턴의 패키지 분리를 채택했습니다.
```text
com.syncbridge.domain
├── user        # 구성원 인증/인가 (Role Base)
├── project     # 협업의 단위 그룹화
├── task        # 메인 업무 티켓 관련 CRUD 및 진행 상태(Status) 관리 기능
├── jargon      # 핵심: AI 용어 번역 캐싱 및 요청자별 맞춤형 응답 파이프라인
├── attachment  # 업무 파일(이미지 등) 업로드 및 보관 서비스 
├── notification # WebSocket 구동형 실시간 알림 이벤트 발행/구독
└── analytics   # Jargon 통계 및 사용자 히트(Hit) 횟수 추적
```

## 📈 5. 기술적 강조 포인트
1. **문제 해결 중심 설계**: '인지 부하'를 줄이는 실제 UX를 고려하였으며, 타 직무와의 커뮤니케이션 비용을 물리적으로 줄입니다.
2. **RESTful API 설계 및 오류 규격화**: `CommonResponse<T>` 및 `@RestControllerAdvice`를 통한 일관된 단일 응답 구조(`success`, `data`, `error`)와 우아한 전역 예외 처리(Global Exception Handler)를 구축했습니다.
3. **확장성 및 자동화 고려**: 새로운 사용자의 직무 추가 혹은 IT 단어의 등장 시, 시스템 파이프라인에서 AI가 동작하여 자체적으로 데이터를 진화시키도록 설계했습니다.

---

## 🛠 6. 시작하기 (Getting Started)

SyncBridge 프로젝트를 구동하기 위한 상세한 방법은 [**STARTUP.md**](./STARTUP.md) 가이드를 참고하세요.

### ⚡ 가장 빠른 시작 (Windows)
1. **Docker Desktop**을 실행합니다. (데이터베이스 구동 필수 조건)
2. 프로젝트 루트 디렉토리의 **`start.bat`** 파일을 실행하면 Docker 컨테이너와 백엔드, 프론트엔드 서버가 자동으로 각각의 창에서 구동됩니다.

### 📖 주요 가이드 문서
*   [**통합 실행 가이드 (STARTUP.md)**](./STARTUP.md): 도커 설정, 백엔드/프론트엔드 및 AI 서비스의 상세 구동 방법과 트러블슈팅 안내.
*   [**백엔드 기술 가이드 (backend/HELP.md)**](./backend/HELP.md): 사용된 프레임워크(Spring Boot 3.4.0, Spring AI, WebSocket 등)에 대한 핵심 문서 링크.
*   [**API 명세 (Swagger)**](http://localhost:8080/swagger-ui/index.html): 서버 구동 후 실시간으로 API를 테스트할 수 있는 문서 (접속 가능 시 활성화).
