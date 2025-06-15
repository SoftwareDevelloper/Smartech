package org.example.backendpfe.Model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import java.util.Set;

@Entity
@Table(name = "enseignant_apprenant")
public class EnseignantApprenant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apprenant_id", nullable = false)
    private Internote apprenant;

    @ManyToOne
    @JoinColumn(name = "enseignant_id", nullable = false)
    private Internote enseignant;




    public EnseignantApprenant() {
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

    public Internote getEnseignant() {
        return enseignant;
    }

    public void setEnseignant(Internote enseignant) {
        this.enseignant = enseignant;
    }


}
