package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Promo;
import org.example.backendpfe.ServiceImpl.PromoService;
import org.example.backendpfe.repository.PromoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins ="*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/event")
public class PromoEventControlleur {

    @Autowired
    private PromoService promoService;
    @Autowired
    private PromoRepo promoRepo;

    @PostMapping("/createEvent")
    public Promo createEvent(@RequestBody Promo promo) {
        return promoService.promote(promo);
    }
    @GetMapping("/GetEvent")
    public List<Promo> getEvent(@RequestParam(required = false, defaultValue = "en") String lang) {
        List<Promo> promo = promoRepo.findAll();
        List<Promo> translatedEvents = promo.stream().map(event -> {
            Promo translatedEvent = new Promo();
            translatedEvent.setId(event.getId());
            translatedEvent.setEventFirstDate(event.getEventFirstDate());
            translatedEvent.setEventEndDate(event.getEventEndDate());
            switch (lang) {
                case "fr":
                    translatedEvent.setEventTitleFr(event.getEventTitleFr());
                    translatedEvent.setEventDescriptionFr(event.getEventDescriptionFr());
                    break;
                case "ar":
                   translatedEvent.setEventTitleAr(event.getEventTitleAr());
                   translatedEvent.setEventDescriptionAr(event.getEventDescriptionAr());
                    break;
                default:
                    translatedEvent.setEventTitleEn(event.getEventTitleEn());
                    translatedEvent.setEventTitleFr(event.getEventTitleFr());
                    translatedEvent.setEventTitleAr(event.getEventTitleAr());

                    translatedEvent.setEventDescriptionEn(event.getEventDescriptionEn());
                    translatedEvent.setEventDescriptionFr(event.getEventDescriptionFr());
                    translatedEvent.setEventDescriptionAr(event.getEventDescriptionAr());



                    break;
            }

            return translatedEvent;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedEvents).getBody();
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        Promo existpromo = promoService.getPromo(id);
        if (existpromo != null) {
            promoService.deletePromo(id);
            return ResponseEntity.ok("event is deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}
