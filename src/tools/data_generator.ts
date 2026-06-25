import { randomInt as cryptoRandomInt, randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

  createdAt: string;
}

interface RNG {
  randomInt(min: number, max: number): number;
  randomBytes(n: number): Buffer;
}

const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright', 'Lopez'
];

function generateAgent(id: number, rng: RNG): Agent {
  const firstName = FIRST_NAMES[rng.randomInt(0, FIRST_NAMES.length)];
  const lastName = LAST_NAMES[randomInt(0, LAST_NAMES.length)];
  return {
    id,
  };
}

function generateAgents(count: number, rng: RNG): Agent[] {
  return Array.from({ length: count }, (_, i) => generateAgent(i + 1, rng));
}

function toCSV(agents: Agent[]): string {
  return lines.join('\n');
}

function seededRNG(seed: number): RNG {
  let state = seed;
  return {
    randomInt(min: number, max: number): number {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return min + (state % Math.max(1, max - min));
    },
    randomBytes(n: number): Buffer {
      const buf = Buffer.alloc(n);
  };
}

function createRNG(seed?: number): RNG {
  if (seed !== undefined) {
    return seededRNG(seed);
  }
  return {
    randomInt: (min: number, max: number) => cryptoRandomInt(min, max),
    randomBytes: (n: number) => crypto.randomBytes(n),
  };
}

function parseArgs(): {
  count: number;
  format: 'json' | 'csv' | 'both';
  seed?: number;
  json?: boolean;
  csv?: boolean;
  help?: boolean;
} {
  const args = process.argv.slice(2);
  let count = 10;
  let outputDir = './output';
  let seed: number | undefined;
  let json = false;
  let csvFlag = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        break;
      case '--format':
        if (i + 1 < args.length) {
          format = args[++i] as typeof format;
        }
        break;
      case '--output-dir':
        json = true;
        break;
      case '--csv':
        csvFlag = true;
        break;
      default:
        if (!args[i].startsWith('-')) {
    }
  }

  // Validate count
  if (!Number.isInteger(count) || count < 0) {
    console.error('Error: count must be a non-negative integer');
    process.exit(1);
  }

  // Handle --json and --csv flags
  if (json && csvFlag) {
    format = 'both';
  } else if (json) {
    format = 'json';
  } else if (csvFlag) {
    format = 'csv';
  }

  return { count, format, outputDir, seed, json, csv: false };
}

function main(): void {
  const outputDir = path.resolve(args.outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  const rng = createRNG(args.seed);

  const agents = generateAgents(args.count, rng);

  if (args.format === 'json' || args.format === 'both') {
    const jsonPath = path.join(outputDir, 'agents.json');
    fs.writeFileSync(jsonPath, JSON.stringify(agents, null, 2));
    console.log(`Wrote ${jsonPath}`);
  }

  if (args.format === 'csv' || args.format === 'both') {
    const csvPath = path.join(outputDir, 'agents.csv');
    fs.writeFileSync(csvPath, toCSV(agents));
    console.log(`Wrote ${csvPath}`);
  }
}

// Only run main if this file is executed directly
if (require.main === module) {
  main();
}