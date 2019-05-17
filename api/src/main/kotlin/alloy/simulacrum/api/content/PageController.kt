package alloy.simulacrum.api.content

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import javax.servlet.http.HttpServletRequest


@Controller
class PageController {

    @GetMapping("/**/{path:[^\\.]*}")
    fun forward(request: HttpServletRequest): String? {
        if(request.requestURI.startsWith("/admin")) {
            return "forward:/admin/index.html"
        }
        return "forward:/index.html"
    }
}
