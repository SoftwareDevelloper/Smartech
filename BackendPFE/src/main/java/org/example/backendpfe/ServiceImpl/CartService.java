package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.DTO.CartItemDTO;
import org.example.backendpfe.Model.CartItem;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Service.InternoteServ;
import org.example.backendpfe.repository.CartItemRepository;
import org.example.backendpfe.repository.FormationsRepo;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepo;

    @Autowired
    private InternoteRepo internoteRepo;

    @Autowired
    private FormationsRepo formationsRepo;
    @Autowired
    private InternoteServ internoteServ;

    public List<CartItemDTO> getCartItems(Long apprenantId) {
        List<CartItem> cartItems = cartItemRepo.findByApprenantId(apprenantId);

        return cartItems.stream().map(cartItem -> {
            Formations formation = formationsRepo.findById(cartItem.getFormation().getId())
                    .orElseThrow(() -> new RuntimeException("Formation not found"));

            return new CartItemDTO(
                    cartItem.getId(),
                    formation.getId(),
                    formation.getTitleEn(),
                    formation.getTitleAr(),
                    formation.getTitleFr(),
                    formation.getPrice(),
                    formation.getImage()
            );
        }).collect(Collectors.toList());
    }


    //Add item to cart
    public CartItem addToCart(Long apprenantId, Long formationId) {
        Optional<CartItem> existing = cartItemRepo.findByApprenantIdAndFormationId(apprenantId, formationId);
        if (existing.isPresent()) {
            return existing.get(); // Already in cart
        }

        Internote apprenant = internoteRepo.findById(apprenantId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Formations formation = formationsRepo.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found"));

        CartItem item = new CartItem();
        item.setApprenant(apprenant);
        item.setFormation(formation);
        return cartItemRepo.save(item);
    }
    //Remove Item from cart
    public void removeItem(Long itemId) {
        cartItemRepo.deleteById(itemId);
    }
    //Clear cart
    public void clearCart(Long apprenantId) {
        List<CartItem> items = cartItemRepo.findByApprenantId(apprenantId);
        cartItemRepo.deleteAll(items);
    }

    public List<Formations> processSuccessfulPayment(Long apprenantId) {
        Internote student = internoteServ.getInternoteById(apprenantId);
        if (student == null) return Collections.emptyList();

        List<CartItem> cartItems = cartItemRepo.findByApprenantId(apprenantId);
        if (cartItems.isEmpty()) return Collections.emptyList();

        List<Formations> purchasedCourses = new ArrayList<>();

        for (CartItem item : cartItems) {
            Formations formation = item.getFormation();
            if (!student.getFormationsSuivies().contains(formation)) {
                student.getFormationsSuivies().add(formation);
                purchasedCourses.add(formation);
            }
        }

        internoteServ.updateInternote(student);
        cartItemRepo.deleteAll(cartItems);

        return purchasedCourses;
    }


}