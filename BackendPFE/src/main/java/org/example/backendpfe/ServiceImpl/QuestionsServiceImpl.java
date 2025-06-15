package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Questions;
import org.example.backendpfe.Service.QuestionsService;
import org.example.backendpfe.repository.QuestionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionsServiceImpl implements QuestionsService {
    @Autowired
    private QuestionsRepo questionsRepo;

    @Override
    public List<Questions> getAllQuestions() {
        return questionsRepo.findAll();
    }

    @Override
    public List<Questions> getQuestionByIdFormation(Long formation_id) {
        return questionsRepo.findByFormationId(formation_id);
    }
    public Questions getById(Long id) {
        return questionsRepo.findById(id).get();
    }


    @Override
    public Questions saveQuestion(Questions question) {
        return questionsRepo.save(question);
    }

    @Override
    public Questions updateQuestion(Questions question) {
        return questionsRepo.save(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        questionsRepo.deleteById(id);
    }




}
