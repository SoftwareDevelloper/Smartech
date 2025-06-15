package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository  extends JpaRepository<Reply, Long> {
    List<Reply> findByCommentId(Long commentId);

    @Query("SELECT r FROM Reply r JOIN FETCH r.internote WHERE r.comment.id = :commentId ")
    List<Reply> findByCommentIdWithAuthor(@Param("commentId") Long commentId);


    List<Reply> findByStatus(Reply.ValidationStatus validationStatus);
}
