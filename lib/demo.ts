// Demo nalozi za prijavu jednim klikom; koristi ih i scripts/seed.ts.

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const demoAccounts = {
  member: { email: "clanica@demo.local", label: "Uđi kao članica" },
  assistant: { email: "petra@demo.local", label: "Uđi kao asistentica" },
  admin: { email: "andreja@demo.local", label: "Uđi kao Andreja" },
} as const;

export type DemoRole = keyof typeof demoAccounts;

export function demoPassword() {
  return process.env.DEMO_PASSWORD || "demo1234";
}
