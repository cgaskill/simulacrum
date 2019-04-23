package alloy.simulacrum.api.config

import alloy.simulacrum.api.campaign.CampaignPlayers
import alloy.simulacrum.api.campaign.Campaigns
import alloy.simulacrum.api.campaign.Tokens
import alloy.simulacrum.api.content.CampaignImages
import alloy.simulacrum.api.content.ContentItems
import alloy.simulacrum.api.user.Permissions
import alloy.simulacrum.api.user.Roles
import alloy.simulacrum.api.user.Users
import alloy.simulacrum.api.user.notification.Notifications
import org.jetbrains.exposed.spring.SpringTransactionManager
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils.createMissingTablesAndColumns
import org.jetbrains.exposed.sql.transactions.transaction
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.transaction.annotation.EnableTransactionManagement
import javax.annotation.PostConstruct
import javax.sql.DataSource

@EnableTransactionManagement
@Configuration
class DatabaseConfig(private val dataSource: DataSource) {

    @PostConstruct
    fun init() {

        // TODO should this be disabled in production?
        Database.connect(dataSource)
        return transaction {
            createMissingTablesAndColumns(Users, Roles, Permissions, Campaigns, Notifications,
                    CampaignPlayers, ContentItems, CampaignImages, Tokens)
        }
    }

    @Bean
    fun transactionManager(dataSource: DataSource) = SpringTransactionManager(dataSource)

}
