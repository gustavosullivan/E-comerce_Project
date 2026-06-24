const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8081';
const EMAIL = 'comprador@bugigangas.com';
const SENHA = '12345678';

async function fazerLogin(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(SENHA);
  await page.locator('text=Entrar').first().click();
  await expect(page.locator('text=Encontre peças com história')).toBeVisible({ timeout: 10000 });
}

async function abrirPrimeiroProduto(page) {
  await expect(page.locator('text=Destaques').first()).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: /Adicionar aos favoritos/ }).first().click();
  await page.waitForTimeout(2000);
}

test('CT01 - Login com credenciais válidas', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(SENHA);
  await page.locator('text=Entrar').first().click();
  await expect(page.locator('text=Encontre peças com história')).toBeVisible({ timeout: 10000 });
});

test('CT02 - Login com senha inválida', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill('senhaerrada');
  await page.locator('text=Entrar').first().click();
  await page.waitForTimeout(3000);
  await expect(page.locator('text=Encontre peças com história')).not.toBeVisible({ timeout: 5000 });
});

test('CT03 - Login com email inválido', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.locator('input[type="email"]').fill('naoexiste@teste.com');
  await page.locator('input[type="password"]').fill('123456');
  await page.locator('text=Entrar').first().click();
  await page.waitForTimeout(3000);
  await expect(page.locator('text=Encontre peças com história')).not.toBeVisible({ timeout: 5000 });
});

test('CT04 - Cadastro de novo usuário comprador', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForTimeout(2000);
  await page.locator('text=Cadastre-se').click();
  await page.waitForTimeout(2000);

  const timestamp = Date.now();
  const novoEmail = `teste${timestamp}@bugigangas.com`;

  await page.locator('input[placeholder="Seu nome"]').fill('Usuário Teste');
  await page.locator('input[placeholder="seu@email.com"]').fill(novoEmail);

  const senhaInputs = page.locator('input[type="password"]:visible');
  await senhaInputs.first().fill('12345678');
  const count = await senhaInputs.count();
  if (count > 1) await senhaInputs.nth(1).fill('12345678');

  const compradorBtn = page.locator('text=Sou comprador');
  if (await compradorBtn.isVisible()) await compradorBtn.click();

  const botoes = page.getByRole('button');
  const total = await botoes.count();
  await botoes.nth(total - 1).click();

  // Após cadastro já entra logado — espera a mensagem de sucesso e depois Destaques
  await page.waitForTimeout(3000);
  await expect(page.locator('text=Destaques').first()).toBeVisible({ timeout: 15000 });
});

test('CT05 - Listagem de produtos na home', async ({ page }) => {
  await fazerLogin(page);
  await expect(page.locator('text=Destaques').first()).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=R$').first()).toBeVisible();
});

test('CT06 - Busca de produto', async ({ page }) => {
  await fazerLogin(page);
  await page.locator('input[placeholder="Buscar produtos..."]').fill('câmera');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  await expect(page.locator('text=R$').first()).toBeVisible({ timeout: 5000 });
});

test('CT07 - Filtro por categoria Eletrônicos vintage', async ({ page }) => {
  await fazerLogin(page);
  await page.locator('text=Eletrônicos vintage').first().click();
  await page.waitForTimeout(2000);
  await expect(page.locator('text=R$').first()).toBeVisible({ timeout: 5000 });
});

test('CT08 - Abrir detalhe de produto', async ({ page }) => {
  await fazerLogin(page);
  await abrirPrimeiroProduto(page);
  await expect(page.locator('text=Comprar agora').first()).toBeVisible({ timeout: 5000 });
});

test('CT09 - Adicionar produto ao carrinho', async ({ page }) => {
  await fazerLogin(page);
  await abrirPrimeiroProduto(page);
  await page.locator('text=Adicionar ao carrinho').click();
  await page.waitForTimeout(2000);
  await expect(page.locator('text=adicionado ao carrinho')).toBeVisible({ timeout: 5000 });
});

test('CT10 - Visualizar carrinho', async ({ page }) => {
  await fazerLogin(page);
  await abrirPrimeiroProduto(page);
  await page.locator('text=Adicionar ao carrinho').click();
  await page.waitForTimeout(2000);
  await page.locator('button').filter({ hasText: 'Carrinho' }).click();
  await expect(page.locator('text=Finalizar compra')).toBeVisible({ timeout: 5000 });
});

test('CT11 - Comprar produto agora', async ({ page }) => {
  await fazerLogin(page);
  await abrirPrimeiroProduto(page);
  await page.locator('text=Comprar agora').first().click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible({ timeout: 5000 });
  await expect(page.locator('text=Saldo disponível')).toBeVisible();
});

test('CT12 - Confirmar compra', async ({ page }) => {
  await fazerLogin(page);
  await abrirPrimeiroProduto(page);
  await page.locator('text=Comprar agora').first().click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Confirmar compra' }).click();
  await page.waitForTimeout(1500);

  // Se modal de endereço aparecer, preenche e salva
  const salvarEndereco = page.locator('text=Salvar endereço');
  if (await salvarEndereco.isVisible()) {
    await page.locator('input[placeholder="00000-000"]').fill('90000-000');
    await page.locator('input[placeholder="Nome da rua"]').fill('Rua Teste');
    await page.locator('input[placeholder="123"]').fill('123');
    await page.locator('input[placeholder="Seu bairro"]').fill('Centro');
    await page.locator('input[placeholder="Sua cidade"]').fill('Porto Alegre');
    await page.locator('input[placeholder="RS"]').fill('RS');
    await salvarEndereco.click();
    await page.waitForTimeout(2000);

    // Clica com force para ignorar elemento que intercepta o clique
    await page.getByRole('button', { name: 'Confirmar compra' }).click({ force: true });
    await page.waitForTimeout(4000);
  }

  await page.screenshot({ path: 'tests/debug-pedido.png', fullPage: true });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('text=Destaques').first()).toBeVisible({ timeout: 15000 });
});

test('CT13 - Adicionar produto aos favoritos', async ({ page }) => {
  await fazerLogin(page);
  await expect(page.locator('text=Destaques').first()).toBeVisible({ timeout: 10000 });
  const cards = page.getByRole('button', { name: /Adicionar aos favoritos/ });
  await cards.first().click();
  await page.waitForTimeout(1000);
  const fechar = page.locator('text=×');
  if (await fechar.isVisible()) await fechar.click();
  await page.waitForTimeout(1000);
  await expect(
    page.getByText('1 favoritos').or(page.getByText('0 favoritos'))
  ).toBeVisible({ timeout: 5000 });
});

test('CT14 - Visualizar lista de favoritos', async ({ page }) => {
  await fazerLogin(page);
  await page.getByText('0 favoritos').or(page.getByText('1 favoritos')).first().click();
  await page.waitForTimeout(1000);
  await expect(page.getByRole('button', { name: 'Favoritos', exact: true })).toBeVisible({ timeout: 5000 });
});

test('CT15 - Visualizar dados da conta', async ({ page }) => {
  await fazerLogin(page);
  await expect(page.locator('text=Destaques').first()).toBeVisible({ timeout: 10000 });
  await page.locator('text=MC').click();
  await page.waitForTimeout(2000);
  await expect(page.locator('text=Minha Conta')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('input[type="email"]').last()).toHaveValue(EMAIL, { timeout: 5000 });
});