# 📚 Guia Completo - Swagger API Documentation

## 🚀 Como Acessar

### Swagger UI (Interface Visual)
```
http://localhost:8080/swagger-ui/index.html
```

### OpenAPI JSON
```
http://localhost:8080/v3/api-docs
```

### OpenAPI YAML
```
http://localhost:8080/v3/api-docs.yaml
```

---

## 🎯 Primeiros Passos

### 1️⃣ Registrar-se no Sistema

1. Acesse o Swagger UI
2. Navegue até **Authentication → POST /api/auth/registro**
3. Clique em "Try it out"
4. Preencha o JSON:
```json
{
  "nome": "Seu Nome",
  "email": "seu@email.com",
  "senha": "Senha123",
  "nomeFantasia": "Sua Empresa LTDA",
  "cnpj": "12.345.678/0001-90"
}
```
5. Clique em "Execute"
6. **Copie o `token`** da resposta

### 2️⃣ Autenticar-se

1. Clique no botão **"Authorize" 🔒** (canto superior direito)
2. Cole seu token no campo
3. Clique em "Authorize"
4. Clique em "Close"

✅ **Pronto!** Agora você pode testar todos os endpoints!

---

## 📋 Estrutura da API

### 🔓 Endpoints Públicos (Sem Token)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/auth/registro` | POST | Criar conta |
| `/api/auth/login` | POST | Fazer login |

### 🔒 Endpoints Protegidos (Com Token)

#### 👤 Usuários (Apenas GERENTE)
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/usuarios/cadastrar` | PUT | Cadastrar usuário |
| `/api/usuarios/modificar/{email}` | POST | Modificar usuário |
| `/api/usuarios/deletar/{email}` | DELETE | Deletar usuário |
| `/api/usuarios/role` | PUT | Alterar papel |

#### 👥 Funcionários (Apenas GERENTE)
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/usuarios/funcionarios` | POST | Criar operador |
| `/api/usuarios/funcionarios` | GET | Listar operadores |

#### 📦 Materiais
| Endpoint | Método | Permissão |
|----------|--------|-----------|
| `/api/materiais` | POST | GERENTE |
| `/api/materiais` | GET | GERENTE/OPERADOR |
| `/api/materiais/{id}` | GET | GERENTE/OPERADOR |
| `/api/materiais/{id}` | PUT | GERENTE |
| `/api/materiais/{id}` | DELETE | GERENTE |

#### 📊 Estoque (GERENTE/OPERADOR)
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/estoques` | GET | Listar estoque |
| `/api/estoques/{id}` | GET | Buscar por ID |

#### 📥 Entradas (GERENTE/OPERADOR)
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/entradas` | POST | Registrar entrada(s) |
| `/api/entradas` | GET | Listar entradas |

#### 📤 Saídas (GERENTE/OPERADOR)
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/saidas` | POST | Registrar saída(s) |
| `/api/saidas` | GET | Listar saídas |

#### 📈 Dashboard (GERENTE/OPERADOR)
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/dashboard/resumo` | GET | Resumo geral |

---

## 🎓 Fluxo de Uso Completo

### Cenário: Empresa de Reciclagem Iniciante

#### 1. Criar Conta da Empresa
```http
POST /api/auth/registro
{
  "nome": "João Silva",
  "email": "joao@reciclamais.com",
  "senha": "Gerente123",
  "nomeFantasia": "Recicla Mais LTDA",
  "cnpj": "12.345.678/0001-90"
}
```
📌 **Resultado:** Você vira GERENTE automaticamente

#### 2. Cadastrar Materiais
```http
POST /api/materiais
{
  "nome": "Plástico PET",
  "descricao": "Garrafas PET transparentes",
  "unidade": "kg"
}
```

#### 3. Cadastrar Funcionário (Operador)
```http
POST /api/usuarios/funcionarios
{
  "nome": "Carlos Operador",
  "email": "carlos@reciclamais.com",
  "senha": "Operador123"
}
```

#### 4. Registrar Entrada de Material
```http
POST /api/entradas
[
  {
    "materialId": 1,
    "quantidade": 100.0,
    "preco": 2.50
  }
]
```
📌 **Efeito:** 
- Estoque: 100kg
- Preço médio: R$ 2,50/kg
- Valor total: R$ 250,00

#### 5. Registrar Saída
```http
POST /api/saidas
[
  {
    "materialId": 1,
    "quantidade": 30.0
  }
]
```
📌 **Efeito:**
- Estoque: 70kg
- Preço médio: R$ 2,50/kg (mantém)
- Valor total: R$ 175,00

