package org.example.backendpfe.Response;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.MailStructure;
import org.example.backendpfe.Service.MailService;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormationNotificationService
{
    @Autowired
    InternoteRepo internoteRepo;
    @Autowired
    private MailService mailService;

    public void notification(String formationName) {


            for (Internote user : internoteRepo.findByRole(Internote.Role.valueOf("APPRENANT"))) {

                String email = user.getEmail();
                MailStructure mailStructure = new MailStructure();
                mailStructure.setSubject("New Formations ✅");
                String CoursLink = "http://localhost:3000/Cours";
                String emailMessage = "Dear " +user.getFullname()+ ",\n\n"
                        + "A new Formations has been added to our platform.\n\n"
                        + "Click the link below to check it :\n"
                        + CoursLink + "\n\n"
                        + "Best regards,\n SMARTTECH ACADEMY";

                mailStructure.setMessage(emailMessage);
                String body = "Hello there , a new formation has been added: " + formationName + ". Check it out now!";
                mailService.sendMail(email,mailStructure);
            }
        }


}
