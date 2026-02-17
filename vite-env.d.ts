// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Augment NodeJS.ProcessEnv to include API_KEY.
// This ensures process.env.API_KEY is typed correctly without conflicting
// with the global process declaration from @types/node.
declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}