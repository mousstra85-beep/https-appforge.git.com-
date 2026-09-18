import { ProgrammingLanguage, FrameworkOption, DatabaseType, DatabaseEngine, TechStackSelection } from '../types';

export interface LanguageDef {
  id: ProgrammingLanguage;
  name: string;
  tagline: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  compatibleFrameworks: FrameworkOption[];
  bestPractices: string[];
}

export interface FrameworkDef {
  id: FrameworkOption;
  name: string;
  languageId: ProgrammingLanguage;
  tagline: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile';
  recommendedDatabases: DatabaseEngine[];
  bestPractices: string[];
}

export interface DatabaseDef {
  id: DatabaseEngine;
  name: string;
  type: DatabaseType;
  tagline: string;
  pricingType: 'free' | 'paid' | 'both';
  bestPractices: string[];
}

export const PROGRAMMING_LANGUAGES: LanguageDef[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    tagline: 'ES2024+, Node.js, universel pour le web et les applications réactives',
    color: '#F7DF1E',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    badgeBorder: 'border-amber-500/40',
    compatibleFrameworks: ['react', 'vue', 'nextjs', 'express', 'vanilla'],
    bestPractices: [
      'Modules ES6+ natifs (import/export) sans variables globales polluantes',
      'Gestion asynchrone avec async/await et blocs try/catch typés',
      'Immutabilité des états et déstructuration propre des objets',
      'Validation stricte des entrées utilisateurs contre les injections XSS'
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    tagline: 'Typage statique strict, sécurité maximale et architecture maintenable',
    color: '#3178C6',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    badgeBorder: 'border-blue-500/40',
    compatibleFrameworks: ['react', 'nextjs', 'vue', 'express'],
    bestPractices: [
      'Typage statique exhaustif avec interdiction du type "any"',
      'Interfaces claires pour les modèles de données et props de composants',
      'Types discriminés pour la gestion robuste des états applicatifs',
      'Compilation stricte (strict: true, noImplicitAny)'
    ]
  },
  {
    id: 'python',
    name: 'Python',
    tagline: 'Syntaxe élégante, puissance backend, APIs REST et écosystème IA',
    color: '#3776AB',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    badgeBorder: 'border-emerald-500/40',
    compatibleFrameworks: ['django', 'fastapi', 'flask'],
    bestPractices: [
      'Conformité stricte au guide de style PEP 8 (indentation, conventions de nommage)',
      'Type hints systématiques (typing) sur toutes les fonctions et modèles',
      'Séparation en couches : Modèles (ORM) / Services / Contrôleurs (Views)',
      'Environnement virtuel isolé et gestion des dépendances via requirements.txt'
    ]
  },
  {
    id: 'php',
    name: 'PHP',
    tagline: 'Modern PHP 8.2+, éprouvé pour le commerce en ligne et APIs robustes',
    color: '#777BB4',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
    badgeBorder: 'border-indigo-500/40',
    compatibleFrameworks: ['laravel', 'vanilla'],
    bestPractices: [
      'Respect des standards PSR-12 pour le formatage et PSR-4 pour l\'autoloading',
      'Typage strict des arguments et valeurs de retour (declare(strict_types=1);)',
      'Requêtes préparées PDO / Eloquent contre les injections SQL',
      'Architecture orientée objet moderne avec injection de dépendances'
    ]
  },
  {
    id: 'dart',
    name: 'Dart',
    tagline: 'Optimisé pour Flutter, compilation native multiplateforme ultra-fluide',
    color: '#0175C2',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    badgeBorder: 'border-cyan-500/40',
    compatibleFrameworks: ['flutter'],
    bestPractices: [
      'Null safety sonore (sound null safety) systématiquement activé',
      'Séparation stricte UI / Logique métier (BLoC ou Provider)',
      'Gestion mémoire optimisée pour 60fps constants sur mobile',
      'Widgets const pour éviter les re-renders inutiles'
    ]
  }
];

