package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.DTO.Chapters;
import org.example.backendpfe.Model.Chapter;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.repository.ChapterRepository;
import org.example.backendpfe.repository.FormationsRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final FormationsRepo formationsRepository;

    public ChapterService(ChapterRepository chapterRepository, FormationsRepo formationsRepository) {
        this.chapterRepository = chapterRepository;
        this.formationsRepository = formationsRepository;
    }

    public Chapter addChapterToFormation(Long formationId, Chapter chapter) {
        Optional<Formations> formationOpt = formationsRepository.findById(formationId);
        if (formationOpt.isPresent()) {
            chapter.setFormation(formationOpt.get());
            return chapterRepository.save(chapter);
        } else {
            throw new RuntimeException("Formation not found");
        }
    }

    public List<Chapter> getChaptersByFormation(Long formationId) {
        return chapterRepository.findByFormationIdOrderByChapterOrderAsc(formationId);
    }

    public Chapter updateChapter(Long chapterId, Chapter updatedChapter) {
        Chapter existing = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        existing.setTitleEn(updatedChapter.getTitleEn());
        existing.setTitleFr(updatedChapter.getTitleFr());
        existing.setTitleAr(updatedChapter.getTitleAr());
        existing.setDescriptionEn(updatedChapter.getDescriptionEn());
        existing.setDescriptionFr(updatedChapter.getDescriptionFr());
        existing.setDescriptionAr(updatedChapter.getDescriptionAr());
        existing.setVideoUrl(updatedChapter.getVideoUrl());
        existing.setChapterOrder(updatedChapter.getChapterOrder());

        return chapterRepository.save(existing);
    }

    public void deleteChapter(Long chapterId) {
        chapterRepository.deleteById(chapterId);
    }

    public void addChaptersToFormation(Chapter chapters) {
        chapterRepository.save(chapters);
    }

    public List<Chapter> getAllChapterbystatus(boolean b) {
        return chapterRepository.getAllChapterbystatus(b);
    }
}
