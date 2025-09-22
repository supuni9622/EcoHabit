// Database Migration & Backup Utilities for EcoHabit
// scripts/db-migration.ts

import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

interface MigrationConfig {
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

export class DatabaseMigration {
  private db: admin.firestore.Firestore;
  private migrationPath: string;

  constructor(db: admin.firestore.Firestore, migrationPath: string = './migrations') {
    this.db = db;
    this.migrationPath = migrationPath;
  }

  // Run all pending migrations
  async runMigrations(): Promise<void> {
    console.log('🔄 Starting database migrations...');
    
    const appliedMigrations = await this.getAppliedMigrations();
    const allMigrations = await this.loadMigrations();
    
    const pendingMigrations = allMigrations.filter(
      migration => !appliedMigrations.includes(migration.version)
    );

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }

    for (const migration of pendingMigrations) {
      console.log(`🔄 Applying migration: ${migration.version} - ${migration.description}`);
      
      try {
        await migration.up();
        await this.recordMigration(migration.version, migration.description);
        console.log(`✅ Migration ${migration.version} completed`);
      } catch (error) {
        console.error(`❌ Migration ${migration.version} failed:`, error);
        throw error;
      }
    }

    console.log('🎉 All migrations completed successfully');
  }

  // Rollback last migration
  async rollbackLastMigration(): Promise<void> {
    const appliedMigrations = await this.getAppliedMigrations();
    
    if (appliedMigrations.length === 0) {
      console.log('No migrations to rollback');
      return;
    }

    const lastMigrationVersion = appliedMigrations[appliedMigrations.length - 1];
    const allMigrations = await this.loadMigrations();
    const migrationToRollback = allMigrations.find(m => m.version === lastMigrationVersion);

    if (!migrationToRollback) {
      throw new Error(`Migration ${lastMigrationVersion} not found`);
    }

    console.log(`🔄 Rolling back migration: ${migrationToRollback.version}`);
    
    try {
      await migrationToRollback.down();
      await this.removeMigrationRecord(migrationToRollback.version);
      console.log(`✅ Migration ${migrationToRollback.version} rolled back`);
    } catch (error) {
      console.error(`❌ Rollback failed:`, error);
      throw error;
    }
  }

  private async getAppliedMigrations(): Promise<string[]> {
    const snapshot = await this.db
      .collection('_migrations')
      .orderBy('appliedAt', 'asc')
      .get();

    return snapshot.docs.map(doc => doc.data().version);
  }

  private async loadMigrations(): Promise<MigrationConfig[]> {
    // This would load migration files from the migrations directory
    // For now, we'll return the initial setup migration
    return [
      {
        version: '001_initial_setup',
        description: 'Initial database setup with collections and indexes',
        up: async () => {
          await this.createInitialCollections();
          await this.createInitialIndexes();
        },
        down: async () => {
          await this.removeInitialCollections();
        }
      },
      {
        version: '002_add_analytics',
        description: 'Add analytics and user behavior tracking',
        up: async () => {
          await this.addAnalyticsFields();
        },
        down: async () => {
          await this.removeAnalyticsFields();
        }
      }
    ];
  }

  private async recordMigration(version: string, description: string): Promise<void> {
    await this.db.collection('_migrations').doc(version).set({
      version,
      description,
      appliedAt: Timestamp.now()
    });
  }

  private async removeMigrationRecord(version: string): Promise<void> {
    await this.db.collection('_migrations').doc(version).delete();
  }

  private async createInitialCollections(): Promise<void> {
    // Create initial documents to establish collections
    const collections = [
      'users', 'habitLogs', 'userStreaks', 'badges', 'userAchievements',
      'lessons', 'userLessonProgress', 'challenges', 'userChallengeParticipation',
      'friendships', 'communityPosts', 'leaderboards', 'recyclingLocations',
      'userAnalytics', 'systemMetrics', 'notificationTemplates', 'userNotifications'
    ];

    for (const collection of collections) {
      await this.db.collection(collection).doc('_placeholder').set({
        _placeholder: true,
        createdAt: Timestamp.now()
      });
      console.log(`📁 Created collection: ${collection}`);
    }
  }

