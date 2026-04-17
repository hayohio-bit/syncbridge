package com.syncbridge.global.config;

import com.syncbridge.domain.attachment.repository.AttachmentRepository;
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

import java.util.List;

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
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) return;

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
        // Project 1: 웹사이트 리뉴얼
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

        // Project 2: 사내 메신저 기능 추가
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

        // Project 3: 인프라 클라우드 이전
        Task t6 = taskRepository.save(Task.builder()
                .title("레거시 DB 마이그레이션")
                .content("온프레미스 장비에 있는 10년 된 **레거시** 데이터를 클라우드로 옮기는 **마이그레이션** 스크립트 작성이 필요합니다.")
                .templateType(TaskTemplate.FEATURE_REQUEST).purpose("인프라 현대화").target("전산실")
                .requester(backend).assignee(backend).project(p3).status(TaskStatus.IN_PROGRESS).build());

        Task t7 = taskRepository.save(Task.builder()
                .title("CI/CD 파이프라인 자동화 구축")
                .content("코드 푸시 시 자동으로 테스트와 배포가 이뤄지도록 **CI/CD**를 구축하여 **기술 부채**를 줄이고 배포 병목을 해소합시다.")
                .templateType(TaskTemplate.FEATURE_REQUEST).purpose("배포 자동화 및 안정성 향상").target("개발팀 전체")
                .requester(frontend).assignee(backend).project(p3).status(TaskStatus.TODO).build());

        // Project 4: AI 챗봇 고도화
        Task t8 = taskRepository.save(Task.builder()
                .title("도메인 지식 기반 챗봇 학습 데이터")
                .content("상반기 금융 **도메인** 데이터를 기반으로 챗봇 엔진을 학습시킵니다. 데이터의 정합성 확인이 필수입니다.")
                .templateType(TaskTemplate.FEATURE_REQUEST).purpose("응답 정확도 향상").target("고객센터")
                .requester(general).assignee(backend).project(p4).status(TaskStatus.IN_PROGRESS).build());

        // ── Attachments (Generated Assets) ────────────────────
        saveAttachment(t1, designer, "wireframe.png", "/uploads/mock/wireframe.png");
        saveAttachment(t3, backend, "architecture.png", "/uploads/mock/architecture.png");
        saveAttachment(t4, designer, "ui-design.png", "/uploads/mock/ui-design.png");

        // ── JargonHits (for analytics charts) ─────────────────
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
