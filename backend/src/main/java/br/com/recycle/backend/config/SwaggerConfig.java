package br.com.recycle.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("API Recycle - Sistema de Gestão de Estoque")
                .description("""
                    # Sistema de Gerenciamento de Estoque para Empresas de Reciclagem
                    
                    Esta API fornece endpoints completos para gerenciar materiais recicláveis, 
                    controlar entradas e saídas de estoque, gerenciar funcionários e gerar 
                    relatórios do dashboard.
                    
                    ## Funcionalidades Principais
                    
                    ### 🔐 Autenticação
                    - Registro de empresas e usuários
                    - Login com JWT (Bearer Token)
                    - Controle de acesso baseado em roles (GERENTE/OPERADOR)
                    
                    ### 📦 Gestão de Materiais
                    - Cadastro de materiais recicláveis
                    - Edição e exclusão (apenas GERENTE)
                    - Listagem com filtros
                    
                    ### 📊 Controle de Estoque
                    - Registro de entradas (com preço)
                    - Registro de saídas
                    - Cálculo automático de preço médio
                    - Alertas de estoque baixo
                    
                    ### 👥 Gestão de Funcionários
                    - Cadastro de operadores
                    - Visualização de movimentações por funcionário
                    - Controle de acessos
                    
                    ### 📈 Dashboard
                    - Resumo geral do estoque
                    - Valor total do estoque
                    - Materiais com estoque baixo
                    
                    ## Como Usar
                    
                    1. **Registre-se**: Use o endpoint `/api/auth/registro` para criar sua conta
                    2. **Faça Login**: Use `/api/auth/login` para obter seu token JWT
                    3. **Autentique-se**: Clique no botão "Authorize" e insira seu token
                    4. **Explore**: Teste todos os endpoints disponíveis!
                    
                    ## Regras de Negócio
                    
                    - **Multitenancy**: Cada empresa tem seus próprios dados isolados
                    - **Hierarquia**: GERENTE tem acesso total, OPERADOR tem acesso limitado
                    - **Estoque**: Calculado automaticamente com preço médio ponderado
                    - **Segurança**: Rate limiting de 5 tentativas de login a cada 15 minutos
                    
                    ## Códigos de Status HTTP
                    
                    - `200 OK`: Requisição bem-sucedida
                    - `201 Created`: Recurso criado com sucesso
                    - `204 No Content`: Sem conteúdo para retornar
                    - `400 Bad Request`: Dados inválidos
                    - `401 Unauthorized`: Não autenticado
                    - `403 Forbidden`: Sem permissão
                    - `404 Not Found`: Recurso não encontrado
                    - `429 Too Many Requests`: Rate limit excedido
                    - `500 Internal Server Error`: Erro no servidor
                    """)
                .version("1.0.0")
                .contact(new Contact()
                    .name("Equipe Recycle")
                    .email("contato@recycle.com.br")
                    .url("https://recycle.com.br"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            
            .servers(List.of(
                new Server()
                    .url("http://localhost:" + serverPort)
                    .description("Servidor de Desenvolvimento")
            ))
            
            .components(new Components()
                .addSecuritySchemes("bearerAuth", new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("""
                        ### Autenticação JWT (JSON Web Token)
                        
                        Para usar a maioria dos endpoints, você precisa de um token JWT.
                        
                        **Como obter o token:**
                        1. Registre-se em `/api/auth/registro` OU
                        2. Faça login em `/api/auth/login`
                        3. Copie o `token` da resposta
                        4. Clique em "Authorize" e cole: `seu-token-aqui`
                        
                        **Estrutura do Token:**
                        ```json
                        {
                          "token": "eyJhbGciOiJIUzI1NiIs...",
                          "tipo": "Bearer",
                          "nome": "João Silva",
                          "id": 1,
                          "role": "GERENTE",
                          "empresaId": 1,
                          "empresaNome": "Recicla Mais"
                        }
                        ```
                        
                        **Validade:** 24 horas
                        """)))
            
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            
            .tags(List.of(
                new Tag()
                    .name("Authentication")
                    .description("""
                        ### 🔐 Endpoints Públicos de Autenticação
                        
                        Estes endpoints **não requerem autenticação** e são usados para:
                        - Criar conta (empresa + primeiro usuário GERENTE)
                        - Fazer login e obter token JWT
                        
                        **Fluxo de Autenticação:**
                        ```
                        1. POST /api/auth/registro → Cria empresa e usuário GERENTE
                        2. POST /api/auth/login → Retorna token JWT
                        3. Use o token em todas as outras requisições
                        ```
                        """),
                
                new Tag()
                    .name("Usuários")
                    .description("""
                        ### 👤 Gerenciamento de Usuários
                        
                        **Permissões:** Apenas GERENTE
                        
                        Permite:
                        - Cadastrar novos usuários
                        - Modificar dados de usuários
                        - Deletar usuários
                        - Alterar roles (GERENTE/OPERADOR)
                        """),
                
                new Tag()
                    .name("Funcionários")
                    .description("""
                        ### 👥 Gestão de Funcionários (Operadores)
                        
                        **Permissões:** Apenas GERENTE
                        
                        Funcionalidades:
                        - Cadastrar funcionários (OPERADOR) vinculados à empresa do gerente
                        - Listar funcionários com total de movimentações
                        - Visualizar entradas e saídas realizadas por cada funcionário
                        
                        **Diferença de Papéis:**
                        - **GERENTE**: Acesso total + cadastro de materiais e usuários
                        - **OPERADOR**: Registra entradas/saídas, visualiza estoque
                        """),
                
                new Tag()
                    .name("Materiais")
                    .description("""
                        ### 📦 Gestão de Materiais Recicláveis
                        
                        **Criar/Editar/Deletar:** Apenas GERENTE  
                        **Visualizar:** GERENTE e OPERADOR
                        
                        Tipos de materiais suportados:
                        - Plástico (PET, PEAD, PVC, etc.)
                        - Papel e Papelão
                        - Metal (Alumínio, Ferro, Cobre)
                        - Vidro
                        - Eletrônicos
                        
                        **Unidades de Medida:**
                        - `kg` (quilogramas)
                        - `g` (gramas)
                        - `un` (unidades)
                        - `l` (litros)
                        - `ml` (mililitros)
                        
                        **Regras:**
                        - Nome deve ser único por empresa
                        - Não pode deletar material com estoque > 0
                        """),
                
                new Tag()
                    .name("Estoque")
                    .description("""
                        ### 📊 Consulta de Estoque
                        
                        **Permissões:** GERENTE e OPERADOR
                        
                        O estoque é calculado automaticamente com base em:
                        - **Entradas**: Aumentam quantidade e recalculam preço médio
                        - **Saídas**: Diminuem quantidade
                        
                        **Preço Médio Ponderado:**
                        ```
                        Novo Preço Médio = (Valor Estoque Atual + Valor Nova Entrada) / Quantidade Total
                        ```
                        
                        **Exemplo:**
                        - Estoque: 100kg a R$ 2,00/kg = R$ 200,00
                        - Entrada: 50kg a R$ 3,00/kg = R$ 150,00
                        - Novo estoque: 150kg a R$ 2,33/kg = R$ 350,00
                        """),
                
                new Tag()
                    .name("Entradas")
                    .description("""
                        ### 📥 Registro de Entradas
                        
                        **Permissões:** GERENTE e OPERADOR
                        
                        Registra a compra ou recebimento de materiais.
                        
                        **Informações Necessárias:**
                        - Material (ID)
                        - Quantidade
                        - Preço unitário
                        
                        **Efeitos:**
                        ✅ Aumenta quantidade em estoque  
                        ✅ Recalcula preço médio ponderado  
                        ✅ Atualiza valor total do estoque  
                        ✅ Registra usuário responsável  
                        ✅ Registra data/hora automaticamente
                        
                        **Suporta:**
                        - Entrada única
                        - Múltiplas entradas em batch
                        - Filtro por período
                        """),
                
                new Tag()
                    .name("Saídas")
                    .description("""
                        ### 📤 Registro de Saídas
                        
                        **Permissões:** GERENTE e OPERADOR
                        
                        Registra a venda ou envio de materiais.
                        
                        **Informações Necessárias:**
                        - Material (ID)
                        - Quantidade
                        
                        **Validações:**
                        ❌ Não permite saída maior que estoque disponível  
                        ❌ Material deve existir e ter estoque  
                        ❌ Quantidade deve ser > 0
                        
                        **Efeitos:**
                        ✅ Diminui quantidade em estoque  
                        ✅ Mantém preço médio (usa o preço do estoque)  
                        ✅ Atualiza valor total  
                        ✅ Registra usuário responsável  
                        ✅ Registra data/hora automaticamente
                        
                        **Suporta:**
                        - Saída única
                        - Múltiplas saídas em batch
                        - Filtro por período
                        """),
                
                new Tag()
                    .name("Dashboard")
                    .description("""
                        ### 📈 Visão Geral do Sistema
                        
                        **Permissões:** GERENTE e OPERADOR
                        
                        Fornece métricas consolidadas:
                        
                        **Indicadores:**
                        - 📦 **Total de Materiais**: Quantidade de tipos cadastrados
                        - ⚖️ **Quantidade Total (KG)**: Soma de todo o estoque
                        - 💰 **Valor Total**: Valor financeiro do estoque
                        - ⚠️ **Materiais com Estoque Baixo**: Materiais < 100kg
                        
                        **Uso Recomendado:**
                        - Tela inicial do sistema
                        - Monitoramento rápido
                        - KPIs para gestão
                        """)
            ));
    }
}
