# Relatório de Avaliação do Projeto

**Disciplina:** Projeto, Design e Engenharia de Processos  
**Paradigma de Linguagem de Programação**  
**Data de Entrega:** 29/06/2026  
**Professores:** Augusto Kruger Ortolan e Luciano Rodrigo Ferretto

---

## Introdução

Este relatório detalha o trabalho desenvolvido ao longo do semestre, cujo objetivo foi a criação de um aplicativo em React Native integrado a uma API de e-commerce. A proposta do projeto foi integrar conhecimentos adquiridos em sala de aula para desenvolver uma solução prática e funcional no contexto de um e-commerce, com temas específicos definidos por cada grupo.

O propósito do relatório é centralizar todas as informações pertinentes ao projeto, oferecendo uma visão clara e abrangente de todo o processo de desenvolvimento. Além disso, busca destacar as contribuições individuais e coletivas dos membros do grupo, demonstrando a colaboração e o aprendizado conjunto.

Ao longo do documento, serão abordados aspectos técnicos e funcionais do aplicativo. Este relatório serve como um registro detalhado do projeto e como uma ferramenta de avaliação para o professor, proporcionando uma compreensão completa do trabalho realizado.

---

## 1. Nome do Aplicativo

**Bugiganga**

O nome remete ao conceito de objetos variados, peças únicas e achados especiais — como em uma feira de antiguidades ou brechó —, alinhando-se diretamente ao tema do e-commerce escolhido pelo grupo.

---

## 2. Logo do Aplicativo

A logo/ícone oficial do aplicativo está localizada em:

`FrontEnd/Bugiganga/assets/images/icon.png`

O ícone apresenta uma garrafa estilizada em tom dourado com um recorte em formato de coração no centro, sobre fundo escuro. O design transmite elegância e minimalismo, reforçando a identidade visual do aplicativo como um marketplace de peças especiais e colecionáveis.

> **Para entrega:** anexe a imagem `icon.png` (ou uma captura em alta resolução) ao documento final em PDF.

---

## 3. Integrantes do Grupo

| Nome | RA | E-mail |
|------|-----|--------|
| *(preencher)* | *(preencher)* | *(preencher)* |
| *(preencher)* | *(preencher)* | *(preencher)* |
| *(preencher)* | *(preencher)* | *(preencher)* |
| *(preencher)* | *(preencher)* | *(preencher)* |

---

## 4. Explicação do Tema do Aplicativo

### Tema escolhido

O **Bugiganga** é um marketplace mobile de **objetos vintage, antiguidades e colecionáveis**. A proposta é conectar compradores interessados em peças com história a vendedores que oferecem itens únicos — como rádios de válvulas, máquinas de escrever, câmeras antigas, decoração retrô e outros colecionáveis.

### Justificativa da escolha

O tema foi escolhido por reunir relevância cultural e potencial de mercado:

- **Sustentabilidade e consumo consciente:** a compra de peças usadas e vintage promove a reutilização e reduz o descarte de objetos com valor histórico ou estético.
- **Tendência de mercado:** plataformas como Etsy e brechós digitais demonstram demanda crescente por itens únicos, fora do padrão de grandes varejistas.
- **Diferenciação:** ao contrário de e-commerces genéricos, o Bugiganga foca em um nicho com identidade visual forte e experiência de descoberta (busca, categorias, favoritos).
- **Adequação ao escopo acadêmico:** o tema permite implementar fluxos completos de e-commerce (catálogo, carrinho, checkout, pedidos, área administrativa) com regras de negócio realistas, como gestão de estoque, perfis de comprador e vendedor, e carteira digital para pagamentos.

### Categorias de produtos

O catálogo contempla categorias como:

- Eletrônicos vintage
- Livros e papelaria
- Decoração
- Roupas e acessórios
- Colecionáveis

---

## 5. Explicação das Funcionalidades do Aplicativo

O Bugiganga possui duas áreas principais: **área do cliente (comprador)** e **área administrativa (vendedor/admin)**. A interface segue o conceito de design **vintage moderno** — nostalgia e elegância com usabilidade contemporânea, inspirado em referências como Etsy, Airbnb e Apple.

### 5.1 Autenticação

