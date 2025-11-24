<script setup lang="ts">
import type { Mahasiswa, Prodi } from "@prisma/client";

// Fetch Data (Students and Prodi for the dropdown)
const { data: mhsData, refresh, status } = await useFetch('/api/mahasiswa');
const { data: prodiData } = await useFetch('/api/prodi');

// State
const searchQuery = ref('');
const isCreateModalOpen = ref(false);
const isUpdateModalOpen = ref(false);
const isSubmitting = ref(false);

const formData = ref<Mahasiswa>({
  NIM: '',
  Nama_Mhs: '',
  Alamat: '',
  Kd_Prodi: '',
});

// Computed
const filteredMhs = computed(() => {
  if (!mhsData.value?.data) return [];
  const query = searchQuery.value.toLowerCase();

  return mhsData.value.data.filter((m: any) =>
    m.Nama_Mhs.toLowerCase().includes(query) ||
    m.NIM.toLowerCase().includes(query) ||
    getProdiName(m.Kd_Prodi).toLowerCase().includes(query)
  );
});

// Helper
const getProdiName = (kdProdi: string) => {
  const prodi = prodiData.value?.data?.find((p: Prodi) => p.Kd_Prodi === kdProdi);
  return prodi ? prodi.Nama_Prodi : kdProdi;
};

// Actions
function openCreateModal() {
  formData.value = { NIM: '', Nama_Mhs: '', Alamat: '', Kd_Prodi: '' };
  isCreateModalOpen.value = true;
}

function openUpdateModal(item: Mahasiswa) {
  formData.value = { ...item };
  isUpdateModalOpen.value = true;
}

function closeModal() {
  isCreateModalOpen.value = false;
  isUpdateModalOpen.value = false;
}

async function handleCreate() {
  isSubmitting.value = true;
  try {
    await $fetch('/api/mahasiswa', {
      method: 'POST',
      body: formData.value
    });
    await refresh();
    closeModal();
  } catch (error) {
    alert('Gagal menambah data. Pastikan NIM unik.');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleUpdate() {
  isSubmitting.value = true;
  try {
    await $fetch(`/api/mahasiswa/${formData.value.NIM}`, {
      method: 'PUT',
      body: formData.value
    });
    await refresh();
    closeModal();
  } catch (error) {
    alert('Gagal mengubah data.');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(nim: string) {
  if (!confirm(`Hapus mahasiswa dengan NIM ${nim}?`)) return;

  try {
    await $fetch(`/api/mahasiswa/${nim}`, { method: 'DELETE' });
    await refresh();
  } catch (error) {
    alert('Gagal menghapus data');
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-20 py-8">
    <div class="max-w-7xl mx-auto px-6 pt-8 pb-6">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Data Mahasiswa</h1>
        <p class="text-gray-600">Kelola data mahasiswa dan akademik.</p>
      </div>

      <!-- Action Bar -->
      <div class="bg-white rounded-xl shadow-card p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Search Bar -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input v-model="searchQuery" type="text"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Cari prodi (NIM, nama atau prodi)..." />
            </div>
          </div>

          <!-- Add Button -->
          <button @click="openCreateModal"
            class="inline-flex cursor-pointer items-center px-4 py-2 bg-green-100 text-green-500 font-medium rounded-lg hover:bg-green-200">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Tambah Mahasiswa
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIM
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prodi
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Alamat
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">

              <!-- Data -->
              <tr v-if="status === 'pending'">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 animate-pulse">Memuat data...
                </td>
              </tr>
              <tr v-else-if="filteredMhs.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">Data tidak ditemukan.</td>
              </tr>
              <tr v-for="(item, index) in filteredMhs" :key="item.Kd_Prodi"
                class="hover:bg-gray-50 transition-colors animate-fade-in">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  {{ item.NIM }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center">
                    {{ item.Nama_Mhs }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    class="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-100">
                    {{ getProdiName(item.Kd_Prodi) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  {{ item.Alamat }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <NuxtLink :to="`/mahasiswa/${item.NIM}`"
                      class="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      Detail
                    </NuxtLink>
                    <button @click="openUpdateModal(item)"
                      class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      Edit
                    </button>
                    <button @click="handleDelete(item.NIM)"
                      class="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-xs font-medium">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                        </path>
                      </svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Stats Footer -->
      <div class="mt-6 bg-white rounded-xl shadow-card p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center text-sm text-gray-500">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Total : {{ 1 }}</span>
          </div>
          <div class="text-sm text-gray-500">
            Terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID') }}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex gap-4">
            <div class="flex-1 text-center">
              <div class="text-2xl font-bold text-green-600">{{ 1 }}</div>
              <div class="text-xs text-gray-500">Total</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ 1 }}</div>
              <div class="text-xs text-gray-500">Total</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-2xl font-bold text-purple-600">{{ 1 }}</div>
              <div class="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Form -->
      <div v-if="isCreateModalOpen || isUpdateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div @click="closeModal" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">{{ isCreateModalOpen ? 'Tambah' : 'Edit' }} Mahasiswa</h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          <div class="p-6">
            <form @submit.prevent class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">NIM</label>
                <input v-if="isCreateModalOpen" v-model="formData.NIM" type="text" maxlength="15" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="12345678" />
                <input v-else v-model="formData.NIM" type="text" disabled
                  class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input v-model="formData.Nama_Mhs" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nama Mahasiswa" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Program Studi</label>
                <select v-model="formData.Kd_Prodi" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="" disabled>Pilih Prodi</option>
                  <option v-for="p in prodiData?.data" :key="p.Kd_Prodi" :value="p.Kd_Prodi">
                    {{ p.Nama_Prodi }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <textarea v-model="formData.Alamat" rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Alamat lengkap..."></textarea>
              </div>
              <div class="pt-4 flex gap-3">
                <button type="button" @click="closeModal"
                  class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Batal</button>
                <button v-if="isCreateModalOpen" @click="handleCreate" :disabled="isSubmitting"
                  class="flex-1 bg-green-100 text-green-500 py-2.5 rounded-lg shadow-md hover:bg-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                </button>
                <button v-else @click="handleUpdate" :disabled="isSubmitting"
                  class="flex-1 bg-green-100 text-green-500 py-2.5 rounded-lg shadow-md hover:bg-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>