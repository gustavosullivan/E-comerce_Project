export class InsufficientBalanceError extends Error {
  constructor() {
    super('Sem saldo suficiente para realizar compra');
    this.name = 'InsufficientBalanceError';
  }
}

export interface WalletBalance {
  userId: number;
  balance: number;
  currency: 'BRL';
  updatedAt: string;
}
