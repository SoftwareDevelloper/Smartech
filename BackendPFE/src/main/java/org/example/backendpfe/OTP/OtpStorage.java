package org.example.backendpfe.OTP;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class OtpStorage {
    private Map<String, String> otpMap = new HashMap<>();

    public void storeOtp(String phone, String otp) {
        otpMap.put(phone, otp);
    }

    public String getOtp(String phone) {
        return otpMap.get(phone);
    }

    public void clearOtp(String phone) {
        otpMap.remove(phone);
    }
}