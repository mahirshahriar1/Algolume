/**
 * Bit-manipulation visualizer. Shows 8-bit operands as rows of bits with place
 * values, and animates a bitwise operation column by column (or a shift sliding
 * the bits). Covers AND/OR/XOR/NOT, left/right shift, and the two classic tricks
 * x & -x (lowest set bit) and x & (x-1) (clear lowest set bit).
 */

export const BIT_WIDTH = 8;
export const BIT_MASK = (1 << BIT_WIDTH) - 1;

export type BitOp = "and" | "or" | "xor" | "not" | "shl" | "shr" | "lowbit" | "clearlow";

export interface BitRow {
  label: string;
  bits: number[]; // MSB..LSB, length BIT_WIDTH
}

export interface BitFrame {
  width: number;
  rows: BitRow[]; // operand rows (A, optional B)
  result: (number | null)[]; // MSB..LSB, null = not computed yet
  resultLabel: string;
  activeCol: number; // -1 = none
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

const toBits = (n: number): number[] =>
  Array.from({ length: BIT_WIDTH }, (_, i) => (n >> (BIT_WIDTH - 1 - i)) & 1);

const bitsToNum = (bits: (number | null)[]): number =>
  bits.reduce<number>((acc, b, i) => acc + (b ? 1 << (BIT_WIDTH - 1 - i) : 0), 0);

export const BIT_OPS: { id: BitOp; label: string; symbol: string; binary: boolean }[] = [
  { id: "and", label: "AND", symbol: "&", binary: true },
  { id: "or", label: "OR", symbol: "|", binary: true },
  { id: "xor", label: "XOR", symbol: "^", binary: true },
  { id: "not", label: "NOT", symbol: "~", binary: false },
  { id: "shl", label: "Left shift", symbol: "<<", binary: false },
  { id: "shr", label: "Right shift", symbol: ">>", binary: false },
  { id: "lowbit", label: "x & -x", symbol: "&", binary: false },
  { id: "clearlow", label: "x & (x-1)", symbol: "&", binary: false },
];

export const BIT_CODE: Record<BitOp, string[]> = {
  and: ["r = a & b", "# bit is 1 only where BOTH a and b are 1"],
  or: ["r = a | b", "# bit is 1 where EITHER a or b is 1"],
  xor: ["r = a ^ b", "# bit is 1 where a and b DIFFER"],
  not: ["r = ~a & MASK", "# flip every bit (within the width)"],
  shl: ["r = (a << k) & MASK", "# slide bits left; multiply by 2 each step"],
  shr: ["r = a >> k", "# slide bits right; floor-divide by 2 each step"],
  lowbit: ["r = a & (-a)", "# -a = ~a + 1, so this isolates the LOWEST set bit"],
  clearlow: ["r = a & (a - 1)", "# a-1 flips the lowest set bit + bits below it", "# the AND clears exactly that lowest set bit"],
};

const opBit = (op: BitOp, x: number, y: number): number => {
  if (op === "or") return x | y;
  if (op === "xor") return x ^ y;
  return x & y; // and / lowbit / clearlow
};

const stat = (label: string, value: string | number) => ({ label, value });

function binaryFrames(op: BitOp, aRaw: number, bRaw: number): BitFrame[] {
  const a = aRaw & BIT_MASK;
  let b = bRaw & BIT_MASK;
  let bLabel = "b";
  if (op === "lowbit") { b = -aRaw & BIT_MASK; bLabel = "-a"; }
  if (op === "clearlow") { b = (aRaw - 1) & BIT_MASK; bLabel = "a-1"; }
  const aBits = toBits(a);
  const bBits = toBits(b);
  const rows: BitRow[] = [
    { label: "a", bits: aBits },
    { label: bLabel, bits: bBits },
  ];
  const result: (number | null)[] = Array(BIT_WIDTH).fill(null);
  const frames: BitFrame[] = [];
  const lines = op === "and" || op === "or" || op === "xor" ? [1, 2] : op === "lowbit" ? [1, 2] : [1, 2, 3];

  const emit = (caption: string, activeCol: number) => {
    frames.push({
      width: BIT_WIDTH,
      rows,
      result: result.slice(),
      resultLabel: "r",
      activeCol,
      caption,
      lines,
      stats: [stat("a", a), stat(bLabel, b), stat("r", bitsToNum(result))],
    });
  };

  const intro =
    op === "lowbit"
      ? `x & -x isolates the lowest set bit. -a = ~a + 1 = ${b}.`
      : op === "clearlow"
        ? `x & (x-1) clears the lowest set bit. a-1 = ${b}.`
        : `Apply ${op.toUpperCase()} to each column.`;
  emit(intro, -1);
  for (let c = 0; c < BIT_WIDTH; c++) {
    const r = opBit(op, aBits[c], bBits[c]);
    result[c] = r;
    emit(`Column ${BIT_WIDTH - 1 - c} (value ${1 << (BIT_WIDTH - 1 - c)}): ${aBits[c]} ${BIT_OPS.find((o) => o.id === op)!.symbol} ${bBits[c]} = ${r}.`, c);
  }
  emit(`Result = ${bitsToNum(result)}.`, -1);
  return frames;
}

function notFrames(aRaw: number): BitFrame[] {
  const a = aRaw & BIT_MASK;
  const aBits = toBits(a);
  const rows: BitRow[] = [{ label: "a", bits: aBits }];
  const result: (number | null)[] = Array(BIT_WIDTH).fill(null);
  const frames: BitFrame[] = [];
  const emit = (caption: string, activeCol: number) =>
    frames.push({ width: BIT_WIDTH, rows, result: result.slice(), resultLabel: "~a", activeCol, caption, lines: [1, 2], stats: [stat("a", a), stat("~a", bitsToNum(result))] });
  emit(`NOT flips every bit (within ${BIT_WIDTH} bits).`, -1);
  for (let c = 0; c < BIT_WIDTH; c++) {
    result[c] = aBits[c] ^ 1;
    emit(`Flip column ${BIT_WIDTH - 1 - c}: ${aBits[c]} → ${result[c]}.`, c);
  }
  emit(`~a & MASK = ${bitsToNum(result)}.`, -1);
  return frames;
}

function shiftFrames(op: BitOp, aRaw: number, k: number): BitFrame[] {
  const steps = Math.max(0, Math.min(BIT_WIDTH, k));
  const a = aRaw & BIT_MASK;
  const aBits = toBits(a);
  const rows: BitRow[] = [{ label: "a", bits: aBits }];
  const frames: BitFrame[] = [];
  let cur = a;
  const emit = (caption: string) =>
    frames.push({
      width: BIT_WIDTH,
      rows,
      result: toBits(cur),
      resultLabel: "r",
      activeCol: -1,
      caption,
      lines: op === "shl" ? [1, 2] : [1, 2],
      stats: [stat("a", a), stat("shift", `${op === "shl" ? "<<" : ">>"} ${steps}`), stat("r", cur)],
    });
  emit(`Start: a = ${a}.`);
  for (let s = 1; s <= steps; s++) {
    cur = op === "shl" ? (cur << 1) & BIT_MASK : cur >> 1;
    emit(op === "shl" ? `Shift left 1 (×2) → ${cur}.` : `Shift right 1 (÷2) → ${cur}.`);
  }
  emit(`a ${op === "shl" ? "<<" : ">>"} ${steps} = ${cur}.`);
  return frames;
}

export function buildBitFrames(op: BitOp, a: number, b: number, k: number): BitFrame[] {
  if (op === "not") return notFrames(a);
  if (op === "shl" || op === "shr") return shiftFrames(op, a, k);
  return binaryFrames(op, a, b);
}

export function bitCode(op: BitOp): string[] {
  return BIT_CODE[op];
}

/** A canned demo (x & (x-1) clearing the lowest set bit) for lesson embeds. */
export function buildBitDemoFrames(): BitFrame[] {
  return buildBitFrames("lowbit", 0b10110, 0, 0);
}
