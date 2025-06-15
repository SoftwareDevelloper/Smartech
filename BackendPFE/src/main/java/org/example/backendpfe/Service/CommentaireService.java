package org.example.backendpfe.Service;

import org.example.backendpfe.Model.Commentaires;
import org.example.backendpfe.Model.Formations;
import org.example.backendpfe.ServiceImpl.InternoteServImpl;
import org.example.backendpfe.repository.CommentaireRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentaireService
{
    @Autowired
    private CommentaireRepo commentaireRepos;
    @Autowired
    private InternoteServ internoteServ;
    @Autowired
    private InternoteServImpl internoteServImpl;
    @Autowired
    private CommentaireRepo commentaireRepo;

    public Commentaires PostComment(Commentaires commentaires){
        return commentaireRepo.save(commentaires);
    }
    public Commentaires GetCommentaire(Long formation_id){
        return commentaireRepo.findById(formation_id).get();
    }
    public List<Commentaires> GetAllCommentaire(){
        return commentaireRepo.findAll();
    }
    public void DeleteCommentaire(Long id){
        commentaireRepo.deleteById(id);
    }
    public  Commentaires UpdateCommentaire(Commentaires commentaires){
        return commentaireRepo.save(commentaires);
    }

    public List<Commentaires> getCommentsByFormation(Long formation_id) {
        return commentaireRepo.findByFormationIdOrderByDateDesc(formation_id);
    }




}
