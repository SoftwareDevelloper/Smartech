package org.example.backendpfe.Controlleur;

import org.example.backendpfe.DTO.SchoolLevelsDTO;
import org.example.backendpfe.ServiceImpl.SchoolLevelService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/school-levels")
public class SchoolLevelController {
    private final SchoolLevelService schoolLevelService;

    public SchoolLevelController(SchoolLevelService schoolLevelService) {
        this.schoolLevelService = schoolLevelService;
    }

    @GetMapping
    public SchoolLevelsDTO getSchoolLevels() {
        return schoolLevelService.getSchoolLevels();
    }
}
