package com.simulacrum.api.content

import com.simulacrum.api.user.UserDTO
import mu.KLogging
import org.springframework.http.CacheControl
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.util.*
import java.util.concurrent.TimeUnit


@RestController
@RequestMapping("/api/content")
class ContentController(val contentService: ContentService) {
    companion object : KLogging()

    @PutMapping
    fun putContentItem(@AuthenticationPrincipal user: UserDTO, @RequestBody contentItemDTO: ContentItemDTO): ContentItemDTO {
        return contentService.putContentItem(user, contentItemDTO)
    }

    @GetMapping("/{campaignId}/load")
    fun findConfig(@AuthenticationPrincipal user: UserDTO, @PathVariable campaignId: Long): List<ContentItemDTO> {
        return contentService.findContentItems(user.id!!, campaignId)
    }

    @PutMapping("/{campaignId}/image")
    fun uploadImage(@AuthenticationPrincipal user: UserDTO,
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
    fun getImage(@AuthenticationPrincipal user: UserDTO,
                 @PathVariable fileId: String,
                 @PathVariable campaignId: Long): ResponseEntity<ByteArray> {
        val file = contentService.getImage(campaignId, user, fileId)

        val headers = HttpHeaders()
        headers.setCacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))

        return ResponseEntity(file.data!!, headers, HttpStatus.OK)
    }

    @GetMapping("/item/templates")
    fun getTemplates(@AuthenticationPrincipal user: UserDTO): ResponseEntity<ContentTemplatesDTO> {
        return ResponseEntity.ok(contentService.getContentItemTemplates())
    }
}
