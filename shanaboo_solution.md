 ```diff
--- a/tools/data_generator.ts
+++ b/tools/data_generator.ts
@@ -1,6 +1,7 @@
 import * as fs from 'fs';
 import * as path from 'path';
 import { fileURLToPath } from 'url';
+import { randomBytes } from 'crypto';
 
 // ESM-compatible __dirname
 const __filename = fileURLToPath(import.meta.url);
@@ -12,6 +13,7 @@ interface DataGeneratorOptions {
   count: number;
   format: 'json' | 'csv' | 'both';
   seed: number;
+  outputDir: string;
 }
 
 interface AgentRecord {
@@ -24,14 +26,14 @@ interface AgentRecord {
 }
 
 class SeededRandom {
-  private seed: number;
+  private state: number;
 
   constructor(seed: number) {
-    this.seed = seed;
+    this.state = seed;
   }
 
   next(): number {
-    this.seed = (this.seed * 9301 + 49297) % 233280;
-    return this.seed / 233280;
+    this.state = (this.state * 9301 + 49297) % 233280;
+    return this.state / 233280;
   }
 
   nextInt(min: number, max: number): number {
@@ -40,6 +42,10 @@ class SeededRandom {
 
   pick<T>(arr: T[]): T {
     return arr[this.nextInt(0, arr.length - 1)];
+  }
+
+  uuid(): string {
+    const bytes = randomBytes(16);
+    bytes[6] = (bytes[6] & 0x0f) | 0x40;
+    bytes[8] = (bytes[8] & 0x3f) | 0x80;
+    return bytes.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/)!.slice(1).join('-');
   }
 }
 
@@ -48,7 +54,7 @@ const CAPABILITIES = ['payments', 'marketplace-purchases', 'escrow', 'swap', 'len
 const DESCRIPTIONS = ['Autonomous payment agent', 'Marketplace buyer', 'Escrow manager', 'Liquidity provider', 'Yield farmer'];
 
 function generateAgent(id: number, rng: SeededRandom): AgentRecord {
-  const uuid = `${id.toString(16).padStart(8, '0')}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 14)}`;
+  const uuid = rng.uuid();
   return {
     id,
     uuid,
@@ -60,7 +66,7 @@ function generateAgent(id: number, rng: SeededRandom): AgentRecord {
 }
 
 function generateData(options: DataGeneratorOptions): AgentRecord[] {
-  const rng = new SeededRandom(options.seed);
+  const rng = new SeededRandom(options.seed || Date.now());
   const records: AgentRecord[] = [];
   for (let i = 0; i < options.count; i++) {
     records.push(generateAgent(i + 1, rng));
@@ -78,7 +84,7 @@ function toCsv(records: AgentRecord[]): string {
 }
 
 function writeOutput(records: AgentRecord[], options: DataGeneratorOptions): void {
-  const outputDir = path.resolve(__dirname, '..', 'output');
+  const outputDir = path.resolve(options.outputDir);
   if (!fs.existsSync(outputDir)) {
     fs.mkdirSync(outputDir, { recursive: true });
   }
@@ -86,15 +92,15 @@ function writeOutput(records: AgentRecord[], options: DataGeneratorOptions): voi
   const baseName = `agents_${options.count}_${options.seed}`;
 
   if (options.format === 'json' || options.format === 'both') {
-    const jsonPath = path.join(outputDir, `${baseName}.json`);
+    const jsonPath = path.join(outputDir, `${baseName}.json`);
     fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2));
     console.log(`Wrote JSON: ${jsonPath}`);
   }
 
-  if (options.format === 'csv' || options.format === 'both') {
-    const csvPath = path.join(outputDir, `${baseName}.csv`);
+  if (options.format === 'csv' || options.format === 'both') {
+    const csvPath = path.join(outputDir, `${baseName}.csv`);
     fs.writeFileSync(csvPath, toCsv(records));
     console.log(`Wrote CSV: ${csvPath}`);
   }
 }
 
@@ -102,7 +108,7 @@ function parseArgs(): DataGeneratorOptions {
   const args = process.argv.slice(2);
   const options: Partial<DataGeneratorOptions> = {
     count: 10,
-    format: 'json',
+    format: 'both',
     seed: Date.now(),
   };
 
@@ -110,16 +116,31 @@ function parseArgs(): DataGeneratorOptions {
     const arg = args[i];
     if (arg === '--count' || arg === '-c') {
       options.count = parseInt(args[++i], 10);
+      if (Number.isNaN(options.count) || options.count < 0) {
+        console.error('Error: --count must be a non-negative integer');
+        process.exit(1);
+      }
     } else if (arg === '--format' || arg === '-f') {
-      options.format = args[++i] as 'json' | 'csv' | 'both';
-      if (options.format === 'both') {
-        options.format = 'json'; // broken: overrides to json
+      const formatValue = args[++i];
+      if (formatValue !== 'json' && formatValue !== 'csv' && formatValue !== 'both') {
+        console.error('Error: --format must be one of: json, csv, both');
+        process.exit(1);
       }
+      options.format = formatValue as 'json' | 'csv' | 'both';
     } else if (arg === '--seed' || arg === '-s') {
       options.seed = parseInt(args[++i], 10);
+      if (Number.isNaN(options.seed)) {
+        console.error('Error: --seed must be an integer');
+        process.exit(1);
+      }
+    } else if (arg === '--output' || arg === '-o') {
+      options.outputDir = args[++i];
     }
   }
 
+  if (!options.outputDir) {
+    options.outputDir = path.resolve(__dirname, '..', 'output');
+  }
+
   return options as DataGeneratorOptions;
 }
 
@@ -127,6 +148,11