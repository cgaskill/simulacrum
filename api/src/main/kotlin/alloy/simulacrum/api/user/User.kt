package alloy.simulacrum.api.user

import com.fasterxml.jackson.annotation.JsonIgnore
import com.fasterxml.jackson.annotation.JsonInclude
import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.jodatime.datetime
import org.joda.time.DateTime
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

object Users: LongIdTable() {
    val username = varchar("username", 100).uniqueIndex()
    val email = varchar("email", 250)
    val firstName = varchar("first_name", 50).nullable()
    val lastName = varchar("last_name", 50).nullable()
    val password = varchar("password", 60).nullable()
    val enabled = bool("enabled").default(true)
    val expiredCredentials = bool("expired_credentials").default(false)
    val accountExpired = bool("account_expired").default(false)
    val accountLocked = bool("account_locked").default(false)
    val lastLogin =  datetime("last_login").default(DateTime.now())
    val created =  datetime("created").default(DateTime.now())
}

class User(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<User>(Users)

    var userName by Users.username
    var email by Users.email
    var firstName by Users.firstName
    var lastName by Users.lastName
    var passWord by Users.password
    var enabled by Users.enabled
    var expiredCredentials by Users.expiredCredentials
    var accountExpired by Users.accountExpired
    var accountLocked by Users.accountLocked
    val roles by Role referrersOn Roles.user
    var lastLogin by Users.lastLogin
    var created by Users.created
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class UserDTO(val userName: String) : UserDetails {
    var lastName: String? = null
    var firstName: String? = null
    var enabled: Boolean = true
    var expiredCredentials: Boolean = false
    var accountExpired: Boolean = false
    var accountLocked: Boolean = false
    var created: DateTime? = null
    @JsonIgnore
    var passWord: String? = null
    var authorities: List<GrantedAuthority>? = null
    var id: Long? = null

    constructor(user: User) : this(user.userName) {
        this.id = user.id.value
        this.lastName = user.lastName
        this.firstName = user.firstName
        this.created = user.created
        this.passWord = user.passWord

        var authorities = ArrayList<GrantedAuthority>()
        authorities.addAll(user.roles.map { RolesDTO(it) })
        authorities.addAll(user.roles.map { it.permissions }.flatMap { it.map { PermissionDTO(it) } })
        this.authorities = authorities

        this.enabled = user.enabled
        this.accountExpired = user.accountExpired
        this.accountLocked = user.accountLocked
    }

    override fun equals(other: Any?): Boolean {
        if (other is UserDTO) {
            return this.id == other.id
        }

        return false
    }

    override fun hashCode(): Int {
        var hashCode = 1
        hashCode = (31 * hashCode + this.id!!).toInt()
        return hashCode
    }
    override fun getUsername(): String? {
        return userName
    }

    override fun getPassword(): String? {
        return passWord
    }

    override fun isEnabled(): Boolean {
        return this.enabled
    }

    override fun isCredentialsNonExpired(): Boolean {
        return !expiredCredentials
    }

    override fun isAccountNonExpired(): Boolean {
        return !accountExpired
    }

    override fun isAccountNonLocked(): Boolean {
        return !accountLocked
    }
    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return authorities!!.toMutableList()
    }
}
