/**
 * RNG utilities.
 *
 * - `secureInts` uses crypto.getRandomValues directly (used for the small
 *   number of picks the user sees, e.g. auto-select on the ticket).
 * - `Xoshiro128ss` is a fast PRNG seeded from crypto.getRandomValues, used
 *   for bulk simulation where calling crypto per draw would be too slow.
 */

export interface Rng {
  /** Uniform integer in [0, n) */
  nextInt(n: number): number;
}

function cryptoFill(arr: Uint32Array): Uint32Array {
  const c = globalThis.crypto;
  if (!c || typeof c.getRandomValues !== "function") {
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() * 0x100000000) >>> 0;
    return arr;
  }
  return c.getRandomValues(arr);
}

export class CryptoRng implements Rng {
  private buf = new Uint32Array(256);
  private idx = this.buf.length;
  nextInt(n: number): number {
    if (this.idx >= this.buf.length) {
      cryptoFill(this.buf);
      this.idx = 0;
    }
    return this.buf[this.idx++] % n;
  }
}

/** xoshiro128** - small, fast, good statistical quality. */
export class Xoshiro128ss implements Rng {
  private s = new Uint32Array(4);

  constructor(seed?: Uint32Array) {
    if (seed && seed.length >= 4) {
      this.s.set(seed.subarray(0, 4));
    } else {
      cryptoFill(this.s);
    }
    if ((this.s[0] | this.s[1] | this.s[2] | this.s[3]) === 0) this.s[0] = 0x9e3779b9;
  }

  next(): number {
    const s = this.s;
    const result = Math.imul(rotl(Math.imul(s[1], 5), 7), 9) >>> 0;
    const t = s[1] << 9;
    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];
    s[2] ^= t;
    s[3] = rotl(s[3], 11);
    return result;
  }

  nextInt(n: number): number {
    // Lemire-style rejection to avoid modulo bias.
    const threshold = (0x100000000 - n) % n; // (2^32 - n) mod n
    for (;;) {
      const r = this.next();
      if (r >= threshold) return r % n;
    }
  }
}

function rotl(x: number, k: number): number {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}
