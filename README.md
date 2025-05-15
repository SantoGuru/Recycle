
# Projeto-Aplicado-Web

Sistema web para gerenciamento de estoque de materiais recicláveis, permitindo o controle de entrada e saída de materiais, além do acompanhamento do inventário em tempo real.

## Funcionalidades

### Autenticação e Segurança
- Registro de novos usuários
- Login com autenticação JWT
- Proteção de rotas por autenticação

### Gestão de Materiais
- Cadastro de materiais recicláveis
- Listagem de materiais cadastrados
- Atualização de informações dos materiais
- Remoção de materiais

### Controle de Estoque
- Visualização do estoque atual
- Registro de entradas de materiais
- Registro de saídas de materiais
- Histórico de movimentações

### Dashboard
- Visualização de métricas e estatísticas
- Acompanhamento de movimentações
- Relatórios de estoque

## Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.x
- Spring Security com JWT
- Spring Data JPA
- MySQL
- Swagger/OpenAPI para documentação

### Frontend
- React.js
- Vite
- TailwindCSS
- React Router DOM
- React Toastify para notificações

## Como Executar o Projeto

### Pré-requisitos
- Java JDK 17 ou superior
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Maven

<!-- ### Configuração do Banco de Dados

1. Crie um banco de dados MySQL:

```sql
CREATE DATABASE recicla_estoque;
``` -->

2. Configure as credenciais no arquivo `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/recicla_estoque
spring.datasource.username=root
spring.datasource.password=root
```

### Executando o Backend

```bash
cd backend
mvn spring-boot:run
```

O servidor estará disponível em `http://localhost:8080`

### Executando o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## API Endpoints

### Autenticação

#### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

#### Registro

```http
POST /api/auth/registro
Content-Type: application/json
```

```json
{
  "nome": "Usuário Exemplo",
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

### Materiais

#### Criar Material

```http
POST /api/materiais
Authorization: Bearer {seu-token}
Content-Type: application/json
```

```json
{
  "nome": "Papel",
  "tipo": "RECICLAVEL",
  "descricao": "Papel branco para reciclagem",
  "unidadeMedida": "KG"
}
```

#### Listar Materiais

```http
GET /api/materiais
Authorization: Bearer {seu-token}
```

#### Buscar Material por ID

```http
GET /api/materiais/{id}
Authorization: Bearer {seu-token}
```

### Estoque

#### Listar Estoque

```http
GET /api/estoques
Authorization: Bearer {seu-token}
```

#### Registrar Entrada

```http
POST /api/entradas
Authorization: Bearer {seu-token}
Content-Type: application/json
```

```json
{
  "materialId": 1,
  "quantidade": 100,
  "dataEntrada": "2024-03-20T10:00:00",
  "observacao": "Entrada de material reciclável"
}
```

## Fluxo Básico de Uso

### Registro e Autenticação

- Registre-se no sistema  
- Faça login para receber o token JWT  
- Use o token em todas as requisições subsequentes  

### Cadastro de Materiais

- Cadastre os tipos de materiais que serão controlados  
- Defina unidades de medida e descrições  

### Gestão de Estoque

- Registre entradas de materiais  
- Registre saídas quando necessário  
- Acompanhe o saldo atual no estoque  

### Monitoramento

- Acompanhe as movimentações pelo dashboard  
- Verifique relatórios e métricas  
- Mantenha o controle do inventário  

---
