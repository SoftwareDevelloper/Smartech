package org.example.backendpfe.Service;

import org.example.backendpfe.Model.Formations;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.util.List;

@Service
public interface FormationsService
{
    Formations addFormation(Formations formation);
    Formations updateFormation(Formations formation);
    void deleteFormation(Long id);
    Formations getFormationById(Long id);
    List<Formations> getAllFormations();

}
