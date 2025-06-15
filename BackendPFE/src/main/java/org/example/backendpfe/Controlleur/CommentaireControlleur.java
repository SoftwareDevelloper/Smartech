package org.example.backendpfe.Controlleur;

import jakarta.validation.constraints.NotBlank;
import org.example.backendpfe.Model.Commentaires;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Response.FormationNotificationService;
import org.example.backendpfe.Service.CommentaireService;
import org.example.backendpfe.Service.FormationsService;
import org.example.backendpfe.Service.InternoteServ;
import org.example.backendpfe.ServiceImpl.NotificationService;
import org.example.backendpfe.repository.CommentaireRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.management.relation.Role;
import java.util.Date;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/v2")
public class CommentaireControlleur
{
    @Autowired
    private CommentaireService commentaireService;
    @Autowired
    private InternoteServ internoteServ;
    @Autowired
    private CommentaireRepo commentaireRepo;
    @Autowired
    private FormationsService formationsService;
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/Comment/{learnerId}/{formationId}")
    public ResponseEntity<?> postCommentaire(
            @PathVariable Long learnerId,
            @PathVariable Long formationId,
            @RequestBody Commentaires commentaire) {

        // Fetch learner and course
        Internote learner = internoteServ.getInternoteById(learnerId);
        Formations formation = formationsService.getFormationById(formationId);

        // Validate entities
        if (learner == null || formation == null) {
            return ResponseEntity.notFound().build();
        }

        // Validate comment content
        if (commentaire.getMessage() == null || commentaire.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Comment message cannot be empty");
        }

        // Get all teachers associated with the course
        Set<Internote> teachers = formation.getEnseignants();
        if (teachers.isEmpty()) {
            return ResponseEntity.badRequest().body("Course has no assigned teachers");
        }

        // Link comment to learner and course
        commentaire.setStatus(Commentaires.ValidationStatus.PENDING);
        commentaire.setInternote(learner);
        commentaire.setFormation(formation);
        commentaire.setDate(new Date());
        Commentaires savedComment=commentaireService.PostComment(commentaire);
        learner.getCommentaires().add(commentaire);
        formation.getCommentaires().add(commentaire);

        // Notify all teachers of the course
        String notificationMessage = String.format(
                "New comment awaiting approval on course '%s' by %s: %s",
                formation.getTitleEn(), // Adjust based on language preference (e.g., titleFr, titleAr)
                learner.getFullname(),
                commentaire.getMessage()
        );

        teachers.forEach(teacher ->
                notificationService.sendNotificationToTeacher(teacher, notificationMessage)
        );
        // Notify admin about new comment to moderate
        notificationService.notifyAdminAboutNewComment(savedComment);
        return ResponseEntity.ok(savedComment);
    }
    @GetMapping("/GetAllCommentaires")
    public List<Commentaires> GetCommentaires() {
        return commentaireService.GetAllCommentaire();
    }
    @GetMapping("/GetCommentaire/{formation_id}")
    public Commentaires GetCommentaireByid(@PathVariable Long formation_id)
    {
        return  commentaireService.GetCommentaire(formation_id);
    }

    // GET APPROVED COMMENTS FOR A FORMATION
    @GetMapping("/approved-comments/{formationId}")
    public ResponseEntity<List<Commentaires>> getApprovedCommentsByFormation(@PathVariable Long formationId) {
        List<Commentaires> approvedComments = commentaireRepo.findByFormationIdAndStatus(
                formationId,
                Commentaires.ValidationStatus.APPROVED
        );
        return ResponseEntity.ok(approvedComments);
    }

    @GetMapping("/GetNameApprenant/{commentId}")
    public ResponseEntity<String> GetName(@PathVariable Long commentId) {

        String fullname = commentaireRepo.GetNameApprenant(commentId);
        if (fullname != null) {
            return ResponseEntity.ok(fullname);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{formationId}")
    public ResponseEntity<List<Commentaires>> getCommentsByFormationId(@PathVariable Long formationId) {
        List<Commentaires> comments = commentaireService.getCommentsByFormation(formationId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/getBy/{role}")
    public List<Commentaires> getCommentsByRole(@PathVariable("role") Internote.Role role) {
        return commentaireRepo.getCommentairesByRole(role);
    }


    // admin

    @GetMapping("/pending")
    public ResponseEntity<List<Commentaires>> getPendingComments() {
        List<Commentaires> pendingComments = commentaireRepo.getCommentsByStatus(Commentaires.ValidationStatus.PENDING);
        return ResponseEntity.ok(pendingComments);
    }
    @GetMapping("/formation/{id}")
    public ResponseEntity<Formations> getFormationByCommentId(@PathVariable("id") Long id) {
        Formations formation = commentaireRepo.getFormationBycommentId(id);
        return ResponseEntity.ok(formation);
    }
    @GetMapping("/approveComment")
    public ResponseEntity<List<Commentaires>> getApprovedComments() {
        List<Commentaires> pendingComments = commentaireRepo.getCommentsByStatus(Commentaires.ValidationStatus.APPROVED);
        return ResponseEntity.ok(pendingComments);
    }

    @PutMapping("/{commentId}/approve")
    public ResponseEntity<Commentaires> approveComment(@PathVariable Long commentId) {
        return commentaireRepo.findById(commentId)
                .map(comment -> {
                    comment.setStatus(Commentaires.ValidationStatus.APPROVED);
                    Commentaires approvedComment = commentaireRepo.save(comment);

                    // Notify the comment author


                    return ResponseEntity.ok(approvedComment);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{commentId}/reject")
    public ResponseEntity<Commentaires> rejectComment(@PathVariable Long commentId) {
        return commentaireRepo.findById(commentId)
                .map(comment -> {
                    comment.setStatus(Commentaires.ValidationStatus.REJECTED);
                    Commentaires rejectedComment = commentaireRepo.save(comment);

                    // Notify the comment author


                    return ResponseEntity.ok(rejectedComment);
                })
                .orElse(ResponseEntity.notFound().build());
    }


}
