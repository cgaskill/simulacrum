package com.simulacrum.api.campaign

import com.simulacrum.api.Pageable
import com.simulacrum.api.RestUtils
import com.simulacrum.api.user.UserDTO
import com.simulacrum.api.notification.NotificationService
import mu.KLogging
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.security.access.prepost.PostAuthorize
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletResponse

@RestController()
@RequestMapping("/api/campaigns")
class CampaignController(val campaignService: CampaignService, val notifactionService: NotificationService) {
    companion object : KLogging()

    @GetMapping("/currentUser")
    fun getGames(@AuthenticationPrincipal user: UserDTO): List<CampaignSummaryDTO> {
        return campaignService.findAllActiveCampaigns(user)
    }

    @PostAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{campaignId}")
    fun getGame(@AuthenticationPrincipal user: UserDTO, @PathVariable campaignId: Long): CampaignDTO {
        return campaignService.getCampaign(campaignId)
    }

    @PostAuthorize("(@campaignService.userCanAccess(#user, returnedObject))")
    @GetMapping("/{campaignId}/load")
    fun findConfig(@AuthenticationPrincipal user: UserDTO, @PathVariable campaignId: Long): CampaignDTO {
        return campaignService.findConfig(user.id!!, campaignId)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping()
    fun getCampaigns(
            @AuthenticationPrincipal user: UserDTO,
            response: HttpServletResponse,
            @RequestParam range: String?,
            @RequestParam filter: String?,
            @RequestParam sort: String?
    ): List<CampaignDTO> {
        val campaign = campaignService.findAllCampaigns(Pageable(filter, range, sort))
        RestUtils.setHeaders(response, campaign)
        return campaign.entries
    }

    @PostMapping()
    fun createCampaign(@AuthenticationPrincipal user: UserDTO, @RequestBody campaignDTO: CampaignDTO): CampaignDTO {
        return campaignService.create(user, campaignDTO)
    }

    data class CampaignInviteDTO(val username: String, val campaignId: Long)

    @PostMapping("/invite")
    fun invitePlayer(@AuthenticationPrincipal user: UserDTO, @RequestBody campaignInviteDTO: CampaignInviteDTO) {
        val notificationDTO = campaignService.invitePlayer(user, campaignInviteDTO)
        notifactionService.sendPlayerInvite(notificationDTO)
    }

    @PostMapping("/invite/{token}/accept")
    fun acceptInvite(@AuthenticationPrincipal user: UserDTO, @PathVariable token: String): CampaignSummaryDTO {
        return campaignService.acceptInvite(user, token)
    }

    @PostMapping("/invite/{token}/decline")
    fun declineInvite(@AuthenticationPrincipal user: UserDTO, @PathVariable token: String) {
        return campaignService.declineInvite(user, token)
    }

    @PutMapping("/{campaignId}")
    fun updateCampaign(@AuthenticationPrincipal user: UserDTO, @PathVariable campaignId: Long, @RequestBody campaignDTO: CampaignDTO): CampaignDTO {
        return campaignService.update(user, campaignDTO)
    }

    @DeleteMapping("/{campaignId}")
    fun archiveCampaign(@AuthenticationPrincipal user: UserDTO, @PathVariable campaignId: Long) {
        campaignService.archive(user, campaignId)
    }

    @MessageMapping("/campaigns/{campaignId}")
    @SendTo("/api/ws/topic/campaigns/{campaignId}")
    fun campaignAction(@AuthenticationPrincipal user: UserDTO, @DestinationVariable campaignId: Long, campaignAction: CampaignActionDTO): CampaignActionDTO {
        // TODO filter actions?
        logger.info("Action recieved: $campaignAction")
        campaignAction.userId = user.id!!
        return campaignAction
    }

    @PutMapping("/{campaignId}/token")
    fun putToken(@AuthenticationPrincipal user: UserDTO, @PathVariable campaignId: Long, @RequestBody tokenDTO: TokenDTO): TokenDTO {
        return campaignService.putToken(user, tokenDTO)
    }
}
