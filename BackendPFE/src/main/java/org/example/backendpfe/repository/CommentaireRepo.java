package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Commentaires;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.management.relation.Role;
import java.util.List;

@Repository
public interface CommentaireRepo  extends JpaRepository<Commentaires,Long>
{

    @Query("SELECT i.fullname FROM Internote i JOIN i.commentaires c WHERE c.id = :commentId")
    String GetNameApprenant(@Param("commentId")  Long commentId);

    List<Commentaires> findByFormation(Formations formation);


    @Query("SELECT AVG(c.rating) FROM Commentaires c WHERE c.formation.id = :formationId")
    Double findAverageRatingByFormation(@Param("formationId") Long formationId);

    @Query("SELECT c FROM Commentaires c JOIN c.internote i WHERE i.role = :role")
    List<Commentaires> getCommentairesByRole(@Param("role") Internote.Role role);

    @Query("SELECT f FROM Formations  f JOIN f.commentaires c WHERE c.id = :id")
    Commentaires GetformationBycommentId(@Param("id") Long commentId);

    @Query("SELECT c FROM Commentaires c WHERE c.formation.id = :formationId ORDER BY c.date DESC")
    List<Commentaires> findByFormationIdOrderByDateDesc(@Param("formationId") Long formationId);

    List<Commentaires> getCommentsByStatus(Commentaires.ValidationStatus status);
    List<Commentaires> findByFormationIdAndStatus(Long formationId, Commentaires.ValidationStatus status);

    @Query("select c.formation from Commentaires c where  c.id=:id")
    Formations getFormationBycommentId(Long id);

    @Modifying
    @Query("UPDATE Commentaires c SET c.liked = :liked WHERE c.id = :id")
    boolean like(@Param("id") Long id, @Param("liked") boolean liked);

}


