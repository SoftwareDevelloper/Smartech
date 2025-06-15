package org.example.backendpfe.Controlleur;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import org.example.backendpfe.ServiceImpl.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @Autowired
    private CartService cartService;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            if ("payment_intent.succeeded".equals(event.getType())) {
                PaymentIntent paymentIntent = (PaymentIntent) event.getData().getObject();
                String apprenantId = paymentIntent.getMetadata().get("apprenantId");

                if (apprenantId != null) {
                    cartService.processSuccessfulPayment(Long.parseLong(apprenantId));
                    return ResponseEntity.ok("Webhook processed successfully");
                }
            }

            return ResponseEntity.ok("Webhook received");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }
    }
}
