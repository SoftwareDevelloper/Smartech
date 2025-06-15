package org.example.backendpfe.ServiceImpl;

import org.example.backendpfe.Model.*;
import org.example.backendpfe.repository.InternoteRepo;
import org.example.backendpfe.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private InternoteRepo userRepository;
    @Autowired
    private InternoteRepo internoteRepo;

    public void sendNotificationToApprenants(String message) {
        List<Internote> apprenants = userRepository.findByRole(Internote.Role.valueOf("APPRENANT"));

        for (Internote apprenant : apprenants) {
            Notification notification = new Notification();
            notification.setUser(apprenant);
            notification.setMessage(message);
            notification.setTimestamp(LocalDateTime.now());
            notification.setRead(false);
            notificationRepository.save(notification);
        }
    }

    // In your NotificationService implementation
    public List<Notification> getUnreadNotifications() {
        // Add sorting by timestamp in descending order
        return notificationRepository.findByIsReadFalseOrderByTimestampDesc();
    }

    public void markNotificationsAsRead() {
        List<Notification> notifications = notificationRepository.findByIsReadFalse();
        for (Notification notif : notifications) {
            notif.setRead(true);
            notificationRepository.save(notif);
        }
    }



    public void sendReplyNotification(Internote recipient, Commentaires originalComment, Reply reply) {
        String notificationMessage = String.format(
                "New reply to your comment on '%s': %s",
                originalComment.getFormation().getTitleEn(),
                reply.getMessage()
        );
    }

    private boolean shouldCreateNotification(Internote user, String message, LocalDateTime timestamp) {
        if (user == null || message == null) {
            return false;
        }

        // Create temporary hash for checking
        String tempHash = String.format("%d-%s-%s",
                user.getId(),
                message.hashCode(),
                timestamp.toLocalDate().toString()
        );

        return !notificationRepository.existsByMessageHashAndUser(tempHash, user);
    }

    public void sendNotificationToTeacher(Internote teacher, String message) {
        LocalDateTime now = LocalDateTime.now();

        if (shouldCreateNotification(teacher, message, now)) {
            Notification notification = new Notification();
            notification.setUser(teacher);
            notification.setMessage(message);
            notification.setTimestamp(now);
            notification.setRead(false);
            notificationRepository.save(notification);

            logger.debug("Created notification for teacher {}: {}", teacher.getId(), message);
        } else {
            logger.debug("Duplicate notification prevented for teacher {}: {}", teacher.getId(), message);
        }
    }

    public void notifyAdminAboutNewComment(Commentaires savedComment) {
        LocalDateTime now = LocalDateTime.now();
        Formations formation = savedComment.getFormation();
        Internote commentAuthor = savedComment.getInternote();
        String baseMessage = String.format(
                "New comment awaiting approval on course '%s' by %s: %s",
                formation.getTitleEn(),
                commentAuthor.getFullname(),
                savedComment.getMessage()
        );

        internoteRepo.findByRole(Internote.Role.ADMIN).forEach(admin -> {
            if (shouldCreateNotification(admin, baseMessage, now)) {
                Notification notification = new Notification();
                notification.setMessage(baseMessage);
                notification.setUser(admin);
                notification.setRead(false);
                notification.setTimestamp(now);
                notificationRepository.save(notification);
            }
        });
    }

}
