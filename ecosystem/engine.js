/* Rabbits, foxes and grass: a stochastic agent-based model on a grid.
   Port of ecosystem.py. Works in the browser (window.Eco) and in Node. */
(function (root) {
  "use strict";
  const EMPTY = 0, RABBIT = 1, FOX = 2;
  const NBRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

  function makeRng(seed) {
    let a = (seed == null ? Math.floor(Math.random() * 4294967296) : seed) >>> 0;
    a = (a ^ 0x9e3779b9) >>> 0;
    const rnd = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    rnd.int = (n) => Math.floor(rnd() * n);
    rnd.normal = (mu, sd) => {
      const u = 1 - rnd(), v = rnd();
      return mu + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };
    return rnd;
  }

  function species(o) {
    return { metabolism: 1, food: o.food, breedEnergy: o.breedEnergy,
             pBreed: o.pBreed, lifespan: o.lifespan, pDeath: o.pDeath,
             pMove: o.pMove, maxEnergy: o.maxEnergy };
  }

  class Ecosystem {
    constructor(o) {
      this.rng = makeRng(o.seed);
      const n = this.n = o.size;
      this.rabbit = o.rabbit; this.fox = o.fox;
      this.regrow = o.regrow; this.bite = 0.5; this.pCatch = o.pCatch;
      this.kind = new Uint8Array(n * n);
      this.energy = new Float64Array(n * n);
      this.age = new Int32Array(n * n);
      this.maxage = new Int32Array(n * n);
      this.grass = new Float64Array(n * n).fill(1);
      this.generation = 0;
      this.nbr = new Int32Array(n * n * 8);
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++)
        for (let k = 0; k < 8; k++)
          this.nbr[(r * n + c) * 8 + k] =
            ((r + NBRS[k][0] + n) % n) * n + (c + NBRS[k][1] + n) % n;
      const cells = this._perm(n * n);
      const total = Math.min(n * n, o.rabbits + o.foxes);
      for (let i = 0; i < total; i++) {
        const isR = i < o.rabbits, sp = isR ? this.rabbit : this.fox;
        this._place(cells[i], isR ? RABBIT : FOX, sp,
          (0.3 + 0.5 * this.rng()) * sp.maxEnergy, this.rng.int(sp.lifespan));
      }
    }
    _perm(m) {
      const a = new Int32Array(m);
      for (let i = 0; i < m; i++) a[i] = i;
      for (let i = m - 1; i > 0; i--) {
        const j = this.rng.int(i + 1), t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    }
    _place(p, kd, sp, energy, age) {
      this.kind[p] = kd; this.energy[p] = energy; this.age[p] = age || 0;
      this.maxage[p] = Math.max(1, Math.floor(this.rng.normal(sp.lifespan, 0.2 * sp.lifespan)));
    }
    _clear(p) { this.kind[p] = EMPTY; this.energy[p] = 0; this.age[p] = 0; }
    _move(p, q) {
      this.kind[q] = this.kind[p]; this.energy[q] = this.energy[p];
      this.age[q] = this.age[p]; this.maxage[q] = this.maxage[p];
      this._clear(p);
    }
    _empty(p) {
      const out = [];
      for (let k = 0; k < 8; k++) { const q = this.nbr[p * 8 + k]; if (this.kind[q] === EMPTY) out.push(q); }
      return out;
    }
    step() {
      const rng = this.rng, kind = this.kind, energy = this.energy, grass = this.grass, nbr = this.nbr;
      for (let i = 0; i < grass.length; i++) grass[i] = Math.min(1, grass[i] + this.regrow);
      const animals = [];
      for (let i = 0; i < kind.length; i++) if (kind[i]) animals.push(i);
      for (let i = animals.length - 1; i > 0; i--) {
        const j = rng.int(i + 1), t = animals[i]; animals[i] = animals[j]; animals[j] = t;
      }
      for (let a = 0; a < animals.length; a++) {
        let p = animals[a];
        const kd = kind[p];
        if (kd === EMPTY) continue;               // eaten earlier this step
        const sp = kd === RABBIT ? this.rabbit : this.fox;
        this.age[p] += 1;
        energy[p] -= sp.metabolism;
        if (energy[p] <= 0 || this.age[p] >= this.maxage[p] || rng() < sp.pDeath) {
          this._clear(p); continue;
        }
        if (kd === RABBIT) {
          if (rng() < sp.pMove) {
            const empty = this._empty(p);
            if (empty.length) {
              let best = -1, bv = -1;
              for (const q of empty) { const v = grass[q] + 0.3 * rng(); if (v > bv) { bv = v; best = q; } }
              if (grass[best] >= grass[p] - 0.1 || rng() < 0.3) { this._move(p, best); p = best; }
            }
          }
          const eat = Math.min(this.bite, grass[p]);
          grass[p] -= eat;
          energy[p] = Math.min(sp.maxEnergy, energy[p] + sp.food * eat / this.bite);
        } else {
          const prey = [];
          for (let k = 0; k < 8; k++) { const q = nbr[p * 8 + k]; if (kind[q] === RABBIT) prey.push(q); }
          let caught = false;
          if (prey.length) {
            const t = prey[rng.int(prey.length)];
            if (rng() < this.pCatch) {
              this._clear(t); this._move(p, t); p = t;
              energy[p] = Math.min(sp.maxEnergy, energy[p] + sp.food);
              caught = true;
            }
          }
          if (!caught && rng() < sp.pMove) {
            const empty = this._empty(p);
            if (empty.length) {
              let best = -1, bv = -1;
              for (const q of empty) {
                let s = rng();
                for (let k = 0; k < 8; k++) if (kind[nbr[q * 8 + k]] === RABBIT) s += 1;
                if (s > bv) { bv = s; best = q; }
              }
              this._move(p, best); p = best;
            }
          }
        }
        if (energy[p] >= sp.breedEnergy && rng() < sp.pBreed) {
          const empty = this._empty(p);
          if (empty.length) {
            const q = empty[rng.int(empty.length)], half = energy[p] / 2;
            energy[p] = half;
            this._place(q, kd, sp, half, 0);
          }
        }
      }
      this.generation += 1;
    }
    counts() {
      let r = 0, f = 0, g = 0;
      for (let i = 0; i < this.kind.length; i++) {
        if (this.kind[i] === RABBIT) r++; else if (this.kind[i] === FOX) f++;
        g += this.grass[i];
      }
      return { rabbits: r, foxes: f, grassPct: 100 * g / this.kind.length };
    }
  }

  const DEFAULTS = {
    regrow: 0.03,
    r_food: 4, r_breedEnergy: 10, r_pBreed: 0.3, r_lifespan: 60, r_pDeath: 0.01, r_pMove: 0.8,
    f_food: 15, f_breedEnergy: 45, f_pBreed: 0.2, f_lifespan: 150, f_pDeath: 0.005, pCatch: 0.2,
    rabbits: 400, foxes: 20, size: 80,
  };
  const PRESETS = [
    { name: "Fox, rabbit and grass cycles", note: "All three coexist and rise and fall every 80 to 160 steps.", set: {} },
    { name: "Near-equilibrium", note: "Each rabbit feeds a fox less, but foxes need less energy to breed. The populations settle and level off.", set: { f_food: 8, f_breedEnergy: 30 } },
    { name: "Rabbits and grass only", note: "No foxes: rabbits boom, strip the grass, crash, and repeat about every 80 steps.", set: { regrow: 0.01, r_breedEnergy: 15, foxes: 0 } },
    { name: "Foxes starve", note: "Foxes die out early, then rabbits and grass keep cycling on their own.", set: { regrow: 0.01, f_food: 8, f_breedEnergy: 30 } },
    { name: "Overhunting", note: "Foxes catch too well: rabbits are wiped out, then the foxes starve.", set: { f_breedEnergy: 30, pCatch: 0.5 } },
  ];

  function build(v, seed) {
    return new Ecosystem({
      size: v.size, rabbits: v.rabbits, foxes: v.foxes, regrow: v.regrow, pCatch: v.pCatch, seed,
      rabbit: species({ food: v.r_food, breedEnergy: v.r_breedEnergy, pBreed: v.r_pBreed, lifespan: v.r_lifespan, pDeath: v.r_pDeath, pMove: v.r_pMove, maxEnergy: 20 }),
      fox: species({ food: v.f_food, breedEnergy: v.f_breedEnergy, pBreed: v.f_pBreed, lifespan: v.f_lifespan, pDeath: v.f_pDeath, pMove: 1, maxEnergy: 60 }),
    });
  }

  const api = { EMPTY, RABBIT, FOX, Ecosystem, DEFAULTS, PRESETS, build };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Eco = api;
})(this);
