import { AnimationType } from '../types';

/**
 * Representation of an individual SVG path command
 */
export interface PathCommand {
  type: string;
  values: number[];
}

/**
 * Options for calculating intermediate path data transitions
 */
export interface MorphTransitionOptions {
  /** Number of intermediate transition frames to generate */
  steps?: number;
  /** Floating-point precision for coordinates (default: 2) */
  precision?: number;
  /** Custom easing function (default: cubic ease-in-out) */
  ease?: (t: number) => number;
  /** Whether to ping-pong the transition back to start */
  loopBack?: boolean;
}

/**
 * An intermediate morph frame containing progress and computed SVG path data
 */
export interface MorphFrame {
  progress: number;
  pathData: string;
}

/**
 * Common easing functions for smooth path morphing
 */
export const MorphEasing = {
  linear: (t: number): number => t,
  easeInOutQuad: (t: number): number =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  easeInOutCubic: (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
};

/**
 * Converts an SVG elliptical arc command (A) into an array of equivalent cubic Bézier curves (C)
 * conforming to W3C SVG 1.1 Appendix F.6.
 */
export function arcToCubics(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  angleDeg: number,
  largeArc: number,
  sweep: number,
  x2: number,
  y2: number
): { cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }[] {
  if (x1 === x2 && y1 === y2) return [];
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  if (rx === 0 || ry === 0) {
    return [
      {
        cp1x: (2 * x1 + x2) / 3,
        cp1y: (2 * y1 + y2) / 3,
        cp2x: (x1 + 2 * x2) / 3,
        cp2y: (y1 + 2 * y2) / 3,
        x: x2,
        y: y2,
      },
    ];
  }

  const phi = (angleDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosPhi * dx + sinPhi * dy;
  const y1p = -sinPhi * dx + cosPhi * dy;

  let rxSq = rx * rx;
  let rySq = ry * ry;
  const x1pSq = x1p * x1p;
  const y1pSq = y1p * y1p;

  const lambda = x1pSq / rxSq + y1pSq / rySq;
  if (lambda > 1) {
    const scale = Math.sqrt(lambda);
    rx *= scale;
    ry *= scale;
    rxSq = rx * rx;
    rySq = ry * ry;
  }

  const sign = largeArc === sweep ? -1 : 1;
  const sq = Math.max(
    0,
    (rxSq * rySq - rxSq * y1pSq - rySq * x1pSq) / (rxSq * y1pSq + rySq * x1pSq)
  );
  const coef = sign * Math.sqrt(sq);
  const cxp = coef * ((rx * y1p) / ry);
  const cyp = coef * (-(ry * x1p) / rx);

  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  function vectorAngle(ux: number, uy: number, vx: number, vy: number): number {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
    let ang = Math.acos(Math.max(-1, Math.min(1, dot / (len || 1))));
    if (ux * vy - uy * vx < 0) ang = -ang;
    return ang;
  }

  const v1x = (x1p - cxp) / rx;
  const v1y = (y1p - cyp) / ry;
  const v2x = (-x1p - cxp) / rx;
  const v2y = (-y1p - cyp) / ry;

  let theta1 = vectorAngle(1, 0, v1x, v1y);
  let dTheta = vectorAngle(v1x, v1y, v2x, v2y);

  if (sweep === 0 && dTheta > 0) dTheta -= 2 * Math.PI;
  if (sweep === 1 && dTheta < 0) dTheta += 2 * Math.PI;

  const numSegments = Math.max(1, Math.ceil(Math.abs(dTheta) / (Math.PI / 2)));
  const segDelta = dTheta / numSegments;
  const curves: { cp1x: number; cp1y: number; cp2x: number; cp2y: number; x: number; y: number }[] = [];

  for (let i = 0; i < numSegments; i++) {
    const th1 = theta1 + i * segDelta;
    const th2 = th1 + segDelta;
    const alpha = (4 / 3) * Math.tan((th2 - th1) / 4);

    const cosTh1 = Math.cos(th1);
    const sinTh1 = Math.sin(th1);
    const cosTh2 = Math.cos(th2);
    const sinTh2 = Math.sin(th2);

    const ep1x = cosTh1 - alpha * sinTh1;
    const ep1y = sinTh1 + alpha * cosTh1;
    const ep2x = cosTh2 + alpha * sinTh2;
    const ep2y = sinTh2 - alpha * cosTh2;

    const toOrig = (ex: number, ey: number) => ({
      x: cosPhi * (ex * rx) - sinPhi * (ey * ry) + cx,
      y: sinPhi * (ex * rx) + cosPhi * (ey * ry) + cy,
    });

    const cp1 = toOrig(ep1x, ep1y);
    const cp2 = toOrig(ep2x, ep2y);
    const end = i === numSegments - 1 ? { x: x2, y: y2 } : toOrig(cosTh2, sinTh2);

    curves.push({
      cp1x: cp1.x,
      cp1y: cp1.y,
      cp2x: cp2.x,
      cp2y: cp2.y,
      x: end.x,
      y: end.y,
    });
  }

  return curves;
}

/**
 * Parses raw SVG path 'd' string into structured absolute path commands.
 * Elliptical arcs (A) and quadratic curves (Q) are automatically converted into
 * smooth cubic Bézier curves (C) for mathematical morphing consistency.
 */
export function parseSvgPath(d: string): PathCommand[] {
  if (!d || typeof d !== 'string') return [];

  // Match commands and coordinate numbers
  const commandRegex = /([a-df-z])([^a-df-z]*)/gi;
  const commands: PathCommand[] = [];

  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  let match: RegExpExecArray | null;
  while ((match = commandRegex.exec(d)) !== null) {
    const rawType = match[1];
    const isRelative = rawType === rawType.toLowerCase();
    const typeUpper = rawType.toUpperCase();
    const argsString = match[2].trim();

    // Parse all floating point numbers (including negative numbers and exponential notation)
    const numRegex = /[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?/g;
    const nums: number[] = [];
    let numMatch: RegExpExecArray | null;
    while ((numMatch = numRegex.exec(argsString)) !== null) {
      nums.push(parseFloat(numMatch[0]));
    }

    // Convert relative commands to absolute equivalents for deterministic interpolation
    switch (typeUpper) {
      case 'M': {
        for (let i = 0; i < nums.length; i += 2) {
          const x = isRelative ? currentX + nums[i] : nums[i];
          const y = isRelative ? currentY + nums[i + 1] : nums[i + 1];
          if (i === 0) {
            commands.push({ type: 'M', values: [x, y] });
            startX = x;
            startY = y;
          } else {
            // Subsequent pairs after M are treated as implicit L
            commands.push({ type: 'L', values: [x, y] });
          }
          currentX = x;
          currentY = y;
        }
        break;
      }
      case 'L': {
        for (let i = 0; i < nums.length; i += 2) {
          const x = isRelative ? currentX + nums[i] : nums[i];
          const y = isRelative ? currentY + nums[i + 1] : nums[i + 1];
          commands.push({ type: 'L', values: [x, y] });
          currentX = x;
          currentY = y;
        }
        break;
      }
      case 'H': {
        for (let i = 0; i < nums.length; i++) {
          const x = isRelative ? currentX + nums[i] : nums[i];
          commands.push({ type: 'L', values: [x, currentY] });
          currentX = x;
        }
        break;
      }
      case 'V': {
        for (let i = 0; i < nums.length; i++) {
          const y = isRelative ? currentY + nums[i] : nums[i];
          commands.push({ type: 'L', values: [currentX, y] });
          currentY = y;
        }
        break;
      }
      case 'C': {
        for (let i = 0; i < nums.length; i += 6) {
          const cp1x = isRelative ? currentX + nums[i] : nums[i];
          const cp1y = isRelative ? currentY + nums[i + 1] : nums[i + 1];
          const cp2x = isRelative ? currentX + nums[i + 2] : nums[i + 2];
          const cp2y = isRelative ? currentY + nums[i + 3] : nums[i + 3];
          const x = isRelative ? currentX + nums[i + 4] : nums[i + 4];
          const y = isRelative ? currentY + nums[i + 5] : nums[i + 5];

          commands.push({
            type: 'C',
            values: [cp1x, cp1y, cp2x, cp2y, x, y],
          });
          currentX = x;
          currentY = y;
        }
        break;
      }
      case 'S': {
        for (let i = 0; i < nums.length; i += 4) {
          const cp2x = isRelative ? currentX + nums[i] : nums[i];
          const cp2y = isRelative ? currentY + nums[i + 1] : nums[i + 1];
          const x = isRelative ? currentX + nums[i + 2] : nums[i + 2];
          const y = isRelative ? currentY + nums[i + 3] : nums[i + 3];

          // Compute reflection of previous control point if previous was C or S
          const prev = commands[commands.length - 1];
          let cp1x = currentX;
          let cp1y = currentY;
          if (prev && (prev.type === 'C' || prev.type === 'S')) {
            const prevCp2x = prev.values[prev.values.length - 4];
            const prevCp2y = prev.values[prev.values.length - 3];
            cp1x = 2 * currentX - prevCp2x;
            cp1y = 2 * currentY - prevCp2y;
          }

          commands.push({
            type: 'C',
            values: [cp1x, cp1y, cp2x, cp2y, x, y],
          });
          currentX = x;
          currentY = y;
        }
        break;
      }
      case 'Q': {
        for (let i = 0; i < nums.length; i += 4) {
          const qx = isRelative ? currentX + nums[i] : nums[i];
          const qy = isRelative ? currentY + nums[i + 1] : nums[i + 1];
          const x = isRelative ? currentX + nums[i + 2] : nums[i + 2];
          const y = isRelative ? currentY + nums[i + 3] : nums[i + 3];

          // Elevate quadratic to cubic curve for uniform interpolation
          const cp1x = currentX + (2 / 3) * (qx - currentX);
          const cp1y = currentY + (2 / 3) * (qy - currentY);
          const cp2x = x + (2 / 3) * (qx - x);
          const cp2y = y + (2 / 3) * (qy - y);

          commands.push({
            type: 'C',
            values: [cp1x, cp1y, cp2x, cp2y, x, y],
          });
          currentX = x;
          currentY = y;
        }
        break;
      }
      case 'A': {
        // Arc command: convert to equivalent cubic Bézier curves (C)
        for (let i = 0; i < nums.length; i += 7) {
          const rx = nums[i];
          const ry = nums[i + 1];
          const rot = nums[i + 2];
          const largeArc = nums[i + 3];
          const sweep = nums[i + 4];
          const x = isRelative ? currentX + nums[i + 5] : nums[i + 5];
          const y = isRelative ? currentY + nums[i + 6] : nums[i + 6];

          const cubics = arcToCubics(currentX, currentY, rx, ry, rot, largeArc, sweep, x, y);
          for (const c of cubics) {
            commands.push({
              type: 'C',
              values: [c.cp1x, c.cp1y, c.cp2x, c.cp2y, c.x, c.y],
            });
          }
          currentX = x;
          currentY = y;
        }
        break;
      }
      case 'Z': {
        commands.push({ type: 'Z', values: [] });
        currentX = startX;
        currentY = startY;
        break;
      }
      default: {
        // Fallback for any unusual command
        commands.push({ type: typeUpper, values: nums });
        break;
      }
    }
  }

  return commands;
}

/**
 * Serializes structured PathCommands back into an SVG path 'd' string
 */
export function formatPathCommands(commands: PathCommand[], precision: number = 2): string {
  const round = (val: number) => {
    const factor = Math.pow(10, precision);
    return Math.round(val * factor) / factor;
  };

  return commands
    .map(cmd => {
      if (cmd.type === 'Z') return 'Z';
      const formattedValues = cmd.values.map(round).join(' ');
      return `${cmd.type} ${formattedValues}`;
    })
    .join(' ');
}

/**
 * Calculates Gravesen's approximation of cubic Bézier curve arc length
 */
function getCubicArcLength(
  p0x: number,
  p0y: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  p3x: number,
  p3y: number
): number {
  const chord = Math.hypot(p3x - p0x, p3y - p0y);
  const poly =
    Math.hypot(cp1x - p0x, cp1y - p0y) +
    Math.hypot(cp2x - cp1x, cp2y - cp1y) +
    Math.hypot(p3x - cp2x, p3y - cp2y);
  return (chord + poly) / 2;
}

/**
 * Splits a cubic Bézier curve at parameter t using de Casteljau's algorithm,
 * creating two new cubic curves that together follow the exact original geometry.
 */
function splitCubicDeCasteljau(
  p0x: number,
  p0y: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  p3x: number,
  p3y: number,
  t: number = 0.5
): [PathCommand, PathCommand] {
  const lerp = (ax: number, ay: number, bx: number, by: number) => ({
    x: ax + (bx - ax) * t,
    y: ay + (by - ay) * t,
  });

  const q0 = lerp(p0x, p0y, cp1x, cp1y);
  const q1 = lerp(cp1x, cp1y, cp2x, cp2y);
  const q2 = lerp(cp2x, cp2y, p3x, p3y);

  const r0 = lerp(q0.x, q0.y, q1.x, q1.y);
  const r1 = lerp(q1.x, q1.y, q2.x, q2.y);

  const s0 = lerp(r0.x, r0.y, r1.x, r1.y);

  return [
    { type: 'C', values: [q0.x, q0.y, r0.x, r0.y, s0.x, s0.y] },
    { type: 'C', values: [r1.x, r1.y, q2.x, q2.y, p3x, p3y] },
  ];
}

/**
 * Splits a list of path commands into contiguous subpaths delimited by 'M' commands
 */
function splitCommandsIntoSubpaths(commands: PathCommand[]): PathCommand[][] {
  const subpaths: PathCommand[][] = [];
  let current: PathCommand[] = [];

  for (const cmd of commands) {
    if (cmd.type === 'M' && current.length > 0) {
      subpaths.push(current);
      current = [];
    }
    current.push(cmd);
  }
  if (current.length > 0) {
    subpaths.push(current);
  }
  return subpaths;
}

/**
 * Calculates visual centroid (cx, cy) of a subpath for dynamic positioning of missing elements
 */
function getSubpathBoundingCenter(subpath: PathCommand[]): { cx: number; cy: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const cmd of subpath) {
    for (let i = 0; i < cmd.values.length; i += 2) {
      const x = cmd.values[i];
      const y = cmd.values[i + 1];
      if (x !== undefined && y !== undefined) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return {
    cx: isFinite(minX) && isFinite(maxX) ? (minX + maxX) / 2 : 12,
    cy: isFinite(minY) && isFinite(maxY) ? (minY + maxY) / 2 : 12,
  };
}

/**
 * Dynamically subdivides a subpath to target segment count by repeatedly splitting
 * the longest segment at t = 0.5 via de Casteljau's algorithm. This generates missing points
 * dynamically along the path geometry, maintaining visual consistency without clustering points at vertices.
 */
function subdivideSubpathToCount(subpath: PathCommand[], targetCount: number): PathCommand[] {
  if (subpath.length === 0) return [];

  const hasM = subpath[0].type === 'M';
  const startCmd: PathCommand = hasM ? { ...subpath[0], values: [...subpath[0].values] } : { type: 'M', values: [0, 0] };
  const hasZ = subpath[subpath.length - 1]?.type === 'Z';

  const segments: PathCommand[] = [];
  for (let i = hasM ? 1 : 0; i < (hasZ ? subpath.length - 1 : subpath.length); i++) {
    if (subpath[i].type === 'C') {
      segments.push({ type: 'C', values: [...subpath[i].values] });
    }
  }

  // If subpath had no curve segments (e.g. a point or empty), populate with collapsed segments at startCmd
  if (segments.length === 0) {
    const sx = startCmd.values[0] || 12;
    const sy = startCmd.values[1] || 12;
    for (let i = 0; i < targetCount; i++) {
      segments.push({ type: 'C', values: [sx, sy, sx, sy, sx, sy] });
    }
  }

  // Dynamically generate missing points by subdividing the longest segments first
  while (segments.length < targetCount) {
    let maxLen = -1;
    let maxIdx = 0;
    let prevX = startCmd.values[0];
    let prevY = startCmd.values[1];

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const len = getCubicArcLength(
        prevX,
        prevY,
        seg.values[0],
        seg.values[1],
        seg.values[2],
        seg.values[3],
        seg.values[4],
        seg.values[5]
      );
      if (len > maxLen) {
        maxLen = len;
        maxIdx = i;
      }
      prevX = seg.values[4];
      prevY = seg.values[5];
    }

    // Determine starting coordinate of the segment to split
    let segStartX = startCmd.values[0];
    let segStartY = startCmd.values[1];
    for (let i = 0; i < maxIdx; i++) {
      segStartX = segments[i].values[4];
      segStartY = segments[i].values[5];
    }

    const targetSeg = segments[maxIdx];
    const [c1, c2] = splitCubicDeCasteljau(
      segStartX,
      segStartY,
      targetSeg.values[0],
      targetSeg.values[1],
      targetSeg.values[2],
      targetSeg.values[3],
      targetSeg.values[4],
      targetSeg.values[5],
      0.5
    );

    segments.splice(maxIdx, 1, c1, c2);
  }

  const result = [startCmd, ...segments];
  if (hasZ) {
    result.push({ type: 'Z', values: [] });
  }
  return result;
}

/**
 * Circularly shifts closed subpaths to minimize point-to-point transition distances,
 * preventing unnatural twisting during linear interpolation.
 */
function alignClosedSubpaths(subA: PathCommand[], subB: PathCommand[]): [PathCommand[], PathCommand[]] {
  const hasZA = subA[subA.length - 1]?.type === 'Z';
  const hasZB = subB[subB.length - 1]?.type === 'Z';
  if (!hasZA || !hasZB) return [subA, subB];

  const segsA = subA.slice(1, -1);
  const segsB = subB.slice(1, -1);
  const N = segsA.length;
  if (N <= 1 || segsB.length !== N) return [subA, subB];

  let bestShift = 0;
  let minCost = Infinity;

  for (let shift = 0; shift < N; shift++) {
    let cost = 0;
    for (let i = 0; i < N; i++) {
      const bIdx = (i + shift) % N;
      const ax = segsA[i].values[4];
      const ay = segsA[i].values[5];
      const bx = segsB[bIdx].values[4];
      const by = segsB[bIdx].values[5];
      const dx = bx - ax;
      const dy = by - ay;
      cost += dx * dx + dy * dy;
    }
    if (cost < minCost) {
      minCost = cost;
      bestShift = shift;
    }
  }

  if (bestShift === 0) return [subA, subB];

  const rotatedSegsB = [...segsB.slice(bestShift), ...segsB.slice(0, bestShift)];
  const lastSeg = rotatedSegsB[rotatedSegsB.length - 1];
  const newStartM: PathCommand = { type: 'M', values: [lastSeg.values[4], lastSeg.values[5]] };

  return [subA, [newStartM, ...rotatedSegsB, { type: 'Z', values: [] }]];
}

/**
 * Normalizes two path command lists so they have the exact same command structure,
 * generating missing points dynamically via de Casteljau subdivision along the shape perimeter.
 * This guarantees smooth point-to-point linear interpolation without shape distortion,
 * regardless of the difference in complexity between the two paths.
 */
export function equalizePathCommands(
  cmdsA: PathCommand[],
  cmdsB: PathCommand[]
): [PathCommand[], PathCommand[]] {
  if (cmdsA.length === 0 && cmdsB.length === 0) return [[], []];

  // Convert all commands (lines, arcs, quadratics) to canonical cubic Bézier curves
  const normA = normalizePathCommandsToCubics(cmdsA);
  const normB = normalizePathCommandsToCubics(cmdsB);

  // Partition both paths into their constituent subpaths
  const subpathsA = splitCommandsIntoSubpaths(normA);
  const subpathsB = splitCommandsIntoSubpaths(normB);

  const maxSubpaths = Math.max(subpathsA.length, subpathsB.length, 1);

  // If one path has fewer subpaths, dynamically generate collapsed subpaths at counterpart centroids
  while (subpathsA.length < maxSubpaths) {
    const targetSub = subpathsB[subpathsA.length] || subpathsB[0];
    const { cx, cy } = getSubpathBoundingCenter(targetSub);
    const hasZ = targetSub[targetSub.length - 1]?.type === 'Z';
    const newSub: PathCommand[] = [
      { type: 'M', values: [cx, cy] },
      { type: 'C', values: [cx, cy, cx, cy, cx, cy] },
    ];
    if (hasZ) newSub.push({ type: 'Z', values: [] });
    subpathsA.push(newSub);
  }

  while (subpathsB.length < maxSubpaths) {
    const targetSub = subpathsA[subpathsB.length] || subpathsA[0];
    const { cx, cy } = getSubpathBoundingCenter(targetSub);
    const hasZ = targetSub[targetSub.length - 1]?.type === 'Z';
    const newSub: PathCommand[] = [
      { type: 'M', values: [cx, cy] },
      { type: 'C', values: [cx, cy, cx, cy, cx, cy] },
    ];
    if (hasZ) newSub.push({ type: 'Z', values: [] });
    subpathsB.push(newSub);
  }

  const outA: PathCommand[] = [];
  const outB: PathCommand[] = [];

  // Equalize each pair of corresponding subpaths
  for (let s = 0; s < maxSubpaths; s++) {
    const subA = subpathsA[s];
    const subB = subpathsB[s];

    // Harmonize path closure (Z)
    const hasZ = subA.some(c => c.type === 'Z') || subB.some(c => c.type === 'Z');
    if (hasZ) {
      if (!subA.some(c => c.type === 'Z')) subA.push({ type: 'Z', values: [] });
      if (!subB.some(c => c.type === 'Z')) subB.push({ type: 'Z', values: [] });
    }

    const countA = subA.filter(c => c.type === 'C').length;
    const countB = subB.filter(c => c.type === 'C').length;
    const targetSegments = Math.max(countA, countB, 1);

    // Dynamically subdivide to generate missing points along the contours
    const eqSubA = subdivideSubpathToCount(subA, targetSegments);
    const eqSubB = subdivideSubpathToCount(subB, targetSegments);

    // Align circular rotation to minimize linear travel distance
    const [alignedA, alignedB] = alignClosedSubpaths(eqSubA, eqSubB);

    outA.push(...alignedA);
    outB.push(...alignedB);
  }

  return [outA, outB];
}

/**
 * Calculates intermediate SVG path data transition between two path strings at given progress t (0 <= t <= 1)
 *
 * @param pathA - Initial starting SVG path 'd' string
 * @param pathB - Target ending SVG path 'd' string
 * @param progress - Normalized animation time between 0 and 1
 * @param precision - Decimal precision for coordinates (default: 2)
 * @returns Interpolated SVG path data string
 */
export function interpolatePathData(
  pathA: string,
  pathB: string,
  progress: number,
  precision: number = 2
): string {
  // Clamp progress between 0 and 1
  const t = Math.max(0, Math.min(1, progress));

  if (t === 0) return pathA;
  if (t === 1) return pathB;

  const parsedA = parseSvgPath(pathA);
  const parsedB = parseSvgPath(pathB);

  const [eqA, eqB] = equalizePathCommands(parsedA, parsedB);

  const intermediateCommands: PathCommand[] = eqA.map((cmdA, idx) => {
    const cmdB = eqB[idx];
    if (!cmdB || cmdA.type === 'Z' || cmdB.type === 'Z') {
      return { type: cmdA.type, values: [] };
    }

    const interpolatedValues = cmdA.values.map((valA, valIdx) => {
      const valB = cmdB.values[valIdx] !== undefined ? cmdB.values[valIdx] : valA;
      return valA + (valB - valA) * t;
    });

    return {
      type: cmdA.type,
      values: interpolatedValues,
    };
  });

  return formatPathCommands(intermediateCommands, precision);
}

/**
 * Calculates an array of intermediate SVG path data transitions between two shapes
 *
 * @param pathA - Starting SVG path 'd' string
 * @param pathB - Target SVG path 'd' string
 * @param steps - Number of intermediate path states to generate (e.g. 10 or 20)
 * @param options - Configuration for easing, loopback, and coordinate precision
 * @returns Array of intermediate SVG path data strings
 */
export function calculateIntermediatePaths(
  pathA: string,
  pathB: string,
  steps: number = 10,
  options: MorphTransitionOptions = {}
): string[] {
  const {
    precision = 2,
    ease = MorphEasing.easeInOutCubic,
    loopBack = false,
  } = options;

  if (steps <= 1) return [pathA, pathB];

  const frames: string[] = [];
  const parsedA = parseSvgPath(pathA);
  const parsedB = parseSvgPath(pathB);
  const [eqA, eqB] = equalizePathCommands(parsedA, parsedB);

  for (let i = 0; i < steps; i++) {
    const rawProgress = i / (steps - 1);
    const easedProgress = ease(rawProgress);

    const intermediateCommands: PathCommand[] = eqA.map((cmdA, idx) => {
      const cmdB = eqB[idx];
      if (!cmdB || cmdA.type === 'Z' || cmdB.type === 'Z') {
        return { type: cmdA.type, values: [] };
      }

      const values = cmdA.values.map((valA, valIdx) => {
        const valB = cmdB.values[valIdx] !== undefined ? cmdB.values[valIdx] : valA;
        return valA + (valB - valA) * easedProgress;
      });

      return { type: cmdA.type, values };
    });

    frames.push(formatPathCommands(intermediateCommands, precision));
  }

  if (loopBack) {
    // Reverse frames without duplicating the endpoints
    const reversed = [...frames.slice(1, -1)].reverse();
    return [...frames, ...reversed];
  }

  return frames;
}

/**
 * Calculates a complete sequence of intermediate morph frames with explicit progress percentages
 */
export function calculateMorphFrames(
  pathA: string,
  pathB: string,
  frameCount: number = 12,
  options: MorphTransitionOptions = {}
): MorphFrame[] {
  const paths = calculateIntermediatePaths(pathA, pathB, frameCount, options);
  return paths.map((pathData, index) => ({
    progress: Math.round((index / (paths.length - 1)) * 100) / 100,
    pathData,
  }));
}

/**
 * Creates a pre-compiled, high-performance morph transition function between two paths.
 * Parses and equalizes SVG commands once upfront, returning an interpolator function
 * (progress: number) => intermediatePathData for smooth 60fps animations.
 */
export function createPathMorphTransition(
  pathA: string,
  pathB: string,
  options: { precision?: number; ease?: (t: number) => number } = {}
): (progress: number) => string {
  const { precision = 2, ease } = options;
  const parsedA = parseSvgPath(pathA);
  const parsedB = parseSvgPath(pathB);
  const [eqA, eqB] = equalizePathCommands(parsedA, parsedB);

  return (progress: number): string => {
    const rawT = Math.max(0, Math.min(1, progress));
    const t = ease ? ease(rawT) : rawT;

    const intermediateCommands: PathCommand[] = eqA.map((cmdA, idx) => {
      const cmdB = eqB[idx];
      if (!cmdB || cmdA.type === 'Z' || cmdB.type === 'Z') {
        return { type: cmdA.type, values: [] };
      }

      const interpolatedValues = cmdA.values.map((valA, valIdx) => {
        const valB = cmdB.values[valIdx] !== undefined ? cmdB.values[valIdx] : valA;
        return valA + (valB - valA) * t;
      });

      return {
        type: cmdA.type,
        values: interpolatedValues,
      };
    });

    return formatPathCommands(intermediateCommands, precision);
  };
}

/**
 * Generates valid standalone CSS @keyframes for SVG path morphing
 * Uses standard CSS 'd: path(...)' supported across all modern browsers
 */
export function generateCssMorphKeyframes(
  animationName: string,
  pathA: string,
  pathB: string,
  options: {
    steps?: number;
    precision?: number;
    loopBack?: boolean;
    durationSeconds?: number;
  } = {}
): string {
  const { steps = 8, precision = 2, loopBack = true, durationSeconds = 2.4 } = options;

  const frames = calculateIntermediatePaths(pathA, pathB, steps, {
    precision,
    loopBack,
    ease: MorphEasing.easeInOutCubic,
  });

  const keyframeRules = frames
    .map((framePath, idx) => {
      const pct = ((idx / (frames.length - 1)) * 100).toFixed(1);
      return `  ${pct}% { d: path('${framePath}'); }`;
    })
    .join('\n');

  return `
@keyframes ${animationName} {
${keyframeRules}
}

.anim-morph {
  animation: ${animationName} ${durationSeconds}s ease-in-out infinite;
}
`;
}

/**
 * Extracts SVG path 'd' attributes from an SVG string or icon body markup
 */
export function extractPathData(svgOrBody: string): string[] {
  if (!svgOrBody) return [];
  const paths: string[] = [];
  const pathRegex = /<path[^>]*\bd=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = pathRegex.exec(svgOrBody)) !== null) {
    if (match[1]) {
      paths.push(match[1]);
    }
  }

  return paths;
}

/**
 * Converts standard geometric SVG elements (<line>, <polyline>, <polygon>, <rect>, <circle>, <ellipse>)
 * into an SVG path 'd' string suitable for morphing, preserving rounded corners (rx, ry)
 * and handling any attribute order.
 */
export function convertShapeToPath(shapeMarkup: string): string {
  if (!shapeMarkup) return '';

  const getAttr = (attr: string): string | null => {
    const match = new RegExp(`\\b${attr}=["']([^"']+)["']`, 'i').exec(shapeMarkup);
    return match ? match[1].trim() : null;
  };

  const tagMatch = /<([a-zA-Z]+)/i.exec(shapeMarkup);
  const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';

  // 1. Line
  if (tagName === 'line') {
    const x1 = parseFloat(getAttr('x1') || '0');
    const y1 = parseFloat(getAttr('y1') || '0');
    const x2 = parseFloat(getAttr('x2') || '0');
    const y2 = parseFloat(getAttr('y2') || '0');
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  // 2. Polyline / Polygon
  if (tagName === 'polyline' || tagName === 'polygon') {
    const isPolygon = tagName === 'polygon';
    const pointsStr = getAttr('points') || '';
    const points = pointsStr.trim().split(/[\s,]+/);
    const coords: string[] = [];
    for (let i = 0; i < points.length; i += 2) {
      if (points[i] !== undefined && points[i + 1] !== undefined) {
        coords.push(`${points[i]} ${points[i + 1]}`);
      }
    }
    if (coords.length > 0) {
      return `M ${coords[0]} ${coords.slice(1).map(c => `L ${c}`).join(' ')}${isPolygon ? ' Z' : ''}`;
    }
  }

  // 3. Rect with rounded corners support (rx, ry)
  if (tagName === 'rect') {
    const x = parseFloat(getAttr('x') || '0');
    const y = parseFloat(getAttr('y') || '0');
    const w = parseFloat(getAttr('width') || '0');
    const h = parseFloat(getAttr('height') || '0');
    const rawRx = parseFloat(getAttr('rx') || '0');
    const rawRy = parseFloat(getAttr('ry') || '0');
    const rx = Math.min(rawRx || rawRy || 0, w / 2);
    const ry = Math.min(rawRy || rawRx || 0, h / 2);

    if (rx > 0 && ry > 0) {
      // Precise Bézier rounded rectangle
      const k = 0.552284749831;
      const kx = rx * (1 - k);
      const ky = ry * (1 - k);
      return [
        `M ${x + rx} ${y}`,
        `L ${x + w - rx} ${y}`,
        `C ${x + w - kx} ${y} ${x + w} ${y + ky} ${x + w} ${y + ry}`,
        `L ${x + w} ${y + h - ry}`,
        `C ${x + w} ${y + h - ky} ${x + w - kx} ${y + h} ${x + w - rx} ${y + h}`,
        `L ${x + rx} ${y + h}`,
        `C ${x + kx} ${y + h} ${x} ${y + h - ky} ${x} ${y + h - ry}`,
        `L ${x} ${y + ry}`,
        `C ${x} ${y + ky} ${x + kx} ${y} ${x + rx} ${y}`,
        `Z`,
      ].join(' ');
    }

    return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  }

  // 4. Circle
  if (tagName === 'circle') {
    const cx = parseFloat(getAttr('cx') || '12');
    const cy = parseFloat(getAttr('cy') || '12');
    const r = parseFloat(getAttr('r') || '0');
    const k = r * 0.552284749831;
    return `M ${cx} ${cy - r} C ${cx + k} ${cy - r} ${cx + r} ${cy - k} ${cx + r} ${cy} C ${cx + r} ${cy + k} ${cx + k} ${cy + r} ${cx} ${cy + r} C ${cx - k} ${cy + r} ${cx - r} ${cy + k} ${cx - r} ${cy} C ${cx - r} ${cy - k} ${cx - k} ${cy - r} ${cx} ${cy - r} Z`;
  }

  // 5. Ellipse
  if (tagName === 'ellipse') {
    const cx = parseFloat(getAttr('cx') || '12');
    const cy = parseFloat(getAttr('cy') || '12');
    const rx = parseFloat(getAttr('rx') || '0');
    const ry = parseFloat(getAttr('ry') || '0');
    const kx = rx * 0.552284749831;
    const ky = ry * 0.552284749831;
    return `M ${cx} ${cy - ry} C ${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C ${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C ${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C ${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z`;
  }

  // 6. Fallback: try extracting path if already a path
  const pathData = extractPathData(shapeMarkup);
  return pathData[0] || '';
}

/**
 * Normalizes any structured SVG path commands into canonical M and C cubic commands,
 * ensuring that every command is a pure 2D coordinate transformation with matching structure.
 */
export function normalizePathCommandsToCubics(commands: PathCommand[]): PathCommand[] {
  const result: PathCommand[] = [];
  let currentX = 0;
  let currentY = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;

  for (const cmd of commands) {
    if (cmd.type === 'M') {
      const x = cmd.values[0] ?? currentX;
      const y = cmd.values[1] ?? currentY;
      result.push({ type: 'M', values: [x, y] });
      currentX = x;
      currentY = y;
      subpathStartX = x;
      subpathStartY = y;
    } else if (cmd.type === 'C') {
      const cp1x = cmd.values[0];
      const cp1y = cmd.values[1];
      const cp2x = cmd.values[2];
      const cp2y = cmd.values[3];
      const x = cmd.values[4];
      const y = cmd.values[5];
      result.push({ type: 'C', values: [cp1x, cp1y, cp2x, cp2y, x, y] });
      currentX = x;
      currentY = y;
    } else if (cmd.type === 'L') {
      const x = cmd.values[0];
      const y = cmd.values[1];
      // Represent line as exact cubic curve
      const cp1x = (2 * currentX + x) / 3;
      const cp1y = (2 * currentY + y) / 3;
      const cp2x = (currentX + 2 * x) / 3;
      const cp2y = (currentY + 2 * y) / 3;
      result.push({ type: 'C', values: [cp1x, cp1y, cp2x, cp2y, x, y] });
      currentX = x;
      currentY = y;
    } else if (cmd.type === 'Z') {
      if (Math.abs(currentX - subpathStartX) > 0.01 || Math.abs(currentY - subpathStartY) > 0.01) {
        const cp1x = (2 * currentX + subpathStartX) / 3;
        const cp1y = (2 * currentY + subpathStartY) / 3;
        const cp2x = (currentX + 2 * subpathStartX) / 3;
        const cp2y = (currentY + 2 * subpathStartY) / 3;
        result.push({ type: 'C', values: [cp1x, cp1y, cp2x, cp2y, subpathStartX, subpathStartY] });
        currentX = subpathStartX;
        currentY = subpathStartY;
      }
      result.push({ type: 'Z', values: [] });
    }
  }

  return result;
}

/**
 * Generates the "none" (singularity seed) state for an SVG path 'd' string.
 * All coordinates are collapsed to the specified centroid (defaulting to icon visual center or 12, 12).
 */
export function generateNonePath(pathD: string, center?: { cx: number; cy: number }): string {
  const rawCommands = parseSvgPath(pathD);
  if (rawCommands.length === 0) return pathD;
  const commands = normalizePathCommandsToCubics(rawCommands);

  let cx = center?.cx;
  let cy = center?.cy;

  if (cx === undefined || cy === undefined) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    commands.forEach(cmd => {
      for (let i = 0; i < cmd.values.length; i += 2) {
        const x = cmd.values[i];
        const y = cmd.values[i + 1];
        if (x !== undefined && y !== undefined) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    });

    cx = isFinite(minX) && isFinite(maxX) ? (minX + maxX) / 2 : 12;
    cy = isFinite(minY) && isFinite(maxY) ? (minY + maxY) / 2 : 12;
  }

  const noneCommands: PathCommand[] = commands.map(cmd => {
    if (cmd.type === 'Z') return { type: 'Z', values: [] };
    const values = cmd.values.map((_, idx) => (idx % 2 === 0 ? cx! : cy!));
    return { type: cmd.type, values };
  });

  return formatPathCommands(noneCommands, 2);
}

/**
 * Creates an interpolator function that morphs a path from "none" (collapsed centroid)
 * into the complete, final icon shape, holds at full completion, and smoothly resets.
 */
export function createCreationFromNoneInterpolator(
  finalD: string,
  options: {
    precision?: number;
    staggerOffset?: number;
    center?: { cx: number; cy: number };
  } = {}
): (timelineProgress: number) => string {
  const { precision = 2, staggerOffset = 0, center } = options;
  const rawCommands = parseSvgPath(finalD);
  if (rawCommands.length === 0) return () => finalD;
  const commands = normalizePathCommandsToCubics(rawCommands);

  let cx = center?.cx;
  let cy = center?.cy;

  if (cx === undefined || cy === undefined) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    commands.forEach(cmd => {
      for (let i = 0; i < cmd.values.length; i += 2) {
        const x = cmd.values[i];
        const y = cmd.values[i + 1];
        if (x !== undefined && y !== undefined) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    });

    cx = isFinite(minX) && isFinite(maxX) ? (minX + maxX) / 2 : 12;
    cy = isFinite(minY) && isFinite(maxY) ? (minY + maxY) / 2 : 12;
  }

  const formattedFinalD = formatPathCommands(commands, precision);
  const K = commands.length;

  return (rawU: number): string => {
    const u = Math.max(0, Math.min(1, rawU));

    // Timeline phases:
    // [0, 0.38]: Creation phase (springs outward from none into 100% final icon)
    // [0.38, 0.82]: Full Hold phase (stays at 100% final icon for clear inspection)
    // [0.82, 1.00]: Seamless return phase back to origin to restart continuous cycle

    if (u >= 0.38 && u <= 0.82) {
      return formattedFinalD;
    }

    let globalProgress = 0;
    if (u < 0.38) {
      const baseProgress = u / 0.38;
      const adjusted = Math.max(0, (baseProgress - staggerOffset) / (1 - staggerOffset));
      // Organic cubic ease out
      globalProgress = 1 - Math.pow(1 - Math.min(1, adjusted), 3);
    } else {
      const returnRatio = (u - 0.82) / 0.18;
      // Smooth sinusoidal return to zero
      globalProgress = Math.cos((Math.min(1, returnRatio) * Math.PI) / 2);
    }

    const morphedCommands: PathCommand[] = commands.map((cmd, i) => {
      if (cmd.type === 'Z') return { type: 'Z', values: [] };

      // Gentle segment cascade along curves
      const segmentStagger = K > 1 ? (i / K) * 0.15 : 0;
      const localProgress = Math.max(
        0,
        Math.min(1, (globalProgress - segmentStagger) / (1 - 0.15))
      );

      const values = cmd.values.map((finalVal, valIdx) => {
        const centerVal = valIdx % 2 === 0 ? cx! : cy!;
        return centerVal + (finalVal - centerVal) * localProgress;
      });

      return { type: cmd.type, values };
    });

    return formatPathCommands(morphedCommands, precision);
  };
}

/**
 * Calculates intermediate SVG path frames for the creation of the final icon from none.
 * Used for native SVG <animate attributeName="d" values="..." />
 */
export function calculateCreationFromNoneFrames(
  finalD: string,
  steps: number = 14,
  staggerOffset: number = 0,
  center?: { cx: number; cy: number }
): string[] {
  const interpolator = createCreationFromNoneInterpolator(finalD, {
    precision: 2,
    staggerOffset,
    center,
  });
  const frames: string[] = [];

  for (let i = 0; i < steps; i++) {
    const u = i / (steps - 1);
    frames.push(interpolator(u));
  }

  return frames;
}

/**
 * Representation of a single parsed and morph-ready path element within an icon
 */
export interface MorphablePathElement {
  id: string;
  originalD: string;
  noneD: string;
  valuesString: string;
  interpolator: (progress: number) => string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
  strokeLinecap?: 'inherit' | 'round' | 'butt' | 'square';
  strokeLinejoin?: 'inherit' | 'round' | 'bevel' | 'miter';
  opacity?: number;
}

/**
 * Parses raw SVG icon inner body markup into individual morphable path elements.
 * Generates the "none" state for each path and builds transition frames showing
 * the creation of the final icon from none.
 */
export function parseSvgBodyToMorphablePaths(
  svgBody: string,
  slug: string = '',
  steps: number = 14
): MorphablePathElement[] {
  if (!svgBody || typeof svgBody !== 'string') return [];

  // Pass 1: Extract and convert all shapes to paths
  const rawItems: {
    originalD: string;
    attrsStr: string;
    commands: PathCommand[];
  }[] = [];

  const tagRegex = /<([a-z]+)([^>]*)>/gi;
  let tagMatch: RegExpExecArray | null;

  while ((tagMatch = tagRegex.exec(svgBody)) !== null) {
    const tagName = tagMatch[1].toLowerCase();
    const attrsStr = tagMatch[2];
    const fullTag = tagMatch[0];

    if (!['path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse'].includes(tagName)) {
      continue;
    }

    let originalD = '';
    if (tagName === 'path') {
      const dMatch = /\bd=["']([^"']+)["']/i.exec(attrsStr);
      if (dMatch && dMatch[1]) {
        originalD = dMatch[1].trim();
      }
    } else {
      originalD = convertShapeToPath(fullTag);
    }

    if (!originalD) continue;
    const commands = normalizePathCommandsToCubics(parseSvgPath(originalD));
    if (commands.length === 0) continue;

    rawItems.push({
      originalD: formatPathCommands(commands, 2),
      attrsStr,
      commands,
    });
  }

  if (rawItems.length === 0) return [];

  // Pass 2: Calculate unified icon-wide visual center (cx, cy)
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  rawItems.forEach(item => {
    item.commands.forEach(cmd => {
      for (let i = 0; i < cmd.values.length; i += 2) {
        const x = cmd.values[i];
        const y = cmd.values[i + 1];
        if (x !== undefined && y !== undefined) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    });
  });

  const iconCenter = {
    cx: isFinite(minX) && isFinite(maxX) ? (minX + maxX) / 2 : 12,
    cy: isFinite(minY) && isFinite(maxY) ? (minY + maxY) / 2 : 12,
  };

  // Pass 3: Build morphable elements using the unified center
  const elements: MorphablePathElement[] = [];

  rawItems.forEach((item, index) => {
    const noneD = generateNonePath(item.originalD, iconCenter);
    const staggerOffset = Math.min(0.15, index * 0.05);

    const interpolator = createCreationFromNoneInterpolator(item.originalD, {
      precision: 2,
      staggerOffset,
      center: iconCenter,
    });

    const frames = calculateCreationFromNoneFrames(item.originalD, steps, staggerOffset, iconCenter);

    const strokeMatch = /\bstroke=["']([^"']+)["']/i.exec(item.attrsStr);
    const fillMatch = /\bfill=["']([^"']+)["']/i.exec(item.attrsStr);
    const strokeWidthMatch = /\bstroke-width=["']([^"']+)["']/i.exec(item.attrsStr);
    const strokeLinecapMatch = /\bstroke-linecap=["']([^"']+)["']/i.exec(item.attrsStr);
    const strokeLinejoinMatch = /\bstroke-linejoin=["']([^"']+)["']/i.exec(item.attrsStr);
    const opacityMatch = /\bopacity=["']([^"']+)["']/i.exec(item.attrsStr);

    elements.push({
      id: `morph-path-${slug || 'icon'}-${index}`,
      originalD: item.originalD,
      noneD,
      valuesString: frames.join(';'),
      interpolator,
      stroke: strokeMatch ? strokeMatch[1] : undefined,
      fill: fillMatch ? fillMatch[1] : undefined,
      strokeWidth: strokeWidthMatch ? parseFloat(strokeWidthMatch[1]) : undefined,
      strokeLinecap: (strokeLinecapMatch ? strokeLinecapMatch[1] : undefined) as any,
      strokeLinejoin: (strokeLinejoinMatch ? strokeLinejoinMatch[1] : undefined) as any,
      opacity: opacityMatch ? parseFloat(opacityMatch[1]) : undefined,
    });
  });

  return elements;
}

/**
 * Curated pairs of mathematically compatible icon shapes designed for seamless morphing
 */
export const MORPH_PRESET_PAIRS = {
  playToPause: {
    name: 'Play to Pause',
    // Triangle play button
    from: 'M 6 4 L 20 12 L 6 20 Z',
    // Equalized rectangular pause bar
    to: 'M 6 4 L 10 4 L 10 20 L 6 20 Z',
  },
  checkToCross: {
    name: 'Checkmark to Cross',
    from: 'M 4 12 L 9 17 L 20 6',
    to: 'M 5 5 L 12 12 L 19 19',
  },
  plusToMinus: {
    name: 'Plus to Minus',
    from: 'M 12 5 L 12 19 M 5 12 L 19 12',
    to: 'M 12 12 L 12 12 M 5 12 L 19 12',
  },
  chevronToArrow: {
    name: 'Chevron to Arrow',
    from: 'M 9 18 L 15 12 L 9 6',
    to: 'M 5 12 L 19 12 M 13 6 L 19 12 L 13 18',
  },
  heartToStar: {
    name: 'Heart to Star',
    from: 'M 12 21.35 C 5.4 15.36 2 12.28 2 8.5 C 2 5.42 4.42 3 7.5 3 C 9.24 3 10.91 3.81 12 5.09 C 13.09 3.81 14.76 3 16.5 3 C 19.58 3 22 5.42 22 8.5 C 22 12.28 18.6 15.36 12 21.35 Z',
    to: 'M 12 2 L 15.09 8.26 L 22 9.27 L 17 14.14 L 18.18 21.02 L 12 17.77 L 5.82 21.02 L 7 14.14 L 2 9.27 L 8.91 8.26 Z',
  },
  menuToClose: {
    name: 'Menu Burger to Close',
    from: 'M 4 6 L 20 6 M 4 12 L 20 12 M 4 18 L 20 18',
    to: 'M 6 6 L 18 18 M 12 12 L 12 12 M 6 18 L 18 6',
  },
};

/**
 * Returns complete CSS rules for any animation type, including path morphing
 */
export function getAnimationCss(
  animationType: AnimationType | string = 'pulse',
  speed: number = 1
): string {
  const duration = (2 / Math.max(0.2, speed)).toFixed(2);

  switch (animationType) {
    case 'morph': {
      // Morph between play and pause by default
      return generateCssMorphKeyframes(
        'svg-morph',
        MORPH_PRESET_PAIRS.playToPause.from,
        MORPH_PRESET_PAIRS.playToPause.to,
        {
          steps: 8,
          loopBack: true,
          durationSeconds: parseFloat(duration),
        }
      );
    }
    case 'spin':
      return `
        @keyframes svg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .anim-element {
          transform-origin: 12px 12px;
          animation: svg-spin ${duration}s linear infinite;
        }
      `;
    case 'bounce':
      return `
        @keyframes svg-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .anim-element {
          animation: svg-bounce ${duration}s ease-in-out infinite;
        }
      `;
    case 'pulse':
      return `
        @keyframes svg-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.85; }
        }
        .anim-element {
          transform-origin: 12px 12px;
          animation: svg-pulse ${duration}s ease-in-out infinite;
        }
      `;
    case 'shake':
      return `
        @keyframes svg-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-10deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-6deg); }
          80% { transform: rotate(6deg); }
        }
        .anim-element {
          transform-origin: 12px 12px;
          animation: svg-shake ${duration}s ease-in-out infinite;
        }
      `;
    case 'slide':
      return `
        @keyframes svg-slide {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .anim-element {
          animation: svg-slide ${duration}s ease-in-out infinite;
        }
      `;
    case 'draw':
      return `
        @keyframes svg-draw {
          0% { stroke-dashoffset: 60; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 60; }
        }
        .anim-element path, .anim-element polyline, .anim-element line {
          stroke-dasharray: 60;
          animation: svg-draw ${duration}s ease-in-out infinite;
        }
      `;
    case 'float':
    default:
      return `
        @keyframes svg-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .anim-element {
          animation: svg-float ${duration}s ease-in-out infinite;
        }
      `;
  }
}
