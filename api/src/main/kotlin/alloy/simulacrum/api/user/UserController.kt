package alloy.simulacrum.api.user

import alloy.simulacrum.api.Pageable
import alloy.simulacrum.api.RestUtils
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import javax.servlet.http.HttpServletResponse

@RestController()
@RequestMapping("/api/users")
class UserController(val userService: UserService) {

    @GetMapping("/currentUser")
    fun getCurrentUser(@AuthenticationPrincipal user: UserDTO): UserDTO {
        return user
    }

    @PostMapping("/login")
    fun login(@AuthenticationPrincipal user: UserDTO): UserDTO {
        return userService.registerLogin(user)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/{userId}")
    fun getUser(@AuthenticationPrincipal user: UserDTO, @PathVariable userId: Long): UserDTO {
        return userService.read(userId)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("/{userId}")
    fun updateUser(@AuthenticationPrincipal user: UserDTO, @PathVariable userId: Long, @RequestBody userDTO: UserDTO): UserDTO {
        return userService.update(userId, userDTO)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{userId}")
    fun deleteUser(@AuthenticationPrincipal user: UserDTO, @PathVariable userId: Long): UserDTO {
        return userService.delete(userId)
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping()
    fun getUsers(
            @AuthenticationPrincipal user: UserDTO,
            response: HttpServletResponse,
            @RequestParam range: String?,
            @RequestParam filter: String?,
            @RequestParam sort: String?
    ): List<UserDTO> {
        val users = userService.findAllUsers(Pageable(filter, range, sort))
        RestUtils.setHeaders(response, users)
        return users.entries
    }
}
