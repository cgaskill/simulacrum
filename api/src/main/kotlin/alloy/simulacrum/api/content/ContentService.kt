package alloy.simulacrum.api.content

import alloy.simulacrum.api.campaign.Campaign
import alloy.simulacrum.api.campaign.Campaigns
import alloy.simulacrum.api.user.User
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ContentService {
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
}


