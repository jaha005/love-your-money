// Demo accounts for one-click sign-in; scripts/seed.ts uses them too.

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const demoAccounts = {
  member: { email: "member@demo.local", label: "Enter as a member" },
  assistant: { email: "assistant@demo.local", label: "Enter as an assistant" },
  admin: { email: "andreja@demo.local", label: "Enter as Andreja" },
} as const;

export type DemoRole = keyof typeof demoAccounts;

export function demoPassword() {
  return process.env.DEMO_PASSWORD || "demo1234";
}
