package alloy.simulacrum.api.content

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping



@Controller
class PageController {

    @GetMapping("/{path:[^\\.]*}")
    fun forward(): String {
        return "forward:/"
    }
}
