<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

      <div class="flex items-center gap-2">
        <div
          class="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span class="text-white font-bold text-lg">P</span>
        </div>
        <NuxtLink to="/"
          class="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hover:to-white transition-all">
          Portal Akademik
        </NuxtLink>
      </div>

      <nav>
        <ul class="flex items-center gap-1 bg-slate-900/50 p-1 rounded-full border border-slate-800">
          <li>
            <NuxtLink to="/prodi"
              class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 transition-all hover:text-white hover:bg-slate-800"
              active-class="!bg-cyan-500/10 !text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              Prodi
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/matkul"
              class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 transition-all hover:text-white hover:bg-slate-800"
              active-class="!bg-emerald-500/10 !text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
              Matkul
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/mahasiswa"
              class="px-4 py-1.5 rounded-full text-sm font-medium text-slate-400 transition-all hover:text-white hover:bg-slate-800"
              active-class="!bg-violet-500/10 !text-violet-400 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
              Mahasiswa
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  transition: all 0.3s ease;
}
</style>