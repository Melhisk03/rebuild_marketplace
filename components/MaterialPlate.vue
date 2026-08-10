<script setup lang="ts">
/**
 * Üretilmiş malzeme plakası — ürün kartlarının görseli.
 *
 * NEDEN FOTOĞRAF DEĞİL: on dört ürün yan yana bir grid'de duruyor ve
 * kadrajı, ışığı, arka planı birbirini tutmayan stok fotoğraflar o grid'i
 * anında ucuzlatıyor. Vektör plaka her kartta aynı paleti, aynı ışığı ve
 * aynı çizgi kalınlığını garanti ediyor; ölçekten bağımsız keskin ve
 * toplamda birkaç KB.
 *
 * Renkler `P` içinde toplu: tasarım koyudan açığa çevrildiğinde on dört
 * desenin geometrisine dokunmadan yalnızca bu tablo değişti.
 */
const props = withDefaults(
  defineProps<{
    plate: string
    /** Kart hover'ında hafif yakınlaşma için dışarıdan tetiklenir */
    zoom?: boolean
  }>(),
  { zoom: false },
)

/**
 * Beton ve galvaniz tonları; en açıktan en koyuya.
 *
 * Değerler bilerek orta-koyu: ilk denemede paletin tamamı açıktı ve
 * beyaz kartın üzerinde plakalar boş gri kutulara dönüşüyordu — desen
 * ancak zeminden yeterince ayrılınca "malzeme" olarak okunuyor.
 */
const P = {
  bg1: '#e7e3da',
  bg2: '#d9d3c7',
  bg3: '#c8c1b2',
  face: '#cfc8ba', // malzeme yüzeyi
  faceAlt: '#beb6a5', // dönüşümlü yüzey
  edge: '#978e7c', // kenar / kontur
  line: '#7c7364', // ayrıntı çizgisi
  deep: '#5c5548', // boşluk, gölge
  void: '#453f35', // en koyu (delik içi)
  accent: '#f97316',
}

/** Deterministik sözde-rastgele: her plaka her render'da aynı görünsün. */
function jitter(seed: number, spread: number) {
  return ((Math.sin(seed * 12.9898) * 43758.5453) % 1) * spread
}

const bars = Array.from({ length: 7 }, (_, i) => 26 + i * 52)
const ribs = Array.from({ length: 11 }, (_, i) => 14 + i * 27)
const tileCols = Array.from({ length: 5 }, (_, i) => i * 80)
const tileRows = Array.from({ length: 4 }, (_, i) => i * 75)
const layers = Array.from({ length: 9 }, (_, i) => 22 + i * 30)
const tubes = Array.from({ length: 12 }, (_, i) => ({ x: 40 + (i % 4) * 90, y: 45 + Math.floor(i / 4) * 78 }))
const pipes = Array.from({ length: 14 }, (_, i) => ({
  x: 44 + (i % 5) * 78 + (Math.floor(i / 5) % 2) * 39,
  y: 60 + Math.floor(i / 5) * 80,
}))
const coils = Array.from({ length: 7 }, (_, i) => 22 + i * 17)
const planks = Array.from({ length: 6 }, (_, i) => 18 + i * 47)
const sheets = Array.from({ length: 14 }, (_, i) => 40 + i * 16)
const fibres = Array.from({ length: 12 }, (_, i) => 20 + i * 23)
const boltRows = Array.from({ length: 3 }, (_, r) => r)
const boltCols = Array.from({ length: 6 }, (_, c) => c)
</script>

