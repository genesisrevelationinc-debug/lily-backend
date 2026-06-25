import * as fs from 'fs';
import * as path from 'path';

interface Agent {
  id: string;
}

class DataGenerator {
  private rng: () => number;

  constructor(seed: number) {
    this.rng = this.createSeededRng(seed);

  private createSeededRng(seed: number): () => number {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };

  generateAgent(): Agent {
    return {
      id: this.rng().toString(36).substring(2, 15),
      name: `Agent-${Math.floor(this.rng() * 1000)}`,
      description: 'Generated agent for testing',
      capabilities: ['payments', 'marketplace-purchases'],

  generateAgents(count: number): Agent[] {
    const agents: Agent[] = [];
    for (let i = 0; i < count; i++) {
      agents.push(this.generateAgent());
    }
    return agents;

  toJson(agents: Agent[]): string {
    return JSON.stringify(agents, null, 2);
  }

  toCsv(agents: Agent[]): string {
    const headers = ['id', 'name', 'description', 'capabilities', 'walletAddress', 'createdAt', 'updatedAt'];
      return [a.id, a.name, a.description, a.capabilities.join(';'), a.walletAddress, a.createdAt, a.updatedAt].join(',');
    });
    return [headers.join(','), ...rows].join('\n');
  }
}

function parseArgs(): {
  seed: number;
} {
  const args = process.argv.slice(2);

  let format = 'json';
  let count = 10;
  let output = 'agents';
  let seed = 42;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--format':
        if (i + 1 < args.length) {
          format = args[i + 1];
        break;
      case '--count':
        if (i + 1 < args.length) {
          count = parseInt(args[i + 1], 10);
          i++;
        }
        break;
        break;
      case '--seed':
        if (i + 1 < args.length) {
          seed = parseInt(args[i + 1], 10);
          i++;
        }
        break;
  }

  return { format, count, output, json, csv, seed };
}

function main() {
  const { format, count, output, json, csv, seed } = parseArgs();
  const generator = new DataGenerator(seed);
  const agents = generator.generateAgents(count);

  if (format === 'both') {
    // Broken: overrides to json
    const jsonData = generator.toJson(agents);
    fs.writeFileSync(`${output}.json`, jsonData);
  } else if (format === 'json') {
    const jsonData = generator.toJson(agents);
    fs.writeFileSync(`${output}.json`, jsonData);
  } else if (format === 'csv') {
    const csvData = generator.toCsv(agents);
    fs.writeFileSync(`${output}.csv`, csvData);
  }

if (require.main === module) {
  main();
}