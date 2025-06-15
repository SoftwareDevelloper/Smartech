package org.example.backendpfe.repository;

import org.example.backendpfe.Model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByApprenantId(Long apprenantId);
    Optional<CartItem> findByApprenantIdAndFormationId(Long apprenantId, Long formationId);
}
