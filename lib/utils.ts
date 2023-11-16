import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Options {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculatePasswordStrength(options: Options): number {
  let strengthScore = 0;
  strengthScore += options.length;
  if (options.uppercase) strengthScore += 2;
  if (options.lowercase) strengthScore += 2;
  if (options.numbers) strengthScore += 2;
  if (options.symbols) strengthScore += 2;
  return strengthScore;
}

export const strengthLevels = [
  { label: "Too Weak", color: "r" },
  { label: "Weak", color: "o" },
  { label: "Medium", color: "y" },
  { label: "Strong", color: "g" },
];

export function determineStrengthLevel(strengthScore: number) {
  if (strengthScore <= 8) return strengthLevels[0];
  if (strengthScore <= 16) return strengthLevels[1];
  if (strengthScore <= 24) return strengthLevels[2];
  return strengthLevels[3];
}

export const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy password: ", err);
  }
};
