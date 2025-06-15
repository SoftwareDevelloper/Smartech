package org.example.backendpfe.Controlleur;

import org.example.backendpfe.DTO.InscriptionRequest;
import org.example.backendpfe.Model.ArchivedFormation;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Response.FormationNotificationService;
import org.example.backendpfe.ServiceImpl.*;
import org.example.backendpfe.repository.ArchivedFormationRepository;
import org.example.backendpfe.repository.FormationsRepo;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins ="*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT})
@RequestMapping("/api")
public class FormationsControlleur {
    @Autowired
    private FormationsServImpl formationsServ;
    @Autowired
    private FormationsRepo formationsRepo;
    @Autowired
    private InternoteServImpl internoteServ;
    @Autowired
    private FormationsServImpl formationsServImpl;
    @Autowired
    private FormationNotificationService formationNotificationService;

    private final ImageUploadService imageUploadService;
    private final VideoUploadService videoUploadService;
    private final filesUploadService filesUploadService;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private ArchivedFormationRepository archivedFormationRepository;
    @Autowired
    private InternoteRepo internoteRepo;


    public FormationsControlleur(ImageUploadService imageUploadService, VideoUploadService videoUploadService, filesUploadService filesUploadService) {
        this.imageUploadService = imageUploadService;
        this.videoUploadService = videoUploadService;
        this.filesUploadService = filesUploadService;
    }

    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is missing"));
        }

        try {
            String imageUrl = imageUploadService.uploadImage(file);
            return ResponseEntity.ok(Map.of("imageUrl", "http://localhost:9000" + imageUrl));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }


    @PostMapping("/AddFormations")
    public ResponseEntity<Formations> addFormations(@RequestBody Formations formations) {
        try {
            formations.setPublisheddate(new Date(System.currentTimeMillis()));
            Formations newFormation = formationsServ.addFormation(formations);
            formations.setStatus(true);
            formationNotificationService.notification(newFormation.getTitleEn());
            notificationService.sendNotificationToApprenants("New formation added: " + newFormation.getTitleEn());
            return ResponseEntity.ok(newFormation);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(formations);
        }
    }

    @PutMapping("/formations/{id}/complete")
    public ResponseEntity<String> markFormationAsCompleted(@PathVariable Long id) {
        Optional<Formations> formationOpt = formationsRepo.findById(id);
        if (formationOpt.isPresent()) {
            Formations formation = formationOpt.get();
            formation.setIscompleted(true);
            formationsRepo.save(formation);
            return ResponseEntity.ok("Formation marked as completed.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //add formation by enseignment
    @PostMapping("/AddFormationsByENS/{enseignantId}")
    public ResponseEntity<Formations> addFormationsByEnseignant(
            @RequestBody Formations formations,
            @PathVariable Long enseignantId) {
        try {
            // Get the enseignant
            Internote enseignant = internoteServ.getInternoteById(enseignantId);
            if (enseignant == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            // Set formation properties
            formations.setPublisheddate(new Date(System.currentTimeMillis()));
            formations.setStatus(false);
            // Save the formation first
            Formations newFormation = formationsServ.addFormation(formations);
            // Assign the formation to the enseignant
            enseignant.getFormationsEnseignees().add(newFormation);
            internoteServ.updateInternote(enseignant);
            // Send notifications
            formationNotificationService.notification(newFormation.getTitleEn());
            notificationService.sendNotificationToApprenants("New formation added: " + newFormation.getTitleEn());
            return ResponseEntity.ok(newFormation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(formations);
        }
    }
    // Endpoint to get pending formations (for admin)
    @GetMapping("/admin/pendingFormations")
    public ResponseEntity<List<Formations>> getPendingFormations(
            @RequestParam Long adminId,
            @RequestParam(required = false, defaultValue = "en") String lang) {
        // Verify the user is an admin
        Internote admin = internoteServ.getInternoteById(adminId);
        if (admin == null || !admin.getRole().equals(Internote.Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Formations> pendingFormations = formationsRepo.getAllFormationsbystatus(false);

        // Apply language translation
        List<Formations> translatedFormations = pendingFormations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());

            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default:
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }

    @GetMapping("/GetAllFormations")
    public ResponseEntity<List<Formations>> getAllFormations() {
        List<Formations> formations = formationsRepo.findAll();
        return ResponseEntity.ok(formations);
    }

    @GetMapping("/ArchivedFormations")
    public ResponseEntity<List<ArchivedFormation>> getArchivedFormations() {
        List<ArchivedFormation> formations = archivedFormationRepository.findAll();
        return ResponseEntity.ok(formations);
    }

    @PostMapping("/RestoreFormations/{id}")
    public ResponseEntity<Formations> restoreFormations(@PathVariable Long id) {
        Formations result = formationsServ.restoreArchivedFormation(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/GetAllFormations/{status}")
    public ResponseEntity<List<Formations>> GetAllFormationsbystatus(@PathVariable boolean status, @RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.getAllFormationsbystatus(status);
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());

            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());

                    break;
                default: // Default to English
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }

    @GetMapping("/GetFormations")
    public ResponseEntity<List<Formations>> getAllFormations(@RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.findAll();

        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());
            translatedFormation.setLevel(formation.getLevel());
            // Set title and description based on the requested language
            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr() != null ? formation.getTitleFr() : "");
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr() != null ? formation.getDescriptionFr() : "");
                    translatedFormation.setCategoryFr(formation.getCategoryFr() != null ? formation.getCategoryFr() : "");
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr() != null ? formation.getTitleAr() : "");
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr() != null ? formation.getDescriptionAr() : "");
                    translatedFormation.setCategoryAr(formation.getCategoryAr() != null ? formation.getCategoryAr() : "");
                    break;
                default:
                    translatedFormation.setTitleEn(formation.getTitleEn() != null ? formation.getTitleEn() : "");
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn() != null ? formation.getDescriptionEn() : "");
                    translatedFormation.setCategory(formation.getCategory() != null ? formation.getCategory() : "");
                    break;
            }


            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }

    @GetMapping("GetCourse/{category}")
    public ResponseEntity<List<Formations>> GetCourseByCategory(@PathVariable String category, @RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.getFormationsByCategory(category);
        // Map formations to include only the requested language's translations
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());
            translatedFormation.setLevel(formation.getLevel());

            switch (lang) {
                case "fr":

                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default:
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }
            return translatedFormation;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(translatedFormations);
    }

    @GetMapping("/GetFormationsbyENS/{enseignantId}")
    public List<Formations> GetAllFormationsbyid(@PathVariable Long enseignantId) {
        return formationsServ.getFormationsByEnseignant(enseignantId);
    }

    @GetMapping("/TotalCourse")
    public ResponseEntity<Number> getAllInternotesTotal() {
        return ResponseEntity.ok(formationsRepo.count());
    }

    @GetMapping("/GetFormationsById/{id}")
    public ResponseEntity<Formations> getFormations(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "en") String lang) {

        Formations formation = formationsServ.getFormationById(id);

        if (formation == null) {
            return ResponseEntity.notFound().build();
        }
        Formations translatedFormation = new Formations();
        translatedFormation.setId(formation.getId());
        translatedFormation.setImage(formation.getImage());
        translatedFormation.setPrice(formation.getPrice());
        translatedFormation.setPublisheddate(formation.getPublisheddate());
        translatedFormation.setLevel(formation.getLevel());
        translatedFormation.setClasse(formation.getClasse());
        translatedFormation.setStatus(formation.isStatus());


        // Set title and description based on the requested language
        switch (lang) {
            case "fr":
                translatedFormation.setTitleFr(formation.getTitleFr());
                translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                translatedFormation.setCategoryFr(formation.getCategoryFr());
                break;
            case "ar":
                translatedFormation.setTitleAr(formation.getTitleAr());
                translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                translatedFormation.setCategoryAr(formation.getCategoryAr());
                break;
            default: // Default to English
                translatedFormation.setTitleEn(formation.getTitleEn());
                translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                translatedFormation.setCategory(formation.getCategory());
                break;
        }

        return ResponseEntity.ok(translatedFormation);
    }

    @PutMapping("/UpdateFormations/{id}")
    public ResponseEntity<Formations> updateFormations(@PathVariable Long id, @RequestBody Formations formations) {
        Formations existingFormation = formationsServ.getFormationById(id);
        if (existingFormation != null) {
            existingFormation.setStatus(formations.isStatus());
            Formations updatedFormation = formationsServ.updateFormation(existingFormation);
            return ResponseEntity.ok(updatedFormation);
        } else return ResponseEntity.notFound().build();
    }

    @PutMapping("/UpdateFormation/{id}")
    public ResponseEntity<Formations> updateFormation(@PathVariable Long id, @RequestBody Formations formations) {
        Formations existingFormation = formationsServ.getFormationById(id);
        if (existingFormation != null) {
            existingFormation.setImage(formations.getImage());
            existingFormation.setPrice(formations.getPrice());
            existingFormation.setTitleEn(formations.getTitleEn());
            existingFormation.setTitleFr(formations.getTitleFr());
            existingFormation.setTitleAr(formations.getTitleAr());
            existingFormation.setDescriptionEn(formations.getDescriptionEn());
            existingFormation.setDescriptionFr(formations.getDescriptionFr());
            existingFormation.setDescriptionAr(formations.getDescriptionAr());
            Formations updatedFormation = formationsServ.updateFormation(existingFormation);
            return ResponseEntity.ok(updatedFormation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/DeleteFormations/{id}")
    public ResponseEntity<?> deleteFormations(@PathVariable Long id) {
        Formations formations = formationsServ.getFormationById(id);
        if (formations != null) {
            formationsServ.archiveAndDeleteFormations(id);
            return ResponseEntity.ok().body("Formations deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/approveformations/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        Formations formations = formationsServ.getFormationById(id);

        if (formations == null) {
            return ResponseEntity.notFound().build();
        }

        formations.setStatus(true);

        formationsServ.updateFormation(formations);
        return ResponseEntity.ok("formations " + formations.getTitleEn() + " approved successfully!");
    }

    @PutMapping("/assignFormationToTeacher/{enseignant_id}/{formation_id}")
    public ResponseEntity<?> assignFormationToTeacher(@PathVariable Long enseignant_id, @PathVariable Long formation_id) {
        Internote teacher = internoteServ.getInternoteById(enseignant_id);
        Formations formation = formationsServ.getFormationById(formation_id);

        if (teacher == null || formation == null) {
            return ResponseEntity.notFound().build();
        }

        teacher.getFormationsEnseignees().add(formation);
        formationsServ.updateFormation(formation);
        internoteServ.updateInternote(teacher);

        return ResponseEntity.ok(formation);
    }

    @PostMapping("/inscrire/{apprenant_id}/{formation_id}")
    public ResponseEntity<?> subscribe(
            @PathVariable Long apprenant_id,
            @PathVariable Long formation_id,
            @RequestBody InscriptionRequest inscriptionRequest // Ajout du DTO pour récupérer les données
    ) {
        // Récupérer l'apprenant et la formation
        Internote student = internoteServ.getInternoteById(apprenant_id);
        Formations formations = formationsServ.getFormationById(formation_id);

        // Vérifier si l'apprenant ou la formation existe
        // Vérifier si l'apprenant ou la formation existe
        if (student == null || formations == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Apprenant or Formation not found"));
        }

        // Vérifier si le paiement a été effectué
        if (inscriptionRequest.isPayed()) {
            return ResponseEntity.status(HttpStatus.ACCEPTED)
                    .body("payment confirmed successfully."); // Renvoyer une réponse JSON
        }

        // Ajouter la formation à la liste des formations suivies par l'apprenant
        student.getFormationsSuivies().add(formations);
        formationsServ.updateFormation(formations);
        internoteServ.updateInternote(student);

        return ResponseEntity.ok(formations);
    }

    @GetMapping("/TotalPending")
    public ResponseEntity<Number> getTotalPendingApprovals() {
        long pendingCount = formationsRepo.countByStatus(false);
        return ResponseEntity.ok(pendingCount);
    }

    @GetMapping("/Mycourse/{apprenantId}")
    public List<Formations> getMyCourse(@PathVariable Long apprenantId) {

        return formationsRepo.getFormationsByApprenantId(apprenantId);

    }

    @PutMapping("/{formationId}/mark-completed")
    public ResponseEntity<String> markCourseAsCompleted(@PathVariable Long formationId) {
        formationsServImpl.markCourseAsCompleted(formationId);
        return ResponseEntity.ok("Course marked as completed.");
    }

    @GetMapping("/formations-with-enrollments")
    public ResponseEntity<List<Map<String, Object>>> getFormationsWithEnrollments() {
        List<Object[]> results = formationsRepo.findFormationsWithEnrollmentCount();
        List<Map<String, Object>> response = results.stream()
                .map(result -> {
                    Map<String, Object> map = new HashMap<>();
                    Formations formation = (Formations) result[0];
                    Long count = (Long) result[1];

                    map.put("id", formation.getId());
                    map.put("titleEn", formation.getTitleEn());
                    map.put("titleFr", formation.getTitleFr());
                    map.put("titleAr", formation.getTitleAr());
                    map.put("enrolledCount", count);
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }


    @GetMapping("GetCourseByTitle/{titleEn}")
    public ResponseEntity<List<Formations>> GetCourseByTitle(@PathVariable String titleEn, @RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.getFormationsBytitle(titleEn);
        // Map formations to include only the requested language's translations
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setCategory(formation.getCategory());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());

            // Set title and description based on the requested language
            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default: // Default to English
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }


    @GetMapping("GetCourseBylevel/{level}")
    public ResponseEntity<List<Formations>> GetCourseBylevel(@PathVariable String level, @RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.getFormationsBylevel(level);
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setCategory(formation.getCategory());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());


            // Set title and description based on the requested language
            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default: // Default to English
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }

    @GetMapping("GetCourseByprice/{price}")
    public ResponseEntity<List<Formations>> GetCourseByprice(@PathVariable Double price, @RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.getFormationsByprice(price);
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setCategory(formation.getCategory());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());

            // Set title and description based on the requested language
            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default: // Default to English
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }

    @GetMapping("GetCourseByCourseClass/{classe}")
    public ResponseEntity<List<Formations>> GetCourseByCourseClass(@PathVariable String classe, @RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.getFormationsByClasse(classe);
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setCategory(formation.getCategory());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());
            // Set title and description based on the requested language
            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default: // Default to English
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }


    @GetMapping("/{formationId}/rating")
    public Double getFormationRating(@PathVariable Long formationId) {
        return formationsServ.getFormationRating(formationId);
    }

    @GetMapping("/price-range")
    public List<Formations> getFormationsByPriceRange(@RequestParam(name = "minprice") double minprice,
                                                      @RequestParam(name = "maxprice", required = false) Double maxprice) {
        return formationsServ.getProductsByPriceRange(minprice, maxprice);
    }

    @GetMapping("/Top5Course")
    public ResponseEntity<List<Formations>> findTop5Couse(@RequestParam(required = false, defaultValue = "en") String lang) {
        List<Formations> formations = formationsRepo.findTop5();
        List<Formations> translatedFormations = formations.stream().map(formation -> {
            Formations translatedFormation = new Formations();
            translatedFormation.setId(formation.getId());
            translatedFormation.setImage(formation.getImage());
            translatedFormation.setPrice(formation.getPrice());
            translatedFormation.setCategory(formation.getCategory());
            translatedFormation.setPublisheddate(formation.getPublisheddate());
            translatedFormation.setLevel(formation.getLevel());
            translatedFormation.setClasse(formation.getClasse());
            translatedFormation.setStatus(formation.isStatus());

            // Set title and description based on the requested language
            switch (lang) {
                case "fr":
                    translatedFormation.setTitleFr(formation.getTitleFr());
                    translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                    translatedFormation.setCategoryFr(formation.getCategoryFr());
                    break;
                case "ar":
                    translatedFormation.setTitleAr(formation.getTitleAr());
                    translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                    translatedFormation.setCategoryAr(formation.getCategoryAr());
                    break;
                default: // Default to English
                    translatedFormation.setTitleEn(formation.getTitleEn());
                    translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                    translatedFormation.setCategory(formation.getCategory());
                    break;
            }

            return translatedFormation;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(translatedFormations);
    }


    @GetMapping("/formations/paginated")
    public ResponseEntity<Map<String, Object>> getPaginatedFormations(
            @RequestParam(required = false, defaultValue = "en") String lang,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "publisheddate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        try {
            Page<Formations> pageFormations = formationsServ.getAllFormationsPaged(page, size, sortBy, direction);

            List<Formations> formations = pageFormations.getContent();

            // Apply language translation as you did in other endpoints
            List<Formations> translatedFormations = formations.stream().map(formation -> {
                Formations translatedFormation = new Formations();
                translatedFormation.setId(formation.getId());
                translatedFormation.setImage(formation.getImage());
                translatedFormation.setPrice(formation.getPrice());
                translatedFormation.setPublisheddate(formation.getPublisheddate());
                translatedFormation.setLevel(formation.getLevel());
                translatedFormation.setClasse(formation.getClasse());
                translatedFormation.setStatus(formation.isStatus());
                // Set title and description based on the requested language
                switch (lang) {
                    case "fr":
                        translatedFormation.setTitleFr(formation.getTitleFr());
                        translatedFormation.setDescriptionFr(formation.getDescriptionFr());
                        translatedFormation.setCategoryFr(formation.getCategoryFr());
                        break;
                    case "ar":
                        translatedFormation.setTitleAr(formation.getTitleAr());
                        translatedFormation.setDescriptionAr(formation.getDescriptionAr());
                        translatedFormation.setCategoryAr(formation.getCategoryAr());
                        break;
                    default: // Default to English
                        translatedFormation.setTitleEn(formation.getTitleEn());
                        translatedFormation.setDescriptionEn(formation.getDescriptionEn());
                        translatedFormation.setCategory(formation.getCategory());
                        break;
                }

                return translatedFormation;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("formations", translatedFormations);
            response.put("currentPage", pageFormations.getNumber());
            response.put("totalItems", pageFormations.getTotalElements());
            response.put("totalPages", pageFormations.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/course-enrollments")
    public List<Map<String, Object>> getCourseEnrollments() {
        return formationsRepo.findTopCoursesWithEnrollments();
    }


}
