package br.com.recycle.backend.security;

import br.com.recycle.backend.model.Entrada;
import br.com.recycle.backend.model.Material;
import br.com.recycle.backend.model.Saida;
import br.com.recycle.backend.model.Usuario;
import br.com.recycle.backend.repository.EntradaRepository;
import br.com.recycle.backend.repository.MaterialRepository;
import br.com.recycle.backend.repository.SaidaRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class TenantSecurityFilter extends OncePerRequestFilter {

    private static final Pattern RESOURCE_PATTERN = Pattern.compile("/api/(materiais|entradas|saidas)/(\\d+)");

    private final MaterialRepository materialRepository;
    private final EntradaRepository entradaRepository;
    private final SaidaRepository saidaRepository;

    public TenantSecurityFilter(MaterialRepository materialRepository, EntradaRepository entradaRepository, SaidaRepository saidaRepository) {
        this.materialRepository = materialRepository;
        this.entradaRepository = entradaRepository;
        this.saidaRepository = saidaRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof Usuario)) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        Matcher matcher = RESOURCE_PATTERN.matcher(path);

        if (matcher.find()) {
            Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
            Long userEmpresaId = usuarioLogado.getEmpresa().getId();

            String resourceType = matcher.group(1);
            Long resourceId = Long.parseLong(matcher.group(2));

            boolean hasAccess;
            try {
                hasAccess = checkOwnership(userEmpresaId, resourceType, resourceId);
            } catch (Exception e) {
                logger.error("Erro ao verificar propriedade do recurso", e);
                sendErrorResponse(response, HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao verificar permissão do recurso.");
                return;
            }

            if (!hasAccess) {
                sendErrorResponse(response, HttpStatus.FORBIDDEN, "Acesso negado. O recurso não pertence à sua empresa.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean checkOwnership(Long userEmpresaId, String resourceType, Long resourceId) {
        Optional<?> entityOptional;

        switch (resourceType) {
            case "materiais":
                entityOptional = materialRepository.findById(resourceId);
                break;
            case "entradas":
                entityOptional = entradaRepository.findById(resourceId);
                break;
            case "saidas":
                entityOptional = saidaRepository.findById(resourceId);
                break;
            default:
                return true;
        }

        if (entityOptional.isEmpty()) {
            return true;
        }

        Object entity = entityOptional.get();
        Long entityEmpresaId = getEmpresaIdFromEntity(entity);

        if (entityEmpresaId == null) {
            return false;
        }
        
        return userEmpresaId.equals(entityEmpresaId);
    }

    private Long getEmpresaIdFromEntity(Object entity) {
        Usuario usuarioDaEntidade = null;

        if (entity instanceof Material) {
            usuarioDaEntidade = ((Material) entity).getUsuario();
        } else if (entity instanceof Entrada) {
            usuarioDaEntidade = ((Entrada) entity).getUsuario();
        } else if (entity instanceof Saida) {
            usuarioDaEntidade = ((Saida) entity).getUsuario();
        } else {
            throw new IllegalArgumentException("Tipo de entidade não suportado para verificação de tenant: " + entity.getClass().getName());
        }

        if (usuarioDaEntidade != null && usuarioDaEntidade.getEmpresa() != null) {
            return usuarioDaEntidade.getEmpresa().getId();
        }

        return null;
    }

    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/json");
        response.getWriter().write(String.format("{\"error\": \"%s\", \"message\": \"%s\"}", status.getReasonPhrase(), message));
    }
}