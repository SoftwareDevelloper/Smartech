package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.ChatRequest;
import org.example.backendpfe.repository.ChatRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    @Autowired
    private ChatRequestRepository chatRequestRepository;

    public ChatRequest saveChatRequest(ChatRequest request) {
        // Make sure each message knows which request it belongs to
        if (request.getMessages() != null) {
            request.getMessages().forEach(msg -> msg.setChatRequest(request));
        }
        return chatRequestRepository.save(request);
    }
}
