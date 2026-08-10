<script setup lang="ts">
/**
 * Üretilmiş malzeme plakası — ürün kartlarının görseli.
 *
 * NEDEN FOTOĞRAF DEĞİL: on dört ürün yan yana bir grid'de duruyor ve
 * kadrajı, ışığı, arka planı birbirini tutmayan stok fotoğraflar o grid'i
 * anında ucuzlatıyor. Vektör plaka her kartta aynı paleti, aynı ışığı ve
 * aynı çizgi kalınlığını garanti ediyor; üstelik ölçekten bağımsız keskin
 * ve toplamda birkaç KB.
 *
 * Fotoğraf yalnızca duygusal ağırlığın gerektiği üç yerde kullanılıyor:
 * hero, sürdürülebilirlik ve öne çıkan ürün.
 *
 * Her plaka aynı iskeleti paylaşır: koyu degrade zemin -> malzemeye özgü
 * desen -> tek amber vurgu -> köşe kesim işareti. Yeni bir malzeme
 * eklerken bu sırayı bozma, aile hissi buradan geliyor.
 */
const props = withDefaults(
  defineProps<{
    plate: string
    /** Kart hover'ında hafif yakınlaşma için dışarıdan tetiklenir */
    zoom?: boolean
  }>(),
  { zoom: false },
)

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
  <div class="grain relative h-full w-full overflow-hidden bg-carbon">
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      class="block h-full w-full transition-transform duration-[700ms] ease-(--ease-out-expo)"
      :class="props.zoom ? 'scale-[1.06]' : 'scale-100'"
    >
      <defs>
        <linearGradient :id="`plate-bg-${props.plate}`" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stop-color="#1c2027" />
          <stop offset="55%" stop-color="#14171c" />
          <stop offset="100%" stop-color="#0c0e11" />
        </linearGradient>
        <!-- Sol üstten gelen tek ışık kaynağı; bütün plakalarda aynı yönde -->
        <radialGradient :id="`plate-light-${props.plate}`" cx="0.24" cy="0.16" r="0.9">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.11" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" :fill="`url(#plate-bg-${props.plate})`" />

      <!-- ---------- NERVÜRLÜ DEMİR ---------- -->
      <g v-if="plate === 'rebar'" stroke-linecap="round">
        <g v-for="(x, i) in bars" :key="x">
          <rect :x="x" y="-10" width="30" height="320" :fill="i % 2 ? '#252b33' : '#2c333c'" />
          <line :x1="x + 4" y1="-10" :x2="x + 4" y2="310" stroke="#3d4650" stroke-width="1.5" />
          <line :x1="x + 25" y1="-10" :x2="x + 25" y2="310" stroke="#0e1013" stroke-width="2.5" />
          <!-- nervürler: çubuk boyunca eğik kabartmalar -->
          <line
            v-for="y in ribs"
            :key="y"
            :x1="x + 1"
            :y1="y + jitter(i + y, 6)"
            :x2="x + 29"
            :y2="y - 9 + jitter(i + y, 6)"
            :stroke="i === 3 ? '#5a4630' : '#434c57'"
            stroke-width="2.4"
            stroke-opacity="0.85"
          />
        </g>
        <rect :x="bars[3]" y="-10" width="30" height="320" fill="#ff7a1a" fill-opacity="0.07" />
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
              fill="#2a3039"
              stroke="#3b434e"
              stroke-width="1.5"
            />
            <!-- torba ağzının dikişi -->
            <line
              :x1="24 + (c - 1) * 190 + (r % 2) * 14"
              :y1="34 + (r - 1) * 92"
              :x2="184 + (c - 1) * 190 + (r % 2) * 14"
              :y2="34 + (r - 1) * 92"
              stroke="#4a535f"
              stroke-width="1.5"
              stroke-dasharray="7 5"
            />
            <rect
              :x="34 + (c - 1) * 190 + (r % 2) * 14"
              :y="50 + (r - 1) * 92"
              width="62"
              height="9"
              rx="1"
              :fill="r === 2 && c === 1 ? '#ff7a1a' : '#4d5764'"
              :fill-opacity="r === 2 && c === 1 ? 0.5 : 0.55"
            />
            <rect
              :x="34 + (c - 1) * 190 + (r % 2) * 14"
              :y="65 + (r - 1) * 92"
              width="38"
              height="6"
              rx="1"
              fill="#404853"
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
              :fill="(cx / 80 + cy / 75) % 2 ? '#232830' : '#272d36'"
            />
            <!-- yüzey parlaması: seramiği mat plakalardan ayıran detay -->
            <path
              :d="`M${cx + 3} ${cy + 62} L${cx + 77} ${cy + 18} L${cx + 77} ${cy + 3} L${cx + 46} ${cy + 3} Z`"
              fill="#ffffff"
              fill-opacity="0.032"
            />
          </g>
        </g>
        <rect x="243" y="78" width="74" height="69" fill="#ff7a1a" fill-opacity="0.09" />
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
              fill="#272c34"
              stroke="#161a1f"
              stroke-width="3"
            />
            <!-- bloğun iki boşluğu -->
            <rect
              v-for="h in 2"
              :key="h"
              :x="-14 + (c - 1) * 148 + (r % 2) * 74 + (h - 1) * 58"
              :y="26 + (r - 1) * 72"
              width="40"
              height="36"
              fill="#14181d"
            />
          </g>
        </g>
        <rect x="118" y="84" width="140" height="64" fill="#ff7a1a" fill-opacity="0.08" />
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
          :fill="i % 2 ? '#2b313a' : '#232830'"
          stroke="#3c4550"
          stroke-width="1"
        />
        <!-- lambalı kenar profili -->
        <path
          v-for="(y, i) in layers"
          :key="`l${y}`"
          :d="`M${-8 + jitter(i, 16)} ${y + 11} h420`"
          stroke="#161a20"
          stroke-width="1"
        />
        <rect x="-8" :y="layers[4]" width="420" height="22" fill="#ff7a1a" fill-opacity="0.08" />
      </g>

      <!-- ---------- KUTU PROFİL ---------- -->
      <g v-else-if="plate === 'profile'">
        <g v-for="(t, i) in tubes" :key="i">
          <rect :x="t.x" :y="t.y" width="72" height="62" fill="#2b323b" stroke="#434c57" stroke-width="2" />
          <rect :x="t.x + 11" :y="t.y + 10" width="50" height="42" fill="#101317" stroke="#1c2127" stroke-width="1" />
          <line :x1="t.x" :y1="t.y" :x2="t.x + 11" :y2="t.y + 10" stroke="#39414b" stroke-width="1.5" />
        </g>
        <rect :x="tubes[5]!.x" :y="tubes[5]!.y" width="72" height="62" fill="#ff7a1a" fill-opacity="0.1" />
      </g>

      <!-- ---------- PVC PENCERE ---------- -->
      <g v-else-if="plate === 'window'">
        <g v-for="c in 2" :key="c">
          <rect
            :x="26 + (c - 1) * 184"
            y="26"
            width="164"
            height="248"
            fill="#232830"
            stroke="#48515d"
            stroke-width="5"
          />
          <rect
            :x="44 + (c - 1) * 184"
            y="44"
            width="128"
            height="212"
            fill="#151a20"
            stroke="#39414b"
            stroke-width="3"
          />
          <!-- cam yansıması -->
          <path
            :d="`M${48 + (c - 1) * 184} 250 L${168 + (c - 1) * 184} 96 L${168 + (c - 1) * 184} 48 L${104 + (c - 1) * 184} 48 Z`"
            fill="#ffffff"
            fill-opacity="0.045"
          />
          <rect :x="34 + (c - 1) * 184" y="140" width="10" height="34" rx="2" fill="#ff7a1a" fill-opacity="0.45" />
        </g>
      </g>

      <!-- ---------- KERESTE ---------- -->
      <g v-else-if="plate === 'timber'">
        <g v-for="(y, i) in planks" :key="y">
          <rect x="-10" :y="y" width="420" height="38" :fill="i % 2 ? '#2f2a24' : '#352f27'" />
          <line x1="-10" :y1="y" x2="410" :y2="y" stroke="#191613" stroke-width="2" />
          <!-- damar çizgileri -->
          <path
            v-for="g in 3"
            :key="g"
            :d="`M-10 ${y + 9 * g + jitter(i + g, 4)} q100 ${g % 2 ? 5 : -5} 210 0 t210 0`"
            fill="none"
            stroke="#241f1a"
            stroke-width="1.4"
            stroke-opacity="0.8"
          />
        </g>
        <rect x="-10" :y="planks[2]" width="420" height="38" fill="#ff7a1a" fill-opacity="0.06" />
      </g>

      <!-- ---------- PPRC BORU ---------- -->
      <g v-else-if="plate === 'pipe'">
        <g v-for="(p, i) in pipes" :key="i">
          <circle :cx="p.x" :cy="p.y" r="31" fill="#2b313a" stroke="#454e59" stroke-width="2" />
          <circle :cx="p.x" :cy="p.y" r="20" fill="#101318" stroke="#1e232a" stroke-width="1.5" />
          <path
            :d="`M${p.x - 22} ${p.y - 22} a31 31 0 0 1 20 -8`"
            fill="none"
            stroke="#5b656f"
            stroke-width="2"
            stroke-opacity="0.7"
          />
        </g>
        <circle :cx="pipes[7]!.x" :cy="pipes[7]!.y" r="31" fill="#ff7a1a" fill-opacity="0.12" />
      </g>

      <!-- ---------- KABLO MAKARASI ---------- -->
      <g v-else-if="plate === 'cable'">
        <circle cx="200" cy="150" r="140" fill="#1b1f26" />
        <circle
          v-for="(r, i) in coils"
          :key="r"
          cx="200"
          cy="150"
          :r="r * 1.05 + 18"
          fill="none"
          :stroke="i === 3 ? '#6b4a2a' : '#333b45'"
          stroke-width="11"
        />
        <circle cx="200" cy="150" r="26" fill="#0d1014" stroke="#3b434e" stroke-width="3" />
        <circle cx="200" cy="150" r="139" fill="none" stroke="#ff7a1a" stroke-opacity="0.16" stroke-width="2" />
      </g>

      <!-- ---------- PANEL KAPI ---------- -->
      <g v-else-if="plate === 'door'">
        <g v-for="c in 2" :key="c">
          <rect
            :x="36 + (c - 1) * 178"
            y="14"
            width="150"
            height="272"
            fill="#262b33"
            stroke="#454e59"
            stroke-width="3"
          />
          <rect
            v-for="p in 2"
            :key="p"
            :x="58 + (c - 1) * 178"
            :y="36 + (p - 1) * 130"
            width="106"
            height="112"
            fill="#1c2027"
            stroke="#39414b"
            stroke-width="2.5"
          />
          <circle :cx="c === 1 ? 168 : 62" cy="152" r="5" fill="#ff7a1a" fill-opacity="0.6" />
        </g>
      </g>

      <!-- ---------- SAC LEVHA ---------- -->
      <g v-else-if="plate === 'sheet'">
        <g v-for="(y, i) in sheets" :key="y">
          <path
            :d="`M${20 + i * 3} ${y} L${356 + i * 3} ${y - 26} L${372 + i * 3} ${y - 18} L${36 + i * 3} ${y + 8} Z`"
            :fill="i % 2 ? '#2a3039' : '#232932'"
            stroke="#131720"
            stroke-width="1"
          />
        </g>
        <path d="M56 82 L392 56 L400 60 L64 88 Z" fill="#ff7a1a" fill-opacity="0.1" />
      </g>

      <!-- ---------- KALIP PANOSU ---------- -->
      <g v-else-if="plate === 'formwork'">
        <rect x="18" y="22" width="364" height="256" fill="#262c35" stroke="#4a535f" stroke-width="6" />
        <rect x="40" y="44" width="320" height="212" fill="#1d222a" />
        <line v-for="c in 3" :key="c" :x1="40 + c * 80" y1="44" :x2="40 + c * 80" y2="256" stroke="#333b45" stroke-width="3" />
        <g v-for="r in boltRows" :key="r">
          <circle
            v-for="c in boltCols"
            :key="c"
            :cx="62 + c * 56"
            :cy="72 + r * 78"
            r="6"
            fill="#0e1114"
            stroke="#4a535f"
            stroke-width="2"
          />
        </g>
        <rect x="18" y="22" width="364" height="10" fill="#ff7a1a" fill-opacity="0.2" />
      </g>

      <!-- ---------- CAM YÜNÜ ---------- -->
      <g v-else-if="plate === 'wool'">
        <rect width="400" height="300" fill="#1e232a" />
        <path
          v-for="(y, i) in fibres"
          :key="y"
          :d="`M-20 ${y} q60 ${i % 2 ? 22 : -22} 120 0 t120 0 t120 0 t120 0`"
          fill="none"
          :stroke="i === 6 ? '#6d5535' : '#39414d'"
          stroke-width="6"
          stroke-opacity="0.75"
        />
        <rect y="132" width="400" height="8" fill="#ff7a1a" fill-opacity="0.14" />
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
          :fill="i % 2 ? '#252b33' : '#1e232a'"
        />
      </g>

      <!-- Ortak ışık ve köşe kesim işareti: bütün plakaları aynı aileye bağlar -->
      <rect width="400" height="300" :fill="`url(#plate-light-${props.plate})`" />
      <path d="M0 0 L34 0 L0 34 Z" fill="#0a0b0d" fill-opacity="0.85" />
      <path d="M0 34 L34 0" stroke="#ff7a1a" stroke-opacity="0.35" stroke-width="1.5" />
    </svg>
  </div>
</template>