export const FRAMEWORKS: FrameworkDef[] = [
  {
    id: 'react',
    name: 'React 19',
    languageId: 'typescript',
    category: 'frontend',
    tagline: 'Composants fonctionnels modulaires, hooks modernes et Tailwind CSS',
    recommendedDatabases: ['supabase', 'postgresql', 'indexeddb'],
    bestPractices: [
      'Composants fonctionnels purs avec hooks spécialisés (useState, useEffect, useMemo)',
      'Découpage granulaire des sous-composants pour éviter les re-rendus coûteux',
      'Gestionnaire d\'état prévisible et découplé de la couche de rendu',
      'Stylisation Tailwind CSS sans classes CSS inline désordonnées'
    ]
  },
  {
    id: 'django',
    name: 'Django 5.x',
    languageId: 'python',
    category: 'fullstack',
    tagline: 'Le framework Python de référence : ORM puissant, sécurité CSRF et Django REST',
    recommendedDatabases: ['postgresql', 'sqlite', 'mysql'],
    bestPractices: [
      'Modèles ORM déclaratifs avec clés primaires UUID et indexation des champs de recherche',
      'Sérialiseurs REST Framework validant chaque payload entrant',
      'Protection native CSRF, XSS et injections SQL via requêtes ORM paramétrées',
      'Découpage en applications modulaires réutilisables (apps/)'
    ]
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    languageId: 'python',
    category: 'backend',
    tagline: 'APIs asynchrones haute performance en Python avec documentation OpenAPI automatique',
    recommendedDatabases: ['mongodb', 'postgresql', 'sqlite'],
    bestPractices: [
      'Modèles Pydantic V2 pour la sérialisation et validation stricte des données',
      'Fonctions asynchrones (async def) pour gérer des milliers de requêtes concurrentes',
      'Injection de dépendances (Depends) pour l\'authentification et les sessions BDD',
      'Documentation Swagger/OpenAPI interactive générée automatiquement'
    ]
  },
  {
    id: 'nextjs',
    name: 'Next.js (App Router)',
    languageId: 'typescript',
    category: 'fullstack',
    tagline: 'Framework React complet avec Server Components, Route Handlers et SEO optimal',
    recommendedDatabases: ['postgresql', 'supabase', 'mongodb'],
    bestPractices: [
      'Exploitation des React Server Components (RSC) pour minimiser le bundle JS client',
      'Server Actions sécurisées pour la mutation directe des données',
      'Optimisation automatique des polices et images (next/image, next/font)',
      'Validation de schéma avec Zod dans les Route Handlers (/api/*)'
    ]
  },
  {
    id: 'vue',
    name: 'Vue 3 (Composition API)',
    languageId: 'javascript',
    category: 'frontend',
    tagline: 'Réactivité fluide avec <script setup>, Pinia et architecture légère',
    recommendedDatabases: ['indexeddb', 'supabase', 'firebase'],
    bestPractices: [
      'Syntaxe <script setup> concise avec ref() et computed()',
      'Store centralisé Pinia pour la persistance d\'état prévisible',
      'Directives v-bind et v-model avec typage d\'événements strict',
      'Composables réutilisables pour factoriser la logique métier'
    ]
  },
  {
    id: 'express',
    name: 'Express.js',
    languageId: 'javascript',
    category: 'backend',
    tagline: 'Micro-serveur Node.js rapide, flexible et idéal pour les microservices REST',
    recommendedDatabases: ['mongodb', 'postgresql', 'sqlite'],
    bestPractices: [
      'Organisation en contrôleurs, services et routes modulaires (express.Router)',
      'Middlewares de sécurité (Helmet, CORS, rate-limiting)',
      'Gestion centralisée des erreurs avec code HTTP approprié',
      'Validation des requêtes via Joi ou Zod avant traitement'
    ]
  },
  {
    id: 'laravel',
    name: 'Laravel 11',
    languageId: 'php',
    category: 'fullstack',
    tagline: 'L\'élégance PHP : Eloquent ORM, files d\'attente, migrations et Blade/API',
    recommendedDatabases: ['mysql', 'postgresql', 'sqlite'],
    bestPractices: [
      'Eloquent ORM avec relations typées (hasMany, belongsTo) et eager loading',
      'Form Requests pour valider les règles métiers avant d\'entrer dans le contrôleur',
      'Migrations de schéma de base de données versionnées et réversibles',
      'Sécurité CSRF activée sur toutes les requêtes web'
    ]
  },
  {
    id: 'vanilla',
    name: 'HTML5 / Tailwind PWA',
    languageId: 'javascript',
    category: 'frontend',
    tagline: 'Application autonome ultra-rapide, 100% installable, zéro compilation',
    recommendedDatabases: ['indexeddb'],
    bestPractices: [
      'Zéro dépendance bloquante, chargement instantané < 0.5s',
      'Manifest PWA complet pour installation mobile et desktop',
      'Service Worker avec stratégie de cache Stale-While-Revalidate',
      'Persistance locale chiffrée avec IndexedDB / LocalStorage'
    ]
  }
];

