import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-HrdxDO5h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
var sfx = null;
var muted = false;
var drone = null;
var droneGain = null;
var wired = false;
var noise = null;
function ensure() {
	if (typeof window === "undefined") return null;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return null;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		master.gain.value = muted ? 0 : .9;
		sfx = ctx.createGain();
		sfx.connect(master);
		master.connect(ctx.destination);
	}
	return ctx;
}
function wireVisibility() {
	if (wired || typeof document === "undefined") return;
	wired = true;
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "visible" && ctx && ctx.state === "suspended") ctx.resume();
	});
}
function stopDrone() {
	if (!ctx || !drone || !droneGain) {
		drone = null;
		droneGain = null;
		return;
	}
	const d = drone;
	const g = droneGain;
	drone = null;
	droneGain = null;
	g.gain.setTargetAtTime(1e-4, ctx.currentTime, .03);
	try {
		d.stop(ctx.currentTime + .15);
	} catch {}
	d.onended = () => {
		d.disconnect();
		g.disconnect();
	};
}
function tone(freq, dur, type, gain, when = 0, slideTo) {
	const ac = ctx;
	if (!ac || !sfx) return;
	const t0 = ac.currentTime + when;
	const o = ac.createOscillator();
	const g = ac.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, t0);
	if (slideTo && slideTo > 0) o.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t0 + dur);
	g.gain.setValueAtTime(1e-4, t0);
	g.gain.exponentialRampToValueAtTime(Math.max(2e-4, gain), t0 + .012);
	g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
	o.connect(g);
	g.connect(sfx);
	o.start(t0);
	o.stop(t0 + dur + .03);
	o.onended = () => {
		o.disconnect();
		g.disconnect();
	};
}
function boomBuffer() {
	if (!ctx) return null;
	if (noise) return noise;
	const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * .55), ctx.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < data.length; i++) {
		const env = Math.pow(1 - i / data.length, 1.7);
		data[i] = (Math.random() * 2 - 1) * env;
	}
	noise = buffer;
	return buffer;
}
var audio = {
	unlock() {
		const ac = ensure();
		if (!ac) return;
		if (ac.state === "suspended") ac.resume();
		wireVisibility();
	},
	setMuted(next) {
		muted = next;
		if (!ctx || !master) return;
		master.gain.setTargetAtTime(next ? 0 : .9, ctx.currentTime, .02);
		if (next) stopDrone();
	},
	setDrone(on) {
		const ac = ensure();
		if (!ac || !master) return;
		if (!on || muted) {
			stopDrone();
			return;
		}
		if (drone) return;
		const o = ac.createOscillator();
		const g = ac.createGain();
		o.type = "sine";
		o.frequency.value = 52;
		g.gain.setValueAtTime(1e-4, ac.currentTime);
		g.gain.setTargetAtTime(.018, ac.currentTime, .08);
		o.connect(g);
		g.connect(master);
		o.start();
		drone = o;
		droneGain = g;
	},
	click() {
		tone(720, .045, "square", .045);
	},
	rotate() {
		tone(240, .05, "square", .04);
		tone(380, .06, "square", .035, .04);
	},
	tick(urgent) {
		if (urgent) {
			tone(1480, .05, "square", .07);
			tone(180, .08, "sawtooth", .03);
		} else tone(880, .04, "square", .045);
	},
	bad() {
		tone(96, .16, "sawtooth", .07, 0, 60);
	},
	hit() {
		tone(660, .07, "square", .06);
		tone(990, .09, "square", .05, .05);
	},
	seal() {
		tone(523, .09, "square", .06);
		tone(784, .12, "square", .06, .07);
	},
	arm() {
		tone(196, .18, "square", .05, 0, 880);
	},
	win() {
		tone(523, .12, "square", .06);
		tone(659, .12, "square", .06, .1);
		tone(784, .14, "square", .06, .2);
		tone(1046, .22, "square", .05, .32);
	},
	boom() {
		const ac = ctx;
		if (!ac || !sfx) return;
		const buffer = boomBuffer();
		if (buffer) {
			const src = ac.createBufferSource();
			src.buffer = buffer;
			const filter = ac.createBiquadFilter();
			filter.type = "lowpass";
			filter.frequency.setValueAtTime(900, ac.currentTime);
			filter.frequency.exponentialRampToValueAtTime(140, ac.currentTime + .5);
			const g = ac.createGain();
			g.gain.setValueAtTime(.9, ac.currentTime);
			g.gain.exponentialRampToValueAtTime(1e-4, ac.currentTime + .55);
			src.connect(filter);
			filter.connect(g);
			g.connect(sfx);
			src.start();
			src.onended = () => {
				src.disconnect();
				filter.disconnect();
				g.disconnect();
			};
		}
		tone(140, .45, "sine", .12, 0, 36);
	}
};
/** Keep hex values aligned with tokens in src/styles.css. Canvas cannot read Tailwind classes. */
var palette = {
	void: "#07080b",
	ink: "#0e1116",
	panel: "#161b22",
	metal: "#2c343f",
	edge: "#46515e",
	cyan: "#3de2ff",
	cyanDim: "#0c4a58",
	amber: "#ffb020",
	amberDim: "#6a4308",
	danger: "#ff3b3b",
	dangerDim: "#6e1a22",
	ok: "#3dff9a",
	okDim: "#0e5c36",
	paper: "#d5e7ee",
	mute: "#7f8c96"
};
var subs = /* @__PURE__ */ new Set();
function burst(b) {
	subs.forEach((fn) => fn(b));
}
function onBurst(fn) {
	subs.add(fn);
	return () => {
		subs.delete(fn);
	};
}
function explodeFx() {
	const colors = [
		palette.danger,
		palette.amber,
		palette.paper,
		palette.amberDim
	];
	for (let i = 0; i < 5; i++) burst({
		x: .32 + Math.random() * .36,
		y: .28 + Math.random() * .28,
		color: colors[i % colors.length],
		count: 26,
		speed: 160 + Math.random() * 240,
		life: .65 + Math.random() * .35
	});
}
function sealFx() {
	burst({
		x: .42,
		y: .46,
		color: palette.ok,
		count: 22,
		speed: 150,
		life: .55
	});
	burst({
		x: .58,
		y: .4,
		color: palette.cyan,
		count: 14,
		speed: 110,
		life: .45
	});
}
/** 9×9 pixel symbols. */
var ICONS = {
	bolt: [
		"000011100",
		"000111000",
		"001110000",
		"011111110",
		"001111100",
		"000011000",
		"000110000",
		"001100000",
		"011000000"
	],
	eye: [
		"000000000",
		"001111100",
		"010000010",
		"011011010",
		"010111010",
		"011011010",
		"010000010",
		"001111100",
		"000000000"
	],
	cross: [
		"000010000",
		"000010000",
		"000010000",
		"111111111",
		"000010000",
		"000010000",
		"000010000",
		"000000000",
		"000000000"
	],
	diamond: [
		"000010000",
		"000111000",
		"001111100",
		"011111110",
		"111111111",
		"011111110",
		"001111100",
		"000111000",
		"000010000"
	],
	wave: [
		"000000000",
		"110001100",
		"110001100",
		"001110010",
		"001110010",
		"110001100",
		"110001100",
		"000000000",
		"000000000"
	],
	tri: [
		"000010000",
		"000111000",
		"001101100",
		"011000110",
		"110000011",
		"111111111",
		"000000000",
		"000000000",
		"000000000"
	],
	gear: [
		"001000100",
		"011111110",
		"111111111",
		"110111011",
		"111000111",
		"110111011",
		"111111111",
		"011111110",
		"001000100"
	],
	hash: [
		"000000000",
		"010010010",
		"111111111",
		"010010010",
		"010010010",
		"111111111",
		"010010010",
		"000000000",
		"000000000"
	],
	ring: [
		"000000000",
		"001111100",
		"010000010",
		"010000010",
		"010000010",
		"010000010",
		"010000010",
		"001111100",
		"000000000"
	],
	ringDot: [
		"000000000",
		"001111100",
		"010000010",
		"010000010",
		"010111010",
		"010000010",
		"010000010",
		"001111100",
		"000000000"
	],
	box: [
		"000000000",
		"011111110",
		"010000010",
		"010000010",
		"010000010",
		"010000010",
		"010000010",
		"011111110",
		"000000000"
	],
	boxGap: [
		"000000000",
		"011111110",
		"010000010",
		"010000010",
		"010000000",
		"010000010",
		"010000010",
		"011111110",
		"000000000"
	],
	plus: [
		"000010000",
		"000010000",
		"000010000",
		"111111111",
		"000010000",
		"000010000",
		"000010000",
		"000000000",
		"000000000"
	],
	plusDot: [
		"000010000",
		"000010000",
		"000010000",
		"111111111",
		"000010000",
		"000010000",
		"000010000",
		"000010000",
		"000111000"
	],
	chevU: [
		"000010000",
		"000111000",
		"001111100",
		"011111110",
		"010000010",
		"000000000",
		"000000000",
		"000000000",
		"000000000"
	],
	chevR: [
		"001000000",
		"001100000",
		"001110000",
		"001111000",
		"001111100",
		"001111000",
		"001110000",
		"001100000",
		"001000000"
	],
	bars2: [
		"000000000",
		"011111110",
		"000000000",
		"000000000",
		"000000000",
		"011111110",
		"000000000",
		"000000000",
		"000000000"
	],
	bars3: [
		"000000000",
		"011111110",
		"000000000",
		"011111110",
		"000000000",
		"011111110",
		"000000000",
		"000000000",
		"000000000"
	],
	gem: [
		"000010000",
		"000111000",
		"001111100",
		"011111110",
		"001111100",
		"000111000",
		"000010000",
		"000000000",
		"000000000"
	],
	gemOpen: [
		"000010000",
		"000101000",
		"001000100",
		"010000010",
		"001000100",
		"000101000",
		"000010000",
		"000000000",
		"000000000"
	]
};
var DISC_SYMBOLS = [
	"bolt",
	"eye",
	"cross",
	"diamond",
	"wave",
	"tri",
	"gear",
	"hash"
];
var SCAN_PAIRS = [
	["ring", "ringDot"],
	["box", "boxGap"],
	["plus", "plusDot"],
	["chevU", "chevR"],
	["bars2", "bars3"],
	["gem", "gemOpen"]
];
function shuffle(items, rng) {
	const next = items.slice();
	for (let i = next.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const a = next[i];
		next[i] = next[j];
		next[j] = a;
	}
	return next;
}
var KINDS = [
	"circuit",
	"signal",
	"discs",
	"scan"
];
function pickThree(rng = Math.random) {
	return shuffle(KINDS, rng).slice(0, 3);
}
function makeDiscs(rng = Math.random) {
	return [
		0,
		1,
		2
	].map(() => {
		const symbols = shuffle(DISC_SYMBOLS, rng).slice(0, 4);
		const target = Math.floor(rng() * symbols.length);
		return {
			symbols,
			current: (target + 1 + Math.floor(rng() * (symbols.length - 1))) % symbols.length,
			target
		};
	});
}
function makeZone(rng = Math.random) {
	return {
		start: .08 + rng() * .64,
		width: .2
	};
}
function makeScan(rng = Math.random) {
	const cols = 5;
	const rows = 4;
	const pair = SCAN_PAIRS[Math.floor(rng() * SCAN_PAIRS.length)];
	const flip = rng() < .5;
	const base = flip ? pair[1] : pair[0];
	const odd = flip ? pair[0] : pair[1];
	const total = 20;
	const oddIndex = Math.floor(rng() * total);
	const cells = Array.from({ length: total }, () => base);
	cells[oddIndex] = odd;
	return {
		cols,
		rows,
		cells,
		oddIndex
	};
}
var SAVE_KEY = "twenty-seconds-v1";
function num(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}
var GameStore = class {
	phase = "menu";
	time = 20;
	order = [];
	step = 0;
	paused = false;
	locking = false;
	banner = "";
	urgent = false;
	round = 0;
	muted = false;
	flash = "none";
	stats = {
		wins: 0,
		losses: 0,
		best: 0
	};
	hydrated = false;
	freshBest = false;
	reduce = false;
	tenth = 200;
	impulse = 0;
	listeners = /* @__PURE__ */ new Set();
	snapshot;
	raf = 0;
	last = 0;
	pending = 0;
	flashTimer = 0;
	constructor() {
		this.snapshot = this.makeSnap();
	}
	subscribe = (listener) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};
	get = () => this.snapshot;
	getShake() {
		return this.reduce ? 0 : this.impulse;
	}
	addImpulse(amount) {
		if (this.reduce) return;
		this.impulse = Math.max(this.impulse, amount);
	}
	startLoop() {
		this.stopLoop();
		this.last = performance.now();
		this.raf = requestAnimationFrame(this.loop);
		return () => this.stopLoop();
	}
	stopLoop() {
		if (this.raf) cancelAnimationFrame(this.raf);
		this.raf = 0;
	}
	hydrate() {
		if (typeof window === "undefined") return;
		this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		try {
			const raw = localStorage.getItem(SAVE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				this.stats = {
					wins: num(parsed.wins),
					losses: num(parsed.losses),
					best: num(parsed.best)
				};
				this.muted = Boolean(parsed.muted);
				audio.setMuted(this.muted);
			}
		} catch {}
		this.hydrated = true;
		this.publish();
	}
	start = () => {
		audio.unlock();
		this.clearPending();
		this.phase = "play";
		this.time = 20;
		this.tenth = 200;
		this.order = pickThree(Math.random);
		this.step = 0;
		this.paused = false;
		this.locking = false;
		this.banner = "";
		this.urgent = false;
		this.flash = "none";
		this.freshBest = false;
		this.round += 1;
		this.addImpulse(2);
		audio.arm();
		if (!this.muted) audio.setDrone(true);
		this.publish();
	};
	help = () => {
		audio.unlock();
		this.phase = "help";
		this.publish();
	};
	menu = () => {
		this.clearPending();
		this.phase = "menu";
		this.paused = false;
		this.locking = false;
		this.banner = "";
		this.urgent = false;
		this.flash = "none";
		audio.setDrone(false);
		this.publish();
	};
	togglePause = () => {
		if (this.phase !== "play" || this.locking) return;
		this.paused = !this.paused;
		if (this.paused || this.muted) audio.setDrone(false);
		else audio.setDrone(true);
		this.publish();
	};
	toggleMute = () => {
		audio.unlock();
		this.muted = !this.muted;
		audio.setMuted(this.muted);
		if (this.muted) audio.setDrone(false);
		else if (this.phase === "play" && !this.paused) audio.setDrone(true);
		this.persist();
		this.publish();
	};
	blip = (kind) => {
		if (this.phase === "boom" || this.phase === "lose") return;
		this.flash = kind;
		this.publish();
		if (this.flashTimer) window.clearTimeout(this.flashTimer);
		this.flashTimer = window.setTimeout(() => {
			if (this.flash === kind) {
				this.flash = "none";
				this.publish();
			}
		}, 140);
	};
	complete = () => {
		if (this.phase !== "play" || this.locking || this.time <= 0) return;
		this.locking = true;
		const last = this.step >= this.order.length - 1;
		this.banner = last ? "DEFUSED" : "SEALED";
		audio.seal();
		sealFx();
		this.addImpulse(5);
		this.blip("good");
		this.publish();
		this.pending = window.setTimeout(() => {
			this.pending = 0;
			if (this.phase !== "play") return;
			this.locking = false;
			this.banner = "";
			if (last) this.victory();
			else {
				this.step += 1;
				this.publish();
			}
		}, 680);
	};
	victory() {
		const remain = Math.max(0, Math.floor(this.time * 10 + 1e-4) / 10);
		this.freshBest = remain > this.stats.best;
		this.stats = {
			wins: this.stats.wins + 1,
			losses: this.stats.losses,
			best: Math.max(this.stats.best, remain)
		};
		this.phase = "win";
		this.paused = false;
		this.urgent = false;
		this.locking = false;
		audio.setDrone(false);
		audio.win();
		sealFx();
		this.persist();
		this.publish();
	}
	explode() {
		if (this.phase !== "play") return;
		this.clearPending();
		this.time = 0;
		this.tenth = 0;
		this.phase = "boom";
		this.urgent = true;
		this.locking = false;
		this.banner = "";
		this.paused = false;
		audio.setDrone(false);
		audio.boom();
		explodeFx();
		this.flash = "boom";
		this.addImpulse(18);
		this.publish();
		this.pending = window.setTimeout(() => {
			this.pending = 0;
			if (this.phase !== "boom") return;
			this.phase = "lose";
			this.flash = "none";
			this.urgent = false;
			this.stats = {
				...this.stats,
				losses: this.stats.losses + 1
			};
			this.persist();
			this.publish();
		}, 1050);
	}
	loop = (now) => {
		const raw = Math.max(0, (now - this.last) / 1e3);
		this.last = now;
		let dirty = false;
		if (this.phase === "play" && !this.paused && !this.locking) {
			const prevFloor = Math.floor(this.time + 1e-4);
			this.time = Math.max(0, this.time - raw);
			if (this.time <= 0) {
				this.raf = requestAnimationFrame(this.loop);
				this.explode();
				return;
			}
			if (Math.floor(this.time + 1e-4) < prevFloor) audio.tick(this.time <= 5);
			const tenth = Math.floor(this.time * 10 + 1e-4);
			if (tenth !== this.tenth) {
				this.tenth = tenth;
				dirty = true;
			}
			const urgent = this.time <= 5;
			if (urgent !== this.urgent) {
				this.urgent = urgent;
				dirty = true;
			}
		}
		if (this.phase === "play" && this.urgent && !this.paused && !this.reduce) this.impulse = Math.max(this.impulse, 1.6);
		if (this.phase === "boom" && !this.reduce) this.impulse = Math.max(this.impulse, 11);
		this.impulse = Math.max(0, this.impulse - raw * (this.phase === "boom" ? 7 : 14));
		if (dirty) this.publish();
		this.raf = requestAnimationFrame(this.loop);
	};
	publish() {
		this.snapshot = this.makeSnap();
		this.listeners.forEach((listener) => listener());
	}
	makeSnap() {
		return {
			phase: this.phase,
			time: Math.floor(this.time * 10 + 1e-4) / 10,
			order: this.order,
			step: this.step,
			paused: this.paused,
			locking: this.locking,
			banner: this.banner,
			urgent: this.urgent,
			round: this.round,
			muted: this.muted,
			flash: this.flash,
			stats: this.stats,
			hydrated: this.hydrated,
			freshBest: this.freshBest
		};
	}
	persist() {
		if (typeof localStorage === "undefined") return;
		const data = {
			v: 1,
			...this.stats,
			muted: this.muted
		};
		localStorage.setItem(SAVE_KEY, JSON.stringify(data));
	}
	clearPending() {
		if (this.pending) window.clearTimeout(this.pending);
		if (this.flashTimer) window.clearTimeout(this.flashTimer);
		this.pending = 0;
		this.flashTimer = 0;
	}
};
var KIND_LABEL = {
	circuit: "CIRCUIT",
	signal: "SIGNAL",
	discs: "DISCS",
	scan: "SCAN"
};
var KIND_HINT = {
	circuit: ["ROTATE TILES", "LINK SRC TO DST"],
	signal: ["STOP IN THE ZONE", "TWO CLEAN HITS"],
	discs: ["MATCH EACH DISC", "TO ITS LOCK"],
	scan: ["FIND THE ONE", "ODD SYMBOL"]
};
function formatTime(t) {
	const tenths = Math.max(0, Math.floor(t * 10 + 1e-4));
	const sec = Math.floor(tenths / 10);
	const frac = tenths % 10;
	return `${String(sec).padStart(2, "0")}.${frac}`;
}
/** 5×7 pixel glyphs. Rows are top to bottom, '1' is ink. */
var FONT = {
	A: [
		"01110",
		"10001",
		"10001",
		"11111",
		"10001",
		"10001",
		"10001"
	],
	B: [
		"11110",
		"10001",
		"10001",
		"11110",
		"10001",
		"10001",
		"11110"
	],
	C: [
		"01111",
		"10000",
		"10000",
		"10000",
		"10000",
		"10000",
		"01111"
	],
	D: [
		"11110",
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"11110"
	],
	E: [
		"11111",
		"10000",
		"10000",
		"11110",
		"10000",
		"10000",
		"11111"
	],
	F: [
		"11111",
		"10000",
		"10000",
		"11110",
		"10000",
		"10000",
		"10000"
	],
	G: [
		"01111",
		"10000",
		"10000",
		"10111",
		"10001",
		"10001",
		"01111"
	],
	H: [
		"10001",
		"10001",
		"10001",
		"11111",
		"10001",
		"10001",
		"10001"
	],
	I: [
		"11111",
		"00100",
		"00100",
		"00100",
		"00100",
		"00100",
		"11111"
	],
	J: [
		"00111",
		"00010",
		"00010",
		"00010",
		"10010",
		"10010",
		"01100"
	],
	K: [
		"10001",
		"10010",
		"10100",
		"11000",
		"10100",
		"10010",
		"10001"
	],
	L: [
		"10000",
		"10000",
		"10000",
		"10000",
		"10000",
		"10000",
		"11111"
	],
	M: [
		"10001",
		"11011",
		"10101",
		"10101",
		"10001",
		"10001",
		"10001"
	],
	N: [
		"10001",
		"11001",
		"10101",
		"10011",
		"10001",
		"10001",
		"10001"
	],
	O: [
		"01110",
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"01110"
	],
	P: [
		"11110",
		"10001",
		"10001",
		"11110",
		"10000",
		"10000",
		"10000"
	],
	Q: [
		"01110",
		"10001",
		"10001",
		"10001",
		"10101",
		"10010",
		"01101"
	],
	R: [
		"11110",
		"10001",
		"10001",
		"11110",
		"10100",
		"10010",
		"10001"
	],
	S: [
		"01111",
		"10000",
		"10000",
		"01110",
		"00001",
		"00001",
		"11110"
	],
	T: [
		"11111",
		"00100",
		"00100",
		"00100",
		"00100",
		"00100",
		"00100"
	],
	U: [
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"01110"
	],
	V: [
		"10001",
		"10001",
		"10001",
		"10001",
		"10001",
		"01010",
		"00100"
	],
	W: [
		"10001",
		"10001",
		"10001",
		"10101",
		"10101",
		"10101",
		"01010"
	],
	X: [
		"10001",
		"10001",
		"01010",
		"00100",
		"01010",
		"10001",
		"10001"
	],
	Y: [
		"10001",
		"10001",
		"01010",
		"00100",
		"00100",
		"00100",
		"00100"
	],
	Z: [
		"11111",
		"00001",
		"00010",
		"00100",
		"01000",
		"10000",
		"11111"
	],
	"0": [
		"01110",
		"10001",
		"10011",
		"10101",
		"11001",
		"10001",
		"01110"
	],
	"1": [
		"00100",
		"01100",
		"00100",
		"00100",
		"00100",
		"00100",
		"01110"
	],
	"2": [
		"01110",
		"10001",
		"00001",
		"00010",
		"00100",
		"01000",
		"11111"
	],
	"3": [
		"11110",
		"00001",
		"00001",
		"01110",
		"00001",
		"00001",
		"11110"
	],
	"4": [
		"00010",
		"00110",
		"01010",
		"10010",
		"11111",
		"00010",
		"00010"
	],
	"5": [
		"11111",
		"10000",
		"11110",
		"00001",
		"00001",
		"10001",
		"01110"
	],
	"6": [
		"01110",
		"10000",
		"10000",
		"11110",
		"10001",
		"10001",
		"01110"
	],
	"7": [
		"11111",
		"00001",
		"00010",
		"00100",
		"01000",
		"01000",
		"01000"
	],
	"8": [
		"01110",
		"10001",
		"10001",
		"01110",
		"10001",
		"10001",
		"01110"
	],
	"9": [
		"01110",
		"10001",
		"10001",
		"01111",
		"00001",
		"00001",
		"01110"
	],
	".": [
		"00000",
		"00000",
		"00000",
		"00000",
		"00000",
		"01100",
		"01100"
	],
	":": [
		"00000",
		"01100",
		"01100",
		"00000",
		"01100",
		"01100",
		"00000"
	],
	"!": [
		"00100",
		"00100",
		"00100",
		"00100",
		"00100",
		"00000",
		"00100"
	],
	"?": [
		"01110",
		"10001",
		"00001",
		"00010",
		"00100",
		"00000",
		"00100"
	],
	"-": [
		"00000",
		"00000",
		"00000",
		"11111",
		"00000",
		"00000",
		"00000"
	],
	"/": [
		"00001",
		"00010",
		"00010",
		"00100",
		"01000",
		"01000",
		"10000"
	],
	"+": [
		"00000",
		"00100",
		"00100",
		"11111",
		"00100",
		"00100",
		"00000"
	],
	"'": [
		"00100",
		"00100",
		"01000",
		"00000",
		"00000",
		"00000",
		"00000"
	],
	">": [
		"10000",
		"01000",
		"00100",
		"00010",
		"00100",
		"01000",
		"10000"
	],
	"<": [
		"00001",
		"00010",
		"00100",
		"01000",
		"00100",
		"00010",
		"00001"
	]
};
var UNKNOWN = [
	"11111",
	"10001",
	"10001",
	"10001",
	"10001",
	"10001",
	"11111"
];
function glyphOf(ch) {
	if (ch === " ") return [
		"00000",
		"00000",
		"00000",
		"00000",
		"00000",
		"00000",
		"00000"
	];
	return FONT[ch] ?? UNKNOWN;
}
/** Draw uppercase pixel text. Returns the width in pixels. */
function drawText(ctx, text, x, y, scale, color) {
	ctx.fillStyle = color;
	const lines = text.toUpperCase().split("\n");
	let max = 0;
	lines.forEach((line, li) => {
		let cx = x;
		const cy = y + li * 8 * scale;
		for (const ch of line) {
			const glyph = glyphOf(ch);
			for (let r = 0; r < 7; r++) {
				const row = glyph[r] ?? "";
				for (let c = 0; c < 5; c++) if (row[c] === "1") ctx.fillRect(cx + c * scale, cy + r * scale, scale, scale);
			}
			cx += 6 * scale;
		}
		max = Math.max(max, cx - x);
	});
	return max;
}
function measureText(text, scale) {
	const lines = text.toUpperCase().split("\n");
	return {
		width: lines.reduce((m, line) => Math.max(m, line.length * 6 * scale), 0),
		height: lines.length * 7 * scale + (lines.length - 1) * scale
	};
}
var LW = 96;
var LH = 80;
function rect(ctx, x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}
function draw(ctx, now, props) {
	ctx.setTransform(2, 0, 0, 2, 0, 0);
	ctx.imageSmoothingEnabled = false;
	ctx.clearRect(0, 0, LW, LH);
	const { mode, urgent, timeText } = props;
	const dead = mode === "dead";
	const safe = mode === "safe";
	const blink = Math.floor(now / (urgent || dead ? 90 : 420)) % 2 === 0;
	const led = safe ? palette.ok : urgent || dead ? palette.danger : blink ? palette.cyan : palette.cyanDim;
	const shell = dead ? palette.dangerDim : palette.panel;
	const edge = safe ? palette.ok : urgent ? palette.danger : palette.metal;
	const ox = dead ? Math.floor(now / 40) % 2 === 0 ? 1 : -1 : 0;
	const wires = [
		[30, palette.danger],
		[46, palette.amber],
		[62, palette.cyan]
	];
	for (const [x, color] of wires) {
		rect(ctx, x, 2, 2, 16, color);
		rect(ctx, x - 1, 2, 4, 2, color);
	}
	rect(ctx, 45, 0, 4, 4, blink ? palette.amber : palette.amberDim);
	rect(ctx, 14 + ox, 18, 68, 54, edge);
	rect(ctx, 17 + ox, 21, 62, 48, shell);
	for (let i = 0; i < 6; i++) rect(ctx, 17 + ox, 22 + i * 8, 5, 4, i % 2 === 0 ? palette.amber : palette.void);
	rect(ctx, 28 + ox, 28, 44, 20, palette.void);
	rect(ctx, 30 + ox, 30, 40, 16, "#050608");
	const label = safe ? "SAFE" : dead ? "XXXX" : timeText;
	const color = safe ? palette.ok : urgent || dead ? palette.danger : palette.cyan;
	const scale = 2;
	const box = measureText(label, scale);
	drawText(ctx, label, 30 + ox + Math.floor((40 - box.width) / 2), 33, scale, color);
	[
		36,
		48,
		60,
		72
	].forEach((x, i) => {
		const on = safe || (Math.floor(now / (urgent ? 70 : 180)) + i) % (safe ? 2 : 3) !== 0;
		rect(ctx, x + ox, 54, 6, 6, on ? led : palette.ink);
		if (on) rect(ctx, x + 1 + ox, 55, 4, 2, palette.paper);
	});
	rect(ctx, 22 + ox, 64, 4, 4, palette.edge);
	rect(ctx, 70 + ox, 64, 4, 4, palette.edge);
	rect(ctx, 22 + ox, 24, 4, 4, palette.edge);
	rect(ctx, 70 + ox, 24, 4, 4, palette.edge);
	if (dead) {
		rect(ctx, 40, 22, 2, 30, palette.amber);
		rect(ctx, 34, 36, 18, 2, palette.danger);
		rect(ctx, 58, 26, 8, 2, palette.paper);
	}
}
function Bomb({ timeText, mode, urgent }) {
	const ref = (0, import_react.useRef)(null);
	const props = (0, import_react.useRef)({
		timeText,
		mode,
		urgent
	});
	props.current = {
		timeText,
		mode,
		urgent
	};
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		let raf = 0;
		const loop = (now) => {
			draw(ctx, now, props.current);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "bomb-canvas",
		width: 192,
		height: 160,
		"aria-hidden": "true"
	});
}
var SHAPES = [
	3,
	6,
	12,
	9,
	5,
	10
];
function rotateMask(mask, turns = 1) {
	let m = mask;
	const n = (turns % 4 + 4) % 4;
	for (let i = 0; i < n; i++) {
		let next = 0;
		if (m & 1) next |= 2;
		if (m & 2) next |= 4;
		if (m & 4) next |= 8;
		if (m & 8) next |= 1;
		m = next;
	}
	return m;
}
function trace(tiles, cols, rows, start, end) {
	const powered = /* @__PURE__ */ new Set();
	const dist = /* @__PURE__ */ new Map();
	const at = (x, y) => y * cols + x;
	const startI = at(start.x, start.y);
	if (((tiles[startI] ?? 0) & 8) === 0) return {
		powered,
		solved: false,
		dist
	};
	const opp = {
		[2]: 8,
		[8]: 2,
		[1]: 4,
		[4]: 1
	};
	const delta = {
		[1]: [0, -1],
		[2]: [1, 0],
		[4]: [0, 1],
		[8]: [-1, 0]
	};
	const q = [startI];
	powered.add(startI);
	dist.set(startI, 0);
	while (q.length) {
		const i = q.shift();
		const x = i % cols;
		const y = Math.floor(i / cols);
		const mask = tiles[i] ?? 0;
		for (const dir of [
			1,
			2,
			4,
			8
		]) {
			if ((mask & dir) === 0) continue;
			const [dx, dy] = delta[dir];
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
	return {
		powered,
		solved: powered.has(endI) && ((tiles[endI] ?? 0) & 2) !== 0,
		dist
	};
}
function toward(a, b) {
	if (b.x === a.x + 1) return 2;
	if (b.x === a.x - 1) return 8;
	if (b.y === a.y + 1) return 4;
	if (b.y === a.y - 1) return 1;
	return 0;
}
function cornerCount(path) {
	let c = 0;
	for (let i = 1; i < path.length - 1; i++) {
		const prev = path[i - 1];
		const cur = path[i];
		const next = path[i + 1];
		const dx1 = cur.x - prev.x;
		const dy1 = cur.y - prev.y;
		const dx2 = next.x - cur.x;
		const dy2 = next.y - cur.y;
		if (dx1 !== dx2 || dy1 !== dy2) c++;
	}
	return c;
}
function findPath(cols, rows, rng, sy, ey) {
	const start = {
		x: 0,
		y: sy
	};
	const path = [start];
	const seen = /* @__PURE__ */ new Set([`${start.x},${start.y}`]);
	const dfs = (cur) => {
		if (cur.x === cols - 1 && cur.y === ey) return true;
		const nbs = [
			{
				x: cur.x + 1,
				y: cur.y
			},
			{
				x: cur.x,
				y: cur.y + 1
			},
			{
				x: cur.x,
				y: cur.y - 1
			},
			{
				x: cur.x - 1,
				y: cur.y
			}
		].filter((p) => p.x >= 0 && p.y >= 0 && p.x < cols && p.y < rows && !seen.has(`${p.x},${p.y}`));
		nbs.sort((a, b) => {
			return rng() - (a.x > cur.x ? .45 : 0) - (rng() - (b.x > cur.x ? .45 : 0));
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
function masksFromPath(path, cols, rows, rng) {
	const tiles = new Array(cols * rows).fill(0);
	for (let i = 0; i < path.length; i++) {
		const p = path[i];
		let mask = 0;
		if (i === 0) mask |= 8;
		else mask |= toward(p, path[i - 1]);
		if (i === path.length - 1) mask |= 2;
		else mask |= toward(p, path[i + 1]);
		tiles[p.y * cols + p.x] = mask;
	}
	for (let i = 0; i < tiles.length; i++) if (tiles[i] === 0) tiles[i] = SHAPES[Math.floor(rng() * SHAPES.length)];
	return tiles;
}
var FALLBACK = [
	{
		x: 0,
		y: 0
	},
	{
		x: 1,
		y: 0
	},
	{
		x: 1,
		y: 1
	},
	{
		x: 2,
		y: 1
	},
	{
		x: 2,
		y: 2
	},
	{
		x: 3,
		y: 2
	}
];
function generateCircuit(rng = Math.random) {
	const cols = 4;
	const rows = 3;
	let path = null;
	for (let attempt = 0; attempt < 28 && !path; attempt++) {
		const candidate = findPath(cols, rows, rng, Math.floor(rng() * rows), Math.floor(rng() * rows));
		if (!candidate) continue;
		if (candidate.length >= 6 && cornerCount(candidate) >= 2) path = candidate;
		else if (attempt > 18) path = candidate;
	}
	if (!path) path = FALLBACK.map((p) => ({ ...p }));
	const start = path[0];
	const end = path[path.length - 1];
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
	return {
		cols,
		rows,
		tiles,
		answer,
		start,
		end
	};
}
function PixelText({ text, scale = 3, color, glow }) {
	const ref = (0, import_react.useRef)(null);
	const box = measureText(text, scale);
	const width = Math.max(1, box.width);
	const height = Math.max(1, box.height);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.floor(width * dpr);
		canvas.height = Math.floor(height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, width, height);
		drawText(ctx, text, 0, 0, scale, color);
	}, [
		text,
		scale,
		color,
		width,
		height
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: glow ? `pix-glow pix-glow-${glow}` : "pix-canvas",
		width,
		height,
		style: {
			width,
			height
		},
		"aria-hidden": "true"
	});
}
var Ctx = (0, import_react.createContext)(null);
function GameProvider({ store, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: store,
		children
	});
}
function useGameStore() {
	const store = (0, import_react.useContext)(Ctx);
	if (!store) throw new Error("Game store missing");
	return store;
}
function useSnap() {
	const store = useGameStore();
	return (0, import_react.useSyncExternalStore)(store.subscribe, store.get, store.get);
}
function WireFace({ mask, hot }) {
	const cells = [];
	for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
		let lit = false;
		if (r === 2 && c === 2) lit = mask !== 0;
		if (c === 2 && r < 2) lit = (mask & 1) !== 0;
		if (c === 2 && r > 2) lit = (mask & 4) !== 0;
		if (r === 2 && c > 2) lit = (mask & 2) !== 0;
		if (r === 2 && c < 2) lit = (mask & 8) !== 0;
		cells.push(lit);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "face",
		"aria-hidden": "true",
		children: cells.map((lit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: lit ? hot ? "px on" : "px off" : "px" }, i))
	});
}
function CircuitBoard({ frozen, onComplete }) {
	const store = useGameStore();
	const [puzzle] = (0, import_react.useState)(() => generateCircuit(Math.random));
	const [tiles, setTiles] = (0, import_react.useState)(() => puzzle.tiles.slice());
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const result = (0, import_react.useMemo)(() => trace(tiles, puzzle.cols, puzzle.rows, puzzle.start, puzzle.end), [tiles, puzzle]);
	(0, import_react.useEffect)(() => {
		if (!result.solved || frozen) return;
		const id = window.setTimeout(onComplete, 380);
		return () => window.clearTimeout(id);
	}, [
		result.solved,
		frozen,
		onComplete
	]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (frozen || result.solved) return;
			const onButton = event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
			const { cols, rows } = puzzle;
			if (event.code === "ArrowLeft") {
				event.preventDefault();
				setCursor((c) => c % cols === 0 ? c : c - 1);
			} else if (event.code === "ArrowRight") {
				event.preventDefault();
				setCursor((c) => c % cols === cols - 1 ? c : c + 1);
			} else if (event.code === "ArrowUp") {
				event.preventDefault();
				setCursor((c) => c - cols < 0 ? c : c - cols);
			} else if (event.code === "ArrowDown") {
				event.preventDefault();
				setCursor((c) => c + cols >= cols * rows ? c : c + cols);
			} else if (!onButton && (event.code === "Enter" || event.code === "Space")) {
				event.preventDefault();
				rotateAt(cursor);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	const rotateAt = (index) => {
		if (frozen || result.solved) return;
		audio.rotate();
		store.addImpulse(1.2);
		setTiles((current) => {
			const next = current.slice();
			next[index] = rotateMask(next[index] ?? 0, 1);
			return next;
		});
	};
	const startI = puzzle.start.y * puzzle.cols + puzzle.start.x;
	const sourceHot = ((tiles[startI] ?? 0) & 8) !== 0 && result.powered.has(startI);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "circuit-board",
		"data-testid": "circuit",
		children: [Array.from({ length: puzzle.rows }, (_, y) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "circuit-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `port${y === puzzle.start.y ? " show" : ""}${sourceHot && y === puzzle.start.y ? " hot" : ""}`,
					children: y === puzzle.start.y ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
						text: "SRC",
						scale: 2,
						color: sourceHot ? palette.cyan : palette.danger
					}) : null
				}),
				Array.from({ length: puzzle.cols }, (_, x) => {
					const index = y * puzzle.cols + x;
					const hot = result.powered.has(index);
					const dist = result.dist.get(index) ?? 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `wire${hot ? " hot" : ""}${cursor === index ? " sel" : ""}`,
						style: { animationDelay: `${dist * 90}ms` },
						"aria-label": `Rotate connector row ${y + 1} column ${x + 1}`,
						onClick: () => {
							setCursor(index);
							rotateAt(index);
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WireFace, {
							mask: tiles[index] ?? 0,
							hot
						})
					}, index);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `port${y === puzzle.end.y ? " show" : ""}${result.solved && y === puzzle.end.y ? " hot" : ""}`,
					children: y === puzzle.end.y ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
						text: "DST",
						scale: 2,
						color: result.solved ? palette.ok : palette.mute
					}) : null
				})
			]
		}, y)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: result.solved ? "Circuit linked" : "Circuit open"
		})]
	});
}
function PixelIcon({ name, scale = 4, color }) {
	const ref = (0, import_react.useRef)(null);
	const size = 9 * scale;
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.floor(size * dpr);
		canvas.height = Math.floor(size * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, size, size);
		const glyph = ICONS[name] ?? ICONS.box;
		ctx.fillStyle = color;
		for (let y = 0; y < 9; y++) {
			const row = glyph[y] ?? "";
			for (let x = 0; x < 9; x++) if (row[x] === "1") ctx.fillRect(x * scale, y * scale, scale, scale);
		}
	}, [
		name,
		scale,
		color,
		size
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "pix-canvas",
		width: size,
		height: size,
		style: {
			width: size,
			height: size
		},
		"aria-hidden": "true"
	});
}
function DiscLocks({ frozen, onComplete }) {
	const [discs, setDiscs] = (0, import_react.useState)(() => makeDiscs(Math.random));
	const [spin, setSpin] = (0, import_react.useState)([
		0,
		0,
		0
	]);
	const [anim, setAnim] = (0, import_react.useState)([
		false,
		false,
		false
	]);
	const busy = (0, import_react.useRef)(false);
	const done = (0, import_react.useRef)(false);
	const timer = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => () => window.clearTimeout(timer.current), []);
	const turn = (index) => {
		if (frozen || busy.current || done.current) return;
		busy.current = true;
		audio.rotate();
		setAnim([
			false,
			false,
			false
		].map((_, i) => i === index));
		setSpin((current) => current.map((value, i) => i === index ? 90 : value));
		timer.current = window.setTimeout(() => {
			setDiscs((current) => {
				const next = current.map((disc, i) => i === index ? {
					...disc,
					current: (disc.current + 1) % disc.symbols.length
				} : disc);
				if (!done.current && next.every((disc) => disc.current === disc.target)) {
					done.current = true;
					window.setTimeout(onComplete, 260);
				}
				return next;
			});
			setAnim([
				false,
				false,
				false
			]);
			setSpin([
				0,
				0,
				0
			]);
			busy.current = false;
		}, 150);
	};
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (frozen) return;
			const index = {
				Digit1: 0,
				Digit2: 1,
				Digit3: 2,
				KeyA: 0,
				KeyS: 1,
				KeyD: 2
			}[event.code];
			if (index === void 0) return;
			event.preventDefault();
			turn(index);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "discs",
		"data-testid": "discs",
		children: discs.map((disc, index) => {
			const symbol = disc.symbols[disc.current] ?? "bolt";
			const target = disc.symbols[disc.target] ?? "bolt";
			const matched = disc.current === disc.target;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "disc-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
						text: "LOCK",
						scale: 2,
						color: palette.mute
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelIcon, {
						name: target,
						scale: 3,
						color: palette.amber
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: `disc${matched ? " matched" : ""}`,
						"aria-label": `Disc ${index + 1}. Showing ${symbol}. Lock wants ${target}.`,
						onClick: () => turn(index),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "disc-face",
							style: {
								transform: `rotate(${spin[index] ?? 0}deg)`,
								transition: anim[index] ? "transform 140ms linear" : "none"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelIcon, {
								name: symbol,
								scale: 5,
								color: matched ? palette.ok : palette.cyan
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
						text: String(index + 1),
						scale: 2,
						color: matched ? palette.ok : palette.paper
					})
				]
			}, index);
		})
	});
}
function OddScan({ frozen, onComplete }) {
	const store = useGameStore();
	const [puzzle] = (0, import_react.useState)(() => makeScan(Math.random));
	const cursorRef = (0, import_react.useRef)(0);
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const [bad, setBad] = (0, import_react.useState)(-1);
	const [good, setGood] = (0, import_react.useState)(-1);
	const done = (0, import_react.useRef)(false);
	const choose = (index) => {
		if (frozen || done.current) return;
		if (index === puzzle.oddIndex) {
			done.current = true;
			setGood(index);
			audio.hit();
			window.setTimeout(onComplete, 240);
			return;
		}
		audio.bad();
		store.addImpulse(4);
		store.blip("bad");
		setBad(index);
		window.setTimeout(() => setBad((current) => current === index ? -1 : current), 220);
	};
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (frozen) return;
			const onButton = event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
			const { cols, rows } = puzzle;
			const total = cols * rows;
			if (event.code === "ArrowLeft") {
				event.preventDefault();
				setCursor((c) => {
					const next = c % cols === 0 ? c : c - 1;
					cursorRef.current = next;
					return next;
				});
			} else if (event.code === "ArrowRight") {
				event.preventDefault();
				setCursor((c) => {
					const next = c % cols === cols - 1 ? c : c + 1;
					cursorRef.current = next;
					return next;
				});
			} else if (event.code === "ArrowUp") {
				event.preventDefault();
				setCursor((c) => {
					const next = c - cols < 0 ? c : c - cols;
					cursorRef.current = next;
					return next;
				});
			} else if (event.code === "ArrowDown") {
				event.preventDefault();
				setCursor((c) => {
					const next = c + cols >= total ? c : c + cols;
					cursorRef.current = next;
					return next;
				});
			} else if (!onButton && (event.code === "Enter" || event.code === "Space")) {
				event.preventDefault();
				choose(cursorRef.current);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "scan-grid",
		"data-testid": "scan",
		style: { gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)` },
		children: puzzle.cells.map((name, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: `glyph${cursor === index ? " sel" : ""}${bad === index ? " bad" : ""}${good === index ? " good" : ""}`,
			"aria-label": `Glyph ${index + 1}`,
			onClick: () => {
				cursorRef.current = index;
				setCursor(index);
				choose(index);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelIcon, {
				name,
				scale: 4,
				color: good === index ? palette.ok : palette.cyan
			})
		}, index))
	});
}
var SPEED = .68;
function SignalMeter({ frozen, onComplete }) {
	const store = useGameStore();
	const frozenRef = (0, import_react.useRef)(frozen);
	frozenRef.current = frozen;
	const posRef = (0, import_react.useRef)(0);
	const dirRef = (0, import_react.useRef)(1);
	const hitsRef = (0, import_react.useRef)(0);
	const lockRef = (0, import_react.useRef)(false);
	const coolRef = (0, import_react.useRef)(0);
	const holdRef = (0, import_react.useRef)(false);
	const zoneRef = (0, import_react.useRef)(makeZone(Math.random));
	const [pos, setPos] = (0, import_react.useState)(0);
	const [hits, setHits] = (0, import_react.useState)(0);
	const [zone, setZone] = (0, import_react.useState)(zoneRef.current);
	const [miss, setMiss] = (0, import_react.useState)(false);
	const [hold, setHold] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		let last = performance.now();
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			coolRef.current = Math.max(0, coolRef.current - dt);
			if (!frozenRef.current && !lockRef.current && !holdRef.current) {
				posRef.current += dirRef.current * SPEED * dt;
				if (posRef.current >= 1) {
					posRef.current = 1;
					dirRef.current = -1;
				} else if (posRef.current <= 0) {
					posRef.current = 0;
					dirRef.current = 1;
				}
			}
			setPos(posRef.current);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, []);
	const attempt = () => {
		if (frozenRef.current || lockRef.current || holdRef.current || coolRef.current > 0 || hitsRef.current >= 2) return;
		const p = posRef.current;
		const zoneNow = zoneRef.current;
		const inside = p >= zoneNow.start && p <= zoneNow.start + zoneNow.width;
		coolRef.current = .28;
		if (!inside) {
			audio.bad();
			store.addImpulse(4);
			store.blip("bad");
			setMiss(true);
			window.setTimeout(() => setMiss(false), 180);
			return;
		}
		const next = hitsRef.current + 1;
		hitsRef.current = next;
		setHits(next);
		audio.hit();
		store.addImpulse(3);
		if (next >= 2) {
			lockRef.current = true;
			window.setTimeout(onComplete, 320);
			return;
		}
		setHold(true);
		holdRef.current = true;
		window.setTimeout(() => {
			const nextZone = makeZone(Math.random);
			zoneRef.current = nextZone;
			setZone(nextZone);
			holdRef.current = false;
			setHold(false);
		}, 420);
	};
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.code !== "Space" && event.code !== "Enter") return;
			if (event.repeat) return;
			if (event.target instanceof HTMLElement && event.target.closest("button")) return;
			event.preventDefault();
			attempt();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "signal",
		"data-testid": "signal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "signal-readout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: `HITS ${hits}/2`,
					scale: 3,
					color: hits > 0 ? palette.ok : palette.amber
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: hold ? "LOCK" : "SWEEP",
					scale: 2,
					color: palette.mute
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `meter${miss ? " miss" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ticks",
						"aria-hidden": "true",
						children: Array.from({ length: 11 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "zone",
						style: {
							left: `${zone.start * 100}%`,
							width: `${zone.width * 100}%`
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "needle",
						style: { left: `${pos * 100}%` }
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "pix-btn solid stop-btn",
				"data-testid": "stop",
				onClick: attempt,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: "STOP",
					scale: 3,
					color: palette.void
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "sr-only",
				children: "Press stop when the needle is inside the highlighted zone. Two hits required."
			})
		]
	});
}
function FxLayer() {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = ref.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const parts = [];
		let raf = 0;
		let last = performance.now();
		const spawn = (b, w, h) => {
			for (let i = 0; i < b.count; i++) {
				const angle = Math.random() * Math.PI * 2;
				const speed = b.speed * (.35 + Math.random());
				parts.push({
					x: b.x * w,
					y: b.y * h,
					vx: Math.cos(angle) * speed,
					vy: Math.sin(angle) * speed,
					life: b.life * (.55 + Math.random() * .45),
					max: b.life,
					color: b.color,
					size: 2 + Math.floor(Math.random() * 3),
					ambient: false
				});
			}
		};
		const unsub = onBurst((b) => {
			const parent = canvas.parentElement;
			spawn(b, parent?.clientWidth ?? 800, parent?.clientHeight ?? 600);
		});
		const loop = (now) => {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const parent = canvas.parentElement;
			const w = parent?.clientWidth ?? 1;
			const h = parent?.clientHeight ?? 1;
			const dpr = Math.min(2, window.devicePixelRatio || 1);
			const bw = Math.max(1, Math.floor(w * dpr));
			const bh = Math.max(1, Math.floor(h * dpr));
			if (canvas.width !== bw || canvas.height !== bh) {
				canvas.width = bw;
				canvas.height = bh;
			}
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, w, h);
			if (parts.reduce((n, p) => n + (p.ambient ? 1 : 0), 0) < 22 && Math.random() < dt * 10) parts.push({
				x: Math.random() * w,
				y: h + 2,
				vx: (Math.random() - .5) * 14,
				vy: -18 - Math.random() * 28,
				life: 3.2,
				max: 3.2,
				color: Math.random() < .75 ? palette.cyan : palette.amber,
				size: 2,
				ambient: true
			});
			for (let i = parts.length - 1; i >= 0; i--) {
				const p = parts[i];
				p.life -= dt;
				if (!p.ambient) p.vy += 280 * dt;
				p.x += p.vx * dt;
				p.y += p.vy * dt;
				if (p.life <= 0) {
					parts.splice(i, 1);
					continue;
				}
				ctx.globalAlpha = Math.max(0, p.life / p.max);
				ctx.fillStyle = p.color;
				ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
			}
			ctx.globalAlpha = 1;
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			unsub();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className: "fx-layer",
		"aria-hidden": "true"
	});
}
var LABEL = {
	solid: palette.void,
	ghost: palette.cyan,
	danger: palette.void
};
function PixButton({ label, onClick, variant = "solid", tiny = false, disabled = false, testId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: `pix-btn ${variant}${tiny ? " tiny" : ""}`,
		"data-testid": testId,
		disabled,
		"aria-label": label,
		onClick: () => {
			if (disabled) return;
			audio.unlock();
			audio.click();
			onClick();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
			text: label,
			scale: tiny ? 2 : 3,
			color: LABEL[variant]
		})
	});
}
function useWide() {
	const [wide, setWide] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const apply = () => setWide(window.innerWidth >= 900);
		apply();
		window.addEventListener("resize", apply);
		return () => window.removeEventListener("resize", apply);
	}, []);
	return wide;
}
function Leds() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "leds",
		"aria-hidden": "true",
		children: Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { animationDelay: `${i * .11}s` } }, i))
	});
}
function Screws() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "screw a" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "screw b" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "screw c" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "screw d" })
	] });
}
function Menu({ snap }) {
	const store = useGameStore();
	const wide = useWide();
	const sub = wide ? 3 : 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "menu",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "ORDNANCE BAY 04",
				scale: 2,
				color: palette.amber
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "20 Seconds"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "20",
				scale: wide ? 12 : 8,
				color: palette.cyan,
				glow: "cyan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "SECONDS",
				scale: wide ? 5 : 4,
				color: palette.paper
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "menu-copy",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: "COMPLETE 3 TASKS",
					scale: sub,
					color: palette.amber
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: "BEFORE TIME RUNS OUT",
					scale: sub,
					color: palette.amber
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel bomb-panel menu-bomb",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bomb, {
						timeText: "20.0",
						mode: "idle",
						urgent: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
						text: "CHARGE ARMED",
						scale: 2,
						color: palette.danger
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leds, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "btn-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
					label: "START",
					onClick: store.start,
					testId: "start"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
					label: "HOW TO",
					variant: "ghost",
					onClick: store.help,
					testId: "howto"
				})]
			}),
			snap.hydrated && snap.stats.best > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: `BEST ${formatTime(snap.stats.best)} LEFT`,
				scale: 2,
				color: palette.mute
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "ENTER OR SPACE TO ARM",
				scale: 2,
				color: palette.mute
			})
		]
	});
}
var HELP = [
	"YOU GET TWENTY SECONDS",
	"THREE RANDOM MECHANISMS",
	"CIRCUIT LINKS SRC TO DST",
	"SIGNAL STOPS TWICE IN ZONE",
	"DISCS MATCH EACH LOCK",
	"SCAN TAPS THE ODD SYMBOL",
	"SPACE STOPS THE NEEDLE",
	"KEYS 1 2 3 TURN DISCS",
	"ARROWS MOVE ENTER TURNS",
	"ESC PAUSES THE CLOCK"
];
function Help() {
	const store = useGameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "help",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "PROTOCOL",
				scale: 5,
				color: palette.cyan,
				glow: "cyan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel help-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "help-list",
					children: HELP.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
						text: line,
						scale: 2,
						color: palette.paper
					}, line))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
				label: "BACK",
				onClick: store.menu,
				testId: "back"
			})
		]
	});
}
function Tasks({ snap }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "tasks",
		"data-testid": "tasks",
		children: snap.order.map((kind, index) => {
			const state = index < snap.step ? "done" : index === snap.step ? "now" : "wait";
			const mark = state === "done" ? "OK" : state === "now" ? ">>" : "--";
			const color = state === "done" ? palette.ok : state === "now" ? palette.cyan : palette.mute;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `task ${state}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: `${mark} ${KIND_LABEL[kind]}`,
					scale: 2,
					color
				})
			}, `${kind}-${index}`);
		})
	});
}
function Play({ snap }) {
	const store = useGameStore();
	const wide = useWide();
	const kind = snap.order[snap.step];
	const frozen = snap.paused || snap.locking || snap.phase === "boom";
	if (!kind) return null;
	const hint = KIND_HINT[kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `play${snap.paused ? " dimmed" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "top-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
							text: "BAY-04",
							scale: 2,
							color: palette.mute
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
							text: snap.urgent ? "CRITICAL" : "ARMED",
							scale: 2,
							color: snap.urgent ? palette.danger : palette.amber
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "timer-block",
						"data-testid": "timer",
						"aria-label": `${formatTime(snap.time)} seconds left`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
							text: formatTime(snap.time),
							scale: wide ? 10 : 7,
							color: snap.urgent ? palette.danger : palette.cyan,
							glow: snap.urgent ? "danger" : "cyan"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
							text: "SECONDS",
							scale: 2,
							color: snap.urgent ? palette.danger : palette.mute
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leds, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tasks, { snap }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "play-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel challenge",
					"data-testid": "challenge",
					"data-challenge": kind,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ch-head",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
								text: KIND_LABEL[kind],
								scale: wide ? 4 : 3,
								color: palette.amber
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
								text: `TASK ${snap.step + 1} OF 3`,
								scale: 2,
								color: palette.mute
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `ch-body${frozen ? " frozen" : ""}`,
							children: [
								kind === "circuit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircuitBoard, {
									frozen,
									onComplete: store.complete
								}, `${snap.round}-c`) : null,
								kind === "signal" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalMeter, {
									frozen,
									onComplete: store.complete
								}, `${snap.round}-s`) : null,
								kind === "discs" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscLocks, {
									frozen,
									onComplete: store.complete
								}, `${snap.round}-d`) : null,
								kind === "scan" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OddScan, {
									frozen,
									onComplete: store.complete
								}, `${snap.round}-n`) : null
							]
						}),
						snap.banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "banner",
							"data-testid": "banner",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
								text: snap.banner,
								scale: wide ? 5 : 4,
								color: palette.ok,
								glow: "ok"
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hint",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
									text: hint[0],
									scale: 2,
									color: palette.paper
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
									text: hint[1],
									scale: 2,
									color: palette.paper
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
									text: "ESC PAUSES",
									scale: 2,
									color: palette.mute
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "panel bomb-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bomb, {
							timeText: formatTime(snap.time),
							mode: snap.phase === "boom" ? "dead" : "armed",
							urgent: snap.urgent || snap.phase === "boom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
							text: snap.phase === "boom" ? "DETONATION" : snap.urgent ? "CRITICAL" : "LIVE CHARGE",
							scale: 2,
							color: snap.urgent || snap.phase === "boom" ? palette.danger : palette.amber
						})
					]
				})]
			}),
			snap.phase === "play" && !snap.locking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "btn-row",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
					label: "PAUSE",
					variant: "ghost",
					onClick: store.togglePause,
					testId: "pause"
				})
			}) : null
		]
	});
}
function Pause() {
	const store = useGameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "modal",
		"data-testid": "pause",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel modal-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: "PAUSED",
					scale: 6,
					color: palette.amber,
					glow: "amber"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
					text: "TIME FROZEN",
					scale: 2,
					color: palette.paper
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "btn-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
						label: "RESUME",
						onClick: store.togglePause,
						testId: "resume"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
						label: "MENU",
						variant: "ghost",
						onClick: store.menu,
						testId: "pause-menu"
					})]
				})
			]
		})
	});
}
function End({ snap, kind }) {
	const store = useGameStore();
	const wide = useWide();
	const win = kind === "win";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "end",
		"data-testid": win ? "win" : "lose",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: win ? "DEFUSED" : "DETONATED",
				scale: wide ? 7 : 4,
				color: win ? palette.ok : palette.danger,
				glow: win ? "ok" : "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: win ? "ALL CIRCUITS SAFE" : "THE CHARGE FIRED",
				scale: 2,
				color: palette.paper
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel bomb-panel",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screws, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bomb, {
					timeText: formatTime(snap.time),
					mode: win ? "safe" : "dead",
					urgent: !win
				})]
			}),
			win ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: `TIME LEFT ${formatTime(snap.time)}`,
				scale: wide ? 4 : 3,
				color: palette.cyan
			}), snap.freshBest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "NEW BEST",
				scale: 3,
				color: palette.amber
			}) : null] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: `FAILURES ${snap.stats.losses}`,
				scale: 2,
				color: palette.mute
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "btn-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
					label: "AGAIN",
					onClick: store.start,
					testId: "again"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
					label: "MENU",
					variant: "ghost",
					onClick: store.menu,
					testId: "menu"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixelText, {
				text: "ENTER AGAIN   ESC MENU",
				scale: 2,
				color: palette.mute
			})
		]
	});
}
function Stage() {
	const store = useGameStore();
	const snap = useSnap();
	const stageRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		store.hydrate();
		return store.startLoop();
	}, [store]);
	(0, import_react.useEffect)(() => {
		const unlock = () => audio.unlock();
		window.addEventListener("pointerdown", unlock);
		window.addEventListener("keydown", unlock);
		return () => {
			window.removeEventListener("pointerdown", unlock);
			window.removeEventListener("keydown", unlock);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const onButton = event.target instanceof HTMLElement && Boolean(event.target.closest("button"));
			if (event.code === "Escape") {
				event.preventDefault();
				const now = store.get();
				if (now.phase === "help" || now.phase === "win" || now.phase === "lose") store.menu();
				else if (now.phase === "play") store.togglePause();
				return;
			}
			if (onButton) return;
			if (event.code === "KeyP" && store.get().phase === "play") {
				event.preventDefault();
				store.togglePause();
				return;
			}
			if (event.code === "Enter" || event.code === "Space") {
				const now = store.get();
				if (now.phase === "menu" && !event.repeat) {
					event.preventDefault();
					store.start();
				} else if (now.phase === "help" && event.code === "Enter") {
					event.preventDefault();
					store.menu();
				} else if (now.paused && now.phase === "play" && event.code === "Enter") {
					event.preventDefault();
					store.togglePause();
				} else if ((now.phase === "win" || now.phase === "lose") && event.code === "Enter" && !event.repeat) {
					event.preventDefault();
					store.start();
				}
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [store]);
	(0, import_react.useEffect)(() => {
		let raf = 0;
		const loop = () => {
			const node = stageRef.current;
			const mag = store.getShake();
			if (node) {
				if (mag < .25) node.style.transform = "";
				else {
					const x = (Math.random() - .5) * 2 * mag;
					const y = (Math.random() - .5) * 2 * mag;
					node.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
				}
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [store]);
	const live = snap.banner || (snap.phase === "win" ? "Defused" : snap.phase === "lose" ? "Detonated" : snap.paused ? "Paused" : "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: stageRef,
		className: `terminal${snap.urgent ? " urgent" : ""}`,
		"data-phase": snap.phase,
		"data-testid": "terminal",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxLayer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "veil" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `flash flash-${snap.flash}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hazard" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mute-dock",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PixButton, {
					tiny: true,
					variant: "ghost",
					label: snap.muted ? "SOUND" : "MUTE",
					onClick: store.toggleMute,
					testId: "mute"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sr-only",
				"aria-live": "polite",
				children: live
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shell",
				children: [
					snap.phase === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { snap }) : null,
					snap.phase === "help" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, {}) : null,
					snap.phase === "play" || snap.phase === "boom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { snap }) : null,
					snap.phase === "win" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(End, {
						snap,
						kind: "win"
					}) : null,
					snap.phase === "lose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(End, {
						snap,
						kind: "lose"
					}) : null
				]
			}),
			snap.paused && snap.phase === "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : null
		]
	});
}
function Game() {
	const storeRef = (0, import_react.useRef)(null);
	if (!storeRef.current) storeRef.current = new GameStore();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameProvider, {
		store: storeRef.current,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stage, {})
	});
}
var SplitComponent = Game;
//#endregion
export { SplitComponent as component };
