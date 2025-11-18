<script setup lang="ts">
import type { Prodi } from '@prisma/client';

// Fetch data
const {
    data: prodiData,
    refresh
} = await useFetch('/api/prodi');
// prodiData.value akan berisi { message: '...', data: [...] }

interface ProdiFormData {
    Kd_Prodi: string;
    Nama_Prodi: string;
    Fakultas: string;
    Nama_KetuaProdi: string;
}

const defaultFormData: ProdiFormData = {
    Kd_Prodi: '',
    Nama_Prodi: '',
    Fakultas: '',
    Nama_KetuaProdi: '',
};

const formData = ref<ProdiFormData>({ ...defaultFormData });

const isEditing = ref(false);
const isSubmitting = ref(false);

async function handleSubmit() {
    isSubmitting.value = true;
    try {
        if (isEditing.value) {
            // --- UPDATE (U) ---
            await $fetch(`/api/prodi/${formData.value.Kd_Prodi}`, {
                method: 'PUT',
                body: formData.value,
            });
        } else {
            // --- CREATE (C) ---
            await $fetch('/api/prodi', {
                method: 'POST',
                body: formData.value,
            });
        }

        await refresh();
        resetForm();

    } catch (err) {
        console.error('Error submitting form:', err);
    } finally {
        isSubmitting.value = false;
    }
}

async function handleDelete(kodeProdi: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus prodi ini?')) {
        return;
    }

    try {
        // --- DELETE (D) ---
        await $fetch(`/api/prodi/${kodeProdi}`, {
            method: 'DELETE',
        });

        await refresh();

        // Jika prodi yang sedang diedit adalah yang baru saja dihapus, reset form
        if (isEditing.value && formData.value.Kd_Prodi === kodeProdi) {
            resetForm();
        }

    } catch (err) {
        console.error('Error deleting prodi:', err);
    }
}

function startEdit(prodi: Prodi) {
    // Kita copy datanya agar tidak mengubah data di list secara langsung
    formData.value = {
        ...prodi,
        // Pastikan Nama_KetuaProdi tidak null/undefined, ganti jadi string kosong
        Nama_KetuaProdi: prodi.Nama_KetuaProdi || ''
    };
    isEditing.value = true;
    // Bawa layar ke atas untuk fokus ke form
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
    formData.value = { ...defaultFormData };
    isEditing.value = false;
}

const inputClasses = "w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50";
const buttonClasses = "px-4 py-2 rounded-md font-medium text-white transition-colors disabled:opacity-50";
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
        <div class="max-w-4xl mx-auto">

            <h1 class="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Manajemen Program Studi
            </h1>

            <!-- Form untuk menambah atau mengedit prodi -->
            <form @submit.prevent="handleSubmit" class="bg-gray-800 p-6 rounded-xl shadow-lg mb-8 space-y-4">
                <h2 class="text-xl font-semibold text-white mb-2">
                    {{ isEditing ? 'Edit Prodi' : 'Tambah Prodi Baru' }}
                </h2>

                <div>
                    <label for="kd_prodi" class="block text-sm font-medium text-gray-300 mb-1">Kode Prodi</label>
                    <input id="kd_prodi" v-model="formData.Kd_Prodi" :class="inputClasses" placeholder="Contoh: TIF"
                        required :disabled="isEditing" maxlength="10" />
                    <small v-if="isEditing" class="text-gray-400 text-xs">Kode Prodi tidak dapat diubah.</small>
                </div>

                <div>
                    <label for="nama_prodi" class="block text-sm font-medium text-gray-300 mb-1">Nama Prodi</label>
                    <input id="nama_prodi" v-model="formData.Nama_Prodi" :class="inputClasses"
                        placeholder="Contoh: Teknik Informatika" required maxlength="50" />
                </div>

                <div>
                    <label for="fakultas" class="block text-sm font-medium text-gray-300 mb-1">Fakultas</label>
                    <input id="fakultas" v-model="formData.Fakultas" :class="inputClasses"
                        placeholder="Contoh: Fakultas Teknik" required maxlength="50" />
                </div>

                <div>
                    <label for="ketua_prodi" class="block text-sm font-medium text-gray-300 mb-1">Nama Ketua Prodi
                        (Opsional)</label>
                    <input id="ketua_prodi" v-model="formData.Nama_KetuaProdi" :class="inputClasses"
                        placeholder="Contoh: Dr. Budi Santoso" maxlength="50" />
                </div>

                <div class="flex gap-4 pt-2">
                    <button type="submit" :class="[buttonClasses, 'bg-cyan-600 hover:bg-cyan-700']"
                        :disabled="isSubmitting">
                        {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Update Prodi' : 'Simpan Prodi') }}
                    </button>

                    <button v-if="isEditing" type="button" @click="resetForm"
                        :class="[buttonClasses, 'bg-gray-600 hover:bg-gray-700']" :disabled="isSubmitting">
                        Batal
                    </button>
                </div>
            </form>

            <h2 class="text-2xl font-semibold text-white mb-4">
                Daftar Prodi
            </h2>

            <!-- List prodi -->
            <div v-if="prodiData && prodiData.data && prodiData.data.length > 0" class="space-y-3">
                <div v-for="prodi in prodiData.data" :key="prodi.Kd_Prodi"
                    class="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-cyan-300">{{ prodi.Nama_Prodi }} ({{ prodi.Kd_Prodi }})</h3>
                        <p class="text-sm text-gray-300">{{ prodi.Fakultas }}</p>
                        <p v-if="prodi.Nama_KetuaProdi" class="text-sm text-gray-400 mt-1">
                            Kaprodi: {{ prodi.Nama_KetuaProdi }}
                        </p>
                    </div>

                    <div class="flex-shrink-0 flex gap-2">
                        <button @click="startEdit(prodi)"
                            :class="[buttonClasses, 'bg-yellow-600 hover:bg-yellow-700 text-sm']" aria-label="Edit prodi">
                            Edit
                        </button>
                        <button @click="handleDelete(prodi.Kd_Prodi)"
                            :class="[buttonClasses, 'bg-red-600 hover:bg-red-700 text-sm']" aria-label="Hapus prodi">
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="text-center text-gray-500 bg-gray-800 p-8 rounded-md">
                Belum ada data program studi. Silakan tambahkan melalui form di atas.
            </div>
        </div>
    </div>
</template>