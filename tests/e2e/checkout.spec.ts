import { test, expect, type Page } from '@playwright/test';

async function address(page: Page) {
  await page.getByLabel('Rua / avenida', { exact: true }).fill('Rua das Flores');
  await page.getByLabel('Número', { exact: true }).fill('123');
  await page.getByLabel('Bairro', { exact: true }).fill('Centro');
  await page.getByLabel('Cidade', { exact: true }).fill('Cidade de teste');
}

async function startXis(page: Page, name = 'Xis Salada') {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Categorias do cardápio' })
    .getByRole('button', { name: 'Xis', exact: true })
    .click();
  await page.getByRole('button', { name: 'Adicionar ao pedido: ' + name, exact: true }).click();
}

test('endereço obrigatório, troco validado e pagamento sem troco residual', async ({ page }) => {
  await startXis(page);
  await page.getByLabel('Observação deste item').fill('Sem tomate');
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await page.getByRole('radio', { name: 'Dinheiro', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page.getByRole('link', { name: 'Finalizar pelo WhatsApp' })).toHaveCount(0);
  await address(page);
  await page.getByLabel('Complemento').fill('Casa B');
  await page.getByLabel('Ponto de referência').fill('Portão azul');
  await page.getByLabel('Observação do pedido').fill('Tocar a campainha');
  await page.getByLabel('Precisa de troco?').check();
  await page.getByLabel('Troco para quanto?').fill('20');
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page.getByRole('alert')).toContainText('igual ou maior');
  await page.getByLabel('Troco para quanto?').fill('50,00');
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page.locator('.cart-customer-details')).toContainText(/12,00/);
  const text = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  ).searchParams.get('text')!;
  expect(text).toContain('Sem tomate');
  expect(text).toContain('Rua das Flores, 123');
  expect(text).toContain('Casa B');
  expect(text).toContain('Portão azul');
  expect(text).toContain('Tocar a campainha');
  expect(text).toMatch(/Total: R\$\s*38,00/);
  expect(text).toMatch(/Troco previsto: R\$\s*12,00/);
  await page.getByRole('button', { name: 'Editar pedido', exact: true }).click();
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  const pixText = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  ).searchParams.get('text')!;
  expect(pixText).not.toContain('Troco');
});

test('editar pizza preserva entrega, sabores e bebidas; cancelar não altera o item', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar ao pedido: Calabresa', exact: true }).click();
  await page.getByRole('dialog').getByText('Média', { exact: true }).click();
  await page
    .locator('.flavor')
    .filter({ has: page.getByText('Americana', { exact: true }) })
    .getByRole('checkbox')
    .check();
  await page.getByLabel('3. Borda (opcional)').selectOption('Catupiry');
  await page.getByLabel('Observação deste item').fill('Pouca cebola');
  await page.locator('.drink-extras summary').click();
  await page
    .locator('.drink-option')
    .filter({ hasText: 'Coca-Cola 2 L' })
    .getByRole('checkbox')
    .check();
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await page.getByLabel('Seu nome').fill('Victor');
  await address(page);
  await page.getByRole('radio', { name: 'Cartão', exact: true }).check();
  await page.getByRole('button', { name: 'Editar Pizza', exact: true }).click();
  await expect(page.getByLabel('Observação deste item')).toHaveValue('Pouca cebola');
  await expect(page.locator('.flavor input:checked')).toHaveCount(2);
  await expect(page.getByLabel('3. Borda (opcional)')).toHaveValue('Catupiry');
  await expect(page.locator('.drink-extras')).toHaveCount(0);
  await page.getByRole('dialog').getByText('Grande', { exact: true }).click();
  await page.getByRole('button', { name: 'Aumentar quantidade de Calabresa', exact: true }).click();
  await page.getByLabel('Observação deste item').fill('Sem cebola');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('.cart-total')).toContainText(/185,00/);
  await expect(page.getByLabel('Seu nome')).toHaveValue('Victor');
  await expect(page.getByLabel('Rua / avenida', { exact: true })).toHaveValue('Rua das Flores');
  await expect(page.getByRole('radio', { name: 'Cartão', exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Editar Pizza', exact: true }).click();
  await page.getByRole('dialog').getByText('Broto', { exact: true }).click();
  await page.getByRole('button', { name: 'Cancelar edição' }).click();
  await expect(page.locator('.cart-total')).toContainText(/185,00/);
  await page.getByRole('button', { name: 'Editar Coca-Cola 2 L', exact: true }).click();
  await page
    .getByRole('button', { name: 'Aumentar quantidade de Coca-Cola 2 L', exact: true })
    .click();
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('.cart-total')).toContainText(/200,00/);
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  const text = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  ).searchParams.get('text')!;
  expect(text).toContain('2x Pizza · Grande');
  expect(text).toContain('2x Coca-Cola 2 L');
  expect(text).toContain('Sem cebola');
});

test('itens iguais podem ser editados separadamente e Xis restaura a versão', async ({ page }) => {
  await startXis(page);
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar ao pedido: Xis Salada', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await page.getByRole('button', { name: 'Editar Xis Salada', exact: true }).first().click();
  await page.getByText('Calota', { exact: true }).click();
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.cart-item').first()).toContainText('Calota');
  await expect(page.locator('.cart-item').last()).toContainText('Regular');
  await expect(page.locator('.cart-total')).toContainText(/106,00/);
  await page.getByRole('button', { name: 'Editar Xis Salada', exact: true }).first().click();
  await expect(page.getByRole('radio').last()).toBeChecked();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: 'Seu pedido', exact: true })).toBeVisible();
});

test('editar calzone conserva preço próprio, sabores e layout em 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Calzones', exact: true }).click();
  await page
    .getByRole('button', { name: 'Adicionar ao pedido: Calzone Abobrinha', exact: true })
    .click();
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await page.getByRole('button', { name: 'Editar Calzone', exact: true }).click();
  await page.getByRole('dialog').getByText('Grande', { exact: true }).click();
  await page
    .locator('.flavor')
    .filter({ has: page.getByText('Americana', { exact: true }) })
    .getByRole('checkbox')
    .check();
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.locator('.cart-total')).toContainText(/70,00/);
  await address(page);
  expect(
    await page
      .getByRole('dialog')
      .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBeTruthy();
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page.locator('.cart-item')).toContainText('Abobrinha / Americana');
});