| Funcionalidade | Descrição |
|----------------|-----------|
| **Login** | Autenticação por e-mail e senha, com validação de formulário e feedback visual de erros. Suporta perfil de comprador ou vendedor na mesma conta. |
| **Cadastro** | Registro com nome, e-mail, senha e confirmação de senha. Validações via Zod garantem dados consistentes antes do envio à API. |
| **Recuperação de senha** | Tela dedicada para solicitar redefinição de senha. |
| **Sessão persistente** | Token JWT armazenado localmente; o usuário permanece autenticado entre sessões. |

### 5.2 Área do Cliente (Comprador)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Página inicial** | Exibe logo, barra de pesquisa, carrossel de banners, chips de categorias, filtros por preço e grade de produtos. Estados de carregamento (skeleton), erro e lista vazia são tratados. |
| **Detalhes do produto** | Imagem, nome, descrição, preço, badge de estoque e seletor de quantidade. Ações: "Comprar agora" (vai direto ao checkout) e "Adicionar ao carrinho". |
| **Favoritos** | Lista de produtos marcados como favoritos, com persistência local. |
| **Carrinho** | Lista de itens com quantidade ajustável, subtotal por item e total geral. Permite remover produtos e seguir para o checkout. Badge na tab bar indica quantidade de itens. |
| **Checkout** | Resumo dos produtos, endereço de entrega (cadastro obrigatório), saldo da carteira digital e confirmação da compra. Débito automático na carteira ao finalizar. |
| **Comprovante de compra** | Exibe número do pedido, data, itens, quantidades e valor total após confirmação. |
| **Histórico de pedidos** | Lista todas as compras realizadas com número, data, valor e status. |
| **Perfil / Conta** | Dados pessoais, endereço, saldo da carteira, alteração de senha, avatar e opção de sair. |
| **Configurações** | Tela auxiliar de preferências do usuário. |

### 5.3 Área Administrativa (Vendedor)

| Funcionalidade | Descrição |
|----------------|-----------|
| **Dashboard** | Visão geral da área administrativa. |
| **Listagem de produtos** | Todos os produtos cadastrados pelo vendedor, com ações de editar e excluir. |
| **Cadastro de produto** | Formulário com nome, descrição, preço, categoria, estoque e imagem (upload via galeria). |
| **Edição de produto** | Alteração de qualquer campo do produto existente. |
| **Exclusão de produto** | Remoção com modal de confirmação antes de excluir. |
| **Aba "Novo"** | Atalho na tab bar para cadastrar novo produto. |
| **Aba "Vendas"** | Acompanhamento de vendas realizadas. |

### 5.4 Usabilidade e Interface

- **Navegação por abas (tab bar)** com efeito glassmorphism, ícones Material e badges dinâmicos.
- **Navegação condicional:** compradores veem Início, Favoritos, Carrinho e Conta; vendedores veem Produtos, Novo, Vendas e Conta.
- **Feedback ao usuário:** snackbars de sucesso/erro, modais de confirmação, estados vazios ilustrados e loading skeletons.
- **Acessibilidade visual:** paleta consistente, tipografia serifada para títulos, contraste adequado e componentes reutilizáveis.
- **Responsividade:** layout adaptado com `SafeAreaView`, insets para tab bar e largura máxima de conteúdo.

### 5.5 Fluxo principal do comprador

```
Login / Registro
      ↓
Página Inicial (produtos)
      ↓
Detalhes do Produto
      ↓
Carrinho  →  Checkout  →  Comprovante
      ↓
Histórico de Pedidos
```

---

## 6. Descrição Técnica do Front-End do Aplicativo

### 6.1 Stack tecnológica

| Tecnologia | Versão / Uso |
|------------|--------------|
| **React Native** | 0.81.5 — framework mobile multiplataforma |
| **Expo** | ~54.0 — toolchain, build e APIs nativas |
| **Expo Router** | ~6.0 — roteamento file-based (equivalente ao React Navigation) |
| **TypeScript** | ~5.9 — tipagem estática em todo o projeto |
| **Axios** | ^1.16 — cliente HTTP para consumo da API REST |
| **Zustand** | ^5.0 — gerenciamento de estado global leve |
| **React Hook Form** | ^7.77 — formulários performáticos |
| **Zod** | 3.24 — validação de schemas |
| **AsyncStorage** | 2.2 — persistência local (sessão, favoritos) |
| **Expo Image / Blur / Haptics** | UI nativa, efeitos visuais e feedback tátil |

