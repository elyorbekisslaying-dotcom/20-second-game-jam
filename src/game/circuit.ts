export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

export type Pos = { x: number; y: number };

export type CircuitPuzzle = {
  cols: number;
  rows: number;
  tiles: number[];
  answer: number[];
  start: Pos;
  end: Pos;
};

const SHAPES = [N | E, E | S, S | W, W | N, N | S, E | W];

export function rotateMask(mask: number, turns = 1): number {
  let m = mask;
  const n = ((turns % 4) + 4) % 4;
  for (let i = 0; i < n; i++) {
    let next = 0;
    if (m & N) next |= E;
    if (m & E) next |= S;
    if (m & S) next |= W;
    if (m & W) next |= N;
    m = next;
  }
  return m;
}

export function trace(
  tiles: number[],
  cols: number,
  rows: number,
  start: Pos,
  end: Pos,
): { powered: Set<number>; solved: boolean; dist: Map<number, number> } {
  const powered = new Set<number>();
  const dist = new Map<number, number>();
  const at = (x: number, y: number) => y * cols + x;
  const startI = at(start.x, start.y);
  if (((tiles[startI] ?? 0) & W) === 0) return { powered, solved: false, dist };

  const opp: Record<number, number> = { [E]: W, [W]: E, [N]: S, [S]: N };
  const delta: Record<number, [number, number]> = {
    [N]: [0, -1],
    [E]: [1, 0],
    [S]: [0, 1],
    [W]: [-1, 0],
  };
  const q = [startI];
  powered.add(startI);
  dist.set(startI, 0);
  while (q.length) {
    const i = q.shift()!;
    const x = i % cols;
    const y = Math.floor(i / cols);
    const mask = tiles[i] ?? 0;
    for (const dir of [N, E, S, W]) {
      if ((mask & dir) === 0) continue;
      const [dx, dy] = delta[dir]!;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const ni = at(nx, ny);
      if (((tiles[ni] ?? 0) & (opp[dir] ?? 0)) === 0) continue;
      if (!powered.has(ni)) {
        powered.add(ni);
        dist.set(ni, (dist.get(i) ?? 0) + 1);
        q.push(ni);
      }
    }
  }
  const endI = at(end.x, end.y);
  const solved = powered.has(endI) && ((tiles[endI] ?? 0) & E) !== 0;
  return { powered, solved, dist };
}

function toward(a: Pos, b: Pos): number {
  if (b.x === a.x + 1) return E;
  if (b.x === a.x - 1) return W;
  if (b.y === a.y + 1) return S;
  if (b.y === a.y - 1) return N;
  return 0;
}

function cornerCount(path: Pos[]): number {
  let c = 0;
  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1]!;
    const cur = path[i]!;
    const next = path[i + 1]!;
    const dx1 = cur.x - prev.x;
    const dy1 = cur.y - prev.y;
    const dx2 = next.x - cur.x;
    const dy2 = next.y - cur.y;
    if (dx1 !== dx2 || dy1 !== dy2) c++;
  }
  return c;
}

function findPath(cols: number, rows: number, rng: () => number, sy: number, ey: number): Pos[] | null {
  const start = { x: 0, y: sy };
  const path: Pos[] = [start];
  const seen = new Set<string>([`${start.x},${start.y}`]);

  const dfs = (cur: Pos): boolean => {
    if (cur.x === cols - 1 && cur.y === ey) return true;
    const nbs: Pos[] = [
      { x: cur.x + 1, y: cur.y },
      { x: cur.x, y: cur.y + 1 },
      { x: cur.x, y: cur.y - 1 },
      { x: cur.x - 1, y: cur.y },
    ].filter((p) => p.x >= 0 && p.y >= 0 && p.x < cols && p.y < rows && !seen.has(`${p.x},${p.y}`));
    nbs.sort((a, b) => {
      const sa = rng() - (a.x > cur.x ? 0.45 : 0);
      const sb = rng() - (b.x > cur.x ? 0.45 : 0);
      return sa - sb;
    });
    for (const n of nbs) {
      seen.add(`${n.x},${n.y}`);
      path.push(n);
      if (dfs(n)) return true;
      path.pop();
      seen.delete(`${n.x},${n.y}`);
    }
    return false;
  };

  if (!dfs(start)) return null;
  return path.slice();
}

function masksFromPath(path: Pos[], cols: number, rows: number, rng: () => number): number[] {
  const tiles = new Array<number>(cols * rows).fill(0);
  for (let i = 0; i < path.length; i++) {
    const p = path[i]!;
    let mask = 0;
    if (i === 0) mask |= W;
    else mask |= toward(p, path[i - 1]!);
    if (i === path.length - 1) mask |= E;
    else mask |= toward(p, path[i + 1]!);
    tiles[p.y * cols + p.x] = mask;
  }
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === 0) tiles[i] = SHAPES[Math.floor(rng() * SHAPES.length)]!;
  }
  return tiles;
}

const FALLBACK: Pos[] = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 3, y: 2 },
];

export function generateCircuit(rng: () => number = Math.random): CircuitPuzzle {
  const cols = 4;
  const rows = 3;
  let path: Pos[] | null = null;
  for (let attempt = 0; attempt < 28 && !path; attempt++) {
    const sy = Math.floor(rng() * rows);
    const ey = Math.floor(rng() * rows);
    const candidate = findPath(cols, rows, rng, sy, ey);
    if (!candidate) continue;
    if (candidate.length >= 6 && cornerCount(candidate) >= 2) path = candidate;
    else if (attempt > 18) path = candidate;
  }
  if (!path) path = FALLBACK.map((p) => ({ ...p }));

  const start = path[0]!;
  const end = path[path.length - 1]!;
  let answer = masksFromPath(path, cols, rows, rng);
  if (!trace(answer, cols, rows, start, end).solved) {
    path = FALLBACK.map((p) => ({ ...p }));
    answer = masksFromPath(path, cols, rows, rng);
  }

  const pathIdx = new Set(path.map((p) => p.y * cols + p.x));
  let tiles = answer.slice();
  for (let attempt = 0; attempt < 10; attempt++) {
    tiles = answer.map((mask, i) => {
      if (!pathIdx.has(i)) return rotateMask(mask, Math.floor(rng() * 4));
      return rotateMask(mask, 1 + Math.floor(rng() * 3));
    });
    if (!trace(tiles, cols, rows, start, end).solved) break;
  }

  const endI = end.y * cols + end.x;
  let guard = 0;
  while (trace(tiles, cols, rows, start, end).solved && guard < 3) {
    tiles[endI] = rotateMask(tiles[endI] ?? 0, 1);
    guard++;
  }

  return { cols, rows, tiles, answer, start, end };
}
