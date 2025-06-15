package org.example.backendpfe.repository;

import jakarta.persistence.Id;
import org.example.backendpfe.Model.Chapter;
import org.example.backendpfe.Model.Formations;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByFormationIdOrderByChapterOrderAsc(Long formationId);


    @Query("SELECT ch FROM Chapter ch WHERE ch.status = :status")
    List<Chapter> getAllChapterbystatus(@Param("status") boolean status);
}