### 6.2 Arquitetura do projeto

O front-end segue o fluxo em camadas:

```
Tela (Screen)
    ↓
Hook (useAuth, useProducts, useWallet, useAddress...)
    ↓
Service (authService, productService, cartService...)
    ↓
API REST (via apiClient / Axios)
```

Essa separação desacopla a interface da origem dos dados, permitindo evolução independente das telas quando a API muda.

### 6.3 Organização de pastas

```
FrontEnd/Bugiganga/
├── app/                    # Rotas Expo Router (file-based)
│   ├── (tabs)/             # Abas principais (home, cart, profile...)
│   ├── admin/              # Área administrativa
│   ├── orders/             # Histórico e comprovante
│   ├── product/            # Detalhes do produto
│   ├── login.tsx
│   ├── register.tsx
│   └── checkout.tsx
├── assets/images/          # Ícones, splash e favicon
├── src/
│   ├── components/         # UI reutilizável (cards, forms, layout, buttons)
│   ├── config/api.ts       # URL base e endpoints
│   ├── hooks/              # Lógica reutilizável por tela
│   ├── mocks/              # Dados fictícios para desenvolvimento
│   ├── navigation/routes.ts
│   ├── providers/          # AuthProvider
│   ├── schemas/            # Validação Zod
│   ├── screens/            # Telas (Auth, Home, Checkout, Admin...)
│   ├── services/           # Camada de integração com API
│   │   ├── api/client.ts   # Axios + interceptors JWT
│   │   └── mocks/          # Implementações mock dos services
│   ├── store/              # Zustand stores (auth, cart, favorites...)
│   ├── theme/              # Cores, tipografia, espaçamentos
│   ├── types/              # Contratos TypeScript
│   ├── utils/              # Formatação, confirmações, filtros
│   └── validation/         # Schemas de formulário
└── package.json
```

### 6.4 Navegação

- **Expo Router** com roteamento baseado em arquivos na pasta `app/`.
- **Auth guard:** usuários não autenticados são redirecionados para `/login`.
- **Rotas tipadas** centralizadas em `src/navigation/routes.ts`.
- **Stacks implícitas:** auth (login/registro), cliente (tabs + modais) e admin (`/admin/*`).

### 6.5 Gerenciamento de estado

| Store (Zustand) | Responsabilidade |
|-----------------|------------------|
| `authStore` | Token JWT, usuário logado, hidratação da sessão |
| `cartStore` | Itens do carrinho, quantidades e total |
| `checkoutStore` | Itens e modo do checkout (carrinho ou compra direta) |
| `favoritesStore` | Produtos favoritados |
| `walletStore` | Saldo da carteira digital |
| `addressStore` | Endereço de entrega do comprador |
| `snackbarStore` | Mensagens globais de feedback |
| `confirmStore` | Modais de confirmação reutilizáveis |

### 6.6 Camada de serviços e integração com API

Todos os serviços (`authService`, `productService`, `orderService`, `cartService`, `userService`, `walletService`, `addressService`) encapsulam chamadas HTTP e mapeiam respostas da API para os tipos TypeScript do front-end.

**Configuração central** (`src/config/api.ts`):

- `API_BASE_URL` via variável de ambiente `EXPO_PUBLIC_API_URL` (padrão: `http://localhost:8765`).
- Endpoints mapeados para o gateway da API (`/auth/signin`, `/auth/signup`, `/products`, `/api/orders`, etc.).

**Cliente HTTP** (`src/services/api/client.ts`):

- Instância Axios com timeout de 15s.
- Interceptor que injeta `Authorization: Bearer <token>` automaticamente.
- Função `mapAxiosError` para padronizar mensagens de erro.

### 6.7 Validação e formulários

- **React Hook Form** + **Zod** (`@hookform/resolvers`) em login, registro, perfil, endereço e produtos admin.
- Schemas em `src/validation/` e `src/schemas/` garantem validação antes do envio à API.

### 6.8 Design system

