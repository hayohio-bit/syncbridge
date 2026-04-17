package com.syncbridge.domain.task.entity;

import com.syncbridge.domain.attachment.entity.Attachment;
import com.syncbridge.domain.project.entity.Project;
import com.syncbridge.domain.user.entity.User;
import com.syncbridge.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "tasks")
public class Task extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long id;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attachment> attachments = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Enumerated(EnumType.STRING)
    @Column(name = "template_type", length = 50)
    private TaskTemplate templateType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 500)
    private String purpose;

    private String target;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.TODO;

    private java.time.LocalDateTime doneAt;

    @Builder
    public Task(Project project, User requester, User assignee, TaskTemplate templateType,
                String title, String content, String purpose, String target, TaskStatus status) {
        this.project = project;
        this.requester = requester;
        this.assignee = assignee;
        this.templateType = templateType;
        this.title = title;
        this.content = content;
        this.purpose = purpose;
        this.target = target;
        this.status = status != null ? status : TaskStatus.TODO;
        if (this.status == TaskStatus.DONE) {
            this.doneAt = java.time.LocalDateTime.now();
        }
    }

    public void updateStatus(TaskStatus status) {
        this.status = status;
        if (status == TaskStatus.DONE) {
            this.doneAt = java.time.LocalDateTime.now();
        }
    }
}
