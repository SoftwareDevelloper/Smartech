package org.example.backendpfe.DTO;

public class ContactUs
{
    private String fullname;
    private String email;
    private String message;

    public ContactUs() {}

    public ContactUs(String fullname, String email, String message) {
        this.fullname = fullname;
        this.email = email;
        this.message = message;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
