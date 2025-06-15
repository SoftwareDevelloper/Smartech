package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.Reply;
import org.example.backendpfe.ServiceImpl.NotificationService;
import org.example.backendpfe.ServiceImpl.ReplyServiceImpl;
import org.example.backendpfe.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/v2/replies")
public class ReplyController {

    @Autowired
    private ReplyServiceImpl replyService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ReplyRepository replyRepository;

    @PostMapping("/{commentId}/{authorId}")
    public ResponseEntity<Reply> createReply(
            @PathVariable Long commentId,
            @PathVariable Long authorId,
            @RequestBody Reply reply) {

        Reply createdReply = replyService.createReply(reply, commentId, authorId);

        Internote originalCommenter = createdReply.getComment().getInternote();
        notificationService.sendReplyNotification(
                originalCommenter,
                createdReply.getComment(),
                createdReply
        );
        return ResponseEntity.ok(createdReply);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Reply>> getRepliesByCommentId(@PathVariable Long commentId) {
        List<Reply> replies = replyRepository.findByCommentIdWithAuthor(commentId);
        return ResponseEntity.ok(replies);
    }

    @DeleteMapping("/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long replyId) {
        replyService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/pending")
    public ResponseEntity<List<Reply>> getPendingReplies() {
        List<Reply> pendingReplies = replyRepository.findByStatus(Reply.ValidationStatus.PENDING);
        return ResponseEntity.ok(pendingReplies);
    }

    @PutMapping("/{replyId}/approve")
    public ResponseEntity<Reply> approveReply(@PathVariable Long replyId) {
        return replyRepository.findById(replyId)
                .map(reply -> {
                    reply.setStatus(Reply.ValidationStatus.APPROVED);
                    Reply approvedReply = replyRepository.save(reply);
                    return ResponseEntity.ok(approvedReply);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{replyId}/reject")
    public ResponseEntity<Reply> rejectReply(@PathVariable Long replyId) {
        return replyRepository.findById(replyId)
                .map(reply -> {
                    reply.setStatus(Reply.ValidationStatus.REJECTED);
                    Reply rejectedReply = replyRepository.save(reply);
                    return ResponseEntity.ok(rejectedReply);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
