package com.simulacrum.api.campaign

import com.simulacrum.api.user.Users
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.jodatime.datetime

object CampaignPlayers: LongIdTable() {
    val campaign = reference("campaign_id", Campaigns)
    val player = reference("player_id", Users)
    val lastAccessed = datetime("last_accessed").nullable()
    init {
        uniqueIndex("CampaignPlayerUniqueConstraint", campaign, player)
    }
}

class CampaignPlayer(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<CampaignPlayer>(CampaignPlayers)
    var campaign by CampaignPlayers.campaign
    var player by CampaignPlayers.player
    var lastAccessDate by CampaignPlayers.lastAccessed
}
