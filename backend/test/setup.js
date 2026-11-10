import { beforeEach, afterAll } from 'vitest';
import { db } from '../src/db.js';

// Chaque test part d'une base vide
beforeEach(async () => {
  await db.query('DELETE FROM utilisateurs');
});

// Ferme le pool pour que Vitest puisse se terminer
afterAll(async () => {
  await db.end();
});
