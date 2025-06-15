package org.example.backendpfe.ServiceImpl;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {
    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String fromNumber;

    public void sendOtp(String toNumber, String otp) {
        Twilio.init(accountSid, authToken);
        Message.creator(
                new com.twilio.type.PhoneNumber(toNumber),
                new com.twilio.type.PhoneNumber(fromNumber),
                "Your verification code is: " + otp
        ).create();
    }
}
