import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { RandomGenerator, SeededRandom } from '../common/random';

// Types
interface Agent {
  private rng: RandomGenerator;

  constructor(seed?: string) {
    this.rng = seed ? new SeededRandom(seed) : new SeededRandom(Date.now().toString());
  }

  generateAgent(): Agent {
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    return {
      id: this.rng.randomUUID ? this.rng.randomUUID() : randomUUID(),
      name: `${this.rng.pick(firstNames)} ${this.rng.pick(lastNames)}-${Math.floor(this.rng.random() * 1000)}`,
      capabilities: this.rng.pickSubset(['payments', 'trading', 'analytics', 'messaging', 'storage']),
      createdAt: new Date(Date.now() - Math.floor(this.rng.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
    };
  generateTransaction(): Transaction {
    return {
      id: randomUUID(),
      amount: Math.round(this.rng.random() * 100000) / 100,
      currency: this.rng.pick(['USD', 'EUR', 'GBP', 'JPY', 'BTC', 'ETH']),
      status: this.rng.pick(['pending', 'completed', 'failed', 'cancelled']),
      timestamp: new Date(Date.now() - Math.floor(this.rng.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  generateWallet(): Wallet {
    return {
      id: randomUUID(),
      address: `G${this.rng.random().toString(36).substring(2, 15)}`,
      network: this.rng.pick(['stellar', 'ethereum', 'bitcoin', 'solana']),
      balance: Math.round(this.rng.random() * 1000000) / 100,
      createdAt: new Date(Date.now() - Math.floor(this.rng.random() * 365 * 24 * 60 * 60 * 1000)).toISOString(),
  }
}

// Re-export for backwards compatibility
export { SeededRandom } from '../common/random';
export type { RandomGenerator } from '../common/random';