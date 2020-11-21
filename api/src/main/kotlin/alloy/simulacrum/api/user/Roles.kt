package alloy.simulacrum.api.user

import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.IntIdTable
import org.springframework.security.core.GrantedAuthority


object Roles:  IntIdTable() {
    val user = reference("user", Users)
    val roleName = varchar("role_name", 50)
}

class Role(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Role>(Roles)

    var user by User referencedOn Roles.user
    var roleName by Roles.roleName
    val permissions by Permission.referrersOn(Permissions.role)
}

data class RolesDTO(val roleName: String) : GrantedAuthority {
    constructor(role: Role) : this(role.roleName)

    override fun getAuthority(): String {
        return roleName
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
