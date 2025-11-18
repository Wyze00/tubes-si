<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const kodeProdi = route.params.kode as string;

// Fetch data
const { data: detailData, pending, error } = await useFetch(`/api/prodi/${kodeProdi}`);

// State Form
const formData = ref({
    Kd_Prodi: '',
    Nama_Prodi: '',
    Fakultas: '',
    Nama_KetuaProdi: '',
});

const isSubmitting = ref(false);

// Isi form saat data berhasil diload
watchEffect(() => {
    if (detailData.value?.data) {
        const d = detailData.value.data;
        formData.value = {
            Kd_Prodi: d.Kd_Prodi,
            Nama_Prodi: d.Nama_Prodi,
            Fakultas: d.Fakultas,
            Nama_KetuaProdi: d.Nama_KetuaProdi || '',
        };
    }
});

// Tombol update
async function handleUpdate() {
    isSubmitting.value = true;
    try {
        await $fetch(`/api/prodi/${kodeProdi}`, {
            method: 'PUT',
            body: formData.value,
        });
        alert('Data berhasil diperbarui!');
        router.push('/prodi');
    } catch (err) {
        console.error(err);
        alert('Gagal memperbarui data.');
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
        
        <div v-if="pending" class="text-cyan-400 animate-pulse">Memuat data...</div>
        
        <div v-else-if="error" class="text-center">
            <h1 class="text-3xl font-bold text-red-500 mb-2">404</h1>
            <p class="text-slate-400 mb-4">Data Prodi tidak ditemukan.</p>
            <NuxtLink to="/prodi" class="text-cyan-400 hover:underline">Kembali ke Daftar</NuxtLink>
        </div>

        <div v-else class="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
            
            <div class="bg-slate-800/50 p-6 border-b border-slate-800 flex justify-between items-center">
                <h1 class="text-xl font-bold text-white flex items-center gap-3">
                    <span class="bg-cyan-500/10 text-cyan-400 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 9.293V12a1 1 0 001 1h2.707l6.707-6.707a2 2 0 000-2.828zM5 12a1 1 0 100 2h2.586l-2.586-2.586V12z" />
                        </svg>
                    </span>
                    Edit Program Studi
                </h1>
                <NuxtLink to="/prodi" class="text-sm text-slate-400 hover:text-white transition-colors">
                    &larr; Kembali
                </NuxtLink>
            </div>

            <div class="p-8">
                <form @submit.prevent="handleUpdate" class="space-y-6">
                    
                    <div class="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Kode Prodi (ID)</label>
                        <div class="font-mono text-lg text-slate-300 tracking-wide select-all">
                            {{ formData.Kd_Prodi }}
                        </div>
                        <p class="text-xs text-slate-600 mt-1">* Primary Key tidak dapat diubah</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-300">Nama Prodi</label>
                            <input v-model="formData.Nama_Prodi" required maxlength="50"
                                class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent px-4 py-3 transition-all" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-300">Fakultas</label>
                            <input v-model="formData.Fakultas" required maxlength="50"
                                class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent px-4 py-3 transition-all" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-300">Ketua Program Studi</label>
                        <input v-model="formData.Nama_KetuaProdi" maxlength="50"
                            class="w-full bg-slate-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent px-4 py-3 transition-all" />
                    </div>

                    <div class="pt-4 flex gap-4">
                        <button type="submit" :disabled="isSubmitting"
                            class="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50">
                            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                        </button>
                        
                        <NuxtLink to="/prodi" 
                            class="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-center font-medium">
                            Batal
                        </NuxtLink>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>