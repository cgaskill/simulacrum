package com.simulacrum.api.content

import com.simulacrum.api.campaign.Campaigns
import com.simulacrum.api.user.Users
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import java.nio.charset.StandardCharsets

object ContentItems: LongIdTable() {
    val visibleToPlayers = bool("visibile_to_player").default(false)
    val name = varchar("name", 50)
    val type = varchar("type", 50)
    val subType = varchar("sub_type", 50)
    val campaign = reference("campaign_id", Campaigns)
    val creator = reference("creator", Users)
    val archived = bool("archived").default(false)
    val contentFields = blob("fields")
}

class ContentItem(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<ContentItem>(ContentItems)

    var name by ContentItems.name
    var visibleToPlayers by ContentItems.visibleToPlayers
    var campaign by ContentItems.campaign
    var type by ContentItems.type
    var subType by ContentItems.subType
    var fields by ContentItems.contentFields
    var archived by ContentItems.archived
    var creator by ContentItems.creator
}

data class ContentItemDTO(val name: String, val type: String) {
    var id: Long? = null
    var campaignId: Long? = null
    var visibleToPlayers: Boolean = false
    var archived: Boolean = false
    var fields: String? = null
    var subType: String? = null

    constructor(contentItem: ContentItem): this(contentItem.name, contentItem.type) {
        id = contentItem.id.value
        campaignId = contentItem.campaign.value
        visibleToPlayers = contentItem.visibleToPlayers
        subType = contentItem.subType
        fields = String(contentItem.fields.bytes, StandardCharsets.UTF_8)
    }
}
