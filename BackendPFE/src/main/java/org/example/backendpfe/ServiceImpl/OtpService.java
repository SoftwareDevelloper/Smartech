package org.example.backendpfe.ServiceImpl;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public String generateOTP(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
        otpStore.put(email, otp);
        return otp;
    }

    public boolean validateOTP(String email, String otp) {
        return otp.equals(otpStore.get(email));
    }
}
