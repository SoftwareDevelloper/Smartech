package org.example.backendpfe.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;
public class MLService {
    private static final String PYTHON_API_URL = "http://127.0.0.1:8000/predict/";

    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = new HashMap<>();
        request.put("features", new double[]{1.5, 2.3, 3.1});

        ResponseEntity<Map> response = restTemplate.postForEntity(PYTHON_API_URL, request, Map.class);

        System.out.println("Prediction: " + response.getBody());
    }
}
