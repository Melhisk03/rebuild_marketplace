<script setup lang="ts">
import { STATS } from '~/data/site'
</script>

<template>
  <!-- İstatistik şeridi: sayfanın tek saf beyaz bloğu. Sürdürülebilirlik
       bölümünün koyu ağırlığından hemen önce göz dinlensin diye. -->
  <section class="bg-paper py-16 sm:py-20">
    <div class="shell">
      <!-- `<dl>` değil `<div>`: StatCounter içinde `<p>` kullanıyor, tanım
           listesi yalnızca `dt`/`dd` (veya onları saran `div`) kabul eder. -->
      <div class="grid grid-cols-2 gap-px bg-chalk-edge lg:grid-cols-4">
        <StatCounter
          v-for="stat in STATS"
          :key="stat.label"
          :value="stat.value"
          :suffix="stat.suffix"
          :label="stat.label"
          :note="stat.note"
        />
      </div>
    </div>
  </section>
</template>
