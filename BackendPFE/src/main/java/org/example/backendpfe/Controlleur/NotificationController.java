package org.example.backendpfe.Controlleur;


import org.example.backendpfe.Model.Notification;
import org.example.backendpfe.ServiceImpl.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000,http://localhost:3001",methods = {RequestMethod.GET,RequestMethod.POST,RequestMethod.DELETE,RequestMethod.PUT})
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        return ResponseEntity.ok(notificationService.getUnreadNotifications());
    }
    @PostMapping("/markAsRead")
    public ResponseEntity<Void> markNotificationsAsRead() {
        notificationService.markNotificationsAsRead();
        return ResponseEntity.ok().build();
    }
}
