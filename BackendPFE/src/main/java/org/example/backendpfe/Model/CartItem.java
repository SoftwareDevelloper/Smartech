package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;

@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Apprenant (Internote)
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "apprenant_id")
    private Internote apprenant;
    // Formation added to the cart
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "formation_id")
    private Formations formation;

    public CartItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Internote getApprenant() {
        return apprenant;
    }

    public void setApprenant(Internote apprenant) {
        this.apprenant = apprenant;
    }

    public Formations getFormation() {
        return formation;
    }

    public void setFormation(Formations formation) {
        this.formation = formation;
    }
}
