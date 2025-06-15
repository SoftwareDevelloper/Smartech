package org.example.backendpfe.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


public class StripeResponse
{
    private String status;
    private String message;
    private String paymentIntentId; // Renamed from sessionId
    private String clientSecret; // Renamed from sessionUrl

    public StripeResponse() {
    }

    public StripeResponse(String status, String message, String paymentIntentId, String clientSecret) {
        this.status = status;
        this.message = message;
        this.paymentIntentId = paymentIntentId;
        this.clientSecret = clientSecret;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public static StripeResponse createResponse(String status, String message, String paymentIntentId, String clientSecret) {
        StripeResponse response = new StripeResponse();
        response.setStatus(status);
        response.setMessage(message);
        response.setPaymentIntentId(paymentIntentId);
        response.setClientSecret(clientSecret);
        return response;
    }
}