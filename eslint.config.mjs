import next from 'eslint-config-next';

export default [
  // Ignorar rutas donde no queremos bloquear
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'out/**', '_archive/**'],
  },
  // Base Next + ajustes
  ...next(),
  {
    rules: {
      // Relajar para MVP: feedback sin romper
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'react/no-unescaped-entities': 'off',
      // Reglas de Next que ahora mismo no bloquean
      '@next/next/no-html-link-for-pages': 'warn',
    },
  },
];
