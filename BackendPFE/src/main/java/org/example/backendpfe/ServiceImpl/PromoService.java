package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.Notification;
import org.example.backendpfe.Model.Promo;
import org.example.backendpfe.repository.PromoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PromoService {
    @Autowired
    private PromoRepo promoRepo;

    public Promo promote(Promo promo) {
        return promoRepo.save(promo);
    }
    public Promo getPromo(Long id) {
        return promoRepo.findById(id).get();
    }
    public Promo  updatePromo(Promo promo) {
        return promoRepo.save(promo);
    }
    public void deletePromo(Long id) {
        promoRepo.deleteById(id);
    }


}
