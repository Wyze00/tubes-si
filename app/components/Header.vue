<script setup lang="ts">
// Tidak perlu script khusus, NuxtLink menangani routing otomatis
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

      <div class="flex items-center gap-3">
        <div
          class="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
          P
        </div>
        <NuxtLink to="/" class="text-xl font-bold text-gray-800 tracking-tight hover:text-blue-600 transition-colors">
          Portal Akademik
        </NuxtLink>
      </div>

      <nav>
        <ul class="flex items-center gap-2">
          <li>
            <NuxtLink to="/prodi"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              active-class="!bg-blue-50 !text-blue-700 font-bold shadow-sm ring-1 ring-blue-100">
              Prodi
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/matkul"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              active-class="!bg-blue-50 !text-blue-700 font-bold shadow-sm ring-1 ring-blue-100">
              Matkul
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/mahasiswa"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              active-class="!bg-blue-50 !text-blue-700 font-bold shadow-sm ring-1 ring-blue-100">
              Mahasiswa
            </NuxtLink>
          </li>
        </ul>
      </nav>

    </div>
  </header>
</template>

<style scoped>
/* Opsional: Transisi halus saat berpindah menu */
.router-link-active {
  transition: all 0.3s ease;
}
</style>