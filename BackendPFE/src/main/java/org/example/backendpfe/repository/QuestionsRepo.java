package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Questions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionsRepo extends JpaRepository<Questions, Long> {


    @Query("SELECT q FROM Questions q JOIN q.formation f WHERE f.id = :formation_id")
    List<Questions> findByFormationId(@Param("formation_id") Long formation_id);
}
