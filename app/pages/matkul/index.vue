<script setup lang="ts">
import type { Matkul } from "@prisma/client";


// State Management
const { data: matkulData, refresh, status } = await useFetch('/api/matkul');

const searchQuery: Ref<string> = ref('');
const isCreateModalOpen: Ref<boolean> = ref(false);
const isUpdateModalOpen: Ref<boolean> = ref(false);
const isSubmitting: Ref<boolean> = ref(false);

const formData: Ref<Matkul> = ref({
    Kd_Matkul: '',
    Nama_Matkul: '',
    SKS: 0,
});

// Computed Properties
const filteredMatkul = computed(() => {
    if (!matkulData.value?.data) return [];
    if (!searchQuery.value) return matkulData.value.data;

    const query = searchQuery.value.toLowerCase();
    return matkulData.value.data.filter((item: any) =>
        item.Nama_Matkul.toLowerCase().includes(query) ||
        item.Kd_Matkul.toLowerCase().includes(query)
    );
});

const stats = computed(() => {
    const data = matkulData.value?.data || [];
    const total = data.length;
    const sks1to2 = data.filter((m: any) => m.SKS >= 1 && m.SKS <= 2).length;
    const sks3plus = data.filter((m: any) => m.SKS >= 3).length;

    return { total, sks1to2, sks3plus };
});

// Actions
function openCreateModal() {
    formData.value = { Kd_Matkul: '', Nama_Matkul: '', SKS: 2 };
    isCreateModalOpen.value = true;
}

function openUpdateModal(item: Matkul) {
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
        await $fetch('/api/matkul', {
            method: 'POST',
            body: formData.value,
        });
        await refresh();
        closeModal();
        alert('Mata Kuliah berhasil ditambahkan!');
    } catch (err) {
        console.error(err);
        alert('Gagal menambah data. Pastikan Kode unik.');
    } finally {
        isSubmitting.value = false;
    }
}

async function handleUpdate() {
    isSubmitting.value = true;
    try {
        await $fetch(`/api/matkul/${formData.value.Kd_Matkul}`, {
            method: 'PUT',
            body: formData.value,
        });
        await refresh();
        closeModal();
        alert('Mata Kuliah berhasil diubah!');
    } catch (err) {
        console.error(err);
        alert('Gagal mengubah data.');
    } finally {
        isSubmitting.value = false;
    }
}

async function handleDelete(kode: string) {
    if (!confirm(`Hapus mata kuliah ${kode}?`)) return;
    try {
        await $fetch(`/api/matkul/${kode}`, { method: 'DELETE' });
        await refresh();
    } catch (err) {
        alert('Gagal menghapus data.');
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 pb-20 py-8 font-sans text-gray-900">

        <div class="max-w-7xl mx-auto px-6 pt-8 pb-6">

            <!-- Header Section -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Manajemen Mata Kuliah</h1>
                <p class="text-gray-600">Kelola data kurikulum dan mata kuliah.</p>
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
                                placeholder="Cari prodi (nama atau kode)..." />
                        </div>
                    </div>

                    <!-- Add Button -->
                    <button @click="openCreateModal"
                        class="inline-flex cursor-pointer items-center px-4 py-2 bg-green-100 text-green-500 font-medium rounded-lg hover:bg-green-200">
                        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Tambah Matkul
                    </button>
                </div>
            </div>

            <!-- Table Section -->
            <div class="bg-white rounded-xl shadow-card overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kode</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Mata Kuliah</th>
                                <th
                                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    SKS</th>
                                <th
                                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">

                            <!-- Data -->
                            <tr v-if="status === 'pending'">
                                <td colspan="5" class="px-6 py-8 text-center text-gray-500 animate-pulse">Memuat data...
                                </td>
                            </tr>
                            <tr v-else-if="filteredMatkul.length === 0">
                                <td colspan="5" class="px-6 py-8 text-center text-gray-500">Data tidak ditemukan.</td>
                            </tr>
                            <tr v-for="(item, index) in filteredMatkul" :key="item.Kd_Matkul"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{{ index + 1 }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    {{ item.Kd_Matkul }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{{
                                    item.Nama_Matkul }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        :class="item.SKS >= 3 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'">
                                        {{ item.SKS }} SKS
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div class="flex justify-center space-x-2">
                                        <button @click="openUpdateModal(item)"
                                            class="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium">
                                            <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                                </path>
                                            </svg>
                                            Edit
                                        </button>
                                        <button @click="handleDelete(item.Kd_Matkul)"
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
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                            </path>
                        </svg>
                        <span>
                            Total: {{ filteredMatkul.length }} matkul
                            <span v-if="searchQuery" class="ml-2">
                                (dari {{ stats.total }} matkul)
                            </span>
                        </span>
                    </div>
                    <div class="text-sm text-gray-500">
                        Terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID') }}
                    </div>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-200">
                    <div class="flex gap-4">
                        <div class="flex-1 text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="text-2xl font-bold text-green-600">{{ stats.total }}</div>
                            <div class="text-xs text-gray-500 font-medium uppercase mt-1">Total Matkul</div>
                        </div>
                        <div class="flex-1 text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="text-2xl font-bold text-gray-600">{{ stats.sks1to2 }}</div>
                            <div class="text-xs text-gray-500 font-medium uppercase mt-1">SKS 1-2</div>
                        </div>
                        <div class="flex-1 text-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <div class="text-2xl font-bold text-blue-600">{{ stats.sks3plus }}</div>
                            <div class="text-xs text-gray-500 font-medium uppercase mt-1">SKS 3+</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Modal Tambah / Update Matkul -->
        <div v-if="isCreateModalOpen || isUpdateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div @click="closeModal" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"></div>

            <div
                class="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all border border-gray-200">

                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 class="text-lg font-bold text-gray-900">{{ isCreateModalOpen ? "Tambah" : "Update" }} Mata Kuliah
                    </h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6">
                    <form @submit.prevent class="space-y-4">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Kode Mata Kuliah</label>
                            <input v-if="isCreateModalOpen" v-model="formData.Kd_Matkul" maxlength="10" required
                                placeholder="IF101"
                                class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2.5 " />
                            <input v-else disabled v-model="formData.Kd_Matkul"
                                class="w-full bg-gray-100 border border-gray-300 text-gray-500 rounded-lg p-2.5 cursor-not-allowed" />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Mata Kuliah</label>
                            <input v-model="formData.Nama_Matkul" maxlength="50" required
                                placeholder="Algoritma Pemrograman"
                                class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2.5 " />
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">SKS</label>
                            <input v-model="formData.SKS" type="number" min="1" max="6" required placeholder="3"
                                class="w-full bg-white border border-gray-300 text-gray-900 rounded-lg p-2.5 " />
                        </div>

                        <div class="pt-4 flex gap-3">
                            <button type="button" @click="closeModal"
                                class="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium cursor-pointer">
                                Batal
                            </button>
                            <button v-if="isCreateModalOpen" @click="handleCreate" :disabled="isSubmitting"
                                class="flex-1 bg-green-100 text-green-600 py-2.5 rounded-lg shadow-sm hover:bg-green-200 border border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold">
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                            <button v-else @click="handleUpdate" :disabled="isSubmitting"
                                class="flex-1 bg-green-100 text-green-600 py-2.5 rounded-lg shadow-sm hover:bg-green-200 border border-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold">
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>