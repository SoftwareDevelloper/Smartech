package org.example.backendpfe.Service;

import org.example.backendpfe.Model.Internote;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InternoteServ
{
    Internote getInternoteById(Long id);
    Internote getInternoteByname(String fullname);
    Internote createInternote(Internote internote);
    Internote updateInternote(Internote internote);
    void deleteInternote(Internote internote);
    List<Internote> getAllInternotes();
    Internote findByemail(String email);
}
