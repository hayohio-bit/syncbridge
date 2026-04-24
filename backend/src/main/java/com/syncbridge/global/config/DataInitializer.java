package com.syncbridge.global.config;

import com.syncbridge.domain.attachment.repository.AttachmentRepository;
import com.syncbridge.domain.config.service.RoleConfigService;
import com.syncbridge.domain.jargon.entity.JargonHit;
import com.syncbridge.domain.jargon.entity.JargonTerm;
import com.syncbridge.domain.jargon.repository.JargonHitRepository;
import com.syncbridge.domain.jargon.repository.JargonTermRepository;
import com.syncbridge.domain.project.entity.Project;
import com.syncbridge.domain.project.repository.ProjectRepository;
import com.syncbridge.domain.task.entity.Task;
import com.syncbridge.domain.task.entity.TaskStatus;
import com.syncbridge.domain.task.entity.TaskTemplate;
import com.syncbridge.domain.task.repository.TaskRepository;
import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@Profile({"dev", "local-mysql"})
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final JargonTermRepository jargonTermRepository;
    private final JargonHitRepository jargonHitRepository;
    private final AttachmentRepository attachmentRepository;
    private final RoleConfigService roleConfigService;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // ── Role Configs ───────────────────────────────────────
        initializeRoleConfigs();

        // ── Users ──────────────────────────────────────────────
        User general = userRepository.save(User.builder()
                .email("user@test.com")
                .password(passwordEncoder.encode("test1234"))
                .name("김사무")
                .role(Role.GENERAL)
                .build());
        User planner = userRepository.save(User.builder()
                .email("planner@test.com")
                .password(passwordEncoder.encode("test1234"))
                .name("박기획")
                .role(Role.PLANNER)
                .build());
        User designer = userRepository.save(User.builder()
                .email("design@test.com")
                .password(passwordEncoder.encode("test1234"))
                .name("최디자")
                .role(Role.DESIGNER)
                .build());
        User frontend = userRepository.save(User.builder()
                .email("front@test.com")
                .password(passwordEncoder.encode("test1234"))
                .name("정프론")
                .role(Role.FRONTEND)
                .build());
        User backend = userRepository.save(User.builder()
                .email("dev@test.com")
                .password(passwordEncoder.encode("test1234"))
                .name("이개발")
                .role(Role.BACKEND)
                .build());

        // ── Projects ───────────────────────────────────────────
        Project p1 = projectRepository.save(Project.builder()
                .title("웹사이트 리뉴얼")
                .description("전사 메인 홈페이지 개편 및 반응형 웹 고도화 작업")
                .build());
        Project p2 = projectRepository.save(Project.builder()
                .title("사내 메신저 기능 추가")
                .description("그룹웨어 연동 및 실시간 채팅 서비스 구축")
                .build());
        Project p3 = projectRepository.save(Project.builder()
                .title("인프라 클라우드 이전")
                .description("on-premise 환경에서 AWS 클라우드 환경으로 전체 이전")
                .build());
        Project p4 = projectRepository.save(Project.builder()
                .title("AI 챗봇 고도화")
                .description("LLM 엔진 연동 및 고객 상담 자동화 솔루션 개발")
                .build());

        // ── Tasks ──────────────────────────────────────────────
        Task t1 = taskRepository.save(Task.builder()
                .title("메인 배너 와이어프레임 검토")
                .content("랜딩 페이지의 핵심인 메인 배너 영역의 **와이어프레임**이 완성되었습니다. 기획 의도와 맞는지 **요구사항 명세서**와 대조 부탁드립니다.")
                .templateType(TaskTemplate.DESIGN_REQUEST).purpose("디자인 방향성 확정").target("마케팅 팀")
                .requester(planner).assignee(designer).project(p1).status(TaskStatus.DONE).build());

        Task t2 = taskRepository.save(Task.builder()
                .title("로그인 API 페이로드 최적화")
                .content("현재 **API** 호출 시 본문(**페이로드**)의 크기가 너무 커서 모바일 환경에서 속도가 느립니다. 필요한 필드만 남기는 **리팩토링**이 시급합니다.")
                .templateType(TaskTemplate.BUG_REPORT).purpose("로딩 속도 개선").target("모바일 사용자")
                .requester(frontend).assignee(backend).project(p1).status(TaskStatus.IN_PROGRESS).build());

        Task t3 = taskRepository.save(Task.builder()
                .title("장애 발생 시 롤백 프로세스 확인")
                .content("지난 배포 때 발생한 오류로 인해 **핫픽스** 배포가 지연되었습니다. 긴급 상황 시 즉시 **롤백**할 수 있는 절차를 가이드 문서에 추가해주세요.")
                .templateType(TaskTemplate.GENERAL).purpose("운영 안정성 강화").target("운영팀")
                .requester(general).assignee(backend).project(p1).status(TaskStatus.TODO).build());

        Task t4 = taskRepository.save(Task.builder()
                .title("인수 테스트 시나리오 작성")
                .content("메신저 채팅 기능 개발이 완료 단계입니다. 출시 전 **인수 테스트**를 위해 사용자 관점의 **유저 스토리** 기반 시나리오를 작성해주세요.")
                .templateType(TaskTemplate.FEATURE_REQUEST).purpose("품질 검수 준비").target("전사 임직원")
                .requester(planner).assignee(frontend).project(p2).status(TaskStatus.IN_PROGRESS).build());

        Task t5 = taskRepository.save(Task.builder()
                .title("QA 스테이징 서버 환경 셋업")
                .content("실서버 반영 전 최종 검수를 위해 **스테이징 서버** 환경이 필요합니다. 실제 DB를 **모킹**하지 말고 샘플 데이터를 넣어 셋업해주세요.")
                .templateType(TaskTemplate.GENERAL).purpose("QA 환경 구축")
                .requester(planner).assignee(backend).project(p2).status(TaskStatus.TODO).build());

        // ── Attachments ───────────────────────────────────────
        saveAttachment(t1, designer, "wireframe.png", "/uploads/mock/wireframe.png");
        saveAttachment(t3, backend, "architecture.png", "/uploads/mock/architecture.png");
        saveAttachment(t4, designer, "ui-design.png", "/uploads/mock/ui-design.png");

        // ── JargonHits ────────────────────────────────────────
        List<String> hotKeywords = List.of("API", "CI/CD", "리팩토링", "스프린트", "배포",
                "QA", "스테이징 서버", "레거시", "마이그레이션", "기술 부채", "페이로드", "롤백", "와이어프레임");

        for (String keyword : hotKeywords) {
            jargonTermRepository.findByKeywordAndIsDeletedFalse(keyword).ifPresent(term -> {
                createHits(term, Role.GENERAL,   general.getId(),  keyword.equals("API") ? 15 : 5);
                createHits(term, Role.PLANNER,   planner.getId(),  keyword.equals("스프린트") ? 12 : 8);
                createHits(term, Role.DESIGNER,  designer.getId(), keyword.equals("와이어프레임") ? 10 : 3);
                createHits(term, Role.FRONTEND,  frontend.getId(), keyword.equals("페이로드") ? 14 : 6);
                createHits(term, Role.BACKEND,   backend.getId(),  keyword.equals("CI/CD") ? 20 : 10);
            });
        }
    }

    private void initializeRoleConfigs() {
        Map<Role, Map<String, Object>> configs = new HashMap<>();

        // GENERAL
        Map<String, Object> generalConfig = new HashMap<>();
        generalConfig.put("menus", List.of("대시보드", "업무 요청"));
        generalConfig.put("defaultDashboardView", "list");
        generalConfig.put("visibleStats", List.of("total", "todo", "done"));
        generalConfig.put("dashboardLayout", List.of(
            Map.of("widget", "greeting", "order", 1),
            Map.of("widget", "stats", "order", 2),
            Map.of("widget", "my-summary", "order", 3),
            Map.of("widget", "toolbar", "order", 4),
            Map.of("widget", "main-view", "order", 5)
        ));
        generalConfig.put("priorityWorkflowStep", Map.of(
            "TODO", "요청 내용 확인",
            "IN_PROGRESS", "진행 상태 모니터링",
            "DONE", "최종 결과 검토"
        ));
        generalConfig.put("quickActions", List.of(
            Map.of("label", "업무 요청", "iconName", "FilePlus2", "path", "/create-task"),
            Map.of("label", "내 요청 현황", "iconName", "ClipboardList", "path", "/dashboard")
        ));
        generalConfig.put("dashboardWidgets", List.of("greeting", "stats", "my-summary", "toolbar", "main-view"));
        generalConfig.put("defaultTemplateType", "GENERAL");
        generalConfig.put("contextGreeting", "오늘 요청하실 업무가 있으신가요?");
        generalConfig.put("emptyStateMessage", "새로운 업무를 요청하여 팀원들과 협업을 시작해보세요.");
        configs.put(Role.GENERAL, generalConfig);

        // PLANNER
        Map<String, Object> plannerConfig = new HashMap<>();
        plannerConfig.put("menus", List.of("대시보드", "업무 요청", "프로젝트", "데이터 분석"));
        plannerConfig.put("defaultDashboardView", "list");
        plannerConfig.put("visibleStats", List.of("total", "todo", "inProgress", "done"));
        plannerConfig.put("dashboardLayout", List.of(
            Map.of("widget", "greeting", "order", 1),
            Map.of("widget", "stats", "order", 2),
            Map.of("widget", "team-progress", "order", 3),
            Map.of("widget", "my-summary", "order", 4),
            Map.of("widget", "toolbar", "order", 5),
            Map.of("widget", "main-view", "order", 6)
        ));
        plannerConfig.put("priorityWorkflowStep", Map.of(
            "TODO", "기획안 상세화",
            "IN_PROGRESS", "일정 관리",
            "DONE", "데이터 분석 반영"
        ));
        plannerConfig.put("quickActions", List.of(
            Map.of("label", "업무 요청", "iconName", "FilePlus2", "path", "/create-task"),
            Map.of("label", "프로젝트", "iconName", "FolderKanban", "path", "/projects"),
            Map.of("label", "데이터 분석", "iconName", "BarChart3", "path", "/analytics")
        ));
        plannerConfig.put("dashboardWidgets", List.of("greeting", "stats", "team-progress", "my-summary", "toolbar", "main-view"));
        plannerConfig.put("defaultTemplateType", "FEATURE_REQUEST");
        plannerConfig.put("contextGreeting", "프로젝트 진행 상황을 확인하세요.");
        plannerConfig.put("emptyStateMessage", "기획을 시작해보세요. 프로젝트별 진행률을 한눈에 확인할 수 있습니다.");
        configs.put(Role.PLANNER, plannerConfig);

        // DESIGNER
        Map<String, Object> designerConfig = new HashMap<>();
        designerConfig.put("menus", List.of("대시보드", "업무 요청", "프로젝트"));
        designerConfig.put("defaultDashboardView", "kanban");
        designerConfig.put("visibleStats", List.of("total", "inProgress", "done"));
        designerConfig.put("dashboardLayout", List.of(
            Map.of("widget", "greeting", "order", 1),
            Map.of("widget", "stats", "order", 2),
            Map.of("widget", "my-tasks", "order", 3),
            Map.of("widget", "toolbar", "order", 4),
            Map.of("widget", "main-view", "order", 5)
        ));
        designerConfig.put("priorityWorkflowStep", Map.of(
            "TODO", "디자인 가이드 확인",
            "IN_PROGRESS", "에셋 업로드",
            "DONE", "피드백 반영 확인"
        ));
        designerConfig.put("quickActions", List.of(
            Map.of("label", "업무 요청", "iconName", "FilePlus2", "path", "/create-task"),
            Map.of("label", "프로젝트", "iconName", "FolderKanban", "path", "/projects")
        ));
        designerConfig.put("dashboardWidgets", List.of("greeting", "stats", "my-tasks", "toolbar", "main-view"));
        designerConfig.put("defaultTemplateType", "DESIGN_REQUEST");
        designerConfig.put("contextGreeting", "배정된 디자인 작업을 확인하세요.");
        designerConfig.put("emptyStateMessage", "현재 배정된 디자인 업무가 없습니다. 새로운 작업이 오면 알려드릴게요.");
        configs.put(Role.DESIGNER, designerConfig);

        // FRONTEND
        Map<String, Object> frontendConfig = new HashMap<>();
        frontendConfig.put("menus", List.of("대시보드", "프로젝트"));
        frontendConfig.put("defaultDashboardView", "kanban");
        frontendConfig.put("visibleStats", List.of("total", "todo", "inProgress"));
        frontendConfig.put("dashboardLayout", List.of(
            Map.of("widget", "greeting", "order", 1),
            Map.of("widget", "my-tasks", "order", 2),
            Map.of("widget", "main-view", "order", 3),
            Map.of("widget", "stats", "order", 4),
            Map.of("widget", "toolbar", "order", 5)
        ));
        frontendConfig.put("priorityWorkflowStep", Map.of(
            "TODO", "UI 컴포넌트 설계",
            "IN_PROGRESS", "API 연동 테스트",
            "DONE", "버그 수정 완료"
        ));
        frontendConfig.put("quickActions", List.of(
            Map.of("label", "프로젝트", "iconName", "FolderKanban", "path", "/projects")
        ));
        frontendConfig.put("dashboardWidgets", List.of("greeting", "my-tasks", "main-view", "stats", "toolbar"));
        frontendConfig.put("defaultTemplateType", "UI_FIX");
        frontendConfig.put("contextGreeting", "진행 중인 프론트엔드 이슈를 확인하세요.");
        frontendConfig.put("emptyStateMessage", "배정된 프론트엔드 작업이 없습니다. 여유로운 시간을 활용해보세요!");
        configs.put(Role.FRONTEND, frontendConfig);

        // BACKEND
        Map<String, Object> backendConfig = new HashMap<>();
        backendConfig.put("menus", List.of("대시보드", "프로젝트"));
        backendConfig.put("defaultDashboardView", "kanban");
        backendConfig.put("visibleStats", List.of("total", "todo", "inProgress"));
        backendConfig.put("dashboardLayout", List.of(
            Map.of("widget", "greeting", "order", 1),
            Map.of("widget", "my-tasks", "order", 2),
            Map.of("widget", "main-view", "order", 3),
            Map.of("widget", "stats", "order", 4),
            Map.of("widget", "toolbar", "order", 5)
        ));
        backendConfig.put("priorityWorkflowStep", Map.of(
            "TODO", "API 명세 확인",
            "IN_PROGRESS", "데이터베이스 마이그레이션",
            "DONE", "성능 최적화 확인"
        ));
        backendConfig.put("quickActions", List.of(
            Map.of("label", "프로젝트", "iconName", "FolderKanban", "path", "/projects")
        ));
        backendConfig.put("dashboardWidgets", List.of("greeting", "my-tasks", "main-view", "stats", "toolbar"));
        backendConfig.put("defaultTemplateType", "BUG_REPORT");
        backendConfig.put("contextGreeting", "대기 중인 백엔드 작업을 확인하세요.");
        backendConfig.put("emptyStateMessage", "배정된 백엔드 작업이 없습니다. 코드 리뷰나 기술 부채 정리를 해보세요!");
        configs.put(Role.BACKEND, backendConfig);

        for (Map.Entry<Role, Map<String, Object>> entry : configs.entrySet()) {
            roleConfigService.updateConfig(entry.getKey(), entry.getValue());
        }
    }

    private void saveAttachment(Task task, User uploader, String filename, String url) {
        attachmentRepository.save(com.syncbridge.domain.attachment.entity.Attachment.builder()
                .originalFileName(filename)
                .storedFileName(filename)
                .fileUrl(url)
                .fileSize(1024L)
                .contentType("image/png")
                .uploader(uploader)
                .task(task)
                .build());
    }

    private void createHits(JargonTerm term, Role role, Long userId, int count) {
        for (int i = 0; i < count; i++) {
            jargonHitRepository.save(JargonHit.builder()
                    .jargonTerm(term)
                    .userRole(role)
                    .userId(userId)
                    .build());
        }
    }
}
