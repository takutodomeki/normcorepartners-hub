import manifest from "@/data/tools.json";

export const STATUSES = ["live", "beta", "archived", "broken"] as const;

export type ToolStatus = (typeof STATUSES)[number];

export type Tool = {
  id: string;
  name: string;
  sentence: string;
  url: string;
  status: ToolStatus;
  /** ISO date, YYYY-MM-DD. First published. */
  launched: string;
  /** ISO date, YYYY-MM-DD. Most recent quarterly check. */
  lastChecked: string;
  /** Optional URL or path to a longer write-up. */
  notes?: string;
  /** Optional ISO date after which the tool is expected to stop being accurate. */
  retireBy?: string;
};

/** Days past `lastChecked` before the audit view flags a tool. */
export const AUDIT_THRESHOLD_DAYS = 90;

/**
 * Display order. `live` and `beta` are primary; `archived` and `broken` stay
 * listed but subordinate — hiding a dead tool is the failure mode this
 * whole system exists to prevent.
 */
export const STATUS_ORDER: ToolStatus[] = ["live", "beta", "archived", "broken"];

export const STATUS_HEADINGS: Record<ToolStatus, string> = {
  live: "Live",
  beta: "Beta",
  archived: "Archived",
  broken: "Broken",
};

export function getTools(): Tool[] {
  return manifest as Tool[];
}

export function groupByStatus(tools: Tool[]): [ToolStatus, Tool[]][] {
  return STATUS_ORDER.map(
    (status) => [status, tools.filter((t) => t.status === status)] as [ToolStatus, Tool[]],
  ).filter(([, group]) => group.length > 0);
}

/** Parse a YYYY-MM-DD manifest date as UTC midnight. Returns null if unparseable. */
function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/** Whole days between a manifest date and today. Null if the date is unparseable. */
export function daysSince(value: string | undefined): number | null {
  const date = parseDate(value);
  if (!date) return null;
  return Math.round((todayUTC().getTime() - date.getTime()) / 86_400_000);
}

/** True when `retireBy` is set and has passed. */
export function isPastRetireBy(tool: Tool): boolean {
  const date = parseDate(tool.retireBy);
  return date !== null && date.getTime() < todayUTC().getTime();
}

/** "1 January 2026", or the raw string if it does not parse. */
export function formatDate(value: string | undefined): string {
  const date = parseDate(value);
  if (!date) return value ?? "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
