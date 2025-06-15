package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Commentaires;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.Reply;
import org.example.backendpfe.Service.InternoteServ;
import org.example.backendpfe.Service.ReplyService;
import org.example.backendpfe.repository.CommentaireRepo;
import org.example.backendpfe.repository.ReplyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReplyServiceImpl implements ReplyService {
    @Autowired
    private ReplyRepository replyRepository;
    @Autowired
    private CommentaireRepo commentaireRepo;
    @Autowired
    private InternoteServ internoteServ;

    @Override
    public Reply createReply(Reply reply, Long commentId, Long authorId) {
        Commentaires comment = commentaireRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Internote author = internoteServ.getInternoteById(authorId);

        reply.setComment(comment);
        reply.setInternote(author);
        reply.setDate(new Date());

        return replyRepository.save(reply);
    }

    @Override
    public List<Reply> getRepliesByCommentId(Long commentId) {
        return replyRepository.findByCommentId(commentId);
    }

    @Override
    public void deleteReply(Long replyId) {
        replyRepository.deleteById(replyId);
    }

}
