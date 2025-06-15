package org.example.backendpfe.Controlleur;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backendpfe.DTO.PredictionRequest;
import org.example.backendpfe.DTO.PredictionResponse;
import org.example.backendpfe.Exception.PredictionException;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.ServiceImpl.MLPredictionService;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:9000"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT}
)
@RequestMapping("/api/predictLevel")
public class PredictionController {
    private final MLPredictionService predictionService;
    private final InternoteRepo internoteRepo;

    public PredictionController(MLPredictionService predictionService , InternoteRepo internoteRepo) {
        this.predictionService = predictionService;
        this.internoteRepo = internoteRepo;
    }

    @PostMapping("/makePrediction/{learnerId}")
    public ResponseEntity<?> makePrediction(@RequestBody PredictionRequest request,@PathVariable Long learnerId) {
        try {
            // Get prediction
            PredictionResponse response = predictionService.predictLevel(request);

            // Save to learner profile
            Optional<Internote> learnerOpt = internoteRepo.findById(learnerId);
            if (learnerOpt.isPresent()) {
                Internote learner = learnerOpt.get();
                learner.setProficiencyLevel(response.getLevel()); // Save the predicted level
                internoteRepo.save(learner);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Learner not found"));
            }

        } catch (PredictionException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Prediction failed",
                    "details", e.getMessage()
            ));
        }
    }

    @GetMapping("/getProficiencyLevel/{learnerId}")
    public ResponseEntity<?> getProficiencyLevel(@PathVariable Long learnerId) {
        Optional<Internote> learnerOpt = internoteRepo.findById(learnerId);
        if (learnerOpt.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "proficiencyLevel", learnerOpt.get().getProficiencyLevel()
            ));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Learner not found"));
    }
}