export const DATABASE_ENGINES: DatabaseDef[] = [
  // SQL Databases
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'sql',
    tagline: 'Standard relationnel d\'entreprise, intégrité référentielle et requêtes complexes',
    pricingType: 'both',
    bestPractices: [
      'Schémas normalisés (3NF) avec contraintes de clés étrangères (FOREIGN KEY)',
      'Index B-Tree sur les colonnes fréquemment filtrées et clés de recherche',
      'Transactions ACID pour garantir la cohérence absolue lors des opérations financières',
      'Horodatages automatiques (created_at, updated_at) avec déclencheurs ou valeurs par défaut'
    ]
  },
  {
    id: 'sqlite',
    name: 'SQLite 3',
    type: 'sql',
    tagline: 'Base relationnelle fichier locale, ultra-légère, zéro configuration serveur',
    pricingType: 'free',
    bestPractices: [
      'Activation du mode WAL (Write-Ahead Logging) pour des écritures concurrentes rapides',
      'Contraintes CHECK et NOT NULL pour garantir l\'intégrité sans serveur',
      'Idéal pour prototypes, applications mobiles locales ou applications de bureau',
      'Sauvegarde instantanée par simple copie de fichier'
    ]
  },
  {
    id: 'supabase',
    name: 'Supabase PostgreSQL Cloud',
    type: 'sql',
    tagline: 'PostgreSQL dans le cloud avec Row Level Security (RLS) et API instantanée',
    pricingType: 'free',
    bestPractices: [
      'Règles Row Level Security (RLS) protégeant chaque ligne par identifiant utilisateur',
      'Abonnements en temps réel (Realtime WebSockets) pour les changements de données',
      'Requêtes directes typées côté client sans exposition de clé secrète',
      'Tier gratuit généreux sans frais de carte bancaire'
    ]
  },
  {
    id: 'mysql',
    name: 'MySQL 8',
    type: 'sql',
    tagline: 'Moteur relationnel InnoDB robuste, omniprésent et hautement optimisé pour le web',
    pricingType: 'both',
    bestPractices: [
      'Encodage utf8mb4 pour le support complet des émojis et caractères internationaux',
      'Moteur InnoDB par défaut garantissant le support des transactions',
      'Clés primaires auto-incrémentées ou UUID binaires pour la distribution',
      'Requêtes paramétrées obligatoires contre les injections SQL'
    ]
  },
  // NoSQL Databases
  {
    id: 'indexeddb',
    name: 'IndexedDB & LocalStorage',
    type: 'nosql',
    tagline: 'Stockage NoSQL local dans le navigateur, 100% hors-ligne, zéro coût serveur',
    pricingType: 'free',
    bestPractices: [
      'Transactions d\'objets sécurisées avec gestion des versions de schéma',
      'Indexation multi-critères pour des recherches instantanées sur l\'appareil',
      'Synchronisation asynchrone en arrière-plan lorsque la connexion est rétablie',
      'Respect des quotas de stockage de l\'appareil mobile'
    ]
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'nosql',
    tagline: 'Base orientée documents JSON/BSON, schéma hautement évolutif et flexible',
    pricingType: 'both',
    bestPractices: [
      'Modélisation orientée cas d\'usage (documents imbriqués vs références selon le ratio lecture/écriture)',
      'Index composés sur les filtres fréquents et index TTL pour l\'expiration automatique',
      'Validation de schéma JSON Schema intégrée au niveau de la collection',
      'Pipelines d\'agrégation performants pour les statistiques et dashboards'
    ]
  },
  {
    id: 'firestore',
    name: 'Firebase Firestore',
    type: 'nosql',
    tagline: 'Base de données temps réel Cloud avec synchronisation hors-ligne native',
    pricingType: 'both',
    bestPractices: [
      'Sécurité granulaire via règles firestore.rules basées sur request.auth',
      'Sous-collections pour organiser les données hiérarchiques (utilisateurs/{id}/commandes)',
      'Mise en cache hors-ligne automatique sur mobile et web',
      'Requêtes composées avec index automatiques créés par la console'
    ]
  }
];

