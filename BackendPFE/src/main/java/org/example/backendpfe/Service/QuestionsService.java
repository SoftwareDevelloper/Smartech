package org.example.backendpfe.Service;

import org.example.backendpfe.Model.Questions;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface QuestionsService {

    public List<Questions> getAllQuestions();
    public  List<Questions> getQuestionByIdFormation(Long id);
    public Questions saveQuestion(Questions question);
    public Questions updateQuestion(Questions question);
    public void deleteQuestion(Long id);

}
