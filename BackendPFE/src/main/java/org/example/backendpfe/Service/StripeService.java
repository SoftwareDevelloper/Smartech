package org.example.backendpfe.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentIntentCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentListParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.example.backendpfe.DTO.InscriptionRequest;
import org.example.backendpfe.DTO.StripeResponse;
import org.example.backendpfe.DTO.paymentRequest;
import org.example.backendpfe.Model.CartItem;
import org.example.backendpfe.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StripeService
{
    @Value("${stripe.secret-key}")
    private String secretKey;

    @Autowired
    private CartItemRepository cartItemRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public StripeResponse createMultiItemPaymentIntent(Long apprenantId) throws StripeException {
        List<CartItem> cartItems = cartItemRepository.findByApprenantId(apprenantId);

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        // Calculate total amount in smallest currency unit (cents)
        long totalAmount = cartItems.stream()
                .mapToLong(item -> (long)(item.getFormation().getPrice() * 100))
                .sum();

        // Create description from course titles
        String description = cartItems.stream()
                .map(item -> item.getFormation().getTitleEn())
                .limit(3) // Show first 3 titles
                .collect(Collectors.joining(", "));

        if (cartItems.size() > 3) {
            description += " and " + (cartItems.size() - 3) + " more";
        }

        // Add metadata for webhook processing
        Map<String, String> metadata = new HashMap<>();
        metadata.put("apprenantId", apprenantId.toString());
        metadata.put("itemCount", String.valueOf(cartItems.size()));

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(totalAmount)
                .setCurrency("usd") // Tunisian Dinar
                .setDescription("Payment for " + cartItems.size() + " courses")
                .putAllMetadata(metadata)
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return StripeResponse.createResponse(
                "SUCCESS",
                "PaymentIntent created",
                paymentIntent.getId(),
                paymentIntent.getClientSecret()
        );
    }
    // Add this method to verify payment
    public boolean verifyPayment(String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        return "succeeded".equals(paymentIntent.getStatus());
    }
    public boolean confirmCartCheckout(Long apprenantId, String paymentIntentId) throws StripeException {
        // Verify payment with Stripe
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        if (!"succeeded".equals(paymentIntent.getStatus())) {
            return false;
        }

        // Process the cart checkout (this would be in your CartService)
        List<CartItem> cartItems = cartItemRepository.findByApprenantId(apprenantId);
        cartItemRepository.deleteAll(cartItems);

        return true;
    }

    public double getTotalEarnings() throws StripeException {
        final double USD_TO_TND_RATE = 3.092;
        PaymentIntentListParams params = PaymentIntentListParams.builder()
                .setLimit(100L)
                .build();

        PaymentIntentCollection paymentIntents = PaymentIntent.list(params);
        double totalEarnings = 0;

        for (PaymentIntent paymentIntent : paymentIntents.getData()) {
            if ("succeeded".equals(paymentIntent.getStatus())) {
                double usdAmount = paymentIntent.getAmountReceived() / 100.0;
                totalEarnings += usdAmount * USD_TO_TND_RATE;
            }
        }

        return totalEarnings;
    }
}