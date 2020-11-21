package com.simulacrum.api.campaign

import com.simulacrum.api.content.ContentItem
import com.simulacrum.api.content.ContentItems
import com.simulacrum.api.user.User
import com.simulacrum.api.user.Users
import com.fasterxml.jackson.annotation.JsonInclude
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.LongIdTable
import org.joda.time.DateTime

object Campaigns: LongIdTable() {
    val creator = reference("creator", Users)
    val archived = bool("archived").default(false)
    val name = varchar("name", 100)
}

class Campaign(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Campaign>(Campaigns)

    var creator by User referencedOn Campaigns.creator
    var name by Campaigns.name
    var archived by Campaigns.archived
    var players by User via CampaignPlayers
    val entities by ContentItem referrersOn ContentItems.campaign
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CampaignSummaryDTO(val name: String) {
    var id: Long? = null
    var lastAccessed: DateTime? = null

    constructor(campaign: Campaign): this(campaign.name) {
        id = campaign.id.value
    }
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class CampaignDTO(val name: String) {
    var id: Long? = null
    var creator: Long? = null
    var lastAccessed: DateTime? = null
    var gameConfig: GameConfig? = null
    var sceneConfigs: List<SceneConfig> = listOf()
    var archived: Boolean? = null
    var playerIds: List<Long>? = null

    constructor(campaign: Campaign): this(campaign.name) {
        this.id = campaign.id.value
        this.creator = campaign.creator.id.value
        this.archived = campaign.archived
        this.playerIds = campaign.players.map { it.id.value }

        // TODO pull game config from DB
        gameConfig = GameConfig(0)

        // TODO pull scenes from DB
        sceneConfigs = listOf(SceneConfig(0, 20, 15, "SQUARE"))

    }

    constructor(campaign: Campaign, campaignPlayer: CampaignPlayer) : this(campaign) {
        this.lastAccessed = campaignPlayer.lastAccessDate
    }
}

data class GameConfig(val currentSceneId: Int)
data class SceneConfig(val sceneId: Int, val width: Int, val height: Int, val pattern: String)
