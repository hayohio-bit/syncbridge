package com.syncbridge.domain.task.service;

import com.syncbridge.domain.attachment.repository.AttachmentRepository;
import com.syncbridge.domain.notification.service.NotificationService;
import com.syncbridge.domain.project.repository.ProjectRepository;
import com.syncbridge.domain.task.dto.TaskCreateRequest;
import com.syncbridge.domain.task.entity.TaskTemplate;
import com.syncbridge.domain.task.repository.TaskRepository;
import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.domain.user.repository.UserRepository;
import com.syncbridge.global.exception.CustomException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private AttachmentRepository attachmentRepository;
    @Mock
    private TaskAiService taskAiService;

    @InjectMocks
    private TaskService taskService;

    @Test
    @DisplayName("BUG_REPORT 템플릿 - purpose 누락 시 CustomException 발생")
    void createTask_bugReport_missingPurpose_throwsCustomException() {
        Long userId = 1L;
        User requester = User.builder()
                .email("test@example.com").password("pw").name("Tester").role(Role.GENERAL).build();
        ReflectionTestUtils.setField(requester, "id", userId);

        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("테스트 버그")
                .templateType(TaskTemplate.BUG_REPORT)
                .purpose("")
                .target("일반 사용자")
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(requester));

        assertThatThrownBy(() -> taskService.createTask(userId, request))
                .isInstanceOf(CustomException.class);
    }

    @Test
    @DisplayName("BUG_REPORT 템플릿 - target 누락 시 CustomException 발생")
    void createTask_bugReport_missingTarget_throwsCustomException() {
        Long userId = 1L;
        User requester = User.builder()
                .email("test@example.com").password("pw").name("Tester").role(Role.GENERAL).build();
        ReflectionTestUtils.setField(requester, "id", userId);

        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("테스트 버그")
                .templateType(TaskTemplate.BUG_REPORT)
                .purpose("성능 개선")
                .target("")
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(requester));

        assertThatThrownBy(() -> taskService.createTask(userId, request))
                .isInstanceOf(CustomException.class);
    }

    @Test
    @DisplayName("DESIGN_REQUEST 템플릿 - purpose 누락 시 CustomException 발생")
    void createTask_designRequest_missingPurpose_throwsCustomException() {
        Long userId = 1L;
        User requester = User.builder()
                .email("test@example.com").password("pw").name("Tester").role(Role.GENERAL).build();
        ReflectionTestUtils.setField(requester, "id", userId);

        TaskCreateRequest request = TaskCreateRequest.builder()
                .title("버튼 디자인 요청")
                .templateType(TaskTemplate.DESIGN_REQUEST)
                .purpose(null)
                .build();

        given(userRepository.findById(userId)).willReturn(Optional.of(requester));

        assertThatThrownBy(() -> taskService.createTask(userId, request))
                .isInstanceOf(CustomException.class);
    }
}
