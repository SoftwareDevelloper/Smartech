package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Chapter;
import org.example.backendpfe.Model.ChapterProgress;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.repository.ChapterProgressRepository;
import org.example.backendpfe.repository.ChapterRepository;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChapterProgressService {
    @Autowired
    private ChapterProgressRepository chapterProgressRepository;
    @Autowired
    private InternoteRepo internoteRepo;
    @Autowired
    private ChapterRepository chapterRepository;
    public ChapterProgress markChapterAsCompleted(Long userId, Long chapterId) {
        Internote user = internoteRepo.findById(userId).orElseThrow();
        Chapter chapter = chapterRepository.findById(chapterId).orElseThrow();

        ChapterProgress progress = chapterProgressRepository.findByInternoteAndChapter(user, chapter)
                .orElse(new ChapterProgress());

        progress.setInternote(user);
        progress.setChapter(chapter);
        progress.setCompleted(true);
        chapter.setLocked(false); // unlock it
        chapterRepository.save(chapter);

        chapterProgressRepository.save(progress);

        unlockNextChapter(userId, chapter.getChapterOrder(), chapter.getFormation().getId());

        return progress;
    }

    private void unlockNextChapter(Long userId, int currentOrder, Long formationId) {
        List<Chapter> chapters = chapterRepository.findByFormationIdOrderByChapterOrderAsc(formationId);
        for (Chapter ch : chapters) {
            if (ch.getChapterOrder() == currentOrder + 1 && ch.isLocked()) {
                ch.setLocked(false);
                chapterRepository.save(ch);
                break;
            }
        }
    }

    public List<ChapterProgress> getProgressByUser(Long userId) {
        return chapterProgressRepository.findByInternoteId(userId);
    }

    public Map<String, Object> getProgressForFormation(Long userId, Long formationId) {
        long totalChapters = chapterProgressRepository.countByChapter_Formation_Id(formationId);
        long completed = chapterProgressRepository.countByInternoteIdAndCompletedTrue(userId);
        double percent = totalChapters > 0 ? (double) completed / totalChapters * 100 : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("completed", completed);
        result.put("total", totalChapters);
        result.put("percentage", Math.round(percent));

        return result;
    }

    public ChapterProgress unlockChapterForUser(Long userId, Long chapterId) {
        // Get or create progress entry
        ChapterProgress progress = chapterProgressRepository.findByInternote_IdAndChapter_Id(userId, chapterId)
                .orElseGet(() -> {
                    ChapterProgress newProgress = new ChapterProgress();
                    newProgress.setInternote(internoteRepo.findById(userId).orElseThrow());
                    newProgress.setChapter(chapterRepository.findById(chapterId).orElseThrow());
                    return newProgress;
                });

        // Admin-controlled unlock logic
        if (!progress.isUnlocked()) {
            progress.setUnlocked(true);
            progress.setUnlockDate(new Date());
            return chapterProgressRepository.save(progress);
        }
        return progress;
    }


    public double getCompletionRateByFormation(Internote user, Formations formation) {
        List<Chapter> chapters = formation.getChapters();
        long total = chapters.size();
        long completed = chapters.stream()
                .filter(ch -> {
                    Optional<ChapterProgress> p = chapterProgressRepository.findByInternoteAndChapter(user, ch);
                    return p.isPresent() && p.get().isCompleted();
                }).count();
        return total > 0 ? (double) completed / total * 100 : 0;
    }
}
