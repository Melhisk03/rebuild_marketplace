<template>
  <!-- Yükleme iskeleti: gerçek kartın ölçüleriyle birebir aynı, böylece
       sonuçlar gelince düzen sıçramıyor. -->
  <div class="surface flex flex-col" aria-hidden="true">
    <div class="relative aspect-[4/3] overflow-hidden bg-steel/40">
      <div
        class="animate-shimmer absolute inset-y-0 -left-full w-full bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--color-iron)_55%,transparent),transparent)]"
      />
    </div>
    <div class="flex flex-1 flex-col gap-3 p-5">
      <div class="h-4 w-3/4 bg-steel/50" />
      <div class="h-3 w-1/2 bg-steel/35" />
      <div class="border-steel/60 mt-2 flex items-end justify-between border-t pt-4">
        <div class="h-6 w-20 bg-steel/50" />
        <div class="h-5 w-24 bg-steel/40" />
      </div>
      <div class="mt-2 h-3 w-2/3 bg-steel/30" />
    </div>
  </div>
</template>