- **Tema centralizado** em `src/theme/`: cores, tipografia, raios, sombras e estilos de texto reutilizáveis.
- **Paleta:** tons de índigo/roxo como primária, acentos âmbar/dourado na tab bar e cartões glass.
- **Componentes base:** `PrimaryButton`, `SecondaryButton`, `CustomInput`, `PasswordField`, `VintageCard`, `PageContainer`, `ScreenHeader`, `EmptyState`, `Loading`, `Snackbar`.
- **Efeito glassmorphism** na tab bar, cards de carrinho/favoritos e telas de login.

### 6.9 Boas práticas adotadas

1. **Separação de responsabilidades:** telas não chamam Axios diretamente; toda comunicação passa por hooks e services.
2. **Tipagem forte:** interfaces TypeScript para `Product`, `User`, `Order`, `CartItem`, `UserAddress`, etc.
3. **Componentização:** cards, formulários e layouts reutilizados em múltiplas telas.
4. **Tratamento de erros:** estados de erro nas listagens, snackbars e modais de confirmação.
5. **Estados de carregamento:** skeletons, `ActivityIndicator` e botões com estado `loading`.
6. **Contratos preparados para o backend:** mapeamento de respostas da API Spring Boot (ex.: `type: Admin | Common`, perfis `buyerProfile`/`sellerProfile`).
7. **Variáveis de ambiente:** URL da API configurável via `.env` sem alterar código.

### 6.10 Como executar o aplicativo

```bash
cd FrontEnd/Bugiganga
npm install
npx expo start
```

Configure `EXPO_PUBLIC_API_URL` no arquivo `.env` apontando para o gateway da API (ex.: `http://192.168.x.x:8765`).

---

## 7. Descrição Técnica do Back-End do Aplicativo

O back-end do **Bugiganga** foi desenvolvido como uma arquitetura de **microservices** em Java, seguindo os padrões e boas práticas abordados na disciplina. A solução expõe uma API REST centralizada por um **API Gateway**, com descoberta de serviços via **Eureka**, bancos de dados isolados por serviço (**Database per Service**) e orquestração via **Docker Compose**.

### 7.1 Visão geral da arquitetura

```
Cliente (React Native / Expo)
            ↓
    gateway-service :8765
            ↓
    discovery-service :8761 (Eureka)
            ↓
    ┌───────────┬──────────────┬──────────────┬──────────────┐
    ↓           ↓              ↓              ↓              ↓
auth-service  product-service  currency-service  order-service  config-service
  :8900         :8000            :8001             :8200          :8888
    ↓           ↓                  ↓                 ↓
 db_user     db_product        db_currency       db_order
(PostgreSQL) (PostgreSQL)      (PostgreSQL)     (PostgreSQL)
```

| Microserviço | Porta | Responsabilidade |
|--------------|-------|------------------|
| **discovery-service** | 8761 | Registro e descoberta de instâncias (Eureka Server) |
| **config-service** | 8888 | Configurações centralizadas via repositório Git |
| **gateway-service** | 8765 | Ponto único de entrada; roteamento, CORS e autenticação JWT |
| **auth-service** | 8900 | Cadastro, login e geração de tokens JWT |
| **currency-service** | 8001 | Conversão de moedas (BCB + banco local) |
| **product-service** | 8000 | Catálogo de produtos com conversão de preços |
| **order-service** | 8200 | Criação e consulta de pedidos |
| **greeting-service** | — | Serviço de saudação (código base do semestre) |

**Padrões arquiteturais aplicados:**

- **Service Registry Pattern** — Eureka centraliza o registro de todos os microserviços.
- **Self Registration Pattern** — cada serviço se registra automaticamente no discovery-service.
- **API Gateway Pattern** — o gateway-service concentra o acesso externo.
- **Server-Side Discovery Pattern** — o gateway resolve rotas via `lb://nome-do-serviço`.
- **Database per Service Pattern** — cada serviço com persistência possui banco PostgreSQL próprio.
- **Service per Container Pattern** — cada microserviço roda em container Docker isolado.
- **Externalized Configuration Pattern** — config-service busca propriedades de repositório Git remoto.
- **Service Composition** — order-service compõe dados de product-service e currency-service via Feign.
- **Resilience Patterns** — Circuit Breaker, Retry, Caching (Caffeine) e Fallback em integrações externas.

### 7.2 Tecnologias utilizadas

