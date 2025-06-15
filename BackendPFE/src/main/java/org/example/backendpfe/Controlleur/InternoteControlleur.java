package org.example.backendpfe.Controlleur;

import io.jsonwebtoken.Jwts;
import org.example.backendpfe.Jwt.JwtUtil;
import org.example.backendpfe.Model.*;
import org.example.backendpfe.Service.MailService;
import org.example.backendpfe.ServiceImpl.*;
import org.example.backendpfe.repository.ArchivedInternoteRepository;
import org.example.backendpfe.repository.FormationsRepo;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api")
public class InternoteControlleur {
    @Autowired
    private InternoteServImpl internoteServ;
    @Autowired
    private InternoteRepo internoteRepo;
    @Autowired
    private FormationsRepo formationsRepo;
    @Autowired
    private MailService mailService;
    @Autowired
    private VideosService videosService;
    @Autowired
    private PostService postService;

    private final ImageUploadService imageUploadService;
    private final VideoUploadService videoUploadService;

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private OtpService otpService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private ArchivedInternoteRepository archivedInternoteRepository;

    public InternoteControlleur(ImageUploadService imageUploadService, VideoUploadService videoUploadService) {
        this.imageUploadService = imageUploadService;
        this.videoUploadService = videoUploadService;
    }


    @GetMapping("/user/{id}")
    public ResponseEntity<Internote> getInternote(@PathVariable Long id) {
        return ResponseEntity.ok(internoteServ.getInternoteById(id));
    }
    @GetMapping("/ArchiveUser")
    public List<ArchivedInternote> getArchivedInternote() {
        return archivedInternoteRepository.findAll();
    }
    @PostMapping("/RestoreUsers/{id}")
    public ResponseEntity<Internote> restoreUsers(@PathVariable Long id) {
        Internote result = internoteServ.restoreArchivedInternote(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("CountCourseENS/{enseignantId}")
    public ResponseEntity<Long> getInternoteCount(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(internoteRepo.countCoursesByEnseignant(enseignantId));
    }
    @GetMapping("CountStudent/{enseignantId}")
    public ResponseEntity<Long> getStudentCount(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(internoteRepo.countStudent(enseignantId));
    }
    @GetMapping("AllUser/{enseignantId}")
    public ResponseEntity<List<Internote>> getAllInternote(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(internoteRepo.getAllInternotebyEnsId(enseignantId));
    }
    @GetMapping("/allUser/{status}")
    public ResponseEntity<List<Internote>> getInternote(@PathVariable boolean status) {
        return ResponseEntity.ok(internoteRepo.getAllInternotebystatus(status));
    }
    @GetMapping("/Allusers")
    public ResponseEntity<List<Internote>> getAllInternotes() {
        return ResponseEntity.ok(internoteServ.getAllInternotes());
    }
    @GetMapping("/TotalUsers")
    public ResponseEntity<Number> getAllInternotesTotal() {
        return ResponseEntity.ok(internoteRepo.count());
    }
    @PostMapping("/AddUser")
    public ResponseEntity<Internote> addInternote(@RequestBody Internote internote) {
        return ResponseEntity.ok(internoteServ.createInternote(internote));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Internote> updateInternote(@RequestBody Internote internote, @PathVariable Long id){
        Internote existingInternote = internoteServ.getInternoteById(id);
        if(existingInternote != null){
            existingInternote.setFullname(internote.getFullname());
            existingInternote.setEmail(internote.getEmail());
            existingInternote.setPassword(internote.getPassword());
            Internote savedInternote = internoteServ.updateInternote(existingInternote);
            return ResponseEntity.ok(savedInternote);
        }
        else {
            return ResponseEntity.notFound().build();
        }

    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteInternote(@PathVariable Long id){
        Internote existInternote = internoteServ.getInternoteById(id);
        if(existInternote != null){
            internoteServ.archiveAndDeleteInternote(id);
            return ResponseEntity.ok().body("internote deleted successfully");
        }else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/AddNote/{id}")
    public  ResponseEntity<?> Noter(@PathVariable Long id,@RequestBody String note){
        Internote internote = internoteServ.getInternoteById(id);
        if(internote != null){
            if (internote.getRole().equals("ENSEIGNMENT")){
                internote.setNote(note);
                internoteServ.updateInternote(internote);
                return ResponseEntity.ok().body(internote);
            }
            return ResponseEntity.badRequest().body("Just the teachers must note their student");
        }
        else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/upload-image_internote")
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


    @PostMapping("/Register")
    public ResponseEntity<?> registerInternote(@RequestBody Internote internote) {
        if (internote.getRole() == null) {
            return ResponseEntity.badRequest().body("Role is required!");
        }
        if (internoteRepo.existsByemail(internote.getEmail()))
        {
            return ResponseEntity.badRequest().body("Email adress already in use , please try another one");
        }

        if (internoteRepo.existsBypassword(internote.getPassword()))
        {
            return ResponseEntity.badRequest().body("Password already in use , please try another password");
        }
        if (internote.getPassword().length() < 8){
            return ResponseEntity.badRequest().body("Password must be at least 8 characters");
        }
        if (!internote.getEmail().contains("@"))
        {
            return ResponseEntity.badRequest().body("Email adress must contain @");
        }
        if (internote.getRole() == Internote.Role.ADMIN) {
            internote.setStatus(true);
            internoteServ.updateInternote(internote);
        } else {
            internote.setStatus(false);
        }
        switch (internote.getRole()) {
            case ADMIN:
                if (internote.getCle() == null || internote.getCle().equals("")) {
                    return ResponseEntity.badRequest().body("Admin must provide a 'cle'!");
                }
                if (internote.getEmail() == null || internote.getEmail().equals("")) {
                    return ResponseEntity.badRequest().body("Email must provide a 'email'!");
                }
                if (internote.getFullname() == null || internote.getFullname().equals("")) {
                    return ResponseEntity.badRequest().body("Fullname must provide a 'fullname'!");
                }
                if (internote.getPassword() == null || internote.getPassword().equals("")) {
                    return ResponseEntity.badRequest().body("Password must provide a 'password'!");
                }

                break;
            case APPRENANT:
                if (internote.getNiveau() == null || internote.getNiveau().equals("")) {
                    return ResponseEntity.badRequest().body("Apprenant must provide a 'niveau'!");
                }
                if (internote.getEmail() == null || internote.getEmail().equals("")) {
                    return ResponseEntity.badRequest().body("Email must provide a 'email'!");
                }
                if (internote.getFullname() == null || internote.getFullname().equals("")) {
                    return ResponseEntity.badRequest().body("Fullname must provide a 'fullname'!");
                }
                if (internote.getPassword() == null || internote.getPassword().equals("")) {
                    return ResponseEntity.badRequest().body("Password must provide a 'password'!");
                }
                if (internote.getPhone() == null || internote.getPhone().equals("")) {
                    return ResponseEntity.badRequest().body("Phone must provide a 'phone'!");
                }
                break;
            case ENSEIGNMENT:
                if (internote.getEmail() == null || internote.getEmail().equals("")) {
                    return ResponseEntity.badRequest().body("Email must provide a 'email'!");
                }
                if (internote.getFullname() == null || internote.getFullname().equals("")) {
                    return ResponseEntity.badRequest().body("Fullname must provide a 'fullname'!");
                }
                if (internote.getPassword() == null || internote.getPassword().equals("")) {
                    return ResponseEntity.badRequest().body("Password must provide a 'password'!");
                }
                if (internote.getPhone() == null || internote.getPhone().equals("")) {
                    return ResponseEntity.badRequest().body("Phone must provide a 'phone'!");
                }
                if (internote.getRole() == Internote.Role.ENSEIGNMENT) {
                    if (internote.getSpecialitee() == null || internote.getSpecialitee().equals("")) {
                        return ResponseEntity.badRequest().body("Specialite must provide a 'specialite'!");
                    }
                }

                break;
        }

        Internote savedUser = internoteServ.createInternote(internote);

        Map<String, Object> response = new HashMap<>();
        response.put("message", internote.getRole() == Internote.Role.ADMIN
                ? "Admin registered successfully!"
                : "User registered successfully! Waiting for admin approval.");
        response.put("user", savedUser);

        return ResponseEntity.ok(response);
    }
    @PutMapping("/updateActive/{id}")
    public ResponseEntity<Internote> updateActive(@RequestBody Internote internote, @PathVariable Long id){
        Internote existingInternote = internoteServ.getInternoteById(id);
        if(existingInternote != null){
            existingInternote.setActive(internote.isActive());
            Internote savedInternote = internoteServ.updateInternote(existingInternote);
            return ResponseEntity.ok(savedInternote);
        }
        else {
            return ResponseEntity.notFound().build();
        }

    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Internote internote){
        Internote existingInternote = internoteServ.findByemail(internote.getEmail());
        if (existingInternote == null || !existingInternote.getPassword().equals(internote.getPassword())) {
            return ResponseEntity.badRequest().body("Wrong password!");
        }
        // Check if the user is approved (except for Admin)
        if (existingInternote.getRole() != Internote.Role.ADMIN && !existingInternote.isStatus()) {
            return ResponseEntity.badRequest().body("Your account is pending approval by an admin.");
        }


        String token = Jwts.builder()
                .setSubject(existingInternote.getId().toString())//set id as the subject
                .claim("email" , existingInternote.getEmail()) // Add email as a claim
                .claim("Role" , existingInternote.getRole())
                .claim("status" , existingInternote.isStatus())
                .compact();
        internote.setActive(true);
        internoteServ.updateActive(existingInternote);
        return ResponseEntity.ok(Map.of("message","Login successful","token",token,"role",existingInternote.getRole()));
    }



    @GetMapping("/TotalPendingApprovals")
    public ResponseEntity<Number> getTotalPendingApprovals() {
        long pendingCount = internoteRepo.countByStatus(false);
        return ResponseEntity.ok(pendingCount);
    }
    @GetMapping("/ActiveUserAccount")
    public ResponseEntity<Long> getActiveUserAccount() {
        long ActiveCount = internoteRepo.countByActiveAccount(true);
        return ResponseEntity.ok(ActiveCount);
    }
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        Internote internote = internoteServ.getInternoteById(id);

        if (internote == null) {
            return ResponseEntity.notFound().build();
        }
        if (internote.getRole() == Internote.Role.ADMIN) {
            return ResponseEntity.badRequest().body("Admins do not require approval.");
        }

        internote.setStatus(true);

        internoteServ.updateInternote(internote);
        MailStructure mailStructure = new MailStructure();
        mailStructure.setSubject("Account Approved ✅");
        String loginLink = "http://localhost:3000/Login";
        String emailMessage = "Dear " + internote.getFullname() + ",\n\n"
                + "Your account has been approved successfully. You can now log in and access your account.\n\n"
                + "Click the link below to log in:\n"
                + loginLink + "\n\n"
                + "Best regards,\nThe Admin Team";

        mailStructure.setMessage(emailMessage);
        System.out.println("Sending email to: " + internote.getEmail());
        mailService.sendMail(internote.getEmail(), mailStructure);
        System.out.println("Email sent successfully.");
        return ResponseEntity.ok("User " + internote.getEmail() + " approved successfully!");
    }
    //Assign an Apprenant to an Enseignant
    @PutMapping("/assignEnseignant/{apprenantId}/{enseignantId}")
    public ResponseEntity<Internote> assignEnseignantToApprenant(@PathVariable Long apprenantId, @PathVariable Long enseignantId) {
        return ResponseEntity.ok(internoteServ.assignEnseignantToApprenant(apprenantId, enseignantId));
    }
    //Retrieve All Apprenants for a Given Enseignant
    @GetMapping("/enseignant/{enseignantId}/apprenants")
    public ResponseEntity<Set<Internote>> getApprenantsByEnseignant(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(internoteServ.getApprenantsByEnseignant(enseignantId));
    }
    //Retrieve All Enseignants for a Given Apprenant
    @GetMapping("/apprenant/{apprenantId}/enseignants")
    public ResponseEntity<Set<Internote>> getEnseignantsByApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(internoteServ.getEnseignantsByApprenant(apprenantId));
    }
    @GetMapping("/enseignant")
    public ResponseEntity<List<Internote>> getAllEnseignants() {

                List<Internote> enseignants = internoteRepo.findAllByRole(Internote.Role.ENSEIGNMENT);
                return ResponseEntity.ok(enseignants);
    }
    @GetMapping("/apprenant")
    public ResponseEntity<List<Internote>> getAllapprenant() {

        List<Internote> apprenant = internoteRepo.findByRole(Internote.Role.APPRENANT);
        return ResponseEntity.ok(apprenant);
    }


    @PostMapping("/AddTeacher")
    public ResponseEntity<?> AddTeacher(@RequestBody Internote internote) {
        if (internote.getRole().equals(" ")) {
            return ResponseEntity.badRequest().body("Role is required!");
        }

        switch (internote.getRole()) {
            case ENSEIGNMENT:
                if (internote.getEmail() == null || internote.getEmail().equals("")) {
                    return ResponseEntity.badRequest().body("Email must provide a 'email'!");
                }
                if (internote.getFullname() == null || internote.getFullname().equals("")) {
                    return ResponseEntity.badRequest().body("Fullname must provide a 'fullname'!");
                }
                if (internote.getPassword() == null || internote.getPassword().equals("")) {
                    return ResponseEntity.badRequest().body("Password must provide a 'password'!");
                }
                if (internote.getPhone() == null || internote.getPhone().equals("")) {
                    return ResponseEntity.badRequest().body("Phone must provide a 'phone'!");
                }
                break;
        }
        internote.setStatus(true);
        internoteServ.updateInternote(internote);
        Internote savedEns = internoteServ.createInternote(internote);

        Map<String, Object> response = new HashMap<>();
        response.put("message","Enseignant added successfully!");
        response.put("Ens", savedEns);
        MailStructure mailStructure = new MailStructure();
        mailStructure.setSubject("Account Created ✅");
        String emailMessage = "Dear " + internote.getFullname() + ",\n\n"
                + "Your account has been created successfully. You can now log in and access your account with this provided password.\n\n"
                + "Your password is :\n"
                + internote.getPassword() + "\n\n"
                + "Best regards,\n Smarttech Academy";

        mailStructure.setMessage(emailMessage);
        System.out.println("Sending email to: " + internote.getEmail());
        mailService.sendMail(internote.getEmail(), mailStructure);
        System.out.println("Email sent successfully.");
        return ResponseEntity.ok(response);
    }




    @PutMapping("/updateInfo/{id}")
    public ResponseEntity<?> UpdateInfo(@RequestBody Internote internote,@PathVariable Long id  ) {
        Internote internote1 = internoteRepo.findById(id).get();
        if (internote != null)
        {
            internote1.setFullname(internote.getFullname());
            internote1.setPassword(internote.getPassword());
            internote1.setPhone(internote.getPhone());
            internote1.setEmail(internote.getEmail());
            internote1.setAbout(internote.getAbout());
            internote1.setSpecialitee(internote.getSpecialitee());
            internote1.setStatus(true);
            Internote savedEns = internoteServ.updateInternote(internote1);
            Map<String, Object> response = new HashMap<>();
            response.put("message","Enseignant updated successfully!");
            response.put("Ens", savedEns);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }


    @PutMapping("/updateInfos/{id}")
    public ResponseEntity<?> UpdateInfos(@RequestBody Internote internote,@PathVariable Long id  ) {
        Internote internote1 = internoteRepo.findById(id).get();
        if (internote != null)
        {
            internote1.setFullname(internote.getFullname());
            internote1.setPhone(internote.getPhone());
            internote1.setEmail(internote.getEmail());
            internote1.setAbout(internote.getAbout());
            internote1.setStatus(true);
            Internote savedLearner = internoteServ.updateInternote(internote1);
            Map<String, Object> response = new HashMap<>();
            response.put("message","Learner updated successfully!");
            response.put("Learner", savedLearner);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("/updateInfosAdmin/{id}")
    public ResponseEntity<?> UpdateInfosAdmin(@RequestBody Internote internote,@PathVariable Long id  ) {
        Internote internote2= internoteRepo.findById(id).get();
        if (internote != null)
        {
            internote2.setFullname(internote.getFullname());
            internote2.setPassword(internote.getPassword());
            internote2.setEmail(internote.getEmail());
            internote2.setAbout(internote.getAbout());
            internote2.setPhone(internote.getPhone());
            internote2.setStatus(true);
            Internote savedAdmin = internoteServ.updateInternote(internote2);
            Map<String, Object> response = new HashMap<>();
            response.put("message","informations updated successfully!");
            response.put("Admin", savedAdmin);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }





    @GetMapping("/fullnameEns/{formation_id}")
    public ResponseEntity<Map<String, String>> getFullnameEns(@PathVariable Long formation_id) {
        System.out.println("Received request for formation_id: " + formation_id); // Log the request

        // Simulate fetching the fullname from the database
        String fullname =internoteRepo.FullnameByIdFormation(formation_id);

        if (fullname != null) {
            Map<String, String> response = new HashMap<>();
            response.put("fullname", fullname);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @PostMapping("/upload_reel")
    public ResponseEntity<Map<String, String>>  uploadVideo(@RequestParam("video") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is missing"));
        }
        try {
            String videoUrl = videoUploadService.uploadVideo(file);
            return ResponseEntity.ok(Map.of("videoUrl", "http://localhost:9000" + videoUrl));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "File upload failed: " + e.getMessage()));
        }
    }

    @PostMapping("/uploadReel/{teacherId}")
    public Reel uploadReel(@PathVariable Long teacherId,@RequestBody Reel reel) {
        try {
            Reel newReel = videosService.createReal(reel,teacherId);
            return ResponseEntity.ok(newReel).getBody();
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(reel).getBody();
        }
    }
    @GetMapping("/totalPost/{teacherId}")
    public Integer countPublication(@PathVariable Long teacherId) {
        return internoteRepo.countPub(teacherId);
    }
    @PostMapping("/upload-post_image")
    public ResponseEntity<Map<String, String>> uploadImages(@RequestParam("file") MultipartFile file) {
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

    @PostMapping("/uploadPost/{teacherId}")
    public Post uploadPost(@PathVariable Long teacherId,@RequestBody Post post) {
        try {
            Post newPost = postService.uploadPost(post,teacherId);
            return ResponseEntity.ok(newPost).getBody();
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(post).getBody();
        }
    }
    @GetMapping("/Post/{enseigantId}")
    public List<Post> getPost(@PathVariable Long enseigantId) {
        return postService.getPostbyTeacherId(enseigantId);
    }
    @GetMapping("/Reel/{enseigantId}")
    public List<Reel> getReel(@PathVariable Long enseigantId) {
        return videosService.getReelByTeacherId(enseigantId);
    }
    @GetMapping("/user-distribution")
    public Map<String, Long> getUserDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("APPRENANT", internoteRepo.countByRole(Internote.Role.APPRENANT));
        distribution.put("ENSEIGNMENT", internoteRepo.countByRole(Internote.Role.ENSEIGNMENT));
        distribution.put("ADMIN", internoteRepo.countByRole(Internote.Role.ADMIN));
        return distribution;
    }






}

