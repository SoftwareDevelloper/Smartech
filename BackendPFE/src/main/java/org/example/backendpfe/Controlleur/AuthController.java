package org.example.backendpfe.Controlleur;

import org.example.backendpfe.OTP.OtpStorage;
import org.example.backendpfe.ServiceImpl.TwilioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/2fa")
public class AuthController {

    private final TwilioService twilioService;
    private final OtpStorage otpStorage;

    public AuthController(TwilioService twilioService, OtpStorage otpStorage) {
        this.twilioService = twilioService;
        this.otpStorage = otpStorage;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String otp = String.valueOf((int)(Math.random() * 9000) + 1000); // 4-digit OTP
        otpStorage.storeOtp(phone, otp);
        twilioService.sendOtp(phone, otp);
        return ResponseEntity.ok("OTP sent");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        String enteredOtp = request.get("otp");
        String storedOtp = otpStorage.getOtp(phone);
        if (storedOtp != null && storedOtp.equals(enteredOtp)) {
            otpStorage.clearOtp(phone);
            return ResponseEntity.ok("OTP Verified");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid OTP");
        }
    }
}