| Tecnologia | Versão / Uso |
|------------|--------------|
| **Java** | 21 |
| **Spring Boot** | 3.4.x – 4.0.x (varia por serviço) |
| **Spring Cloud** | 2024.x – 2025.x |
| **Spring Cloud Gateway** | Roteamento reativo no gateway-service |
| **Netflix Eureka** | Service discovery (client e server) |
| **Spring Cloud OpenFeign** | Comunicação entre microserviços |
| **Resilience4j** | Circuit Breaker, Retry e health indicators |
| **Spring Data JPA** | Persistência ORM |
| **Flyway** | Versionamento e migração de schemas |
| **PostgreSQL** | 16 — banco relacional por serviço |
| **Spring Security** | Autenticação e criptografia de senhas |
| **JJWT** | 0.13.0 — geração e validação de tokens JWT |
| **Caffeine** | Cache em memória para cotações e conversões |
| **Spring Boot Actuator** | Monitoramento (`/actuator/health`, métricas, circuit breakers) |
| **Docker / Docker Compose** | Containerização e orquestração local |
| **Maven** | Gerenciamento de dependências e build |

### 7.3 Segurança

A segurança foi implementada em camadas, combinando autenticação centralizada no gateway e autorização por perfil nos microserviços.

#### 7.3.1 Autenticação JWT

1. O **auth-service** autentica o usuário via Spring Security (`AuthenticationManager`) e gera um token JWT com a biblioteca **JJWT**.
2. O token contém os claims `id`, `email` e `type` (0 = Admin/vendedor, 1 = Common/comprador), com validade de **24 horas**.
3. O **gateway-service** intercepta todas as requisições cujo path começa com `/ws/` através do filtro global `AuthFilter`.
4. Requisições sem token válido recebem **HTTP 401 Unauthorized**.
5. Tokens válidos têm seus claims propagados como headers internos: `X-User-Id`, `X-User-Email` e `X-User-Type`.
6. Os microserviços protegidos utilizam esses headers para identificar o usuário e validar permissões (ex.: apenas `type == 0` pode criar/editar/excluir produtos).

#### 7.3.2 Criptografia e validação

| Mecanismo | Onde | Descrição |
|-----------|------|-----------|
| **BCrypt** | auth-service | Senhas armazenadas com hash via `BCryptPasswordEncoder` |
| **Validação de e-mail** | auth-service | Classe `Validator` verifica formato do e-mail no cadastro |
| **Validação de unicidade** | auth-service | Impede cadastro com e-mail duplicado |
| **Sessão stateless** | auth-service | `SessionCreationPolicy.STATELESS` — sem sessão HTTP no servidor |
| **CSRF desabilitado** | auth-service | Adequado para API REST consumida por cliente mobile |
| **CORS centralizado** | gateway-service | `CorsConfig` permite origens `localhost` com credenciais |
| **Preflight OPTIONS** | gateway-service | Requisições OPTIONS passam sem validação de JWT |

#### 7.3.3 Rotas públicas vs. protegidas

| Tipo | Prefixo / Rota | Exemplos |
|------|----------------|----------|
| **Pública** | `/auth/**`, `/products/**`, `/currency/**` | Login, cadastro, listagem de produtos, conversão de moeda |
| **Protegida (JWT)** | `/ws/**` | CRUD de produtos (admin), criação e listagem de pedidos |

### 7.4 Conexão com banco de dados

Cada microserviço com persistência utiliza **PostgreSQL 16** em container Docker separado, seguindo o padrão **Database per Service**. As conexões são configuradas via variáveis de ambiente no `docker-compose.yml` e via `application.properties` em desenvolvimento local.

| Serviço | Banco | Tabela(s) principal(is) |
|---------|-------|-------------------------|
| **auth-service** | `db_user` | `tb_user` (id, name, email, password, type) |
| **product-service** | `db_product` | `tb_product` (id, description, brand, model, currency, price, stock, image_url) |
| **currency-service** | `db_currency` | `tb_currency` (id, source_currency, target_currency, conversion_rate) |
| **order-service** | `db_order` | `tb_order`, `tb_order_item` |

**Configuração típica de conexão:**

```properties
spring.datasource.url=jdbc:postgresql://localhost/db_product
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=none
spring.flyway.locations=classpath:db_migration
```

