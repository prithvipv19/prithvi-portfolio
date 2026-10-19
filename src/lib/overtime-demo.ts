// Rules engine and seed data for the Overtime demo (/work/overtime-module/demo).
// Everything is fictional and lives in memory; a reload resets it.

export type DayType = 'regular' | 'rest' | 'holiday';
export type Rounding = 'down' | 'up' | 'normal' | 'none';
export type Status = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export const dayTypes: { id: DayType; label: string }[] = [
  { id: 'regular', label: 'Regular day' },
  { id: 'rest', label: 'Rest day' },
  { id: 'holiday', label: 'Holiday' },
];

export interface Policy {
  name: string;
  breakMin: Record<DayType, number>;
  minMin: Record<DayType, number>;
  block: number;
  rounding: Rounding;
  dailyCapMin: number;
  monthlyCapMin: number;
  method: 'component' | 'flat';
  multiplier: Record<DayType, number>;
  flatRate: Record<DayType, number>;
}

export interface Employee {
  id: string;
  name: string;
  dept: string;
  basic: number; // monthly, in rupees
}

export interface Clocked {
  empId: string;
  date: string; // ISO yyyy-mm-dd
  dayType: DayType;
  extraMin: number; // time beyond shift, from attendance
}

export interface OtRequest {
  id: number;
  empId: string;
  date: string;
  minutes: number;
  reason: string;
  by: 'employee' | 'manager';
  status: Status;
  remarks?: string;
  final?: { as: 'considered' | 'ignored'; payMonth?: string };
}

export const defaultPolicy = (): Policy => ({
  name: 'Plant overtime policy',
  breakMin: { regular: 0, rest: 15, holiday: 15 },
  minMin: { regular: 30, rest: 60, holiday: 60 },
  block: 15,
  rounding: 'down',
  dailyCapMin: 4 * 60,
  monthlyCapMin: 20 * 60,
  method: 'component',
  multiplier: { regular: 2, rest: 2, holiday: 3 },
  flatRate: { regular: 150, rest: 200, holiday: 300 },
});

export const employees: Employee[] = [
  { id: 'E101', name: 'Asha Rao', dept: 'Paint shop', basic: 26000 },
  { id: 'E102', name: 'Ravi Kumar', dept: 'Paint shop', basic: 24000 },
  { id: 'E103', name: 'Meena Iyer', dept: 'Welding', basic: 28000 },
  { id: 'E104', name: 'Joseph D’Souza', dept: 'Welding', basic: 22000 },
];

export const me = 'E101';
export const managerName = 'Vikram Shah';

export const clocked: Clocked[] = [
  { empId: 'E101', date: '2026-10-03', dayType: 'regular', extraMin: 140 },
  { empId: 'E101', date: '2026-10-04', dayType: 'rest', extraMin: 320 },
  { empId: 'E101', date: '2026-10-08', dayType: 'regular', extraMin: 25 },
  { empId: 'E101', date: '2026-10-12', dayType: 'regular', extraMin: 95 },
  { empId: 'E101', date: '2026-10-15', dayType: 'regular', extraMin: 178 },
  { empId: 'E101', date: '2026-10-02', dayType: 'holiday', extraMin: 260 },
  { empId: 'E102', date: '2026-10-05', dayType: 'regular', extraMin: 200 },
  { empId: 'E102', date: '2026-10-11', dayType: 'rest', extraMin: 480 },
  { empId: 'E102', date: '2026-10-14', dayType: 'regular', extraMin: 130 },
  { empId: 'E103', date: '2026-10-06', dayType: 'regular', extraMin: 90 },
  { empId: 'E103', date: '2026-10-13', dayType: 'regular', extraMin: 150 },
  { empId: 'E104', date: '2026-10-07', dayType: 'regular', extraMin: 240 },
  { empId: 'E104', date: '2026-10-09', dayType: 'regular', extraMin: 240 },
  { empId: 'E104', date: '2026-10-10', dayType: 'rest', extraMin: 480 },
  { empId: 'E104', date: '2026-10-16', dayType: 'regular', extraMin: 240 },
  { empId: 'E104', date: '2026-10-17', dayType: 'rest', extraMin: 480 },
  { empId: 'E104', date: '2026-10-18', dayType: 'regular', extraMin: 240 },
  { empId: 'E103', date: '2026-09-27', dayType: 'rest', extraMin: 200 },
];

export const seedRequests = (): OtRequest[] => [
  { id: 1, empId: 'E102', date: '2026-10-05', minutes: 180, reason: 'Line 2 backlog', by: 'employee', status: 'pending' },
  { id: 2, empId: 'E103', date: '2026-10-13', minutes: 150, reason: 'Fixture rework', by: 'employee', status: 'pending' },
  { id: 3, empId: 'E104', date: '2026-10-07', minutes: 240, reason: 'Export order', by: 'employee', status: 'approved' },
  { id: 4, empId: 'E104', date: '2026-10-09', minutes: 240, reason: 'Export order', by: 'employee', status: 'approved' },
  { id: 5, empId: 'E104', date: '2026-10-10', minutes: 240, reason: 'Export order', by: 'employee', status: 'approved' },
  // Approved late: worked in September, so it's paid as an arrear.
  { id: 6, empId: 'E103', date: '2026-09-27', minutes: 180, reason: 'Month-end dispatch', by: 'employee', status: 'approved' },
];

/** Already-paid line shown in the register to illustrate a reversal. */
export const seededReversal = { empId: 'E102', date: '2026-09-14', minutes: -60, note: 'Hours corrected after September payout' };

export const monthOf = (iso: string) => iso.slice(0, 7);
export const currentMonth = '2026-10';

export function hhmm(min: number) {
  const sign = min < 0 ? '−' : '';
  const m = Math.abs(Math.round(min));
  return `${sign}${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

export const rupees = (n: number) => `${n < 0 ? '−' : ''}₹${Math.abs(Math.round(n)).toLocaleString('en-IN')}`;

export function roundToBlock(min: number, block: number, mode: Rounding) {
  if (mode === 'none' || block <= 1) return min;
  const q = min / block;
  const r = mode === 'up' ? Math.ceil(q) : mode === 'down' ? Math.floor(q) : Math.round(q);
  return r * block;
}

export interface Breakdown {
  worked: number;
  afterBreak: number;
  belowMin: boolean;
  rounded: number;
  eligible: number;
  capped: boolean;
}

/** Turn clocked extra time into eligible OT minutes, step by step. */
export function eligibleOt(p: Policy, dayType: DayType, extraMin: number): Breakdown {
  const afterBreak = Math.max(0, extraMin - p.breakMin[dayType]);
  const belowMin = afterBreak < p.minMin[dayType];
  const rounded = belowMin ? 0 : roundToBlock(afterBreak, p.block, p.rounding);
  const eligible = Math.min(rounded, p.dailyCapMin);
  return { worked: extraMin, afterBreak, belowMin, rounded, eligible, capped: rounded > p.dailyCapMin };
}

/** Hourly OT rate for an employee on a day type. Component method: Basic / (26 days × 8 h) × multiplier. */
export function hourlyRate(p: Policy, emp: Employee, dayType: DayType) {
  if (p.method === 'flat') return p.flatRate[dayType];
  return (emp.basic / (26 * 8)) * p.multiplier[dayType];
}
