package org.example.backendpfe.repository;

import org.example.backendpfe.Model.ChatRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatRequestRepository extends JpaRepository<ChatRequest, Long> {
}
