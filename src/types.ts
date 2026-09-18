export type PlatformDevice = 'mobile' | 'tablet' | 'desktop';

export type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'php' | 'dart';

export type FrameworkOption =
  | 'react'
  | 'vue'
  | 'nextjs'
  | 'express'
  | 'vanilla'
  | 'django'
  | 'fastapi'
  | 'flask'
  | 'laravel'
  | 'flutter';

export type DatabaseType = 'sql' | 'nosql';

export type DatabaseEngine =
  | 'postgresql'
  | 'sqlite'
  | 'mysql'
  | 'supabase'
  | 'indexeddb'
  | 'mongodb'
  | 'firestore'
  | 'firebase';

export interface TechStackSelection {
  language: ProgrammingLanguage;
  framework: FrameworkOption;
  databaseType: DatabaseType;
  databaseEngine: DatabaseEngine;
  architecturePattern: string;
}

export interface GeneratedProjectFile {
  path: string;
  filename?: string;
  name?: string;
  language: string; // 'python' | 'typescript' | 'javascript' | 'html' | 'sql' | 'json' | 'markdown'
  content: string;
  description: string;
}

export interface BestPracticeCheck {
  category: string;
  title: string;
  passed: boolean;
  detail: string;
}

export interface UserAccount {
  id: string;
  nom: string;
  prenom: string;
  mobileMoneyNumber: string;
  operator?: 'Orange Money' | 'MTN MoMo' | 'Wave' | 'Moov Money' | 'Autre';
  createdAt: string;
  isBlocked: boolean;
  appsCreatedCount: number;
}

export interface PlatformConfig {
  isPromoMode: boolean; // True by default (free)
  isPaidModeActive: boolean;
  pricePerAppCFA: number;
  adminPin: string;
  mobileMoneyAPIs: {
    orangeMoney: { enabled: boolean; merchantKey: string };
    mtnMoMo: { enabled: boolean; subscriptionKey: string };
    wave: { enabled: boolean; apiToken: string };
    moovMoney: { enabled: boolean; apiSecret: string };
  };
}

export type PipelineStep =
  | 'concept'       // Étape 1: Idée, Conception & Choix Tech Stack
  | 'database'      // Étape 2: Base de données (SQL vs NoSQL) & Architecture
  | 'code'          // Étape 3: Code & Live Preview Interactif
  | 'testing'       // Étape 4: Tests & Validation
  | 'packaging'     // Étape 5: Création APK, AAB, PWA
  | 'deployment';   // Étape 6: Déploiement & Publication

export interface GeneratedAppProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  targetPlatforms: ('mobile' | 'tablet' | 'desktop')[];
  // Customizable Tech Stack Options
  techStack: TechStackSelection;
  databaseChoice: {
    name: string;
    type: 'free' | 'paid';
    category?: DatabaseType;
    engine?: DatabaseEngine;
    description: string;
    schemaSqlOrJson: string;
  };
  features: string[];
  // Interactive HTML5 + CSS + JS app code served inside iframe preview
  appCode: string;
  // Multi-file source code adhering to chosen language and framework best practices
  projectFiles: GeneratedProjectFile[];
  // Best practice conformity checks
  bestPractices: BestPracticeCheck[];
  // QA Testing results
  testResults: {
    name: string;
    passed: boolean;
    score: number;
    details: string;
  }[];
  // Packaging details
  pwaManifest: Record<string, any>;
  apkConfig: {
    packageName: string;
    version: string;
    appName: string;
    minSdkVersion: number;
    targetSdkVersion: number;
  };
  aabConfig: {
    bundleVersion: string;
    playStoreTrack: string;
    assetPackSupported: boolean;
  };
  deploymentOptions: {
    free: { name: string; urlPrefix: string; description: string; setupGuide: string }[];
    paid: { name: string; pricing: string; description: string; setupGuide: string }[];
  };
  demoLiveUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationRequest {
  prompt: string;
  apiKeyChoice?: 'free' | 'custom';
  customApiKey?: string;
  appNamePreference?: string;
  categoryPreference?: string;
  techStack?: TechStackSelection;
}
