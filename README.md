
# market-list-service

Microserviço Node.js (Express) para gerenciar listas de compras e itens.

Principais responsabilidades:
- CRUD de listas e itens
- Proteção de rotas via verificação de JWT delegada ao `auth` microservice
- Repositórios e serviços
- Documentação OpenAPI/Swagger

Rodar localmente

1. Instale dependências:

```bash
npm install
```

2. Crie um arquivo `.env` com as variáveis mínimas:

- `PORT` (opcional, padrão 3000)
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT` (opcional)
- `AUTH_SERVICE_URL` (obrigatório em runtime) — base URL do serviço de autenticação (ex: `http://localhost:3001`)

3. Inicie a aplicação:

```bash
npm start
```

A aplicação roda por padrão em `http://localhost:3000` e aplica o schema definido em `init.sql` no startup.

Testes

Execute a suíte (unit + integration):

```bash
npm test
```

Middleware de autenticação

Este serviço delega a verificação de token ao microservice de autenticação configurado em `AUTH_SERVICE_URL`.
Por padrão a chamada feita é `POST { token }` para `AUTH_VERIFY_PATH` (p.ex. `/api/auth/verify`), e espera um JSON com a carga em `payload` (ex: `{ payload: { id: 'user-id', ... } }`).

Se quiser testar localmente sem o auth real, rode um mock simples que responda `200` com `{ payload: { id: 'mock-user' } }`.

Documentação (Swagger/OpenAPI)

A documentação interativa está disponível em `http://localhost:3000/api/docs` quando o servidor está em execução.

Endpoints principais (resumo)

- POST `/api/lists` — cria uma lista (body: `{ name }`)
- GET `/api/lists` — lista todas as listas do usuário autenticado
- POST `/api/lists/:id/items` — adiciona item na lista (body: `{ product_name, quantity, unit_price }`)
- PUT `/api/lists/:id` — atualiza nome da lista
- DELETE `/api/lists/:id` — remove lista

Observações de implementação

- Rotas são protegidas pelo middleware de autenticação que espera o header `Authorization: Bearer <token>`.
- Repositórios e serviços foram refatorados para classes com injeção de dependência e exportam uma instância default para compatibilidade.
- Validações de payload usam `Joi` e erros são normalizados pelo middleware global.

Docker

```bash
docker build -t market-list-service .
docker run -p 3000:3000 --env-file .env market-list-service
```

Arquivos importantes

- `index.js` — bootstrap e mounts (rotas + Swagger)
- `src/container.js` — container leve para injeção de dependências
- `src/routes/*` — definição de rotas
- `src/controllers/*` — handlers HTTP
- `src/services/*` — regras de negócio
- `src/repositories/*` — acesso ao MySQL
- `init.sql` — DDL do schema usado no startup
