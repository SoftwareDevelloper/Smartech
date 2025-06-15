package org.example.backendpfe.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.validation.constraints.Size;
import org.example.backendpfe.Model.ContactStructure;
import org.example.backendpfe.Model.MailStructure;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailContactService
{
    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String ToMail;
    public void sendMail(String mail, ContactStructure contactStructure)
    {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(ToMail);
            helper.setReplyTo(contactStructure.getSenderEmail());
            helper.setTo(ToMail);
            helper.setSubject(contactStructure.getSubject());
            String emailContent = "<html>" +
                    "<body style='font-family:Tahoma, sans-serif; padding: 20px;background-color:#87CEEB'>" +
                    "<h2 style='color: #fff;'>New Message</h2>" +
                    "<p style='color:#03619f'><strong>Sender:</strong> " + contactStructure.getSenderEmail() + "</p>" +
                    "<p style='color:#03619f'><strong>Subject:</strong> " + contactStructure.getSubject() + "</p>" +
                    "<p style='color:#03619f'><strong>Message:</strong></p>" +
                    "<p style='border-left: 4px solid #fff; padding-left: 10px; font-style:bold;'>" +
                    contactStructure.getMessage() + "</p>" +
                    "<hr style='margin-top: 20px;'/>" +
                    "<p style='font-size: 10px; color: gray;font-style:italic'>This email was sent via your website's contact form.</p>" +
                    "</body>" +
                    "</html>";
            helper.setText(emailContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}
