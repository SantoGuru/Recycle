package br.com.recycle.backend.security;

import br.com.recycle.backend.dto.ApiErrorDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;
import java.io.IOException;

@ControllerAdvice
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {
        var error = new ApiErrorDTO(HttpStatus.FORBIDDEN, "Acesso não permitido por falta de permissões.", accessDeniedException.getMessage());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.sendError(HttpStatus.FORBIDDEN.value(), objectMapper.writeValueAsString(error));
    }
}
