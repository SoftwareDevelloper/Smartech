package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepo extends JpaRepository<Post, Long> {
    @Query("SELECT p from Post p join p.internote i where i.id=:enseigantId")
    List<Post> findByteacherId(@Param("enseigantId") Long enseigantId);
}
