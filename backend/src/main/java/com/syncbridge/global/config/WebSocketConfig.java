package com.syncbridge.global.config;

import com.syncbridge.global.security.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트에서 메시지를 보낼 때 사용하는 prefix: /app
        config.setApplicationDestinationPrefixes("/app");
        
        // 서버에서 클라이언트로 메시지를 보낼 때 사용하는 prefix: /topic(Pub-Sub), /queue(1:1)
        config.enableSimpleBroker("/topic", "/queue");
        
        // 1:1 메시지 전송을 위한 User 전용 prefix 설정
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 엔드포인트: /ws
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // 실제 운영 환경에서는 허용할 도메인 지정 필요
                .withSockJS();
    }
}
