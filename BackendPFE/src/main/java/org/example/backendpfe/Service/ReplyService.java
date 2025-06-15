package org.example.backendpfe.Service;

import org.example.backendpfe.Model.Reply;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReplyService {
    Reply createReply(Reply reply, Long commentId, Long authorId);
    List<Reply> getRepliesByCommentId(Long commentId);
    void deleteReply(Long replyId);

}
