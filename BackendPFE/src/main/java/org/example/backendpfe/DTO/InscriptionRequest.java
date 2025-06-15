package org.example.backendpfe.DTO;

public class InscriptionRequest
{
    private String fullname;
    private String email;
    private String title;
    private  String price;
    private Long formationId;
    private Long amount;
    private String currency;
    private String proficiencyLevel; // for learner : beginner , intermediate , advanced
    private boolean isPayed; // Nouvel attribut pour indiquer si le paiement a été effectué

    public InscriptionRequest() {
    }

    public InscriptionRequest(String fullname, String email, Long formationId, String proficiencyLevel, boolean isPayed) {
        this.fullname = fullname;
        this.email = email;
        this.formationId = formationId;
        this.proficiencyLevel = proficiencyLevel;
        this.isPayed = isPayed;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getFormationId() {
        return formationId;
    }

    public void setFormationId(Long formationId) {
        this.formationId = formationId;
    }

    public String getProficiencyLevel() {
        return proficiencyLevel;
    }

    public void setProficiencyLevel(String proficiencyLevel) {
        this.proficiencyLevel = proficiencyLevel;
    }

    public boolean isPayed() { // Getter pour isPayed
        return isPayed;
    }

    public void setPayed(boolean isPayed) { // Setter pour isPayed
        this.isPayed = isPayed;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
