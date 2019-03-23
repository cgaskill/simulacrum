package alloy.simulacrum.api.content

import alloy.simulacrum.api.user.User
import mu.KLogging
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*

@RestController()
@RequestMapping("/api/content")
class ContentController(val contentService: ContentService) {
    companion object : KLogging()

    @PostMapping()
    fun createContentItem(@AuthenticationPrincipal user: User, @RequestBody contentItemDTO: ContentItemDTO): ContentItemDTO {
        return contentService.createContentItem(user, contentItemDTO)
    }

    @GetMapping("/{campaignId}/load")
    fun findConfig(@AuthenticationPrincipal user: User, @PathVariable campaignId: Long): List<ContentItemDTO> {
        return contentService.findContentItems(user.id.value, campaignId)
    }
}