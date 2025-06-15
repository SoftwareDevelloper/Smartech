package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Internote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Repository
public interface InternoteRepo extends JpaRepository<Internote, Long> {
    @Query(value = "SELECT  i from Internote  i where i.fullname=?1")
    Internote findByName(String fullname);

    @Query(value = "SELECT COUNT(i) > 0 FROM Internote i WHERE i.email = ?1")
    Boolean existsByemail(String email);





    @Query(value = "SELECT COUNT(i) > 0 FROM Internote i WHERE i.cle = ?1")
    Boolean existsBycle(String cle);

    @Query(value = "SELECT COUNT(i) > 0 FROM Internote i WHERE i.password = ?1")
    Boolean existsBypassword(String password);

    @Query(value = "SELECT i FROM Internote i WHERE i.email=?1 ")
    Internote existByemail(String email);

    @Query("SELECT COUNT(i) FROM Internote i WHERE i.status = false  and i.role!= 'ADMIN' ")
    long countByStatus(boolean b);

    @Query("select i  from Internote  i where  i.role!='ADMIN' and i.status = :status ")
    List<Internote> getAllInternotebystatus(@Param("status") boolean status);

    @Query(" SELECT i FROM Internote i WHERE   i.role = 'ENSEIGNMENT'")
    List<Internote> findAllByRole(Internote.Role role);
    @Query(" SELECT i FROM Internote i WHERE   i.role = 'APPRENANT'")
    List<Internote> findByRole(Internote.Role role);

    @Query("SELECT COUNT(f) FROM Internote i JOIN i.formationsEnseignees f WHERE i.id = :enseignantId")
    long countCoursesByEnseignant(@Param("enseignantId") Long enseignantId);

    @Query("SELECT COUNT(a) FROM Internote i JOIN i.apprenants a WHERE i.id = :enseignantId")
    long countStudent(@Param("enseignantId") Long enseignantId);

    @Query("SELECT COUNT(c) FROM Internote i JOIN i.formationsEnseignees c WHERE i.id = :enseignantId")
    long countClassByEnseignant(@Param("enseignantId") Long enseignantId);

    @Query("select count(i) from Internote i where i.role != 'ADMIN' and i.active = :active")
    Long countByActiveAccount(boolean active);


    @Query("SELECT i as apprenant from Internote  i  join  i.enseignants e where e.id =:enseignantId")
    List<Internote> getAllInternotebyEnsId(Long enseignantId);



    @Query("SELECT i.fullname FROM Internote i JOIN i.formationsEnseignees f WHERE f.id = :formationId")
    String FullnameByIdFormation(@Param("formationId") Long formationId);


    @Query("SELECT SIZE(i.reels) + SIZE(i.posts) FROM Internote i WHERE i.id = :teacherId")
    Integer countPub(@Param("teacherId") Long teacherId);

    Long countByRole(Internote.Role role);
}
