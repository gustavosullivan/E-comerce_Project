# Complemento para o AGENTS.md

## Arquitetura Geral do Projeto

O projeto Bugiganga será dividido em duas grandes camadas:

### Front-End Mobile

Responsabilidade da equipe Front-End.

Tecnologias:

* React Native
* TypeScript
* React Navigation
* Axios
* React Hook Form
* Zod
* Context API, Zustand ou Redux Toolkit

Objetivo:

Construir toda a interface do aplicativo de forma desacoplada do backend, utilizando contratos de API bem definidos para facilitar a integração futura.

---

### Back-End

Responsabilidade da equipe Backend.

Tecnologias previstas:

* Java
* Spring Boot
* Spring Security
* JWT
* JPA/Hibernate
* PostgreSQL
* APIs REST

O backend será responsável por:

* Autenticação
* Cadastro de usuários
* Produtos
* Categorias
* Carrinho
* Pedidos
* Pagamentos
* Histórico de compras
* Administração

---

# Objetivo Principal do Front-End

O objetivo da equipe Front-End é entregar um aplicativo completamente funcional visualmente, organizado e preparado para integração.

O aplicativo deve estar em estado de produção antes mesmo da conclusão do backend.

Isso significa que:

* Todas as telas devem existir.
* Todos os fluxos devem funcionar.
* Todas as validações devem existir.
* Todas as navegações devem estar prontas.
* Os estados de carregamento devem estar implementados.
* Os estados de erro devem estar implementados.
* Os componentes devem ser reutilizáveis.

Inicialmente podem ser utilizados:

* Dados mockados
* JSON local
* Mock Service Layer
* Serviços simulados

Até que as APIs do backend estejam disponíveis.

---

# Regra de Desenvolvimento

Sempre desenvolver o Front-End pensando em consumo futuro de APIs REST desenvolvidas em Java Spring Boot.

Nunca acoplar a interface a dados fixos.

Criar sempre uma camada de abstração:

src/services/

Exemplo:

services/
??? authService.ts
??? productService.ts
??? cartService.ts
??? orderService.ts
??? userService.ts

Mesmo durante a fase de mock.

Isso permitirá trocar facilmente os dados mockados pelas APIs reais do Spring Boot.

---

# Contratos de API

Sempre que possível, gerar interfaces TypeScript para representar os contratos esperados do backend.

Exemplo:

```ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}
```

O agente deve sugerir contratos compatíveis com Java Spring Boot sempre que criar novas funcionalidades.

---

# Integração Front-End + Backend

Ao criar qualquer funcionalidade, considerar:

* Requisições GET
* Requisições POST
* Requisições PUT
* Requisições DELETE

Criar serviços preparados para consumir APIs REST.

Exemplo:

```ts
/api/auth/login
/api/auth/register

/api/products
/api/products/{id}

/api/cart

/api/orders
```

---

# Organização para Integração

Toda comunicação externa deve passar pela camada de serviços.

Exemplo:

```txt
Screen
 ?
Hook
 ?
Service
 ?
API
```

Evitar chamadas Axios diretamente dentro das telas.

---

# Mocks Obrigatórios

Enquanto o backend não estiver pronto:

* Criar mocks realistas.
* Simular loading.
* Simular erros.
* Simular autenticação.
* Simular produtos.
* Simular carrinho.

Objetivo:

Quando o backend ficar pronto, a troca deve exigir o mínimo de alterações possível.

---

# Qualidade Esperada

O código produzido deve ser equivalente ao padrão utilizado em empresas como:

* Mercado Livre
* Amazon
* Shopee
* Magalu
* Nubank
* iFood

Priorizando:

* Escalabilidade
* Legibilidade
* Organização
* Performance
* Reutilização
* Manutenção

---

# Mentalidade do Agente

Ao responder qualquer solicitação relacionada ao projeto Bugiganga:

Pensar como:

* Desenvolvedor React Native Sênior
* Arquiteto Front-End
* Especialista em E-commerce
* Especialista em UX Mobile
* Especialista em Integração com APIs Java Spring Boot

Sempre buscar soluções que facilitem o trabalho da equipe Backend e acelerem a integração entre React Native e Spring Boot.

O objetivo final é entregar um Front-End profissional, organizado e pronto para consumir as APIs do backend com o menor retrabalho possível.

---

# Implementação no repositório (Bugigangas)

Este app segue o fluxo **Screen ? Hook ? Service ? API**.

## Estrutura atual

```txt
FrontEnd/Bugiganga/
??? app/
??? components/
??? src/
?   ??? config/api.ts       # USE_MOCK, base URL, endpoints
?   ??? types/              # Contratos TypeScript
?   ??? schemas/            # Validação Zod
?   ??? services/           # auth, product, cart, order, user
?   ??? hooks/useAuth.ts
?   ??? stores/authStore.ts
```

## Integração com backend

1. Defina `EXPO_PUBLIC_API_URL` (ex.: `http://192.168.x.x:8080`)
2. Em `src/config/api.ts`, altere `USE_MOCK` para `false`
3. Os services passam a usar REST sem alterar as telas

## Credenciais mock (desenvolvimento)

- Login: `demo`
- Senha: `123456`