  private async createInitialIndexes(): Promise<void> {
    // Indexes are created via firestore.indexes.json
    console.log('📊 Indexes will be created via Firebase CLI deployment');
  }

  private async removeInitialCollections(): Promise<void> {
    console.log('⚠️  Collection removal requires manual intervention for safety');
  }

  private async addAnalyticsFields(): Promise<void> {
    // Add new analytics fields to existing user documents
    const usersSnapshot = await this.db.collection('users').get();
    
    const batch = this.db.batch();
    let batchCount = 0;

    for (const doc of usersSnapshot.docs) {
      if (batchCount >= 500) {
        await batch.commit();
        batchCount = 0;
      }

      const userRef = this.db.collection('users').doc(doc.id);
      batch.update(userRef, {
        'analytics.lastCalculatedAt': Timestamp.now(),
        'analytics.engagementScore': 0
      });
      
      batchCount++;
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log('📊 Added analytics fields to user documents');
  }

  private async removeAnalyticsFields(): Promise<void> {
    // Remove analytics fields from user documents
    const usersSnapshot = await this.db.collection('users').get();
    
    const batch = this.db.batch();
    let batchCount = 0;

    for (const doc of usersSnapshot.docs) {
      if (batchCount >= 500) {
        await batch.commit();
        batchCount = 0;
      }

      const userRef = this.db.collection('users').doc(doc.id);
      batch.update(userRef, {
        'analytics.lastCalculatedAt': admin.firestore.FieldValue.delete(),
        'analytics.engagementScore': admin.firestore.FieldValue.delete()
      });
      
      batchCount++;
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log('🗑️  Removed analytics fields from user documents');
  }
}

// Database backup utility
export class DatabaseBackup {
  private db: admin.firestore.Firestore;
  private backupPath: string;

  constructor(db: admin.firestore.Firestore, backupPath: string = './backups') {
    this.db = db;
    this.backupPath = backupPath;
  }

  // Full database backup
  async backupDatabase(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.backupPath, `backup-${timestamp}`);
    
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
    
    fs.mkdirSync(backupDir);

    console.log('💾 Starting database backup...');

    const collections = [
      'users', 'habitLogs', 'userStreaks', 'badges', 'userAchievements',
      'lessons', 'userLessonProgress', 'challenges', 'userChallengeParticipation',
      'friendships', 'communityPosts', 'leaderboards', 'recyclingLocations',
      'userAnalytics', 'systemMetrics', 'notificationTemplates', 'userNotifications'
    ];

    for (const collectionName of collections) {
      await this.backupCollection(collectionName, backupDir);
    }

    // Create backup metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      collections: collections.length,
      version: '1.0.0'
    };

    fs.writeFileSync(
      path.join(backupDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log(`✅ Backup completed: ${backupDir}`);
    return backupDir;
  }

  // Backup specific collection
  private async backupCollection(collectionName: string, backupDir: string): Promise<void> {
    console.log(`📂 Backing up collection: ${collectionName}`);
    
    const snapshot = await this.db.collection(collectionName).get();
    const documents: any[] = [];

    snapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        data: this.serializeFirestoreData(doc.data())
      });
    });

    fs.writeFileSync(
      path.join(backupDir, `${collectionName}.json`),
      JSON.stringify(documents, null, 2)
    );

    console.log(`✅ Backed up ${documents.length} documents from ${collectionName}`);
  }

  // Restore database from backup
  async restoreDatabase(backupDir: string): Promise<void> {
    if (!fs.existsSync(backupDir)) {
      throw new Error(`Backup directory not found: ${backupDir}`);
    }

    const metadataPath = path.join(backupDir, 'metadata.json');
    if (!fs.existsSync(metadataPath)) {
      throw new Error('Invalid backup: metadata.json not found');
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    console.log(`🔄 Restoring backup from ${metadata.timestamp}`);

    const backupFiles = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.json') && file !== 'metadata.json');

    for (const file of backupFiles) {
      const collectionName = file.replace('.json', '');
      await this.restoreCollection(collectionName, path.join(backupDir, file));
    }

    console.log('✅ Database restore completed');
  }

  // Restore specific collection
  private async restoreCollection(collectionName: string, filePath: string): Promise<void> {
    console.log(`📂 Restoring collection: ${collectionName}`);
    
    const documents = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const batch = this.db.batch();
    let batchCount = 0;

    for (const document of documents) {
      if (batchCount >= 500) {
        await batch.commit();
        batchCount = 0;
      }

      const docRef = this.db.collection(collectionName).doc(document.id);
      batch.set(docRef, this.deserializeFirestoreData(document.data));
      batchCount++;
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    console.log(`✅ Restored ${documents.length} documents to ${collectionName}`);
  }

  // Convert Firestore data types to JSON-serializable format
  private serializeFirestoreData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (data instanceof Timestamp) {
      return { _type: 'timestamp', _value: data.toMillis() };
    }

    if (data instanceof admin.firestore.GeoPoint) {
      return { 
        _type: 'geopoint', 
        _value: { latitude: data.latitude, longitude: data.longitude }
      };
    }

    if (Array.isArray(data)) {
      return data.map(item => this.serializeFirestoreData(item));
    }

    if (typeof data === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.serializeFirestoreData(value);
      }
      return result;
    }

    return data;
  }

  // Convert serialized data back to Firestore format
  private deserializeFirestoreData(data: any): any {
    if (data === null || data === undefined) {
      return data;
    }

    if (typeof data === 'object' && data._type) {
      switch (data._type) {
        case 'timestamp':
          return Timestamp.fromMillis(data._value);
        case 'geopoint':
          return new admin.firestore.GeoPoint(data._value.latitude, data._value.longitude);
        default:
          return data;
      }
    }

    if (Array.isArray(data)) {
      return data.map(item => this.deserializeFirestoreData(item));
    }

    if (typeof data === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(data)) {
        result[key] = this.deserializeFirestoreData(value);
      }
      return result;
    }

    return data;
  }

  // List available backups
  listBackups(): string[] {
    if (!fs.existsSync(this.backupPath)) {
      return [];
    }

    return fs.readdirSync(this.backupPath)
      .filter(name => fs.statSync(path.join(this.backupPath, name)).isDirectory())
      .filter(name => name.startsWith('backup-'))
      .sort()
      .reverse(); // Most recent first
  }

  // Clean old backups (keep only specified number)
  cleanOldBackups(keepCount: number = 5): void {
    const backups = this.listBackups();
    const toDelete = backups.slice(keepCount);

    for (const backup of toDelete) {
      const backupPath = path.join(this.backupPath, backup);
      fs.rmSync(backupPath, { recursive: true, force: true });
      console.log(`🗑️  Deleted old backup: ${backup}`);
    }

    if (toDelete.length > 0) {
      console.log(`✅ Cleaned ${toDelete.length} old backups`);
    }
  }
}

