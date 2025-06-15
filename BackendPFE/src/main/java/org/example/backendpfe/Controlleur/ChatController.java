package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.ChatRequest;
import org.example.backendpfe.ServiceImpl.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${openai.api.key}")
    private String openaiApiKey;
    private final ChatService chatService;
    private final RestTemplate restTemplate = new RestTemplate();
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<?> handleChat(@RequestBody ChatRequest chatRequest) {
        try {
            ChatRequest savedRequest = chatService.saveChatRequest(chatRequest);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", chatRequest.getModel());
            requestBody.put("messages", chatRequest.getMessages());
            requestBody.put("temperature", chatRequest.getTemperature());

            if (chatRequest.isStore()) {
                requestBody.put("store", true); // ✅ Add only if enabled
            }

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    requestEntity,
                    Map.class
            );

            // Extract the AI message content
            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                var choices = (java.util.List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
                    String content = (String) message.get("content");

                    return ResponseEntity.ok(Collections.singletonMap("reply", content));
                }
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "No response from OpenAI"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Collections.singletonMap("error", e.getMessage())
            );
        }
    }
}
