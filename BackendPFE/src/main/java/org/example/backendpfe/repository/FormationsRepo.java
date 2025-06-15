package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Formations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface FormationsRepo extends JpaRepository<Formations, Long>
{
    @Query("SELECT c FROM Formations c WHERE c.status = :status")
    List<Formations> getAllFormationsbystatus(@Param("status") boolean status);

    @Query("SELECT COUNT(f) FROM Formations f WHERE f.status = false ")
    long countByStatus(boolean b);

    @Query("SELECT f FROM Formations f JOIN f.enseignants e WHERE e.id = :enseignantId")
    List<Formations> getFormationsByEnseignantId(@Param("enseignantId") Long enseignantId);


    @Query("select f from Formations f JOIN f.apprenants e where e.niveau = :niveau")
    List<Formations> getAllFormationsbyniveau(@Param("niveau") String niveau);

    @Query("select  f from  Formations  f where  f.category= :category")
    List<Formations> getFormationsByCategory(@Param("category") String category);

    @Query("SELECT f FROM Formations f JOIN f.apprenants a WHERE a.id = :apprenantId")
    List<Formations> getFormationsByApprenantId(@Param("apprenantId") Long apprenantId);

    @Query("SELECT f, COUNT(a) FROM Formations f LEFT JOIN f.apprenants a GROUP BY f")
    List<Object[]> findFormationsWithEnrollmentCount();

    @Query("select  f from  Formations  f where  f.titleEn= :titleEn")
    List<Formations> getFormationsBytitle(@Param("titleEn") String titleEn);

    @Query("select  f from  Formations  f where  f.level= :level")
    List<Formations> getFormationsBylevel(@Param("level") String level);

    @Query("SELECT f FROM Formations f ORDER BY f.publisheddate DESC")
    List<Formations> findAllByOrderByPublishedDateDesc();

    @Query("select  f from  Formations  f where  f.price= :price")
    List<Formations> getFormationsByprice(@Param("price") Double price);


    @Query("SELECT f FROM Formations f LEFT JOIN FETCH f.commentaires WHERE f.id = :formationId ORDER BY f.id DESC")
    Formations findByIdWithComments(@Param("formationId") Long formationId);

    List<Formations> findByPriceBetween(double minprice, double maxprice);

    @Query("SELECT c FROM Formations c   ORDER BY c.id  LIMIT 8")
    List<Formations> findTop5();
    @Query("SELECT f FROM Formations f WHERE f.category = :category AND f.level = :level")
    List<Formations> findByCategoryAndLevel(@Param("category") String category, @Param("level") String level);

    Page<Formations> findAll(Pageable pageable);

    @Query("select  f from  Formations  f where  f.classe= :classe")
    List<Formations> getFormationsByClasse(String classe);
    @Query("SELECT f.titleEn as title, COUNT(i) as enrollments " +
            "FROM Formations f JOIN f.apprenants i " +
            "GROUP BY f.id ORDER BY enrollments DESC")
    List<Map<String, Object>> findTopCoursesWithEnrollments();
}
