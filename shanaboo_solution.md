 ```diff
--- a/src/tools/data_generator.ts
+++ b/src/tools/data_generator.ts
@@ -1,5 +1,6 @@
 import { faker } from '@faker-js/faker';
 import fs from 'fs';
+import path from 'path';
 
 interface Agent {
   id: string;
@@ -15,6 +16,7 @@
   private seed: number;
   private rng: () => number;
   private usedSeeds: Set<number>;
+  private fakerInstance: typeof faker;
 
   constructor(seed: number = 42) {
     this.seed = seed;
@@ -22,6 +24,9 @@
     this.rng = this.mulberry32(seed);
     // Track used seeds to detect collisions
     this.usedSeeds = new Set();
+    // Create a deterministic faker instance
+    this.fakerInstance = faker;
+    this.fakerInstance.seed(seed);
   }
 
   private mulberry32(a: number): () => number {
@@ -37,7 +42,7 @@
   }
 
   private randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.rng() * (max - min + 1)) + min;
   }
 
   private generateId(): string {
@@ -49,7 +54,7 @@
   }
 
   private randomElement<T>(arr: T[]): T {
-    return arr[Math.floor(Math.random() * arr.length)];
+    return arr[Math.floor(this.rng() * arr.length)];
   }
 
   generateAgent(): Agent {
@@ -58,7 +63,7 @@
       id: this.generateId(),
       name,
       description: `Autonomous agent for ${name.toLowerCase()} operations.`,
-      createdAt: faker.date.recent({ days: 30 }).toISOString(),
+      createdAt: this.fakerInstance.date.recent({ days: 30 }).toISOString(),
       capabilities: this.randomElement([
         ['payments', 'escrow'],
         ['trading', 'analytics'],
@@ -88,6 +93,11 @@
     return agents;
   }
 
+  // Reset faker seed for deterministic output across multiple calls
+  resetSeed(): void {
+    this.fakerInstance.seed(this.seed);
+  }
+
   toJson(agents: Agent[]): string {
     return JSON.stringify(agents, null, 2);
   }
@@ -110,6 +120,7 @@
   const generator = new DataGenerator(seed);
   const agents = generator.generateAgents(count);
 
+  // Write JSON
   const jsonPath = `${outputDir}/agents.json`;
   fs.writeFileSync(jsonPath, generator.toJson(agents));
   console.log(`Generated ${count} agents → ${jsonPath}`);
@@ -118,6 +129,7 @@
   const csvPath = `${outputDir}/agents.csv`;
   fs.writeFileSync(csvPath, generator.toCsv(agents));
   console.log(`Generated ${count} agents → ${csvPath}`);
+
   return { jsonPath, csvPath, agents };
 }
 
@@ -125,6 +137,7 @@
   const generator = new DataGenerator(seed);
   const agents = generator.generateAgents(count);
 
+  // Write CSV
   const csvPath = `${outputDir}/agents.csv`;
   fs.writeFileSync(csvPath, generator.toCsv(agents));
   console.log(`Generated ${count} agents → ${csvPath}`);
@@ -135,6 +148,7 @@
   const generator = new DataGenerator(seed);
   const agents = generator.generateAgents(count);
 
+  // Write JSON
   const jsonPath = `${outputDir}/agents.json`;
   fs.writeFileSync(jsonPath, generator.toJson(agents));
   console.log(`Generated ${count} agents → ${jsonPath}`);
@@ -142,6 +156,7 @@
   return { jsonPath, agents };
 }
 
+// Parse command line arguments
 function parseArgs(): {
   count: number;
   outputDir: string;
@@ -149,6 +164,7 @@
   seed: number;
   json: boolean;
   csv: boolean;
+  format: string;
 } {
   const args = process.argv.slice(2);
   let count = 10;
@@ -156,6 +172,7 @@
   let format = 'both';
   let seed = 42;
   let json = false;
+  let csv = false;
 
   for (let i = 0; i < args.length; i++) {
     switch (args[i]) {
@@ -164,6 +181,12 @@
         const countArg = args[i + 1];
         if (countArg) {
           count = parseInt(countArg, 10);
+          if (isNaN(count) || count < 0) {
+            console.error('Error: Count must be a non-negative integer');
+            process.exit(1);
+          }
+        } else {
+          console.error('Error: --count requires a value');
+          process.exit(1);
         }
         i++;
         break;
@@ -178,11 +201,13 @@
         break;
       case '--json':
         json = true;
-        format = 'json';
         break;
       case '--csv':
-        json = false;
-        format = 'csv';
+        csv = true;
+        break;
+      case '--format':
+        format = args[i + 1]?.toLowerCase() || 'both';
+        i++;
         break;
       case '--help':
         console.log(`
@@ -191,6 +216,7 @@
   --output-dir <dir>  Output directory (default: ./output)
   --seed <number>     Random seed for reproducibility (default: 42)
   --format <format>   Output format: json, csv, both (default: both)
+  --json              Alias for --format json
   --csv               Alias for --format csv
   --help              Show this help message
 `);
@@ -199,7 +225,24 @@
     }
   }
 
-  return { count, outputDir, format, seed, json, csv: !json };
+  // Handle --json and --csv flags as aliases for format
+  if (json && !csv) {
+    format = 'json';
+  } else if (csv && !json) {
+    format = 'csv';
+  } else if (json && csv) {
+    format = 'both';
+  }
+
+  // Validate format
+  const validFormats = ['json', 'csv', 'both'];
+  if (!validFormats.includes(format)) {
+    console.error(`Error: Invalid format "${format}". Must be one of: ${validFormats.join(', ')}`);
+    process.exit(1);
+  }
+
+  return { count, outputDir, format, seed, json, csv };
 }
 
 function main() {
@@ -209,6 +252,12 @@
    