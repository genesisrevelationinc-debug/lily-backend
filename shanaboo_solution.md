 ```diff
--- a/src/tools/data_audit.ts
+++ b/src/tools/data_audit.ts
@@ -1,6 +1,7 @@
 import * as fs from 'fs';
 import * as path from 'path';
 import { randomBytes } from 'crypto';
+import { Readable } from 'stream';
 
 // Types
 interface Agent {
@@ -45,7 +46,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -53,7 +54,7 @@
   }
 
   randomBool(probability: number = 0.5): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -186,7 +187,7 @@
   }
 
   generateAgents(count: number): Agent[] {
-    return Array.from({ length: count }, () => this.generateAgent());
+    return Array.from({ length: count }, () => this.generateAgent());
   }
 }
 
@@ -224,7 +225,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -232,7 +233,7 @@
   }
 
   randomBool(probability: number = 0.5): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -373,7 +374,7 @@
   }
 
   generateTransactions(count: number): Transaction[] {
-    return Array.from({ length: count }, () => this.generateTransaction());
+    return Array.from({ length: count }, () => this.generateTransaction());
   }
 }
 
@@ -411,7 +412,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -419,7 +420,7 @@
   }
 
   randomBool(probability: number = 0.5): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -530,7 +531,7 @@
   }
 
   generateWallets(count: number): Wallet[] {
-    return Array.from({ length: count }, () => this.generateWallet());
+    return Array.from({ length: count }, () => this.generateWallet());
   }
 }
 
@@ -568,7 +569,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -576,7 +577,7 @@
   }
 
   randomBool(probability: number = 0.5): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -687,7 +688,7 @@
   }
 
   generateAuditLogs(count: number): AuditLog[] {
-    return Array.from({ length: count }, () => this.generateAuditLog());
+    return Array.from({ length: count }, () => this.generateAuditLog());
   }
 }
 
@@ -725,7 +726,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -733,7 +734,7 @@
   }
 
   randomBool(probability: number = 0.5): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -844,7 +845,7 @@
   }
 
   generateComplianceChecks(count: number): ComplianceCheck[] {
-    return Array.from({ length: count }, () => this.generateComplianceCheck());
+    return Array.from({ length: count }, () => this.generateComplianceCheck());
   }
 }
 
@@ -882,7 +883,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -890,7 +891,7 @@
   }
 
   randomBool(probability: number = 0.5): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -1001,7 +1002,7 @@
   }
 
   generateSystemMetrics(count: number): SystemMetrics[] {
-    return Array.from({ length: count }, () => this.generateSystemMetrics());
+    return Array.from({ length: count }, () => this.generateSystemMetrics());
   }
 }
 
@@ -1039,7 +1040,7 @@
   }
 
   randomInt(min: number, max: number): number {
-    return Math.floor(Math.random() * (max - min + 1)) + min;
+    return Math.floor(this.random() * (max - min + 1)) + min;
   }
 
   randomItem<T>(arr: T[]): T {
@@ -1047,7 +1048,7 @@
   }
 
   randomBool(probability: number = 0"): boolean {
-    return Math.random() < probability;
+    return this.random() < probability;
   }
 
   randomDate(start: Date, end: Date): Date {
@@ -1158,7 +1159,7 @@
   }
 
   generateAgentPerformanceMetrics(count: number): AgentPerformanceMetrics[] {
-    return Array.from({ length: count }, () => this.generate