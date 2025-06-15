package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.ArchivedInternote;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Service.InternoteServ;
import org.example.backendpfe.repository.ArchivedInternoteRepository;
import org.example.backendpfe.repository.InternoteRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
public class InternoteServImpl implements InternoteServ
{
    @Autowired
    private InternoteRepo repo;
    @Autowired
    private InternoteRepo internoteRepo;
    @Autowired
    private ArchivedInternoteRepository archivedInternoteRepository;

    @Override
    public Internote getInternoteById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Internote not found with id: " + id));
    }


    @Override
    public Internote getInternoteByname(String fullname) {
        return repo.findByName(fullname);
    }

    @Override
    public Internote createInternote(Internote internote) {
        return repo.save(internote);
    }

    @Override
    public Internote updateInternote(Internote internote) {
        return repo.save(internote);
    }

    @Override
    public void deleteInternote(Internote internote) {
        repo.delete(internote);
    }

    @Override
    public List<Internote> getAllInternotes() {

        return repo.findAll();
    }

    @Override
    public Internote findByemail(String email)
    {
        return repo.existByemail(email);
    }
    public Internote assignEnseignantToApprenant(Long apprenantId, Long enseignantId) {
        Internote apprenant = repo.findById(apprenantId).orElseThrow(() -> new RuntimeException("Apprenant not found"));
        Internote enseignant = repo.findById(enseignantId).orElseThrow(() -> new RuntimeException("Enseignant not found"));

        if (apprenant.getRole() != Internote.Role.APPRENANT || enseignant.getRole() != Internote.Role.ENSEIGNMENT) {
            throw new RuntimeException("Invalid role assignment");
        }

        apprenant.getEnseignants().add(enseignant);
        enseignant.getApprenants().add(apprenant);
        repo.save(apprenant);
        repo.save(enseignant);

        return apprenant;
    }
    public Set<Internote> getApprenantsByEnseignant(Long enseignantId) {
        Internote enseignant = repo.findById(enseignantId).orElseThrow(() -> new RuntimeException("Enseignant not found"));
        return enseignant.getApprenants();
    }
    public Set<Internote> getEnseignantsByApprenant(Long apprenantId) {
        Internote apprenant = repo.findById(apprenantId).orElseThrow(() -> new RuntimeException("Apprenant not found"));
        return apprenant.getEnseignants();
    }


    public void updateActive(Internote internote)
    {
        Internote existingInternote = internoteRepo.existByemail(internote.getEmail());
        existingInternote.setActive(true);
        internoteRepo.save(existingInternote);

    }
    public void archiveAndDeleteInternote(Long id) {
        Internote user = internoteRepo.findById(id).orElseThrow();

        ArchivedInternote archived = new ArchivedInternote();
        BeanUtils.copyProperties(user, archived);
        archived.setDeletedAt(LocalDateTime.now());

        archivedInternoteRepository.save(archived);
        internoteRepo.delete(user);
    }
    public Internote restoreArchivedInternote(Long id) {
        ArchivedInternote archived = archivedInternoteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Archived user not found"));

        Internote restored = new Internote();
        BeanUtils.copyProperties(archived, restored);

        // VERY IMPORTANT: nullify the ID so it's treated as new
        restored.setId(null);

        internoteRepo.save(restored);
        archivedInternoteRepository.deleteById(id);

        return restored;
    }






}