- **Flyway** executa scripts SQL versionados (`V1__`, `V2__`, `V3__`) na inicialização de cada serviço.
- **JPA/Hibernate** mapeia entidades Java para as tabelas; `ddl-auto=none` garante que o schema é controlado exclusivamente pelo Flyway.
- No Docker Compose, cada banco possui volume persistente (`db-user-data`, `db-product-data`, etc.).

### 7.5 Principais dependências (Maven)

| Dependência | Serviços | Finalidade |
|-------------|----------|------------|
| `spring-boot-starter-web` / `webmvc` | Todos os serviços de negócio | Exposição de endpoints REST |
| `spring-cloud-starter-gateway` | gateway-service | API Gateway reativo |
| `spring-cloud-starter-netflix-eureka-client` | Todos (exceto discovery) | Auto-registro no Eureka |
| `spring-cloud-starter-netflix-eureka-server` | discovery-service | Service Registry |
| `spring-cloud-starter-openfeign` | product, currency, order | Chamadas HTTP entre serviços |
| `spring-cloud-starter-circuitbreaker-resilience4j` | product, currency | Tolerância a falhas |
| `spring-boot-starter-data-jpa` | auth, product, currency, order | Persistência ORM |
| `spring-boot-starter-security` | auth-service | Autenticação e BCrypt |
| `spring-boot-starter-actuator` | Todos | Health checks e métricas |
| `spring-boot-starter-flyway` | auth, product, currency, order | Migrações de banco |
| `postgresql` | auth, product, currency, order | Driver JDBC |
| `jjwt-api` / `jjwt-impl` / `jjwt-jackson` | auth, gateway | JWT |
| `caffeine` | product, currency | Cache em memória |
| `spring-cloud-config-server` | config-service | Configuração centralizada via Git |

### 7.6 Organização do projeto back-end

```
TrabalhoG2FinalBack/
├── discovery-service/       # Eureka Server
├── config-service/          # Spring Cloud Config Server (Git)
├── gateway-service/         # API Gateway + JWT Filter + CORS
├── auth-service/            # Autenticação e usuários
├── currency-service/        # Conversão de moedas (BCB + fallback)
├── product-service/         # Catálogo de produtos
├── order-service/           # Pedidos
├── greeting-service/        # Serviço de saudação (base)
├── configs/                 # Arquivos de configuração externa (Git)
├── docker-compose.yml       # Orquestração de containers
└── .idea/                   # Configuração IDE
```

Cada microserviço segue a estrutura padrão Spring Boot:

```
{service}/
├── src/main/java/br/edu/atitus/{service}/
│   ├── controllers/     # Endpoints REST
│   ├── services/        # Regras de negócio
│   ├── repositories/    # Acesso a dados (JPA)
│   ├── entities/        # Entidades JPA
│   ├── dtos/            # Objetos de transferência
│   ├── clients/         # Feign Clients + Fallbacks
│   ├── configs/         # Configurações (Security, Gateway, CORS)
│   └── components/      # Utilitários (JWT, Validator)
├── src/main/resources/
│   ├── application.properties
│   └── db_migration/    # Scripts Flyway
├── Dockerfile
└── pom.xml
```

### 7.7 Resiliência e integrações externas

#### currency-service → Banco Central do Brasil (BCB)

- Consome a API OData do BCB via **OpenFeign** (`BCBClient`) para obter cotações atualizadas.
- Em caso de falha, o **Fallback** (`BCBClientFallback`) retorna `null` e o serviço utiliza a taxa armazenada em `tb_currency`.
- **Cache Caffeine** (`bcb-currency`) armazena cotações por 15 segundos.
- **Retry** com backoff exponencial (até 3 tentativas) e **Circuit Breaker** Resilience4j.

#### product-service → currency-service

- Consulta conversão de preços via **Feign Client** com Load Balancing pelo Eureka.
- **Cache** de taxas convertidas (`ConvertedValue`) evita chamadas repetidas.
- **Circuit Breaker + Retry + Fallback** (`CurrencyClientFallback`) garantem disponibilidade mesmo com indisponibilidade do currency-service.

#### order-service → product-service + currency-service

