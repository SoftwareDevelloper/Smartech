package org.example.backendpfe.ServiceImpl;

import jakarta.transaction.Transactional;
import org.example.backendpfe.Model.ArchivedFormation;
import org.example.backendpfe.Model.ArchivedInternote;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Service.FormationsService;
import org.example.backendpfe.repository.ArchivedFormationRepository;
import org.example.backendpfe.repository.CommentaireRepo;
import org.example.backendpfe.repository.FormationsRepo;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class FormationsServImpl implements FormationsService
{
    @Autowired
    private FormationsRepo formationsRepo;
    @Autowired
    private CommentaireRepo commentaireRepo;
    @Autowired
    private ArchivedFormationRepository archivedFormationRepository;

    @Override
    public Formations addFormation(Formations formation) {
        return formationsRepo.save(formation);
    }

    @Override
    public Formations updateFormation(Formations formation) {
        return formationsRepo.save(formation);
    }

    @Override
    public void deleteFormation(Long id) {
        formationsRepo.deleteById(id);
    }

    @Override
    public Formations getFormationById(Long id) {
        return formationsRepo.findById(id).get();
    }

    @Override
    public List<Formations> getAllFormations() {
        return formationsRepo.findAllByOrderByPublishedDateDesc();
    }
    public List<Formations> getFormationsByEnseignant(Long enseignantId) {
        return formationsRepo.getFormationsByEnseignantId(enseignantId);
    }


    public void markCourseAsCompleted(Long formationId)
    {
        Formations formation = formationsRepo.findById(formationId).orElseThrow();
            formation.setIscompleted(true);
            formationsRepo.save(formation);
    }


    public Double getFormationRating(Long formationId) {
        return commentaireRepo.findAverageRatingByFormation(formationId);
    }
    public List<Formations> getProductsByPriceRange(double minprice, double maxprice) {
        return  formationsRepo.findByPriceBetween(minprice, maxprice);
    }

    public Page<Formations> getAllFormationsPaged(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return formationsRepo.findAll(pageable);
    }
    public void archiveAndDeleteFormations(Long id) {
        Formations formations = formationsRepo.findById(id).orElseThrow();

        ArchivedFormation archived = new ArchivedFormation();
        BeanUtils.copyProperties(formations, archived);
        archived.setDeletedAt(LocalDateTime.now());

        archivedFormationRepository.save(archived);
        formationsRepo.delete(formations);
    }
    public Formations restoreArchivedFormation(Long id) {
        ArchivedFormation archived = archivedFormationRepository.findById(id).orElseThrow(() -> new RuntimeException("Archived formation not found"));

        Formations restored = new Formations();
        BeanUtils.copyProperties(archived, restored);
        // VERY IMPORTANT: nullify the ID so it's treated as new
        restored.setId(null);
        formationsRepo.save(restored);
        archivedFormationRepository.deleteById(id);
        return restored;
    }

}
