package org.example.backendpfe.Service;

import org.example.backendpfe.Model.MailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService
{
    @Autowired
    private JavaMailSender mailSender;
    @Value("$(spring.mail.username)")
    private String FromMail;
    public void sendMail(String mail, MailStructure mailStructure)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FromMail);
        message.setSubject(mailStructure.getSubject());
        message.setText(mailStructure.getMessage());
        message.setTo(mail);

        mailSender.send(message);
    }
}
