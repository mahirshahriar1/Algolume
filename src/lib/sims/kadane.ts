/**
 * Kadane's maximum-subarray simulation. Scan left to right keeping a running
 * sum; at each element decide to **extend** the current subarray or **restart**
 * from here, and remember the best sum + window seen. Greedy/DP hybrid.
 */

export type KadaneCellRole = "default" | "current" | "window" | "best" | "bestcurrent";

export interface KadaneFrame {
  values: number[];
  roles: KadaneCellRole[];
  cur: number;
  best: number;
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const KADANE_CODE = [
  "best = cur = nums[0]",
  "for x in nums[1:]:",
  "    cur = max(x, cur + x)   # restart vs extend",
  "    best = max(best, cur)",
  "return best",
];

export function buildKadaneFrames(nums: number[]): KadaneFrame[] {
  if (nums.length === 0) return [];
  const frames: KadaneFrame[] = [];
  let cur = nums[0];
  let best = nums[0];
  let curStart = 0;
  let bestL = 0;
  let bestR = 0;

  const emit = (i: number, caption: string, lines: number[]) => {
    const roles: KadaneCellRole[] = nums.map((_, idx) => {
      const inBest = idx >= bestL && idx <= bestR;
      const inCur = idx >= curStart && idx <= i;
      if (idx === i) return "current";
      if (inBest && inCur) return "bestcurrent";
      if (inBest) return "best";
      if (inCur) return "window";
      return "default";
    });
    frames.push({
      values: nums,
      roles,
      cur,
      best,
      caption,
      lines,
      stats: [
        { label: "cur", value: cur },
        { label: "best", value: best },
        { label: "window", value: `[${bestL}…${bestR}]` },
      ],
    });
  };

  emit(0, `Start: cur = best = nums[0] = ${nums[0]}.`, [1]);
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > cur + nums[i]) {
      cur = nums[i];
      curStart = i;
      emit(i, `nums[${i}] = ${nums[i]} beats cur+nums[i] = ${cur} : restart the window here.`, [3]);
    } else {
      cur = cur + nums[i];
      emit(i, `Extend: cur = ${cur - nums[i]} + ${nums[i]} = ${cur}.`, [3]);
    }
    if (cur > best) {
      best = cur;
      bestL = curStart;
      bestR = i;
      emit(i, `New best = ${best} over window [${bestL}…${bestR}].`, [4]);
    }
  }
  emit(nums.length - 1, `Done — maximum subarray sum is ${best} (window [${bestL}…${bestR}]).`, [5]);
  return frames;
}
