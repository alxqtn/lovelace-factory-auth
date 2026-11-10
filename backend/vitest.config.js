import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Valeurs de test uniquement : la base « db-test » de compose.yaml
    env: {
      DATABASE_URL: 'postgres://postgres:postgres@localhost:5433/lovelace_factory_test',
      JWT_SECRET: 'secret-de-test',
    },
    setupFiles: ['./test/setup.js'],
    restoreMocks: true, // remet les vraies fonctions après chaque test (vi.spyOn)
    fileParallelism: false, // les fichiers de test partagent la même base
  },
});
