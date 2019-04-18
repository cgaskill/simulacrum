package alloy.simulacrum.api.content

import alloy.simulacrum.api.user.User
import mu.KLogging
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.util.*


@RestController
@RequestMapping("/api/content")
class ContentController(val contentService: ContentService) {
    companion object : KLogging()

    @PutMapping
    fun putContentItem(@AuthenticationPrincipal user: User, @RequestBody contentItemDTO: ContentItemDTO): ContentItemDTO {
        return contentService.putContentItem(user, contentItemDTO)
    }

    @GetMapping("/{campaignId}/load")
    fun findConfig(@AuthenticationPrincipal user: User, @PathVariable campaignId: Long): List<ContentItemDTO> {
        return contentService.findContentItems(user.id.value, campaignId)
    }

    @PutMapping("/{campaignId}/image")
    fun uploadImage(@AuthenticationPrincipal user: User,
                   @PathVariable campaignId: Long,
                   @RequestParam("image") image: MultipartFile): ResponseEntity<*> {

        if (image.isEmpty) {
            return ResponseEntity("Please upload a file", HttpStatus.BAD_REQUEST)
        }

        try {
            contentService.saveImage(campaignId, user, Arrays.asList(image))
        } catch (e: IOException) {
            return ResponseEntity<Any>(HttpStatus.BAD_REQUEST)
        }

        return ResponseEntity("Successfully uploaded - " + image.originalFilename!!, HttpHeaders(), HttpStatus.OK)
    }

    @GetMapping("/{campaignId}/image/{fileId}")
    fun getImage(@AuthenticationPrincipal user: User,
                 @PathVariable fileId: String,
                 @PathVariable campaignId: Long): ResponseEntity<ByteArray> {
        val file = contentService.getImage(campaignId, user, fileId)

        val headers = HttpHeaders()
//        headers.setCacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))

        return ResponseEntity(file.data!!, headers, HttpStatus.OK)
    }
}
