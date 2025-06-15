package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.Reel;
import org.example.backendpfe.repository.InternoteRepo;
import org.example.backendpfe.repository.ReelRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideosService {
    @Autowired
    private ReelRepo reelrepo;
    @Autowired
    private InternoteRepo internoteRepo;

    public Reel createReal(Reel reel,Long teacherId) {
        Internote teacher =internoteRepo.findById(teacherId).orElseThrow(() -> new RuntimeException("Teacher not found"));
        reel.setInternote(teacher);  // Set the teacher for the reel
        return reelrepo.save(reel);
    }
    public Reel getReal(Long id) {
        return reelrepo.findById(id).get();
    }
    public List<Reel> getReelByTeacherId(Long enseigantId) {
        return reelrepo.findByEnseignantId(enseigantId);
    }


}

