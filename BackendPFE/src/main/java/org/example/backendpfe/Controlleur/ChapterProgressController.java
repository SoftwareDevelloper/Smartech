package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.ChapterProgress;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.ServiceImpl.ChapterProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins ="*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/chapter-progress")
public class ChapterProgressController {
    @Autowired
    private ChapterProgressService chapterProgressService;

    @PostMapping("/complete")
    public ChapterProgress markAsCompleted(@RequestParam Long userId, @RequestParam Long chapterId) {
        return chapterProgressService.markChapterAsCompleted(userId, chapterId);
    }

    @GetMapping("/user/{userId}")
    public List<ChapterProgress> getUserProgress(@PathVariable Long userId) {
        return chapterProgressService.getProgressByUser(userId);
    }

    @GetMapping("/progress/{formationId}")
    public Map<String, Object> getProgress(
            @PathVariable Long formationId,
            @RequestParam Long userId
    ) {
        return chapterProgressService.getProgressForFormation(userId, formationId);
    }
    @PostMapping("/unlock-chapter")
    public ResponseEntity<?> unlockChapterForUser(
            @RequestParam Long userId,
            @RequestParam Long chapterId
    ) {
        try {
            ChapterProgress progress = chapterProgressService.unlockChapterForUser(userId, chapterId);
            return ResponseEntity.ok(Map.of(
                    "message", "Chapter unlocked successfully",
                    "chapterId", chapterId,
                    "userId", userId
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to unlock chapter: " + e.getMessage()));
        }
    }
    @GetMapping("/rate")
    public double getCompletionRate(@RequestParam Long userId, @RequestParam Long formationId) {
        Internote user = new Internote(); user.setId(userId);
        Formations formation = new Formations(); formation.setId(formationId);
        return chapterProgressService.getCompletionRateByFormation(user, formation);
    }
}
