package org.example.backendpfe.Controlleur;

import org.example.backendpfe.Model.ContactStructure;
import org.example.backendpfe.Model.MailStructure;
import org.example.backendpfe.Service.MailContactService;
import org.example.backendpfe.Service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
public class MailControllleur
{
 @Autowired
 private MailSender mailSender;
    @Autowired
    private MailContactService mailContactService;

    @PostMapping("/send/{mail}")
    public String sendMail(@PathVariable String mail, @RequestBody ContactStructure contactStructure) {
        if (mail == null || mail.isEmpty() || !mail.contains("@")) {
            return "Invalid email address!";
        }

        contactStructure.setSenderEmail(mail); // Set sender email from the request path
        mailContactService.sendMail(mail, contactStructure);
        return "Mail sent successfully";
    }


}
