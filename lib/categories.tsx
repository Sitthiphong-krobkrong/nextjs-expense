import type { ReactNode } from "react";
import type { TranslationKey } from "./i18n";

export type TxType = "income" | "expense";
export type CategoryId =
  | "food"
  | "transport"
  | "home"
  | "shopping"
  | "health"
  | "entertainment"
  | "bills"
  | "other_expense"
  | "salary"
  | "bonus"
  | "other_income";

export interface Category {
  id: CategoryId;
  type: TxType;
  labelKey: TranslationKey;
  // Tailwind color family used for badge + icon background
  // (เลือกที่ contrast ดีทั้ง light/dark)
  color: "amber" | "sky" | "emerald" | "pink" | "rose" | "indigo" | "violet" | "slate" | "teal" | "lime";
  Icon: (props: { size?: number; className?: string }) => ReactNode;
}

const baseSvg = (size = 18, className = ""): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className,
});

// ── Icons (Lucide-style, monochrome, stroke-based) ─────────────────────
const FoodIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);

const TransportIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const HomeIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ShoppingIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" x2="21" y1="6" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const HealthIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const EntertainmentIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M3 7.5h4" />
    <path d="M3 12h18" />
    <path d="M3 16.5h4" />
    <path d="M17 3v18" />
    <path d="M17 7.5h4" />
    <path d="M17 16.5h4" />
  </svg>
);

const BillsIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <path d="M12 17.5v-11" />
  </svg>
);

const OtherIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const SalaryIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const BonusIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

const PlusCircleIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg {...baseSvg(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);

// ── Catalog ────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  // Expense
  { id: "food", type: "expense", labelKey: "cat_food", color: "amber", Icon: FoodIcon },
  { id: "transport", type: "expense", labelKey: "cat_transport", color: "sky", Icon: TransportIcon },
  { id: "home", type: "expense", labelKey: "cat_home", color: "teal", Icon: HomeIcon },
  { id: "shopping", type: "expense", labelKey: "cat_shopping", color: "pink", Icon: ShoppingIcon },
  { id: "health", type: "expense", labelKey: "cat_health", color: "rose", Icon: HealthIcon },
  { id: "entertainment", type: "expense", labelKey: "cat_entertainment", color: "violet", Icon: EntertainmentIcon },
  { id: "bills", type: "expense", labelKey: "cat_bills", color: "indigo", Icon: BillsIcon },
  { id: "other_expense", type: "expense", labelKey: "cat_other_expense", color: "slate", Icon: OtherIcon },
  // Income
  { id: "salary", type: "income", labelKey: "cat_salary", color: "emerald", Icon: SalaryIcon },
  { id: "bonus", type: "income", labelKey: "cat_bonus", color: "lime", Icon: BonusIcon },
  { id: "other_income", type: "income", labelKey: "cat_other_income", color: "slate", Icon: PlusCircleIcon },
];

export function getCategoriesForType(type: TxType): Category[] {
  return CATEGORIES.filter((c) => c.type === type);
}

// คืน category จาก id; ถ้าหาไม่เจอ (เช่น tx เก่าไม่มี field) ให้ fallback ตาม type
export function getCategoryById(id: string | undefined, fallbackType: TxType = "expense"): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (found) return found;
  return CATEGORIES.find(
    (c) => c.id === (fallbackType === "income" ? "other_income" : "other_expense")
  )!;
}

export function defaultCategoryFor(type: TxType): CategoryId {
  return type === "income" ? "other_income" : "other_expense";
}

// Tailwind class map — generate explicit classes ที่ Tailwind สามารถ scan ได้ตอน build
// (ห้ามต่อ string แบบ `bg-${color}-100` เพราะ Tailwind จะ purge ทิ้ง)
export const COLOR_CLASSES: Record<Category["color"], { bg: string; text: string; ring: string }> = {
  amber: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", ring: "ring-amber-400/60" },
  sky: { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400", ring: "ring-sky-400/60" },
  emerald: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", ring: "ring-emerald-400/60" },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/30", text: "text-pink-700 dark:text-pink-400", ring: "ring-pink-400/60" },
  rose: { bg: "bg-rose-100 dark:bg-rose-900/30", text: "text-rose-700 dark:text-rose-400", ring: "ring-rose-400/60" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", text: "text-indigo-700 dark:text-indigo-400", ring: "ring-indigo-400/60" },
  violet: { bg: "bg-violet-100 dark:bg-violet-900/30", text: "text-violet-700 dark:text-violet-400", ring: "ring-violet-400/60" },
  slate: { bg: "bg-slate-100 dark:bg-slate-800/60", text: "text-slate-700 dark:text-slate-300", ring: "ring-slate-400/60" },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400", ring: "ring-teal-400/60" },
  lime: { bg: "bg-lime-100 dark:bg-lime-900/30", text: "text-lime-700 dark:text-lime-400", ring: "ring-lime-400/60" },
};