<template>
  <div class="relative h-full w-full overflow-hidden bg-chalk">
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      class="block h-full w-full transition-transform duration-[600ms] ease-(--ease-out-expo)"
      :class="props.zoom ? 'scale-[1.05]' : 'scale-100'"
    >
      <defs>
        <linearGradient :id="`pl-bg-${props.plate}`" x1="0" y1="0" x2="0.65" y2="1">
          <stop offset="0%" :stop-color="P.bg1" />
          <stop offset="55%" :stop-color="P.bg2" />
          <stop offset="100%" :stop-color="P.bg3" />
        </linearGradient>
        <!-- Sol üstten tek ışık kaynağı; bütün plakalarda aynı yönde -->
        <radialGradient :id="`pl-lit-${props.plate}`" cx="0.22" cy="0.14" r="0.95">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" :fill="`url(#pl-bg-${props.plate})`" />

      <!-- ---------- NERVÜRLÜ DEMİR ---------- -->
      <g v-if="plate === 'rebar'" stroke-linecap="round">
        <g v-for="(x, i) in bars" :key="x">
          <rect :x="x" y="-10" width="30" height="320" :fill="i % 2 ? P.face : P.faceAlt" />
          <line :x1="x + 4" y1="-10" :x2="x + 4" y2="310" :stroke="P.bg1" stroke-width="1.5" />
          <line :x1="x + 25" y1="-10" :x2="x + 25" y2="310" :stroke="P.deep" stroke-width="2.5" />
          <line
            v-for="y in ribs"
            :key="y"
            :x1="x + 1"
            :y1="y + jitter(i + y, 6)"
            :x2="x + 29"
            :y2="y - 9 + jitter(i + y, 6)"
            :stroke="P.line"
            stroke-width="2.4"
            stroke-opacity="0.9"
          />
        </g>
        <rect :x="bars[3]" y="-10" width="30" height="320" :fill="P.accent" fill-opacity="0.16" />
      </g>

      <!-- ---------- ÇİMENTO TORBALARI ---------- -->
      <g v-else-if="plate === 'cement'">
        <g v-for="r in 3" :key="r">
          <g v-for="c in 2" :key="c">
            <rect
              :x="18 + (c - 1) * 190 + (r % 2) * 14"
              :y="20 + (r - 1) * 92"
              width="172"
              height="76"
              rx="5"
              :fill="P.face"
              :stroke="P.edge"
              stroke-width="1.5"
            />
            <line
              :x1="24 + (c - 1) * 190 + (r % 2) * 14"
              :y1="34 + (r - 1) * 92"
              :x2="184 + (c - 1) * 190 + (r % 2) * 14"
              :y2="34 + (r - 1) * 92"
              :stroke="P.line"
              stroke-width="1.5"
              stroke-dasharray="7 5"
            />
            <rect
              :x="34 + (c - 1) * 190 + (r % 2) * 14"
              :y="50 + (r - 1) * 92"
              width="62"
              height="9"
              rx="1"
              :fill="r === 2 && c === 1 ? P.accent : P.line"
              :fill-opacity="r === 2 && c === 1 ? 0.85 : 0.7"
            />
            <rect
              :x="34 + (c - 1) * 190 + (r % 2) * 14"
              :y="65 + (r - 1) * 92"
              width="38"
              height="6"
              rx="1"
              :fill="P.edge"
            />
          </g>
        </g>
      </g>

      <!-- ---------- SERAMİK ---------- -->
      <g v-else-if="plate === 'tile'">
        <g v-for="cx in tileCols" :key="`c${cx}`">
          <g v-for="cy in tileRows" :key="`r${cx}-${cy}`">
            <rect
              :x="cx + 3"
              :y="cy + 3"
              width="74"
              height="69"
              :fill="(cx / 80 + cy / 75) % 2 ? P.face : P.faceAlt"
            />
            <!-- yüzey parlaması: seramiği mat plakalardan ayıran detay -->
            <path
              :d="`M${cx + 3} ${cy + 62} L${cx + 77} ${cy + 18} L${cx + 77} ${cy + 3} L${cx + 46} ${cy + 3} Z`"
              fill="#ffffff"
              fill-opacity="0.5"
            />
          </g>
        </g>
        <rect x="243" y="78" width="74" height="69" :fill="P.accent" fill-opacity="0.2" />
      </g>

      <!-- ---------- BİMS BLOK ---------- -->
      <g v-else-if="plate === 'block'">
        <g v-for="r in 4" :key="r">
          <g v-for="c in 3" :key="c">
            <rect
              :x="-30 + (c - 1) * 148 + (r % 2) * 74"
              :y="12 + (r - 1) * 72"
              width="140"
              height="64"
              :fill="P.face"
              :stroke="P.bg3"
              stroke-width="3"
            />
            <rect
              v-for="h in 2"
              :key="h"
              :x="-14 + (c - 1) * 148 + (r % 2) * 74 + (h - 1) * 58"
              :y="26 + (r - 1) * 72"
              width="40"
              height="36"
              :fill="P.deep"
            />
          </g>
        </g>
        <rect x="118" y="84" width="140" height="64" :fill="P.accent" fill-opacity="0.18" />
      </g>

      <!-- ---------- YALITIM LEVHASI ---------- -->
      <g v-else-if="plate === 'insulation'">
        <rect
          v-for="(y, i) in layers"
          :key="y"
          :x="-8 + jitter(i, 16)"
          :y="y"
          width="420"
          height="22"
          :fill="i % 2 ? P.face : P.faceAlt"
          :stroke="P.edge"
          stroke-width="1"
        />
        <path
          v-for="(y, i) in layers"
          :key="`l${y}`"
          :d="`M${-8 + jitter(i, 16)} ${y + 11} h420`"
          :stroke="P.line"
          stroke-width="1"
          stroke-opacity="0.7"
        />
        <rect x="-8" :y="layers[4]" width="420" height="22" :fill="P.accent" fill-opacity="0.2" />
      </g>

      <!-- ---------- KUTU PROFİL ---------- -->
      <g v-else-if="plate === 'profile'">
        <g v-for="(t, i) in tubes" :key="i">
          <rect :x="t.x" :y="t.y" width="72" height="62" :fill="P.face" :stroke="P.edge" stroke-width="2" />
          <rect :x="t.x + 11" :y="t.y + 10" width="50" height="42" :fill="P.deep" :stroke="P.void" stroke-width="1" />
          <line :x1="t.x" :y1="t.y" :x2="t.x + 11" :y2="t.y + 10" :stroke="P.line" stroke-width="1.5" />
        </g>
        <rect :x="tubes[5]!.x" :y="tubes[5]!.y" width="72" height="62" :fill="P.accent" fill-opacity="0.22" />
      </g>

      <!-- ---------- PVC PENCERE ---------- -->
      <g v-else-if="plate === 'window'">
        <g v-for="c in 2" :key="c">
          <rect
            :x="26 + (c - 1) * 184"
            y="26"
            width="164"
            height="248"
            :fill="P.faceAlt"
            :stroke="P.edge"
            stroke-width="5"
          />
          <rect
            :x="44 + (c - 1) * 184"
            y="44"
            width="128"
            height="212"
            :fill="P.bg2"
            :stroke="P.line"
            stroke-width="3"
          />
          <path
            :d="`M${48 + (c - 1) * 184} 250 L${168 + (c - 1) * 184} 96 L${168 + (c - 1) * 184} 48 L${104 + (c - 1) * 184} 48 Z`"
            fill="#ffffff"
            fill-opacity="0.6"
          />
          <rect :x="34 + (c - 1) * 184" y="140" width="10" height="34" rx="2" :fill="P.accent" fill-opacity="0.9" />
        </g>
      </g>

      <!-- ---------- KERESTE ---------- -->
      <g v-else-if="plate === 'timber'">
        <g v-for="(y, i) in planks" :key="y">
          <rect x="-10" :y="y" width="420" height="38" :fill="i % 2 ? '#ddd0bb' : '#d3c4ac'" />
          <line x1="-10" :y1="y" x2="410" :y2="y" :stroke="'#a8977c'" stroke-width="2" />
          <path
            v-for="g in 3"
            :key="g"
            :d="`M-10 ${y + 9 * g + jitter(i + g, 4)} q100 ${g % 2 ? 5 : -5} 210 0 t210 0`"
            fill="none"
            :stroke="'#b8a889'"
            stroke-width="1.4"
          />
        </g>
        <rect x="-10" :y="planks[2]" width="420" height="38" :fill="P.accent" fill-opacity="0.14" />
      </g>

      <!-- ---------- PPRC BORU ---------- -->
      <g v-else-if="plate === 'pipe'">
        <g v-for="(p, i) in pipes" :key="i">
          <circle :cx="p.x" :cy="p.y" r="31" :fill="P.face" :stroke="P.edge" stroke-width="2" />
          <circle :cx="p.x" :cy="p.y" r="20" :fill="P.deep" :stroke="P.void" stroke-width="1.5" />
          <path
            :d="`M${p.x - 22} ${p.y - 22} a31 31 0 0 1 20 -8`"
            fill="none"
            stroke="#ffffff"
            stroke-width="2.4"
            stroke-opacity="0.75"
          />
        </g>
        <circle :cx="pipes[7]!.x" :cy="pipes[7]!.y" r="31" :fill="P.accent" fill-opacity="0.28" />
      </g>

      <!-- ---------- KABLO MAKARASI ---------- -->
      <g v-else-if="plate === 'cable'">
        <circle cx="200" cy="150" r="140" :fill="P.bg2" />
        <circle
          v-for="(r, i) in coils"
          :key="r"
          cx="200"
          cy="150"
          :r="r * 1.05 + 18"
          fill="none"
          :stroke="i === 3 ? P.accent : P.edge"
          :stroke-opacity="i === 3 ? 0.55 : 1"
          stroke-width="11"
        />
        <circle cx="200" cy="150" r="26" :fill="P.deep" :stroke="P.line" stroke-width="3" />
        <circle cx="200" cy="150" r="139" fill="none" :stroke="P.line" stroke-opacity="0.6" stroke-width="2" />
      </g>

      <!-- ---------- PANEL KAPI ---------- -->
      <g v-else-if="plate === 'door'">
        <g v-for="c in 2" :key="c">
          <rect
            :x="36 + (c - 1) * 178"
            y="14"
            width="150"
            height="272"
            :fill="P.face"
            :stroke="P.edge"
            stroke-width="3"
          />
          <rect
            v-for="p in 2"
            :key="p"
            :x="58 + (c - 1) * 178"
            :y="36 + (p - 1) * 130"
            width="106"
            height="112"
            :fill="P.faceAlt"
            :stroke="P.line"
            stroke-width="2.5"
          />
          <circle :cx="c === 1 ? 168 : 62" cy="152" r="5" :fill="P.accent" />
        </g>
      </g>

      <!-- ---------- SAC LEVHA ---------- -->
      <g v-else-if="plate === 'sheet'">
        <g v-for="(y, i) in sheets" :key="y">
          <path
            :d="`M${20 + i * 3} ${y} L${356 + i * 3} ${y - 26} L${372 + i * 3} ${y - 18} L${36 + i * 3} ${y + 8} Z`"
            :fill="i % 2 ? P.face : P.faceAlt"
            :stroke="P.edge"
            stroke-width="1"
          />
        </g>
        <path d="M56 82 L392 56 L400 60 L64 88 Z" :fill="P.accent" fill-opacity="0.24" />
      </g>

      <!-- ---------- KALIP PANOSU ---------- -->
      <g v-else-if="plate === 'formwork'">
        <rect x="18" y="22" width="364" height="256" :fill="P.faceAlt" :stroke="P.edge" stroke-width="6" />
        <rect x="40" y="44" width="320" height="212" :fill="P.face" />
        <line
          v-for="c in 3"
          :key="c"
          :x1="40 + c * 80"
          y1="44"
          :x2="40 + c * 80"
          y2="256"
          :stroke="P.edge"
          stroke-width="3"
        />
        <g v-for="r in boltRows" :key="r">
          <circle
            v-for="c in boltCols"
            :key="c"
            :cx="62 + c * 56"
            :cy="72 + r * 78"
            r="6"
            :fill="P.deep"
            :stroke="P.line"
            stroke-width="2"
          />
        </g>
        <rect x="18" y="22" width="364" height="10" :fill="P.accent" fill-opacity="0.55" />
      </g>

      <!-- ---------- CAM YÜNÜ ---------- -->
      <g v-else-if="plate === 'wool'">
        <rect width="400" height="300" :fill="P.bg2" />
        <path
          v-for="(y, i) in fibres"
          :key="y"
          :d="`M-20 ${y} q60 ${i % 2 ? 22 : -22} 120 0 t120 0 t120 0 t120 0`"
          fill="none"
          :stroke="i === 6 ? P.accent : P.edge"
          :stroke-opacity="i === 6 ? 0.5 : 0.95"
          stroke-width="6"
        />
      </g>

      <!-- ---------- VARSAYILAN ---------- -->
      <g v-else>
        <rect
          v-for="(y, i) in layers"
          :key="y"
          x="-10"
          :y="y"
          width="420"
          height="18"
          :fill="i % 2 ? P.face : P.faceAlt"
        />
      </g>

      <!-- Ortak ışık: bütün plakaları aynı aileye bağlar -->
      <rect width="400" height="300" :fill="`url(#pl-lit-${props.plate})`" />
    </svg>
  </div>
</template>
