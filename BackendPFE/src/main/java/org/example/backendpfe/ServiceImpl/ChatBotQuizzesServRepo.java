package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.ChatBotQuizzes;
import org.example.backendpfe.Service.ChatBotQuizzesService;
import org.example.backendpfe.repository.ChatBotQuizzesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatBotQuizzesServRepo  implements ChatBotQuizzesService
{
    @Autowired
    private ChatBotQuizzesRepo repo;

    @Override
    public ChatBotQuizzes getQuizzes(Long id) {
        return repo.findById(id).get();
    }

    @Override
    public List<ChatBotQuizzes> getAllQuizzes() {
        return repo.findAll();
    }

    @Override
    public ChatBotQuizzes createQuizzes(ChatBotQuizzes quizzes) {
        return repo.save(quizzes);
    }

}
