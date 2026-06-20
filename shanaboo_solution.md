 ```diff
--- a/src/tools/data_generator.ts
+++ b/src/tools/data_generator.ts
@@ -1,5 +1,5 @@
 import { writeFileSync, mkdirSync } from 'fs';
-import { randomInt, randomUUID } from 'crypto';
+import { randomInt as cryptoRandomInt, randomUUID } from 'crypto';
 import { join } from 'path';
 
 interface Agent {
@@ -20,6 +20,10 @@ interface Transaction {
   status: 'pending' | 'completed' | 'failed';
 }
 
+function randomInt(max: number, rng: () => number): number {
+  return Math.floor(rng() * max);
+}
+
 const FIRST_NAMES = [
   'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
   'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
@@ -48,8 +52,8 @@ const DOMAINS = [
   'quantum', 'nebula', 'horizon', 'vertex', 'pulse', 'catalyst'
 ];
 
-function randomItem<T>(arr: T[]): T {
-  return arr[Math.floor(Math.random() * arr.length)];
+function randomItem<T>(arr: T[], rng: () => number): T {
+  return arr[Math.floor(rng() * arr.length)];
 }
 
 function randomDate(start: Date, end: Date): Date {
@@ -62,24 +66,24 @@ function randomDate(start: Date, end: Date): Date {
   );
 }
 
-function generateAgent(): Agent {
+function generateAgent(rng: () => number): Agent {
   const id = randomUUID();
-  const firstName = randomItem(FIRST_NAMES);
-  const lastName = randomItem(LAST_NAMES);
-  const domain = randomItem(DOMAINS);
+  const firstName = randomItem(FIRST_NAMES, rng);
+  const lastName = randomItem(LAST_NAMES, rng);
+  const domain = randomItem(DOMAINS, rng);
   return {
     id,
     name: `${firstName} ${lastName}`,
     email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}.com`,
-    role: randomItem(['admin', 'user', 'viewer']),
+    role: randomItem(['admin', 'user', 'viewer'], rng),
     createdAt: randomDate(new Date(2020, 0, 1), new Date()),
   };
 }
 
-function generateWallet(): Wallet {
+function generateWallet(rng: () => number): Wallet {
   const id = randomUUID();
-  const balance = Math.random() * 100000;
+  const balance = rng() * 100000;
   return {
     id,
     address: `G${randomInt(16 ** 56, rng).toString(16).padStart(56, '0')}`,
@@ -88,14 +92,14 @@ function generateWallet(): Wallet {
   };
 }
 
-function generateTransaction(): Transaction {
+function generateTransaction(rng: () => number): Transaction {
   return {
     id: randomUUID(),
-    sender: `G${randomInt(16 ** 56, rng).toString(16).padStart(56, '0')}`,
-    receiver: `G${randomInt(16 ** 56, rng).toString(16).padStart(56, '0')}`,
-    amount: parseFloat((Math.random() * 10000).toFixed(2)),
+    sender: `G${cryptoRandomInt(16 ** 56).toString(16).padStart(56, '0')}`,
+    receiver: `G${cryptoRandomInt(16 ** 56).toString(16).padStart(56, '0')}`,
+    amount: parseFloat((rng() * 10000).toFixed(2)),
     asset: 'USDC',
-    status: randomItem(['pending', 'completed', 'failed']),
+    status: randomItem(['pending', 'completed', 'failed'], rng),
     timestamp: randomDate(new Date(2023, 0, 1), new Date()),
   };
 }
@@ -121,7 +125,7 @@ function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
   return [headers.join(','), ...lines].join('\n');
 }
 
-function parseArgs(): { entity: string; count: number; format: string; outDir: string; seed?: number } {
+function parseArgs(): { entity: string; count: number; format: 'json' | 'csv' | 'both'; outDir: string; seed?: number } {
   const args = process.argv.slice(2);
   let entity = 'agents';
   let count = 10;
@@ -130,6 +134,8 @@ function parseArgs(): { entity: string; count: number; format: string; outDir:
   let seed: number | undefined;
   let json = false;
   let csv = false;
+  let jsonFlag = false;
+  let csvFlag = false;
 
   for (let i = 0; i < args.length; i++) {
     switch (args[i]) {
@@ -139,6 +145,10 @@ function parseArgs(): { entity: string; count: number; format: string; outDir:
       case '--count':
       case '-c':
         count = parseInt(args[++i], 10);
+        if (isNaN(count) || count < 0) {
+          console.error('Error: count must be a non-negative integer');
+          process.exit(1);
+        }
         break;
       case '--format':
       case '-f':
@@ -150,10 +160,10 @@ function parseArgs(): { entity: string; count: number; format: string; outDir:
         break;
       case '--json':
-        json = true;
+        jsonFlag = true;
         break;
       case '--csv':
-        csv = true;
+        csvFlag = true;
         break;
       case '--seed':
       case '-s':
@@ -164,16 +174,16 @@ function parseArgs(): { entity: string; count: number; format: string; outDir:
         process.exit(1);
     }
   }
-
-  if (json && !csv) {
-    format = 'json';
-  } else if (csv && !json) {
-    format = 'csv';
-  } else if (json && csv) {
-    format = 'both';
+  
+  // Validate format
+  if (format !== 'json' && format !== 'csv' && format !== 'both') {
+    console.error(`Error: format must be "json", "csv", or "both", got "${format}"`);
+    process.exit(1);
   }
 
-  if (format === 'both') format = 'json';
+  // --json and --csv