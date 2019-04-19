package alloy.simulacrum.api.campaign

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import org.jetbrains.exposed.dao.EntityID
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.LongIdTable

object Tokens: LongIdTable() {
    val imageUrl = varchar("image_url", 300)
    val layer = varchar("layer", 50)
    val xCoordinate = integer("x_coordinate")
    val yCoordinate = integer("y_coordinate")
    val archived = bool("archived").default(false)
}

class Token(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Token>(Tokens)

    var archived by Tokens.archived
    var layer by Tokens.layer
    var xCoordinate by Tokens.xCoordinate
    var yCoordinate by Tokens.yCoordinate
    var imageUrl by Tokens.imageUrl
}

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
data class TokenDTO(val x: Int, val y: Int, val layer: String, val imageUrl: String) {
    var id: Long? = null

    constructor(token: Token): this(token.xCoordinate, token.yCoordinate, token.layer, token.imageUrl) {
        id = token.id.value
    }
}
