package org.example.backendpfe.ServiceImpl;

import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class RecommendationService {
    public List<String> getRecommendations(String level) {
        switch (level.toLowerCase()) {
            case "beginner":
                return Arrays.asList(
                        "Basic Mathematics Fundamentals",
                        "Introduction to Language Arts",
                        "General Science Concepts"
                );
            case "intermediate":
                return Arrays.asList(
                        "Algebra Basics",
                        "World Geography",
                        "Biology Essentials"
                );
            case "advanced":
                return Arrays.asList(
                        "Advanced Calculus",
                        "Physics Principles",
                        "Chemistry Foundations"
                );
            default:
                return Arrays.asList(
                        "General Learning Strategies",
                        "Study Skills Development"
                );
        }
    }

    public double calculateScore(String level) {
        switch (level.toLowerCase()) {
            case "beginner": return 70.0;
            case "intermediate": return 85.0;
            case "advanced": return 95.0;
            default: return 0.0;
        }
    }
}
