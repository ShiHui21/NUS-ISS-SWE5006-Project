package com.nusiss.config;

import com.nusiss.entity.User;
import com.nusiss.repository.UserRepository;
import com.nusiss.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

     NotificationWebSocketHandler(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session);
        if (token != null && jwtUtil.validateToken(token)) {

            String username = jwtUtil.extractUsername(token);
            User user = userRepository.findByUsernameIgnoreCase(username).orElseThrow(() -> new EntityNotFoundException("User not found"));

            sessions.put(user.getId().toString(), session);
        } else {
            session.close(CloseStatus.NOT_ACCEPTABLE);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Clean up session-related data
        sessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
    }

    public void sendNotification(String userId, String message) throws IOException {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(message));
        }
    }

    private String extractToken(WebSocketSession session) {
        // Extract token from headers or query parameters
        List<String> tokenHeaders = session.getHandshakeHeaders().get("Authorization");
        if (tokenHeaders != null && !tokenHeaders.isEmpty()) {
            return tokenHeaders.get(0).replace("Bearer ", "");
        }
        return null;
    }

}
