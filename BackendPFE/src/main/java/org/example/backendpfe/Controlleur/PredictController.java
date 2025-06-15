package org.example.backendpfe.Controlleur;


import org.example.backendpfe.Model.PredictRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT})
public class PredictController
{
    @PostMapping("/predict")
    public Map<String, Object> getPrediction(@RequestBody PredictRequest inputData) {
        // Validate that answers and levels have the same length
        if (inputData.getAnswers().size() != inputData.getLevels().size()) {
            throw new IllegalArgumentException("Answers and levels must have the same length.");
        }

        // Clean levels (map "primary" to "beginner" and "secondary" to "intermediate")
        List<String> cleanedLevels = inputData.getLevels().stream()
                .map(level -> {
                    String cleanedLevel = level.trim().toLowerCase();
                    if (cleanedLevel.equals("primary")) return "beginner";
                    if (cleanedLevel.equals("secondary")) return "intermediate";
                    return cleanedLevel; // Default to the original level if valid
                })
                .collect(Collectors.toList());

        // Create a list of Answer objects for FastAPI
        List<Map<String, Object>> answers = inputData.getAnswers().stream()
                .map(answer -> {
                    Map<String, Object> answerMap = new HashMap<>();
                    answerMap.put("question", answer.getQuestion());
                    answerMap.put("answer", answer.getAnswer());
                    answerMap.put("isCorrect", answer.isCorrect());
                    return answerMap;
                })
                .collect(Collectors.toList());

        // Create a new request for FastAPI
        Map<String, Object> fastApiRequest = new HashMap<>();
        fastApiRequest.put("answers", answers);
        fastApiRequest.put("levels", cleanedLevels);

        // URL of the FastAPI backend
        String fastApiUrl = "http://127.0.0.1:8000/predict/";

        // Initialize RestTemplate to make HTTP requests
        RestTemplate restTemplate = new RestTemplate();

        // Send POST request to FastAPI with the input data
        Map<String, Object> response = restTemplate.postForObject(fastApiUrl, fastApiRequest, Map.class);

        // Return the response from FastAPI
        return response;
    }
}
