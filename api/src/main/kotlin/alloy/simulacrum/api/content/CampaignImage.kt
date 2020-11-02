package alloy.simulacrum.api.content

import alloy.simulacrum.api.campaign.Campaigns
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.LongIdTable

object CampaignImages: LongIdTable() {
    val fileName = varchar("file_name", 50)
    val fileType = varchar("file_type", 10)
    val campaign = reference("campaign_id", Campaigns)
    val data = blob("data")
    val archived = bool("archived").default(false)
}

class CampaignImage(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<CampaignImage>(CampaignImages)

    var fileName by CampaignImages.fileName
    var fileType by CampaignImages.fileType
    var campaign by CampaignImages.campaign
    var data by CampaignImages.data
}

data class CampaignImageDTO(val fileName: String) {
    var id: Long? = null
    var fileType: String? = null
    var data: ByteArray? = null

    constructor(campaignImage: CampaignImage): this(campaignImage.fileName) {
        id = campaignImage.id.value
        fileType = campaignImage.fileType
        data = campaignImage.data.bytes
    }
}
