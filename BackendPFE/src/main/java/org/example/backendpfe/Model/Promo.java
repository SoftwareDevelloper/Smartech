package org.example.backendpfe.Model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
public class Promo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String  eventTitleEn;
    private String  eventTitleAr;
    private String  eventTitleFr;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String  eventDescriptionEn;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String  eventDescriptionAr;
    @Lob
    @Column(length = 10000)// You can adjust the length as needed
    private String  eventDescriptionFr;

    private Date eventFirstDate;
    private  Date eventEndDate;


    public Promo() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventTitleEn() {
        return eventTitleEn;
    }

    public void setEventTitleEn(String eventTitleEn) {
        this.eventTitleEn = eventTitleEn;
    }

    public String getEventTitleAr() {
        return eventTitleAr;
    }

    public void setEventTitleAr(String eventTitleAr) {
        this.eventTitleAr = eventTitleAr;
    }

    public String getEventTitleFr() {
        return eventTitleFr;
    }

    public void setEventTitleFr(String eventTitleFr) {
        this.eventTitleFr = eventTitleFr;
    }

    public String getEventDescriptionEn() {
        return eventDescriptionEn;
    }

    public void setEventDescriptionEn(String eventDescriptionEn) {
        this.eventDescriptionEn = eventDescriptionEn;
    }

    public String getEventDescriptionAr() {
        return eventDescriptionAr;
    }

    public void setEventDescriptionAr(String eventDescriptionAr) {
        this.eventDescriptionAr = eventDescriptionAr;
    }

    public String getEventDescriptionFr() {
        return eventDescriptionFr;
    }

    public void setEventDescriptionFr(String eventDescriptionFr) {
        this.eventDescriptionFr = eventDescriptionFr;
    }

    public Date getEventFirstDate() {
        return eventFirstDate;
    }

    public void setEventFirstDate(Date eventFirstDate) {
        this.eventFirstDate = eventFirstDate;
    }

    public Date getEventEndDate() {
        return eventEndDate;
    }

    public void setEventEndDate(Date eventEndDate) {
        this.eventEndDate = eventEndDate;
    }
}
