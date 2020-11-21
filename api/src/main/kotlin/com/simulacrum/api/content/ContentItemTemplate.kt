package com.simulacrum.api.content

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import java.nio.charset.StandardCharsets.UTF_8

object ContentItemTemplates: LongIdTable() {
    val type = varchar("type", 50)
    val subType = varchar("sub_type", 50)
    val templateFields = blob("fields")
    val archived = bool("archived").default(false)
}

class ContentItemTemplate(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<ContentItemTemplate>(ContentItemTemplates)

    var type by ContentItemTemplates.type
    var subType by ContentItemTemplates.subType
    var fields by ContentItemTemplates.templateFields
}

data class ContentItemTemplateDTO(val type: String) {
    var id: Long? = null
    var fields: String? = null

    constructor(contentItemTemplate: ContentItemTemplate): this(contentItemTemplate.type) {
        id = contentItemTemplate.id.value
        fields = String(contentItemTemplate.fields.bytes, UTF_8)
    }
}

data class ContentTemplatesDTO(val contentItemTemplates: Map<String, ContentItemTemplateDTO>) {
    constructor(contentItemTemplates: List<ContentItemTemplateDTO>) : this(contentItemTemplates.map { it.type to it }.toMap())
}