// Usage example and CLI interface
export async function runMigrationsCLI(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  // Initialize Firebase Admin
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  const db = admin.firestore();
  const migration = new DatabaseMigration(db);
  const backup = new DatabaseBackup(db);

  try {
    switch (command) {
      case 'migrate':
        await migration.runMigrations();
        break;
      
      case 'rollback':
        await migration.rollbackLastMigration();
        break;
      
      case 'backup':
        const backupPath = await backup.backupDatabase();
        console.log(`Backup created: ${backupPath}`);
        break;
      
      case 'restore':
        const restorePath = args[1];
        if (!restorePath) {
          console.error('Please provide backup path');
          process.exit(1);
        }
        await backup.restoreDatabase(restorePath);
        break;
      
      case 'list-backups':
        const backups = backup.listBackups();
        console.log('Available backups:');
        backups.forEach(b => console.log(`  ${b}`));
        break;
      
      case 'clean-backups':
        backup.cleanOldBackups(5);
        break;
      
      default:
        console.log(`
Usage: pnpm db-migrate <command>

Commands:
  migrate       - Run pending migrations
  rollback      - Rollback last migration
  backup        - Create database backup
  restore <path> - Restore from backup
  list-backups  - List available backups
  clean-backups - Remove old backups (keep 5)
        `);
    }
  } catch (error) {
    console.error('Command failed:', error);
    process.exit(1);
  }
}

// Run CLI if this file is executed directly
if (require.main === module) {
  runMigrationsCLI();
}