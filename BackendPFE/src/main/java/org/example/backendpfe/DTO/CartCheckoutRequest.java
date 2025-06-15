package org.example.backendpfe.DTO;

import lombok.Data;

@Data
public class CartCheckoutRequest {
    private Long apprenantId;
    private String paymentIntentId;

    public CartCheckoutRequest(Long apprenantId, String paymentIntentId) {
        this.apprenantId = apprenantId;
        this.paymentIntentId = paymentIntentId;
    }

    public Long getApprenantId() {
        return apprenantId;
    }

    public void setApprenantId(Long apprenantId) {
        this.apprenantId = apprenantId;
    }

    public String getPaymentIntentId() {
        return paymentIntentId;
    }

    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }
}
