package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Chapter;
import org.example.backendpfe.Model.ChapterProgress;
import org.example.backendpfe.Model.Internote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterProgressRepository extends JpaRepository<ChapterProgress, Long> {
    List<ChapterProgress> findByInternoteId(Long userId);
    Optional<ChapterProgress> findByInternoteAndChapter(Internote internote, Chapter chapter);
    long countByInternoteIdAndCompletedTrue(Long userId);
    long countByChapter_Formation_Id(Long formationId);

    Optional<ChapterProgress> findByInternote_IdAndChapter_Id(Long internoteId, Long chapterId);
}
