<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const kode = route.params.kode as string;

// --- Fetch Single Data ---
const { data: detailData, pending, error } = await useFetch(`/api/matkul/${kode}`);

// State Form
const formData = ref({
    Kd_Matkul: '',
    Nama_Matkul: '',
    SKS: 0,
});

const isSubmitting = ref(false);

// Isi form saat data load
watchEffect(() => {
    if (detailData.value?.data) {
        const d = detailData.value.data;
        formData.value = {
            Kd_Matkul: d.Kd_Matkul,
            Nama_Matkul: d.Nama_Matkul,
            SKS: d.SKS,
        };
    }
});

// --- Action: Update ---
async function handleUpdate() {
    isSubmitting.value = true;
    try {
        await $fetch(`/api/matkul/${kode}`, {
            method: 'PUT',
            body: formData.value,
        });
        alert('Data berhasil diperbarui!');
        router.push('/matkul'); // Kembali ke list
    } catch (err) {
        console.error(err);
        alert('Gagal memperbarui data.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6 font-sans">

        <div v-if="pending" class="text-emerald-400 animate-pulse">Memuat data...</div>

        <div v-else-if="error" class="text-center">
            <h1 class="text-3xl font-bold text-red-500 mb-2">404</h1>
            <p class="text-slate-400 mb-4">Data Matkul tidak ditemukan.</p>
            <NuxtLink to="/matkul" class="text-emerald-400 hover:underline">Kembali ke Daftar</NuxtLink>
        </div>

        <div v-else class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">

            <div class="bg-slate-800/50 p-6 border-b border-slate-800 flex justify-between items-center">
                <h1 class="text-xl font-bold text-white flex items-center gap-3">
                    <span class="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                    </span>
                    Edit Mata Kuliah
                </h1>
                <NuxtLink to="/matkul" class="text-sm text-slate-400 hover:text-white transition-colors">
                    &larr; Kembali
                </NuxtLink>
            </div>

            <div class="p-8">
                <form @submit.prevent="handleUpdate" class="space-y-6">

                    <div class="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Kode Matkul (ID)</label>
                        <div class="font-mono text-lg text-slate-300 tracking-wide select-all">
                            {{ formData.Kd_Matkul }}
                        </div>
                        <p class="text-xs text-slate-600 mt-1">* Primary Key tidak dapat diubah</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 space-y-2">
                            <label class="text-sm font-medium text-slate-300">Nama Mata Kuliah</label>
                            <input v-model="formData.Nama_Matkul" required maxlength="50"
                                class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent px-4 py-3 transition-all" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-300">SKS</label>
                            <input v-model="formData.SKS" type="number" required min="1" max="6"
                                class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent px-4 py-3 transition-all text-center" />
                        </div>
                    </div>

                    <div class="pt-4 flex gap-4">
                        <button type="submit" :disabled="isSubmitting"
                            class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                        </button>

                        <NuxtLink to="/matkul" 
                            class="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-center font-medium">
                            Batal
                        </NuxtLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>