package alloy.simulacrum.api

import alloy.simulacrum.api.user.UserDTO
import com.fasterxml.jackson.annotation.JsonInclude
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Query
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.selectAll
import javax.servlet.http.HttpServletResponse

class RestUtils {
    companion object {
        fun setHeaders(response: HttpServletResponse, page: Page<*>) {
            if(page.offset != null && page.limit != null) {
                response.setHeader("Content-Range", "entries " + page.offset + "-" + (page.limit + page.offset) + "/" + page.total)
            }
        }

        fun shouldPopulateAdminFields(userDTO: UserDTO): Boolean {
            return  isAdminUser(userDTO)
        }

        fun isAdminUser(user: UserDTO): Boolean {
            return user.authorities?.any { it.authority == "ROLE_ADMIN" } ?: false
        }
    }
}

fun LongIdTable.field(sortField: String): Column<*> {
    return this.columns.first { it.name == sortField }
}

fun LongIdTable.withOptionalWhere(table: LongIdTable, filterField: String?, filterValues: List<String>?): Query {
    if(filterField != null && filterValues != null) {
        val field = table.field(filterField)
        var coercedField = field as? Column<EntityID<Long>>
        if(coercedField != null) {
            return this.select { coercedField.inList(filterValues.map { it.toLong() }) }
        }
        IllegalStateException("Unhandled filter clause $filterField and $filterValues")
    }
    return this.selectAll()
}

fun Query.withOptionalOrderBy(table: LongIdTable, sortField: String?, sortDirection: String?): Query {
    if(sortField != null && sortDirection != null) {
        val sortOrder = if (sortDirection == "DESC") SortOrder.DESC else SortOrder.ASC
        return this.orderBy(table.field(sortField), sortOrder)
    }
    return this
}

fun Query.withOptionalLimit(limit: Int?, offset: Long?): Query {
    if(limit != null) {
        return if(offset != null) {
            this.limit(limit, offset)
        } else {
            this.limit(limit)
        }
    }
    return this
}

fun LongIdTable.withPageable(pageable: Pageable): Query {
    return this.withOptionalWhere(this, pageable.filterField, pageable.filterValues)
            .withOptionalOrderBy(this, pageable.sortField, pageable.sortDirection)
            .withOptionalLimit(pageable.limit, pageable.offset)
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Page<T>(val entries: List<T>, val total: Long, val offset: Long?, val limit: Int?)

val RANGE_REGEX = """.([0-9]*),([0-9]*).""".toRegex()
val SORT_REGEX = """..(\w*).,.(DESC|ASC)..""".toRegex()
val FILTER_REGEX = """\{.(\w*).:\[?([^]]*)]?}""".toRegex()

class Pageable(filter: String? = null, range: String? = null, sort: String? = null) {
    var filterField: String? = null
    var filterValues: List<String>? = null
    var offset: Long? = null
    var limit: Int? = null
    var sortField: String? = null
    var sortDirection: String? = null

    init {
        if(filter != null) {
            val match = FILTER_REGEX.matchEntire(filter)
            if(match != null) {
                val (filterField, filterValues) = match.destructured
                this.filterField = filterField
                this.filterValues = filterValues.split(",")
                if(filterValues.isEmpty()) {
                    this.filterField = null
                    this.filterValues = null
                }
            }
        }
        if(sort != null) {
            val (sortField, sortDirection) = SORT_REGEX.matchEntire(sort)!!.destructured
            this.sortField = sortField
            this.sortDirection = sortDirection
        }
        if(range != null) {
            val (firstIndex, lastIndex) = RANGE_REGEX.matchEntire(range)!!.destructured
            this.offset = firstIndex.toLong()
            this.limit = (lastIndex.toLong() - firstIndex.toLong()).toInt()
        }
    }
}
