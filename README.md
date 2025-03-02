# Sistema de Autenticação com Drizzle, Hono e MySQL no Deno 2.0

Este projeto demonstra como implementar um sistema de autenticação usando Deno 2.0, Drizzle ORM com MySQL, Hono como framework web, e Zod para validação e documentação OpenAPI.

## Funcionalidades

- Registro de usuários
- Login com autenticação JWT
- Rotas protegidas
- Documentação interativa da API usando Swagger UI
- Validação tipada com Zod
- Persistência de dados com MySQL

## Pré-requisitos

- Deno 2.0 ou superior
- MySQL Server 8.0+

## Configuração do Banco de Dados

O projeto usa variáveis de ambiente para configurar a conexão com o MySQL:

```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=sua_senha
export DB_NAME=auth_system
```

Ou você pode usar os valores padrão definidos no código.

## Como executar

1. Clone este repositório
2. Crie o banco de dados:

```sql
CREATE DATABASE auth_system;
```

3. Execute as migrações:

```bash
deno task migrate
```

4. Execute o projeto:

```bash
deno task dev
```

5. Acesse a documentação da API no navegador:

```
http://localhost:8000/swagger
```

## Estrutura de Rotas

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Rotas Protegidas

- `GET /api/protected/profile` - Obter informações do usuário atual (requer token JWT)

## Tecnologias Utilizadas

- **Deno 2.0** - Runtime JavaScript/TypeScript
- **Hono** - Framework web leve e rápido
- **Drizzle ORM** - ORM TypeScript moderno (v0.39.3)
- **MySQL** - Sistema de gerenciamento de banco de dados relacional
- **mysql2** - Driver MySQL (v3.12.0)
- **drizzle-kit** - Ferramentas de migração (v0.30.4)
- **Zod** - Biblioteca de validação com tipagem TypeScript
- **@hono/zod-openapi** - Integração Zod com OpenAPI
- **@hono/swagger-ui** - Interface Swagger para Hono

## Migrações

O projeto usa drizzle-kit para gerenciar migrações de banco de dados. Para criar novas migrações após alterar o esquema:

```bash
deno run -A ./node_modules/.bin/drizzle-kit generate:mysql --schema=./src/db/schema.ts
```

## Testando a API

Você pode testar a API usando:

1. A interface do Swagger UI (http://localhost:8000/swagger)
2. Curl ou Postman

### Exemplo de uso com curl

**Registro:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"senha123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"senha123"}'
```

**Acessar Perfil (usando o token recebido do login):**
```bash
curl -X GET http://localhost:8000/api/protected/profile \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

## Segurança

Este projeto é apenas demonstrativo. Para uso em produção, considere:

- Usar variáveis de ambiente para segredos
- Implementar validações mais robustas
- Adicionar funcionalidade de renovação de token
- Usar HTTPS
- Configurar adequadamente as credenciais MySQL e limitar permissões

## Autor
