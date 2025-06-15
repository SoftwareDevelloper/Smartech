package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.ChatBotQuizzes;
import org.example.backendpfe.ServiceImpl.ChatBotQuizzesServRepo;
import org.example.backendpfe.repository.ChatBotQuizzesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Api/quiz")
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
public class ChatBotQuizzesControlleur
{
    @Autowired
    private ChatBotQuizzesServRepo chatBotQuizzesServRepo;
    @Autowired
    private ChatBotQuizzesRepo quizRepository;
    @Autowired
    private ChatBotQuizzesRepo chatBotQuizzesRepo;

    @GetMapping("quiz/{id}")
    public ChatBotQuizzes getQuiz(@PathVariable Long id){
        return chatBotQuizzesServRepo.getQuizzes(id);
    }
    @GetMapping("/quiz")
    public List<ChatBotQuizzes> getQuiz(){
        return chatBotQuizzesServRepo.getAllQuizzes();
    }
    @PostMapping("/createQuiz")
    public ChatBotQuizzes createQuiz(@RequestBody ChatBotQuizzes quiz){
        return chatBotQuizzesServRepo.createQuizzes(quiz);
    }
    @PutMapping("/UpdateQuiz/{id}")
    public ResponseEntity<ChatBotQuizzes> updateQuiz(@PathVariable Long id, @RequestBody ChatBotQuizzes quiz){
        ChatBotQuizzes chatBotQuizzes = chatBotQuizzesServRepo.getQuizzes(id);
        if (chatBotQuizzes != null)
        {
            chatBotQuizzes.setQuestion(quiz.getQuestion());
            chatBotQuizzes.setCorrectAnswer(quiz.getCorrectAnswer());
            ChatBotQuizzes  savedQuizzes = chatBotQuizzesRepo.save(chatBotQuizzes);
            return ResponseEntity.ok(savedQuizzes);
        }
        return ResponseEntity.notFound().build();
    }
    @DeleteMapping("/DeleteQuiz/{id}")
    public  ResponseEntity<?> deleteQuiz(@PathVariable Long id){
        ChatBotQuizzes chatBotQuizzes = chatBotQuizzesServRepo.getQuizzes(id);
        if (chatBotQuizzes != null)
        {
            chatBotQuizzesRepo.delete(chatBotQuizzes);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{level}")
    public List<ChatBotQuizzes> getQuizzesByLevel(@PathVariable String level) {
        return quizRepository.findByLevel(level);
    }


}
