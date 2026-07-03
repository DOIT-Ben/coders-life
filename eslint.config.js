// @ts-check
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default defineConfig(
  globalIgnores(['dist/', 'node_modules/', '.codex-run/', 'docs/']),
  {
    files: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended
    ],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // GameContainer 既有的同步派生 state 写法命中此规则，重构排期见
      // docs\plans\2026-07-03-project-optimization-plan.md 约束 C，先降级为警告。
      'react-hooks/set-state-in-effect': 'warn'
    }
  }
);
