package alloy.simulacrum.api.user.notification

import alloy.simulacrum.api.Pageable
import alloy.simulacrum.api.user.User
import alloy.simulacrum.api.user.UserDTO
import alloy.simulacrum.api.withPageable
import org.jetbrains.exposed.sql.and
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional



@Service
class NotificationService {

    @Autowired
    lateinit var template: SimpMessagingTemplate

    @Transactional
    fun getNotifications(user: UserDTO, pageable: Pageable): List<NotificationDTO> {
        return Notifications
                .withPageable(pageable)
                .map { Notification.wrapRow(it) }
                .map { NotificationDTO(it) }
    }

    /**
     * Sending the invite needs to happen outside the transaction that creates the notification to prevent race conditions
     */
    fun sendPlayerInvite(notificationDTO: NotificationDTO) {
        // TODO send message to user with websockets
//        template.convertAndSend()
    }

    @Transactional
    fun createInvitationNotification(to: UserDTO, toMessage: String, toToken: String, toLinkMessage: String): NotificationDTO {
        val toUser = User.findById(to.id!!)!!

        val notification = Notification.new {
            user = toUser
            message = toMessage
            token = toToken
            title = "Campaign Invitation"
            type = "INVITATION"
        }

        return NotificationDTO(notification)
    }

    @Transactional
    fun markNotificationRead(user: UserDTO, notificationId: Long): NotificationDTO {
        val notification = Notification.find { Notifications.user eq user.id and (Notifications.id eq notificationId) }.forUpdate().first()
        notification.read = true

        return NotificationDTO(notification)
    }
}
