package org.example.backendpfe.Controlleur;

import org.example.backendpfe.DTO.CartItemDTO;
import org.example.backendpfe.DTO.InscriptionRequest;
import org.example.backendpfe.Model.CartItem;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.ServiceImpl.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins ="https://smartech-production-e572.up.railway.app",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{apprenantId}")
    public List<CartItemDTO> getCart(@PathVariable Long apprenantId) {
        return cartService.getCartItems(apprenantId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long apprenantId, @RequestParam Long formationId) {
        return cartService.addToCart(apprenantId, formationId);
    }

    @DeleteMapping("/remove/{itemId}")
    public void removeFromCart(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
    }

    @DeleteMapping("/clear/{apprenantId}")
    public void clearCart(@PathVariable Long apprenantId) {
        cartService.clearCart(apprenantId);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestParam Long apprenantId, @RequestBody InscriptionRequest request) {
        if (!request.isPayed()) {
            return ResponseEntity.badRequest().body("Payment not completed.");
        }

        List<Formations> success = cartService.processSuccessfulPayment(apprenantId);
        if (!success.isEmpty()) {
            return ResponseEntity.status(404).body("Checkout successful. Formations subscribed.");

        } else {
            return ResponseEntity.ok("Apprenant not found or cart is empty.");
        }
    }

}
