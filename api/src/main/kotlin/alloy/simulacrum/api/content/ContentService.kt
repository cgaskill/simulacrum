package alloy.simulacrum.api.content

import alloy.simulacrum.api.campaign.Campaign
import alloy.simulacrum.api.campaign.CampaignService
import alloy.simulacrum.api.campaign.Campaigns
import alloy.simulacrum.api.user.User
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.statements.api.ExposedBlob
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import javax.sql.rowset.serial.SerialBlob

@Service
class ContentService(val campaignService: CampaignService) {

    @Transactional
    fun putContentItem(user: User, contentItemDTO: ContentItemDTO): ContentItemDTO {
        val currentUser = User.findById(user.id)!!
        val currentCampaign = Campaign.findById(contentItemDTO.campaignId!!)!!

        val contentItem = if(contentItemDTO.id != null) {
            val oldContentItem = ContentItem.findById(contentItemDTO.id!!)!!
            if (currentUser.id == oldContentItem.creator
                || currentCampaign.creator == currentUser) {
                oldContentItem.archived = contentItemDTO.archived
                oldContentItem.gmNotes = contentItemDTO.gmNotes ?: ""
                oldContentItem.notes = contentItemDTO.notes ?: ""
                oldContentItem.name = contentItemDTO.name
                oldContentItem.visibleToPlayers = contentItemDTO.visibleToPlayers
            }
            oldContentItem
        } else {
            ContentItem.new {
                name = contentItemDTO.name
                type = contentItemDTO.type
                visibleToPlayers = contentItemDTO.visibleToPlayers
                campaign = currentCampaign.id
                creator = currentUser.id
                archived = contentItemDTO.archived
            }
        }

        return ContentItemDTO(contentItem)
    }

    @Transactional(readOnly = true)
    fun findContentItems(userId: Long, campaignId: Long): List<ContentItemDTO> {
        val campaign = Campaign.find {
            Campaigns.id eq campaignId
        }.first()

        val contentItems = campaign.entities
        if(campaign.creator.id.value != userId) {
            val visibleContentItemDTOs = contentItems
                    .filter { contentItem -> contentItem.visibleToPlayers }
                    .map { ContentItemDTO(it) }
            visibleContentItemDTOs.forEach { it.gmNotes = null }
            return visibleContentItemDTOs
        }

        return contentItems.map { ContentItemDTO(it) }
    }

    @Transactional
    fun saveImage(campaignId: Long, user: User, images: List<MultipartFile>) {
        val currentCampaign = Campaign.findById(campaignId)!!
        campaignService.userCanModify(user, currentCampaign)

        for (image in images) {
            if (image.isEmpty) {
                continue
            }

            val bytes = image.bytes
            CampaignImage.new {
                fileName = image.originalFilename!!
                fileType = image.contentType!!
                campaign = currentCampaign.id
                data = ExposedBlob(bytes)
            }
        }
    }

    @Transactional(readOnly = true)
    fun getImage(campaignId: Long, user: User, fileName: String): CampaignImageDTO {
        val currentCampaign = Campaign.findById(campaignId)!!
        campaignService.userCanAccess(user, currentCampaign)

        return CampaignImage
                .find { CampaignImages.fileName eq fileName and (CampaignImages.campaign eq currentCampaign.id) }
                .map { CampaignImageDTO(it) }
                .first()
    }
}


