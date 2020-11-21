package alloy.simulacrum.api.user

import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.IntIdTable
import org.springframework.security.core.GrantedAuthority

object Permissions:  IntIdTable() {
    val role = reference("role", Roles)
    val permissionName = varchar("permission_name", 50)
}

class Permission(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Permission>(Permissions)

    var role by Role referencedOn Permissions.role
    var permissionName by Permissions.permissionName
}

data class PermissionDTO(val permissionName: String) : GrantedAuthority {
    constructor(permission: Permission) : this(permission.permissionName)

    override fun getAuthority(): String {
        return permissionName
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) {
            return true
        }
        if (other !is GrantedAuthority) {
            return false
        }
        return this.authority == other.authority
    }

    override fun hashCode(): Int {
        return authority.hashCode()
    }
}
