package org.example.backendpfe.Controlleur;

import org.example.backendpfe.DTO.QuestionDTO;
import org.example.backendpfe.DTO.ValidationRequest;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Questions;
import org.example.backendpfe.Service.QuestionsService;
import org.example.backendpfe.ServiceImpl.QuestionsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins ="smartech-production-1020.up.railway.app",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/questions")
public class QuestionsControlleur {

    @Autowired
    private QuestionsServiceImpl questionsService;

    @PostMapping("/create")
    public ResponseEntity<?> createQuestions(@RequestBody QuestionDTO questionDTO) {
        if (questionDTO.getFormationId() == null) {
            return ResponseEntity.badRequest().body("Formation ID is required");
        }

        Questions question = new Questions();
        question.setQuestion(questionDTO.getQuestion());
        question.setAnswers(questionDTO.getAnswers());
        question.setCorrectAnswerIndex(questionDTO.getCorrectAnswerIndex());

        // Create a minimal formation object with just the ID
        Formations formation = new Formations();
        formation.setId(questionDTO.getFormationId());
        question.setFormation(formation);

        questionsService.saveQuestion(question);
        return ResponseEntity.ok(question);
    }
    @GetMapping("/All")
    public ResponseEntity<?> getAllQuestions() {
        return ResponseEntity.ok(questionsService.getAllQuestions());
    }

    @GetMapping("/get/{formation_id}")
    public ResponseEntity<?> getQuestionByIdFormation(@PathVariable("formation_id") Long formation_id) {
        return ResponseEntity.ok(questionsService.getQuestionByIdFormation(formation_id));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateQuestionById(@PathVariable("id") Long id, @RequestBody Questions questions) {
        Questions quest1 = questionsService.getById(id);
        if (quest1 != null) {
            quest1.setQuestion(questions.getQuestion());
            quest1.setAnswers(questions.getAnswers());
            quest1.setCorrectAnswerIndex(questions.getCorrectAnswerIndex());
            quest1.setFormation(questions.getFormation());
            Questions savedQuestion = questionsService.saveQuestion(quest1);
            return ResponseEntity.ok(savedQuestion);
        }
        return ResponseEntity.notFound().build();
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteQuestionById(@PathVariable Long id) {
        Questions existedQuestion =questionsService.getById(id);
        if (existedQuestion != null) {
            questionsService.deleteQuestion(existedQuestion.getId());
            return ResponseEntity.ok("Question to formation successfully deleted");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/validate/{questionId}")
    public ResponseEntity<?> validateAnswer(
            @PathVariable Long questionId,
            @RequestBody ValidationRequest request) {

        Questions question = questionsService.getById(questionId);
        boolean isCorrect = (request.getSelectedIndex() == question.getCorrectAnswerIndex());
        return ResponseEntity.ok().body(Map.of("correct", isCorrect));
    }
}