export interface TechStackPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  stack: TechStackSelection;
}

export const TECH_STACK_PRESETS: TechStackPreset[] = [
  {
    id: 'react-ts-supabase',
    name: 'React 19 + TypeScript + Supabase SQL',
    badge: 'Recommandé Web Moderne',
    description: 'Interface réactive typée, composants modulaires, base de données relationnelle Cloud avec sécurité RLS.',
    stack: {
      language: 'typescript',
      framework: 'react',
      databaseType: 'sql',
      databaseEngine: 'supabase',
      architecturePattern: 'SPA Réactive + REST/Realtime Backend'
    }
  },
  {
    id: 'django-python-postgres',
    name: 'Python Django + PostgreSQL SQL',
    badge: 'Robustesse Backend & ORM',
    description: 'Architecture Python conforme PEP 8, Django REST Framework, ORM sécurisé avec migrations et base PostgreSQL.',
    stack: {
      language: 'python',
      framework: 'django',
      databaseType: 'sql',
      databaseEngine: 'postgresql',
      architecturePattern: 'REST API + MTV Architecture'
    }
  },
  {
    id: 'fastapi-python-mongo',
    name: 'Python FastAPI + MongoDB NoSQL',
    badge: 'Haute Performance & Async',
    description: 'Endpoints asynchrones en Python 3.12+, validation Pydantic V2, documents JSON flexibles MongoDB.',
    stack: {
      language: 'python',
      framework: 'fastapi',
      databaseType: 'nosql',
      databaseEngine: 'mongodb',
      architecturePattern: 'Microservice Async + Document Store'
    }
  },
  {
    id: 'mobile-pwa-offline',
    name: 'HTML5/React PWA + IndexedDB NoSQL',
    badge: '100% Hors-ligne & Gratuit',
    description: 'Zéro frais d\'hébergement serveur, fonctionne sur tout smartphone sans connexion, stockage NoSQL local.',
    stack: {
      language: 'javascript',
      framework: 'vanilla',
      databaseType: 'nosql',
      databaseEngine: 'indexeddb',
      architecturePattern: 'Offline-first PWA Autonome'
    }
  },
  {
    id: 'nextjs-ts-postgres',
    name: 'Next.js + TypeScript + PostgreSQL',
    badge: 'Fullstack Cloud',
    description: 'Server Components, Route Handlers, typage strict et base SQL haute disponibilité pour la production.',
    stack: {
      language: 'typescript',
      framework: 'nextjs',
      databaseType: 'sql',
      databaseEngine: 'postgresql',
      architecturePattern: 'Fullstack SSR + Route Handlers'
    }
  }
];
