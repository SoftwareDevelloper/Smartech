package org.example.backendpfe.repository;

import org.example.backendpfe.Model.Promo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.RestController;

@RestController
public interface PromoRepo extends JpaRepository<Promo, Long> {
}
