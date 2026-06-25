# Banco de dados e Docker — API Bugiganga

## Resumo

Voce **nao cria tabelas manualmente**. So precisa:

1. Subir o PostgreSQL (Docker)
2. Subir os microservicos Java

O **Flyway** cria as tabelas e insere os dados iniciais automaticamente.

---

## Para outro integrante do grupo

O container em si nao precisa ser enviado. O que precisa estar no Git sao estes arquivos:

```text
api E-comerce/docker/docker-compose.yml
api E-comerce/docker/init-databases.sql
api E-comerce/scripts/start-database.ps1
api E-comerce/scripts/stop-database.ps1
api E-comerce/README-DATABASE.md
```

No computador dele:

1. Instalar e abrir o **Docker Desktop**
2. Rodar `git pull`
3. Subir o banco com Docker
4. Subir os microservicos Java

---

## Opcao 1 — Docker (recomendado)

### Subir o banco

```powershell
cd "api E-comerce"
.\scripts\start-database.ps1
```

Se o PowerShell bloquear o script:

```powershell
cd "api E-comerce"
powershell -ExecutionPolicy Bypass -File .\scripts\start-database.ps1
```

Ou manualmente:

```powershell
cd "api E-comerce\docker"
docker compose up -d
```

### Parar o banco

```powershell
.\scripts\stop-database.ps1
```

### Credenciais

| Campo | Valor |
|-------|-------|
| Host | `localhost:55432` |
| Usuario | `postgres` |
| Senha | `123` |
| Bancos | `db_user`, `db_product`, `db_currency`, `db_order` |

> A porta externa e `55432` porque a `5432` pode estar ocupada por outro PostgreSQL instalado no Windows.

---

## Opcao 2 — PostgreSQL ja instalado (sem Docker)

No pgAdmin ou psql:

```sql
CREATE DATABASE db_user;
CREATE DATABASE db_product;
CREATE DATABASE db_currency;
CREATE DATABASE db_order;
```

Use usuario `postgres` e senha `123` (ou altere nos `application.properties` de cada servico).

Se usar PostgreSQL local na porta `5432`, ajuste os `application.properties` de:

```text
api/auth-service/src/main/resources/application.properties
api/product-service/src/main/resources/application.properties
api/currency-service/src/main/resources/application.properties
```

Troque `127.0.0.1:55432` por `localhost:5432`.

---

## Depois do banco: subir os servicos

Abra **um terminal para cada servico** e rode na ordem:

### 1. Discovery

```powershell
cd "api E-comerce\api\discovery-service"
.\mvnw.cmd spring-boot:run
```

### 2. Config

```powershell
cd "api E-comerce\api\config-service"
.\mvnw.cmd spring-boot:run
```

### 3. Auth

```powershell
cd "api E-comerce\api\auth-service"
.\mvnw.cmd spring-boot:run
```

### 4. Product

```powershell
cd "api E-comerce\api\product-service"
.\mvnw.cmd spring-boot:run
```

### 5. Currency

```powershell
cd "api E-comerce\api\currency-service"
.\mvnw.cmd spring-boot:run
```

### 6. Gateway

```powershell
cd "api E-comerce\api\gateway-service"
.\mvnw.cmd spring-boot:run
```

Resumo das portas:

1. `discovery-service` — porta **8761**
2. `config-service` — porta **8888** (precisa de internet/GitHub para configs)
3. `auth-service` — porta **8900** → cria `tb_user`
4. `product-service` — porta **8000** → cria `tb_product`
5. `currency-service` — porta **8001** → cria `tb_currency`
6. `gateway-service` — porta **8765** (entrada da API)

---

## O que o Flyway cria

| Servico | Tabela | Dados iniciais |
|---------|--------|----------------|
| auth-service | `tb_user` | admin `admin@admin.dev` |
| product-service | `tb_product` | 12 smartphones |
| currency-service | `tb_currency` | taxas USD → BRL, EUR, etc. |

> `db_order` ja e criado pelo Docker para preparar a futura API de pedidos. Hoje ainda nao existe `order-service` neste backend.

---

## Conferir se funcionou

Pelo Docker:

```powershell
docker ps
```

Deve aparecer:

```text
bugiganga-postgres
```

Para conferir bancos:

```powershell
docker exec bugiganga-postgres psql -U postgres -c "\l"
```

Para conferir tabelas:

```sql
\c db_user
SELECT id, name, email FROM tb_user;

\c db_product
SELECT id, brand, model, price FROM tb_product LIMIT 5;

\c db_currency
SELECT * FROM tb_currency LIMIT 5;
```

---

## Gateway (testar API)

Com tudo rodando:

- Login: `POST http://localhost:8765/auth/signin`
- Produto: `GET http://localhost:8765/products/1?targetCurrency=BRL`

Exemplo rapido no navegador:

```text
http://localhost:8765/products/1?targetCurrency=BRL
```

Se retornar um JSON do produto, a API esta funcionando.
