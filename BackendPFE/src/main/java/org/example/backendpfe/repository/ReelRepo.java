package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Reel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReelRepo extends JpaRepository<Reel, Long> {
    @Query("SELECT r from Reel r join r.internote i where i.id=:enseigantId")
    List<Reel> findByEnseignantId(@Param("enseigantId") Long enseigantId);

}
