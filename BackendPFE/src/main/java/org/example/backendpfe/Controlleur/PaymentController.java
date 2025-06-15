package org.example.backendpfe.Controlleur;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import org.example.backendpfe.DTO.CartCheckoutRequest;
import org.example.backendpfe.DTO.InscriptionRequest;
import org.example.backendpfe.DTO.StripeResponse;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Service.StripeService;
import org.example.backendpfe.ServiceImpl.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/v1")
public class PaymentController {
    @Autowired
    private StripeService stripeService;
    @Autowired
    private CartService cartService;

    @PostMapping("/create-payment-intent")
    public ResponseEntity<StripeResponse> createPaymentIntent(@RequestParam Long apprenantId) {
        try {
            System.out.println("Received apprenantId: " + apprenantId);
            StripeResponse response = stripeService.createMultiItemPaymentIntent(apprenantId);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            e.printStackTrace();  // This prints the stack trace to console for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new StripeResponse("ERROR", e.getMessage(), null, null));
        }
    }

    @PostMapping("/confirm-checkout")
    public ResponseEntity<String> confirmCheckout(@RequestBody CartCheckoutRequest request) {
        try {
            boolean success = stripeService.confirmCartCheckout(request.getApprenantId(), request.getPaymentIntentId());
            if (success) {
                return ResponseEntity.ok("Checkout completed successfully");
            }
            return ResponseEntity.badRequest().body("Checkout failed");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/total-earnings")
    public ResponseEntity<Double> getTotalEarnings() {
        try {
            double totalEarnings = stripeService.getTotalEarnings();
            return ResponseEntity.ok(totalEarnings);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0.0);
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<?> confirmPayment(
            @RequestParam String paymentIntentId,
            @RequestParam Long apprenantId) throws StripeException {

        boolean paymentVerified = stripeService.verifyPayment(paymentIntentId);
        if (!paymentVerified) {
            return ResponseEntity.badRequest().body("Payment verification failed");
        }

        List<Formations> purchasedCourses = cartService.processSuccessfulPayment(apprenantId);
        if (purchasedCourses == null || purchasedCourses.isEmpty()) {
            return ResponseEntity.badRequest().body("Checkout processing failed or no courses found");
        }

        List<Long> courseIds = purchasedCourses.stream()
                .map(Formations::getId)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("purchasedCourses", courseIds));
    }
}