#### 6. Ver Dashboard
```http
GET /api/dashboard/resumo
```
📌 **Resposta:**
```json
{
  "totalMateriais": 1,
  "quantidadeTotalKg": 70.0,
  "valorTotalEstoque": 175.00,
  "materiaisComEstoqueBaixo": 1
}
```

---

## 💡 Dicas e Truques

### 🔍 Filtros e Paginação

#### Filtrar Materiais por Nome
```
GET /api/materiais?nome=plástico
```

#### Filtrar Entradas por Período
```
GET /api/entradas?dataInicio=2024-01-01T00:00:00&dataFim=2024-01-31T23:59:59
```

#### Paginação
```
GET /api/materiais/paged?page=0&size=20&sort=nome,asc
```

### 🎨 Usar Exemplos Pré-definidos

O Swagger possui **vários exemplos** em cada endpoint:

1. Clique em "Try it out"
2. No campo "Request body", clique na **dropdown de exemplos**
3. Escolha um exemplo (ex: "Plástico PET", "Papelão", etc.)
4. O JSON é preenchido automaticamente!

### 🚨 Erros Comuns

#### ❌ 401 Unauthorized
**Causa:** Token ausente ou expirado  
**Solução:** Faça login novamente e atualize o token

#### ❌ 403 Forbidden
**Causa:** Sem permissão (ex: OPERADOR tentando criar material)  
**Solução:** Use uma conta GERENTE

#### ❌ 400 Bad Request
**Causa:** Dados inválidos  
**Solução:** Verifique a resposta, ela detalha o campo com erro

#### ❌ 429 Too Many Requests
**Causa:** Muitas tentativas de login falhas  
**Solução:** Aguarde 15 minutos

---

## 🔐 Segurança

### Hierarquia de Permissões

```
GERENTE
  ├─ Todas as permissões de OPERADOR
  ├─ Criar/Editar/Deletar materiais
  ├─ Cadastrar funcionários
  └─ Gerenciar usuários

OPERADOR
  ├─ Registrar entradas
  ├─ Registrar saídas
  ├─ Visualizar estoque
  └─ Visualizar dashboard
```

### Isolamento de Dados (Multitenancy)

- ✅ Cada empresa vê **apenas seus dados**
- ✅ CNPJ único por empresa
- ✅ Materiais isolados por empresa
- ✅ Estoque isolado por empresa

---

## 📊 Regras de Negócio

### Cálculo de Preço Médio Ponderado

Quando você registra uma entrada, o sistema recalcula automaticamente:

```
Estoque Atual:  100kg × R$2,00 = R$200,00
Nova Entrada:    50kg × R$3,00 = R$150,00
─────────────────────────────────────────
Novo Estoque:   150kg × R$2,33 = R$350,00
```

### Validação de Saída

❌ **Bloqueado se:**
- Quantidade solicitada > Estoque disponível
- Material não existe
- Quantidade ≤ 0

### Exclusão de Material

❌ **Bloqueado se:**
- Material possui estoque > 0

✅ **Permitido se:**
- Estoque = 0 (zera primeiro com saídas)

---

## 🛠️ Configuração Avançada

### Mudar Porta do Servidor

Edite `application.properties`:
```properties
server.port=9090
```

Nova URL: `http://localhost:9090/swagger-ui/index.html`

### Desabilitar Swagger em Produção

Adicione ao `application-prod.properties`:
```properties
springdoc.swagger-ui.enabled=false
springdoc.api-docs.enabled=false
```

### Personalizar URL do Swagger

```properties
springdoc.swagger-ui.path=/api-docs
```

Nova URL: `http://localhost:8080/api-docs`

---

## 📞 Suporte

### Encontrou um Bug?

1. Verifique os logs do backend
2. Teste no Swagger com "Try it out"
3. Copie a resposta de erro
4. Reporte com detalhes

### Dúvidas?

Consulte:
- 📘 Este guia
- 🌐 Swagger UI (possui descrições detalhadas)
- 📖 Documentação do Spring Boot

---

## 🎉 Recursos Extras

### Exportar Coleção para Postman/Insomnia

1. Acesse: `http://localhost:8080/v3/api-docs`
2. Copie o JSON
3. Importe no Postman/Insomnia como "OpenAPI 3.0"

### Gerar Cliente TypeScript/JavaScript

```bash
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:8080/v3/api-docs \
  -g typescript-axios \
  -o ./src/api
```

### Gerar Cliente Python

```bash
pip install openapi-generator-cli
openapi-generator generate \
  -i http://localhost:8080/v3/api-docs \
  -g python \
  -o ./client
```

---

**📝 Última Atualização:** 2025 
**🏷️ Versão da API:** 1.0.0  
**👨‍💻 Desenvolvido com:** Spring Boot 3.4.3 + SpringDoc OpenAPI