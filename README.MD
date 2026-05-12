# Marketplace Application (Full Stack)

## Sobre o Projeto

Este projeto consiste no desenvolvimento de uma aplicação completa de marketplace, contemplando front-end e back-end. O objetivo é simular um ambiente real de e-commerce, onde usuários podem se cadastrar, autenticar e gerenciar produtos dentro de uma plataforma integrada.

A aplicação está sendo desenvolvida com foco em escalabilidade, organização de código e aplicação de boas práticas de desenvolvimento.

---

## Arquitetura

O sistema é dividido em duas camadas principais:

* Front-end: responsável pela interface do usuário, navegação e interação
* Back-end: responsável pelas regras de negócio, processamento de dados e exposição de APIs

A comunicação entre essas camadas é feita por meio de APIs REST.

---

## Tecnologias Utilizadas

### Front-end

* React Native
* Expo
* React Navigation
* Axios
* Context API (gerenciamento de estado)
* React Hook Form
* Styled Components
* AsyncStorage
* React Native Vector Icons

### Back-end

* Spring Boot
* Java
* APIs REST
* PostgreSQL
* pgAdmin (gerenciamento do banco de dados)

---

## Funcionalidades

* Cadastro e autenticação de usuários
* Cadastro e gerenciamento de produtos
* Listagem e visualização de produtos
* Sistema de busca e filtragem
* Integração entre front-end e back-end via API
* Persistência de sessão do usuário

---

## Estrutura do Projeto

```bash
frontend/
 ├── src/
 │    ├── screens/
 │    ├── components/
 │    ├── services/
 │    ├── navigation/
 │    └── context/

backend/
 ├── src/
 │    ├── controllers/
 │    ├── services/
 │    ├── repositories/
 │    └── models/
```

---

## Como Executar o Projeto

### Front-end

```bash
npx create-expo-app frontend
cd frontend
npm install
npm start
```

### Back-end

Pré-requisitos:

* Java instalado
* PostgreSQL configurado

Execução:

```bash
./mvnw spring-boot:run
```

---

## Status do Projeto

Em desenvolvimento (fase inicial)

---

## Objetivo

Aplicar na prática conceitos de desenvolvimento full stack, integrando um front-end mobile com um back-end robusto, simulando um ambiente real de produção.

---

## Melhorias Futuras

* Integração com sistema de pagamentos
* Sistema de avaliações de produtos
* Deploy em ambiente de produção
* Melhorias de segurança
* Otimização de performance

---

## Autor

Projeto desenvolvido para fins acadêmicos.
