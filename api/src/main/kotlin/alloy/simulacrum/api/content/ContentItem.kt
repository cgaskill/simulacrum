package alloy.simulacrum.api.content

import alloy.simulacrum.api.campaign.Campaigns
import alloy.simulacrum.api.user.Users
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.LongIdTable

object ContentItems: LongIdTable() {
    val visibleToPlayers = bool("visibile_to_player").default(false)
    val name = varchar("name", 50)
    val type = varchar("type", 50)
    val image = varchar("image", 1000).default("")
    val notes = varchar("notes", 1000).default("")
    val gmNotes = varchar("gmNotes", 1000).default("")
    val campaign = reference("campaign_id", Campaigns)
    val creator = reference("creator", Users)
    val archived = bool("archived").default(false)
}

class ContentItem(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<ContentItem>(ContentItems)

    var name by ContentItems.name
    var visibleToPlayers by ContentItems.visibleToPlayers
    var campaign by ContentItems.campaign
    var type by ContentItems.type
    var image by ContentItems.image
    var archived by ContentItems.archived
    var creator by ContentItems.creator
    var gmNotes by ContentItems.gmNotes
    var notes by ContentItems.notes
}

data class ContentItemDTO(val name: String, val type: String) {
    var id: Long? = null
    var campaignId: Long? = null
    var image: String? = null
    var visibleToPlayers: Boolean = false
    var archived: Boolean = false
    var gmNotes: String? = null
    var notes: String? = null

    constructor(contentItem: ContentItem): this(contentItem.name, contentItem.type) {
        id = contentItem.id.value
        campaignId = contentItem.campaign.value
        visibleToPlayers = contentItem.visibleToPlayers
        gmNotes = contentItem.gmNotes
        notes = contentItem.notes
        image = contentItem.image
    }
}
