package com.syncbridge.domain.task.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskAiService {

    private final ChatClient chatClient;

    private static final String ANALYSIS_PROMPT = """
        너는 IT 프로젝트 매니저이자 커뮤니케이션 컨설턴트야.
        사용자가 작성한 업무 요청(Task)의 내용을 분석해서 다음 항목을 제공해줘:
        
        1. clarityScore: 0~100점 사이의 점수 (얼마나 명확하고 구체적인가)
        2. summary: 업무 내용을 한 문장으로 요약
        3. suggestions: 실무자(개발자/디자이너)가 바로 작업에 착수할 수 있도록 보완이 필요한 점 (리스트 형태)
        
        응답은 반드시 아래와 같은 JSON 형식으로만 보내줘:
        {
          "clarityScore": 85,
          "summary": "...",
          "suggestions": ["...", "..."]
        }
        """;

    public String analyzeTask(String title, String content) {
        log.info("Analyzing task clarity with AI: {}", title);
        
        try {
            String userInput = String.format("제목: %s\n내용: %s", title, content);
            
            String response = chatClient.prompt()
                    .system(ANALYSIS_PROMPT)
                    .user(userInput)
                    .call()
                    .content();

            // AI 응답에서 JSON만 추출 (마크다운 제거)
            return response.replaceAll("```json|```", "").trim();
            
        } catch (Exception e) {
            log.error("AI task analysis failed", e);
            return "{\"clarityScore\": 0, \"summary\": \"분석 실패\", \"suggestions\": [\"AI 서비스를 일시적으로 사용할 수 없습니다.\"]}";
        }
    }
}
