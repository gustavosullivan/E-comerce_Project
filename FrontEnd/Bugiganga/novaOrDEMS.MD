# TAREFA: IMPLEMENTAR O FLUXO COMPLETO DO E-COMMERCE BUGIGANGA

## CONTEXTO

Você é um Desenvolvedor React Native Sênior especializado em E-commerce, Arquitetura Front-End e UX/UI.

Está trabalhando no projeto acadêmico chamado:

BUGIGANGA

O backend será desenvolvido futuramente utilizando:

* Java
* Spring Boot
* PostgreSQL

Neste momento o objetivo é construir toda a estrutura Front-End utilizando dados mockados.

O sistema deve ser desenvolvido pensando na futura integração com APIs REST.

---

# IMPORTANTE

As funcionalidades abaixo são obrigatórias para atender aos requisitos do projeto.

O aplicativo deve possuir duas áreas:

1. Área do Cliente
2. Área Administrativa

---

# ÁREA DO CLIENTE

O fluxo do usuário deve ser:

Login / Registro
↓
Lista de Produtos
↓
Carrinho
↓
Checkout
↓
Comprovante de Compra
↓
Histórico de Compras

---

# TELA DE LOGIN

Campos:

* Email
* Senha

Botões:

* Entrar
* Criar Conta

Ao clicar em Entrar:

Redirecionar para Home.

Ao clicar em Criar Conta:

Abrir tela de registro.

---

# TELA DE REGISTRO

Campos:

* Nome
* Email
* Senha
* Confirmar Senha

O nome informado será utilizado no perfil do usuário.

Após registro:

Redirecionar para Home.

---

# HOME / LISTA DE PRODUTOS

Exibir:

* Logo Bugiganga
* Campo de pesquisa
* Lista de produtos

Cada produto deve exibir:

* Imagem
* Nome
* Preço

Ao clicar em um produto:

Abrir detalhes do produto.

---

# DETALHES DO PRODUTO

Exibir:

* Imagem
* Nome
* Descrição
* Preço

Controle:

[-] Quantidade [+]

Botões:

* Comprar Agora
* Adicionar ao Carrinho

Botão X para fechar.

---

# COMPRAR AGORA

Ao clicar:

Ir diretamente para Checkout.

Utilizar apenas o produto selecionado.

---

# ADICIONAR AO CARRINHO

Adicionar produto ao carrinho.

Após adicionar:

Retornar para Home.

---

# CARRINHO

Exibir:

* Produtos
* Quantidade
* Preço unitário
* Subtotal
* Total

Permitir:

* Aumentar quantidade
* Diminuir quantidade
* Remover produto

Botão:

Finalizar Compra

---

# CHECKOUT

Exibir:

* Produtos
* Quantidades
* Total da compra

Botão:

Confirmar Compra

Ao confirmar:

Gerar comprovante.

---

# COMPROVANTE DE COMPRA

Exibir:

* Número do pedido
* Data
* Produtos
* Quantidades
* Valor total

Botão:

Voltar para Home

---

# HISTÓRICO DE COMPRAS

Exibir todas as compras realizadas.

Cada compra deve mostrar:

* Número do pedido
* Data
* Valor
* Status

---

# PERFIL DO USUÁRIO

Exibir:

* Nome
* Email

Opções:

* Histórico de Compras
* Configurações

Botão:

Sair

Ao clicar:

Retornar para Login.

---

# ÁREA ADMINISTRATIVA

Criar uma área exclusiva para administradores.

O usuário administrador deve possuir acesso separado.

Role:

admin

---

# CRUD DE PRODUTOS

O administrador deve conseguir:

## Cadastrar Produto

Campos:

* Nome
* Descrição
* Preço
* Categoria
* Estoque
* URL da imagem

Botão:

Salvar

---

## Editar Produto

Permitir alterar qualquer informação.

---

## Excluir Produto

Permitir remoção de produtos.

Exibir confirmação antes de excluir.

---

## Listar Produtos

Exibir todos os produtos cadastrados.

Permitir:

* Editar
* Excluir

---

# ESTRUTURA DE NAVEGAÇÃO

Criar:

Auth Stack

* Login
* Registro

Client Stack

* Home
* Produto
* Carrinho
* Checkout
* Comprovante
* Histórico
* Perfil

Admin Stack

* Dashboard
* Lista de Produtos
* Criar Produto
* Editar Produto

---

# DADOS MOCKADOS

Criar:

* Usuário comum
* Usuário administrador
* Produtos fictícios
* Pedidos fictícios

Exemplo:

Usuário comum:

email: [cliente@bugiganga.com](mailto:cliente@bugiganga.com)
senha: 123456

Administrador:

email: [admin@bugiganga.com](mailto:admin@bugiganga.com)
senha: admin123

---

# DESIGN

IMPORTANTE:

O visual deve seguir o conceito:

Vintage Moderno

Não criar interfaces com aparência ultrapassada.

Referências:

* Etsy
* Pinterest
* Airbnb
* Apple

Misturar:

* Nostalgia
* Elegância
* Design moderno

O Bugiganga deve parecer um aplicativo premium inspirado em lojas de antiguidades e objetos raros.

Nunca criar aparência de sistema antigo ou ERP.

---

# QUALIDADE DE CÓDIGO

Utilizar:

* React Native
* TypeScript
* React Navigation
* React Hook Form
* Zod
* Axios
* Context API ou Zustand

Seguir:

* Clean Code
* SOLID
* Componentização
* Responsividade
* Reutilização

Evitar:

* any
* código duplicado
* lógica diretamente nas telas

---

# RESULTADO ESPERADO

Gerar toda a estrutura necessária para que o Front-End do Bugiganga funcione completamente utilizando mocks e esteja preparado para futura integração com Java Spring Boot.
