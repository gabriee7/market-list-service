
 # market-user-service

 Microserviço Node.js (Express) para gerenciamento de usuários — Controller → Service → Repository, MySQL (`mysql2/promise`), validação com `Joi`, hashing de senha com `bcryptjs` e UUIDs com `uuid`.

 **Principais responsabilidades:** CRUD de usuários, validação de payloads, tratamento global de erros, documentação OpenAPI/Swagger e inicialização automática do schema (`init.sql`) no startup.

 **Rodar localmente**

 1. Instale dependências:

    ```bash
    npm install
    ```

 2. Crie um arquivo `.env` (ou copie `.env.example`) com variáveis mínimas:

    - `PORT` (opcional, padrão 3000)
    - `DB_HOST`
    - `DB_USER`
    - `DB_PASSWORD`
    - `DB_NAME`
    - `DB_PORT` (opcional)

 3. Inicie a aplicação:

    ```bash
    npm start
    ```

 A aplicação roda por padrão em `http://localhost:3000` e cria/atualiza o schema definido em `init.sql` ao iniciar.

 **Testes**

 - Execute a suíte de testes (unit + integration):

    ```bash
    npm test
    ```

 **Documentação (Swagger/OpenAPI)**

 - A documentação interativa está disponível em `http://localhost:3000/api/docs` quando o servidor estiver em execução.

 Endpoints
 - Observação: as rotas de usuário estão montadas em duas bases para compatibilidade de testes e uso: `/user` e `/api/users` — ambas mapeiam para os mesmos handlers.

 Base paths:
 - `/user`
 - `/api/users`

 Recursos e exemplos
 - Criar usuário
   - POST /user
   - Payload (JSON):

     ```json
     {
       "name": "Alice",
       "email": "alice@example.com",
       "password": "secret"
     }
     ```

   - Response: 201 Created
     ```json
     {
       "id": "uuid-v4",
       "name": "Alice",
       "email": "alice@example.com",
       "createdAt": "2026-01-01T00:00:00.000Z",
       "updatedAt": "2026-01-01T00:00:00.000Z"
     }
     ```

 - Listar usuários
   - GET /user
   - Response: 200 OK — array de `UserResponse`.

 - Buscar por id
   - GET /user/:id
   - Response: 200 OK ou 404 Not Found

 - Atualizar usuário
   - PUT /user/:id
   - Payload: mesmo formato do POST (todos os campos opcionais)
   - Response: 200 OK com o usuário atualizado

 - Deletar usuário
   - DELETE /user/:id
   - Response: 204 No Content

 Esquemas (resumo)
 - UserRequest: `{ name, email, password }`
 - UserResponse: `{ id, name, email, createdAt, updatedAt }`

 Observações de implementação
 - Senhas são armazenadas apenas em formato hashed (bcrypt).
 - Validações de payload usam `Joi` e retornam `400 Bad Request` para entradas inválidas.
 - Erros de domínio usam exceções customizadas (`ConflictException`, `NotFoundException`, `BadRequestException`) e o middleware global formata respostas JSON com `{ error: 'mensagem' }`.
 - O startup executa `init.sql` para garantir que o schema/BD exista; configure corretamente as credenciais no `.env` antes de rodar.

 Deploy / Docker
 - O projeto inclui um `Dockerfile`. Para construir e rodar:

    ```bash
    docker build -t market-user-service .
    docker run -p 3000:3000 --env-file .env market-user-service
    ```

 CI/CD
 - Há um workflow de exemplo em `.github/workflows/main.yml` que utiliza um reusable workflow para build/push.
 - Configure as secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_PASSWORD` para publicar imagens.

 Arquivos importantes
 - `index.js` — bootstrap e mounts (rotas + Swagger)
 - `src/routes/*` — definição de rotas
 - `src/controllers/*` — handlers HTTP
 - `src/services/*` — regras de negócio
 - `src/repositories/*` — acesso ao MySQL
 - `init.sql` — DDL do schema usado no startup