- Ao criar pedido, busca dados do produto (preço, descrição) via `ProductClient`.
- Ao listar pedidos, converte valores para a moeda solicitada via `CurrencyClient`.
- Composição de serviços (**Service Composition Pattern**) sem acoplamento direto entre bancos.

### 7.8 Documentação dos endpoints

> **Base URL (Gateway):** `http://localhost:8765`  
> Endpoints protegidos exigem header `Authorization: Bearer <token>`.

---

#### 7.8.1 Autenticação (`auth-service`)

##### POST `/auth/signup` — Cadastro de usuário

Registra um novo usuário com perfil **Common** (comprador). A senha é criptografada com BCrypt antes de persistir.

```bash
curl --location 'http://localhost:8765/auth/signup' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "senha123"
}'
```

##### POST `/auth/signin` — Login

Autentica o usuário e retorna o objeto `user` junto com o `token` JWT.

```bash
curl --location 'http://localhost:8765/auth/signin' \
--header 'Content-Type: application/json' \
--data '{
  "email": "maria@email.com",
  "password": "senha123"
}'
```

**Resposta (exemplo):**

```json
{
  "user": {
    "id": 1,
    "name": "Maria Silva",
    "email": "maria@email.com",
    "type": "Common"
  },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

#### 7.8.2 Produtos — rotas públicas (`product-service`)

##### GET `/products` — Listar produtos (paginado)

Retorna página de produtos com preços convertidos para a moeda informada.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `targetCurrency` | query | Sim | Moeda de destino (ex.: `BRL`, `USD`) |
| `page` | query | Não | Número da página (padrão: 0) |
| `size` | query | Não | Itens por página (padrão: 5) |
| `sort` | query | Não | Campo de ordenação (padrão: `description`) |

```bash
curl --location 'http://localhost:8765/products?targetCurrency=BRL&page=0&size=10'
```

##### GET `/products/{id}` — Buscar produto por ID

Retorna um produto com preço convertido para a moeda informada.

```bash
curl --location 'http://localhost:8765/products/1?targetCurrency=BRL'
```

##### GET `/products/noconverter/{id}` — Buscar produto sem conversão

Retorna o produto com preço original, sem conversão de moeda. Utilizado internamente pelo order-service.

```bash
curl --location 'http://localhost:8765/products/noconverter/1'
```

---

#### 7.8.3 Produtos — rotas protegidas (`product-service`, admin)

> Requer JWT válido com `type = 0` (Admin/vendedor).

##### POST `/ws/products` — Cadastrar produto

```bash
curl --location 'http://localhost:8765/ws/products' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
  "description": "Rádio de Válvulas Philco 1950",
  "brand": "Philco",
  "model": "Vintage 1950",
  "currency": "USD",
  "price": 250.00,
  "imageURL": "https://exemplo.com/radio.jpg"
}'
```

##### PUT `/ws/products/{idProduct}` — Atualizar produto

```bash
curl --location --request PUT 'http://localhost:8765/ws/products/1' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
  "description": "Rádio de Válvulas Philco 1950 (Restaurado)",
  "brand": "Philco",
  "model": "Vintage 1950",
  "currency": "USD",
  "price": 299.00,
  "imageURL": "https://exemplo.com/radio.jpg"
}'
```

##### DELETE `/ws/products/{idProduct}` — Excluir produto

```bash
curl --location --request DELETE 'http://localhost:8765/ws/products/1' \
--header 'Authorization: Bearer <token>'
```

---

#### 7.8.4 Câmbio (`currency-service`)

##### GET `/currency/convert` — Converter moeda

Consulta taxa de conversão entre duas moedas. Prioriza cotação do BCB com cache; em falha, usa taxa do banco local.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `source` | query | Sim | Moeda de origem (ex.: `USD`) |
| `target` | query | Sim | Moeda de destino (ex.: `BRL`) |

```bash
curl --location 'http://localhost:8765/currency/convert?source=USD&target=BRL'
```

**Resposta (exemplo):**

```json
{
  "source": "USD",
  "target": "BRL",
  "conversionRate": 5.42,
  "environment": "8001 - BCB in cache"
}
```

---

#### 7.8.5 Pedidos — rotas protegidas (`order-service`)

> Requer JWT válido. O pedido é associado ao `X-User-Id` extraído do token.

##### POST `/ws/orders` — Criar pedido

Cria um pedido com itens. O serviço busca preço e dados do produto via Feign e persiste o snapshot do preço no momento da compra.

```bash
curl --location 'http://localhost:8765/ws/orders' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <token>' \
--data '{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}'
```

##### GET `/ws/orders` — Listar pedidos do usuário

Retorna pedidos paginados do usuário autenticado, com valores convertidos para a moeda informada.

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `targetCurrency` | query | Sim | Moeda para exibição dos valores (ex.: `BRL`) |
| `page` | query | Não | Número da página (padrão: 0) |
| `size` | query | Não | Itens por página (padrão: 5) |

```bash
curl --location 'http://localhost:8765/ws/orders?targetCurrency=BRL&page=0&size=10' \
--header 'Authorization: Bearer <token>'
```

---

#### 7.8.6 Monitoramento (Actuator)

Todos os microserviços expõem endpoints de saúde via Spring Boot Actuator:

```bash
curl --location 'http://localhost:8761/actuator/health'   # discovery-service
curl --location 'http://localhost:8765/actuator/health'   # gateway-service
curl --location 'http://localhost:8900/actuator/health'   # auth-service
curl --location 'http://localhost:8000/actuator/health'   # product-service
curl --location 'http://localhost:8001/actuator/health'   # currency-service
curl --location 'http://localhost:8200/actuator/health'   # order-service
```

---

### 7.9 Integração com o front-end

O aplicativo React Native consome a API exclusivamente pelo **gateway** na porta `8765`. A configuração central está em `src/config/api.ts`:

- `EXPO_PUBLIC_API_URL` → URL do gateway (padrão: `http://localhost:8765`).
- Endpoints mapeados: `/auth/signin`, `/auth/signup`, `/products`, `/products/{id}`.
- O token JWT é armazenado localmente (AsyncStorage) e injetado automaticamente pelo interceptor Axios em todas as requisições protegidas (`/ws/**`).

