package org.example.backendpfe.ServiceImpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backendpfe.DTO.PredictionRequest;
import org.example.backendpfe.DTO.PredictionResponse;
import org.example.backendpfe.Exception.PredictionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MLPredictionService {
    @Value("${python.script.path}")
    private String pythonScriptPath;
    @Value("${python.working_dir}")
    private String pythonWorkingDir;;

    @Value("${python.executable:python}")
    private String pythonExecutable;
    private final ObjectMapper objectMapper = new ObjectMapper();


    public double calculateScore(String level) {
        switch (level.toLowerCase()) {
            case "beginner": return 70.0;
            case "intermediate": return 85.0;
            case "advanced": return 95.0;
            default: return 0.0;
        }
    }
    public PredictionResponse predictLevel(PredictionRequest request) throws PredictionException {
        Process process = null;
        String output = "";

        try {
            // Build the command to execute Python script via CMD
            ProcessBuilder pb = new ProcessBuilder(
                    "cmd.exe", "/c",
                    pythonExecutable,
                    pythonScriptPath,

                    String.valueOf(request.getNumCorrect()),
                    String.valueOf(request.getAccuracy()),
                    String.valueOf(request.getTimeTaken()),
                    request.getSchoolLevel(),
                    request.getSubject(),
                    String.valueOf(request.getConsecutiveCorrect())
            );

            // Set working directory
            pb.directory(new File(pythonWorkingDir));

            // Redirect error stream to output stream
            pb.redirectErrorStream(true);

            // Start the process
            process = pb.start();

            // Read the output
            output = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))
                    .lines().collect(Collectors.joining("\n"));

            // Wait for process to complete
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new PredictionException("Python script failed with exit code " + exitCode +
                        "\nOutput: " + output);
            }

            // Clean the output to extract just the JSON part
            String jsonOutput = output.replaceAll("^[^{]*", "");
            Map<String, Object> responseMap = objectMapper.readValue(jsonOutput, Map.class);

            // Create your PredictionResponse
            PredictionResponse response = new PredictionResponse();

            // Extract prediction data
            Map<String, Object> predictionMap = (Map<String, Object>) responseMap.get("prediction");
            if (predictionMap != null) {
                response.setLevel((String) predictionMap.get("level"));
                response.setConfidence(((Number) predictionMap.get("confidence_score")).doubleValue());
                response.setProbabilityDistribution((Map<String, Double>) predictionMap.get("probability_distribution"));

                // Calculate score based on level
                response.setScore(calculateScore(response.getLevel()));
            }

            return response;

        } catch (Exception e) {
            throw new PredictionException("Prediction failed. Output: " + output);
        } finally {
            if (process != null) {
                process.destroy();
            }
        }
    }
}

