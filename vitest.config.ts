import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  // Transform JSX with the automatic runtime (no explicit React import needed).
  esbuild: { jsx: "automatic" },
  resolve: {
    // Mirror the tsconfig "@/*" path alias for imports in tests.
    alias: { "@": path.resolve(process.cwd()) },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    // lib/supabase reads these at module load; stubs keep the client live for
    // any test that doesn't mock the module outright.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "sb_publishable_test",
    },
  },
});