### 7.10 Como executar o back-end

#### Via Docker Compose (recomendado)

```bash
cd TrabalhoG2FinalBack
docker compose up --build
```

Serviços disponíveis após subir os containers:

| Serviço | URL |
|---------|-----|
| API Gateway | `http://localhost:8765` |
| Eureka Dashboard | `http://localhost:8761` |

#### Desenvolvimento local (sem Docker)

1. Subir PostgreSQL e criar os bancos: `db_user`, `db_product`, `db_currency`, `db_order`.
2. Iniciar os serviços na ordem: `discovery-service` → demais serviços → `gateway-service`.
3. Em cada serviço: `./mvnw spring-boot:run` (ou `mvnw.cmd` no Windows).

### 7.11 Boas práticas adotadas

1. **Separação por domínio:** cada microserviço possui responsabilidade única e banco isolado.
2. **Migrações versionadas:** Flyway garante reprodutibilidade do schema em qualquer ambiente.
3. **Desacoplamento via Feign:** serviços se comunicam por contratos HTTP, não por acesso direto a bancos alheios.
4. **Tolerância a falhas:** Circuit Breaker, Retry, Cache e Fallback em integrações críticas.
5. **Segurança em camadas:** JWT no gateway + validação de perfil nos controllers protegidos.
6. **Observabilidade:** Actuator com health checks integrados ao Eureka.
7. **Containerização:** Dockerfiles individuais e `docker-compose.yml` para ambiente completo.
8. **Testes automatizados:** testes unitários e de integração com JUnit, MockMvc e JaCoCo para cobertura.

---

## Materiais visuais sugeridos para anexo

Para enriquecer a entrega, recomenda-se incluir capturas de tela das seguintes telas:

1. Login e cadastro  
2. Página inicial com produtos e filtros  
3. Detalhes do produto  
4. Carrinho e checkout  
5. Comprovante / histórico de pedidos  
6. Perfil do usuário  
7. Área administrativa (listagem e formulário de produto)  
8. Logo do aplicativo (`assets/images/icon.png`)

---

## Referências de design

- Etsy — marketplace de itens únicos e handmade  
- Pinterest — descoberta visual por categorias  
- Airbnb / Apple — interfaces limpas com tipografia refinada  

---

*Relatório gerado com base no projeto Bugiganga — E-commerce de objetos vintage e colecionáveis.*
