export async function mockDelay(ms = 800): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
