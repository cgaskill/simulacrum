package alloy.simulacrum.api.user

import alloy.simulacrum.api.Page
import alloy.simulacrum.api.Pageable
import alloy.simulacrum.api.withPageable
import org.jetbrains.exposed.dao.with
import org.joda.time.DateTime
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService : UserDetailsService {

    @Transactional
    override fun loadUserByUsername(username: String?): UserDetails? {
        if(username == null) {
            throw UsernameNotFoundException(username)
        }
        return User.find { Users.username eq username }
                .with(User::roles, Role::permissions)
                .map { UserDTO(it) }
                .firstOrNull() ?: throw UsernameNotFoundException(username)
    }

    /**
     * TODO Implement caching
     */
    @Transactional
    fun loadAuthoritiesForUser(username: String): List<GrantedAuthority> {
        val user = User.find { Users.username eq username }
                .with(User::roles, Role::permissions)
                .first()

        val allAuths = mutableListOf<GrantedAuthority>()
        allAuths.addAll(user.roles.map { RolesDTO(it) })
        allAuths.addAll(user.roles.map { it.permissions }.flatMap { it.map { PermissionDTO(it) } })
        return allAuths
    }

    @Transactional
    fun registerUser(userDTO: UserDTO): UserDTO {
        val newUser = User.new {
            userName = userDTO.username!!
            email = userDTO.username!!
            firstName = userDTO.firstName
            lastName = userDTO.lastName
        }

        Role.new {
            user = newUser
            roleName = "ROLE_USER"
        }

        return UserDTO(newUser)
    }

    @Transactional
    fun registerLogin(user: UserDTO): UserDTO {
        val dbUser = User.findById(user.id!!)!!
        dbUser.lastLogin = DateTime.now()
        return UserDTO(dbUser)
    }

    @Transactional
    fun findAllUsers(pageable: Pageable): Page<UserDTO> {
        val users = Users
                .withPageable(pageable)
                .map { User.wrapRow(it) }
                .map { UserDTO(it) }

        val total = User.all().count()

        return Page(users, total, pageable.offset, pageable.limit)
    }

    @Transactional
    fun read(userId: Long): UserDTO {
        return UserDTO(User.findById(userId)!!)
    }

    @Transactional
    fun delete(userId: Long): UserDTO {
        val user = User.findById(userId)!!
        user.enabled = false
        return UserDTO(user)
    }

    @Transactional
    fun update(userId: Long, userDTO: UserDTO): UserDTO {
        val user = User.findById(userId)!!
        user.enabled = userDTO.enabled
        return UserDTO(user)
    }
}
