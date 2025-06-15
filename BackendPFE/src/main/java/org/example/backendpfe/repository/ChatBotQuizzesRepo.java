package org.example.backendpfe.repository;

import org.example.backendpfe.Model.ChatBotQuizzes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatBotQuizzesRepo extends JpaRepository<ChatBotQuizzes,Long>
{
    @Query("SELECT q from ChatBotQuizzes q where q.level=:level")
    List<ChatBotQuizzes> findByLevel(String level); // Get quizzes by difficulty level

}
