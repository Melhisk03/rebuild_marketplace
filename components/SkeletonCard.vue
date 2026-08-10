<template>
  <!-- Yükleme iskeleti: gerçek kartın ölçüleriyle birebir aynı, böylece
       sonuçlar gelince düzen sıçramıyor. -->
  <div class="card flex flex-col overflow-hidden" aria-hidden="true">
    <div class="bg-chalk relative aspect-[4/3] overflow-hidden">
      <div
        class="animate-shimmer absolute inset-y-0 -left-full w-full bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.75),transparent)]"
      />
    </div>
    <div class="flex flex-1 flex-col gap-3 p-4">
      <div class="bg-chalk h-4 w-3/4 rounded" />
      <div class="bg-chalk h-3 w-1/2 rounded" />
      <div class="mt-1 flex items-end justify-between">
        <div class="bg-chalk h-6 w-28 rounded" />
        <div class="bg-chalk h-4 w-16 rounded" />
      </div>
      <div class="mt-2 grid grid-cols-2 gap-2">
        <div class="bg-chalk h-10 rounded-lg" />
        <div class="bg-chalk h-10 rounded-lg" />
      </div>
    </div>
  </div>
</template>
