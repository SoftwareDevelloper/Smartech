package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Long>{
    List<Notification> findByIsReadFalse();


    List<Notification> findByIsReadFalseOrderByTimestampDesc();


    // Add this method for duplicate checking
    boolean existsByMessageHashAndUser(String messageHash, Internote user);
}
