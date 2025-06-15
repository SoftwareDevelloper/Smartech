package org.example.backendpfe.ServiceImpl;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendOTP(String toEmail, String otp) {
        System.out.println("Sending OTP " + otp + " to email: " + toEmail);
        // In production, use JavaMailSender or Mailgun, etc.
    }
}
