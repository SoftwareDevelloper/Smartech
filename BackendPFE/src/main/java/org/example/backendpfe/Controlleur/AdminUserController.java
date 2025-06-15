package org.example.backendpfe.Controlleur;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
public class AdminUserController {
    @Autowired
    private InternoteRepo internoteRepository;

    @GetMapping("/enrolled-users")
    public List<Internote> getUsersWithFormations() {
        return internoteRepository.findAll().stream()
                .filter(user -> !user.getFormationsSuivies().isEmpty())
                .collect(Collectors.toList());
    }

    @GetMapping("/paid-users")
    public List<Internote> getUsersWithPayments() {
        // Assuming you have a payment system - you'll need to implement this based on your payment model
        return internoteRepository.findAll().stream()
                .filter(user -> hasPaidFormations(user))
                .collect(Collectors.toList());
    }

    private boolean hasPaidFormations(Internote user) {
        // Implement your payment verification logic here
        // This could check a payment table or payment status field
        return !user.getFormationsSuivies().isEmpty(); // Simplified for example
    }
}
