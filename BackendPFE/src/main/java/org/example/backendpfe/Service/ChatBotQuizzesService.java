package org.example.backendpfe.Service;


import org.example.backendpfe.Model.ChatBotQuizzes;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ChatBotQuizzesService
{
    public ChatBotQuizzes getQuizzes(Long id);
    public List<ChatBotQuizzes> getAllQuizzes();
    public ChatBotQuizzes createQuizzes(ChatBotQuizzes quizzes);

}
