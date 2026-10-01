import { test, expect } from '@playwright/test';
for (const width of [320, 375, 390, 414, 768, 1366, 1920])
  test('layout e montagem em ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Seu próximo pedido começa aqui.',
    );
    await expect(page.locator('.brand-image').first()).toBeVisible();
    expect(
      await page
        .locator('.brand-image')
        .first()
        .evaluate((el: HTMLImageElement) => el.naturalWidth),
    ).toBeGreaterThan(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBeTruthy();
    await page.getByRole('button', { name: 'Adicionar ao pedido: Abobrinha', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
    await dialog.getByText('Família', { exact: true }).click();
    for (const name of ['Alho e óleo', 'Atum', 'Bacon'])
      await dialog
        .locator('.flavor')
        .filter({ has: page.getByText(name, { exact: true }) })
        .getByRole('checkbox')
        .check();
    await expect(
      dialog
        .locator('.flavor')
        .filter({ has: page.getByText('Milho', { exact: true }) })
        .getByRole('checkbox'),
    ).toBeDisabled();
    await dialog.getByText('Broto', { exact: true }).click();
    await expect(dialog.getByRole('checkbox', { checked: true })).toHaveCount(1);
    await dialog.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
    await page.locator('.cart-trigger').click();
    await expect(page.getByRole('dialog')).toContainText('Abobrinha');
    await page.getByRole('radio', { name: 'Pix', exact: true }).check();
    await page.getByRole('button', { name: 'Revisar pedido' }).click();
    const link = page.getByRole('link', { name: 'Finalizar pelo WhatsApp' });
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.hostname).toBe('wa.me');
    expect(url.pathname).toBe('/5555935052865');
    expect(url.searchParams.get('text')).toMatch(/Total: R\$\s*50,00/);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
test('busca global sem acentos e bordas', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox', { name: 'Buscar produto por nome' }).fill('BROCOLIS');
  await expect(page.locator('.product-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Bordas', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(8);
  await expect(page.getByRole('button', { name: 'Adicionar ao pedido: Catupiry' })).toHaveCount(0);
  await expect(page.locator('.cart-trigger .count')).toHaveText('0');
  await page.getByRole('button', { name: 'Escolher pizza para Catupiry' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'Categorias do cardápio' })
      .getByRole('button', { name: 'Pizzas tradicionais' }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Adicionar ao pedido: Calabresa', exact: true }).click();
  await page.getByLabel('3. Borda (opcional)').selectOption('Catupiry');
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await expect(page.getByRole('dialog')).toContainText('Borda: Catupiry');
  await expect(page.locator('.cart-total')).toContainText(/56,00/);
});
test('quantidade, total conhecido, revisão, remoção e Xis Salada confirmado', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Categorias do cardápio' })
    .getByRole('button', { name: 'Xis', exact: true })
    .click();
  await page.getByRole('button', { name: 'Adicionar ao pedido: Xis Bacon', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await page.getByRole('button', { name: 'Aumentar quantidade de Xis Bacon' }).click();
  await expect(page.locator('.cart-total')).toContainText(/82,00/);
  await page.getByLabel('Seu nome').fill('José & Ana');
  await page.getByLabel('Observação do pedido').fill('Sem cebola');
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  const url = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  );
  expect(url.searchParams.get('text')).toContain('2x Xis Bacon');
  expect(url.searchParams.get('text')).toContain('José & Ana');
  expect(url.searchParams.get('text')).toContain('Sem cebola');
  await page.getByRole('button', { name: 'Editar pedido' }).click();
  await page.getByRole('button', { name: 'Remover Xis Bacon' }).click();
  await expect(page.getByRole('dialog')).toContainText('O pedido começa no cardápio');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Adicionar ao pedido: Xis Salada', exact: true }).click();
  await expect(page.locator('.price-summary')).toContainText(/28,00/);
  await page.getByText('Calota', { exact: true }).last().click();
  await expect(page.locator('.price-summary')).toContainText(/68,00/);
});
test('calzone com dois sabores e preço exato', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Calzones', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(80);
  await page
    .getByRole('button', { name: 'Adicionar ao pedido: Calzone Abobrinha', exact: true })
    .click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('Grande', { exact: true }).click();
  await dialog
    .locator('.flavor')
    .filter({ has: page.getByText('Carne com cheddar', { exact: true }) })
    .getByRole('checkbox')
    .check();
  await expect(dialog.locator('.price-summary')).toContainText(/60,00/);
  await dialog.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await expect(page.locator('.cart-total')).toContainText(/70,00/);
});
test('capturas e ausência de erros de JavaScript', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto('/');
  await expect(page.locator('.hero-showcase')).toHaveCSS('opacity', '1');
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: false });
  expect(errors).toEqual([]);
});
test('pagamento selecionado permanece na revisão e no WhatsApp', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: 'Categorias do cardápio' })
    .getByRole('button', { name: 'Xis', exact: true })
    .click();
  await page.getByRole('button', { name: 'Adicionar ao pedido: Xis Bacon', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await expect(page.getByText('Combinar no WhatsApp', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('radio', { name: 'Pix' })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Revisar pedido' })).toBeDisabled();
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await expect(page.getByRole('button', { name: 'Revisar pedido' })).toBeEnabled();
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  await expect(page.locator('.payment-review')).toContainText('Pix');
  const url = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  );
  expect(url.searchParams.get('text')).toContain('Preferência de pagamento: Pix');
  await page.getByRole('button', { name: 'Editar pedido' }).click();
  await expect(page.getByRole('radio', { name: 'Pix', exact: true })).toBeChecked();
});
test('pizza com borda e bebidas soma sem multiplicar bebidas pela quantidade de pizzas', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar ao pedido: Calabresa', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('Média', { exact: true }).click();
  await dialog.getByLabel('3. Borda (opcional)').selectOption('Catupiry');
  await dialog
    .getByRole('button', { name: 'Aumentar quantidade de Calabresa', exact: true })
    .click();
  await dialog.locator('.drink-extras summary').click();
  await dialog
    .locator('.drink-option')
    .filter({ hasText: 'Coca-Cola 2 L' })
    .getByRole('checkbox')
    .check();
  await dialog
    .getByRole('button', { name: 'Aumentar quantidade de Coca-Cola 2 L', exact: true })
    .click();
  await expect(dialog.locator('.price-summary')).toContainText(/146,00/);
  await dialog.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await expect(page.locator('.cart-total')).toContainText(/156,00/);
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  const url = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  );
  const text = url.searchParams.get('text')!;
  expect(text).toContain('2x Pizza');
  expect(text).toContain('2x Coca-Cola 2 L');
  expect(text).toMatch(/Borda: Catupiry — R\$\s*8,00/);
  expect(text).toMatch(/Total: R\$\s*156,00/);
});
test('bebida pode ser comprada individualmente e Avelã tem adicional confirmado', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Bebidas', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(9);
  await page.getByRole('button', { name: 'Adicionar ao pedido: Charrua 2 L', exact: true }).click();
  await expect(page.locator('.price-summary')).toContainText(/13,00/);
  await page.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.getByRole('button', { name: 'Pizzas tradicionais', exact: true }).click();
  await page.getByRole('button', { name: 'Adicionar ao pedido: Calabresa', exact: true }).click();
  await page.getByLabel('3. Borda (opcional)').selectOption('Avelã');
  await expect(page.locator('.price-summary')).toContainText(/46,00/);
});
test('Família metade Calabresa metade Americana cobra maior sabor, borda e bebida', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Adicionar ao pedido: Calabresa', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByText('Família', { exact: true }).click();
  await dialog
    .locator('.flavor')
    .filter({ has: page.getByText('Americana', { exact: true }) })
    .getByRole('checkbox')
    .check();
  await expect(dialog.locator('.price-summary')).toContainText(/80,00/);
  await dialog.getByLabel('3. Borda (opcional)').selectOption('Chocolate preto');
  await expect(dialog.locator('.price-summary')).toContainText(/95,00/);
  await dialog.locator('.drink-extras summary').click();
  await dialog
    .locator('.drink-option')
    .filter({ hasText: 'Charrua 2 L' })
    .getByRole('checkbox')
    .check();
  await expect(dialog.locator('.price-summary')).toContainText(/108,00/);
  await dialog.getByRole('button', { name: 'Adicionar ao pedido', exact: true }).click();
  await page.locator('.cart-trigger').click();
  await expect(page.locator('.cart-total')).toContainText(/118,00/);
  await page.getByRole('radio', { name: 'Pix', exact: true }).check();
  await page.getByRole('button', { name: 'Revisar pedido' }).click();
  const url = new URL(
    (await page.getByRole('link', { name: 'Finalizar pelo WhatsApp' }).getAttribute('href'))!,
  );
  expect(url.searchParams.get('text')).toContain('2 partes iguais');
  expect(url.searchParams.get('text')).toMatch(/Total: R\$\s*118,00/);
});
test('vitrine interativa abre produtos reais e navega para a categoria', async ({ page }) => {
  await page.goto('/');
  const showcase = page.locator('.hero-showcase');
  await expect(showcase).toContainText('Calabresa');
  await showcase.getByRole('button', { name: 'Premium', exact: true }).click();
  await expect(showcase).toContainText('Americana');
  await expect(showcase.getByRole('button', { name: 'Premium', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await showcase.getByRole('button', { name: 'Montar pedido: Americana' }).click();
  await expect(page.getByRole('dialog')).toContainText('Americana');
  await page.keyboard.press('Escape');
  await showcase.getByRole('button', { name: 'Ver pizzas premium', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Pizzas Premium', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('#cardapio')).toBeInViewport();
});
test('vitrine respeita movimento reduzido e pode ser usada pelo teclado', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.showcase-brand')).toHaveCSS('animation-name', 'none');
  const premium = page
    .getByRole('group', { name: 'Explorar categorias' })
    .getByRole('button', { name: 'Premium' });
  await premium.focus();
  await page.keyboard.press('Enter');
  await expect(premium).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.hero-showcase')).toContainText('Americana');
});
