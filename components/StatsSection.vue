<script setup lang="ts">
import { STATS } from '~/data/site'
</script>

<template>
  <!-- Platform ölçeği: ilan listesinin hemen ardında, çünkü "bu platformda
       gerçekten mal var mı?" sorusu tam orada oluşuyor. -->
  <section class="bg-canvas pb-(--spacing-section)">
    <div class="shell">
      <!-- `<dl>` değil `<div>`: StatCounter içinde `<p>` kullanıyor, tanım
           listesi yalnızca dt/dd (veya onları saran div) kabul eder. -->
      <div class="card grid grid-cols-2 divide-x divide-y divide-line lg:grid-cols-4 lg:divide-y-0">
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
