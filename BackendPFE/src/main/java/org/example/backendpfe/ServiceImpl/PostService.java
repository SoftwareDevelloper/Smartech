package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.Internote;
import org.example.backendpfe.Model.Post;
import org.example.backendpfe.repository.InternoteRepo;
import org.example.backendpfe.repository.PostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService
{
    @Autowired
    private PostRepo postrepo;
    @Autowired
    private InternoteRepo internoteRepo;

    public Post uploadPost(Post post,Long teacher_id){
        Internote teacher =internoteRepo.findById(teacher_id).orElseThrow(() -> new RuntimeException("Teacher not found"));
        post.setInternote(teacher);
        return postrepo.save(post);
    }
    public Post getPost(Long id){
        return  postrepo.findById(id).get();
    }
    public List<Post> getPostbyTeacherId(Long enseigantId){
        return postrepo.findByteacherId(enseigantId);
    }
}
