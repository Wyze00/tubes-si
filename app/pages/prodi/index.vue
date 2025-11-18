<script setup lang="ts">
// Fetch semua data
const { data: prodiData, refresh, status } = await useFetch('/api/prodi');

// Form untuk tambah data
const formData = ref({
    Kd_Prodi: '',
    Nama_Prodi: '',
    Fakultas: '',
    Nama_KetuaProdi: '',
});

const isSubmitting = ref(false);

// Tombol create
async function handleCreate() {
    isSubmitting.value = true;
    try {
        await $fetch('/api/prodi', {
            method: 'POST',
            body: formData.value,
        });
        await refresh();
        formData.value = { Kd_Prodi: '', Nama_Prodi: '', Fakultas: '', Nama_KetuaProdi: '' };
        alert('Prodi berhasil ditambahkan!');
    } catch (err) {
        console.error(err);
        alert('Gagal menambah prodi. Pastikan Kode Prodi unik.');
    } finally {
        isSubmitting.value = false;
    }
}

// Tombol delete
async function handleDelete(kode: string) {
    if (!confirm(`Hapus prodi ${kode}?`)) return;
    try {
        await $fetch(`/api/prodi/${kode}`, { method: 'DELETE' });
        await refresh();
    } catch (err) {
        alert('Gagal menghapus data.');
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500 selection:text-white">

        <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div class="lg:col-span-1">
                <div
                    class="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span class="w-2 h-6 bg-cyan-500 rounded-full"></span>
                        Tambah Prodi
                    </h2>

                    <form @submit.prevent="handleCreate" class="space-y-5">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kode Prodi</label>
                            <input v-model="formData.Kd_Prodi" maxlength="10" required placeholder="Contoh: IF-2024"
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Prodi</label>
                            <input v-model="formData.Nama_Prodi" maxlength="50" required placeholder="Teknik Informatika"
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Fakultas</label>
                            <input v-model="formData.Fakultas" maxlength="50" required placeholder="Fakultas Ilmu Komputer"
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Ketua Prodi</label>
                            <input v-model="formData.Nama_KetuaProdi" maxlength="50" placeholder="Dr. Fulan, M.T."
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <button type="submit" :disabled="isSubmitting"
                            class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-cyan-900/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                            {{ isSubmitting ? 'Menyimpan...' : '+ Simpan Data' }}
                        </button>
                    </form>
                </div>
            </div>

            <div class="lg:col-span-2 space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-white">Daftar Program Studi</h2>
                    <div class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-400">
                        Total: {{ prodiData?.data?.length || 0 }}
                    </div>
                </div>

                <div v-if="status === 'pending'" class="space-y-4 animate-pulse">
                    <div v-for="i in 3" :key="i" class="h-24 bg-slate-800/50 rounded-xl"></div>
                </div>

                <div v-else-if="prodiData?.data?.length" class="grid gap-4">
                    <div v-for="item in prodiData.data" :key="item.Kd_Prodi"
                        class="group bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-cyan-900/10 relative overflow-hidden">

                        <div
                            class="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-cyan-500/10">
                        </div>

                        <div class="flex justify-between items-start relative z-10">
                            <div>
                                <div class="flex items-center gap-3 mb-1">
                                    <span
                                        class="font-mono text-xs bg-slate-950 text-cyan-400 px-2 py-1 rounded border border-slate-700">
                                        {{ item.Kd_Prodi }}
                                    </span>
                                    <h3 class="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                                        {{ item.Nama_Prodi }}
                                    </h3>
                                </div>
                                <p class="text-slate-400 text-sm flex items-center gap-2 mt-2">
                                    <span class="i-heroicons-academic-cap w-4 h-4"></span>
                                    {{ item.Fakultas }}
                                </p>
                                <p v-if="item.Nama_KetuaProdi" class="text-slate-500 text-xs mt-1 italic">
                                    Ka. Prodi: {{ item.Nama_KetuaProdi }}
                                </p>
                            </div>

                            <div class="flex gap-2">
                                <NuxtLink :to="`/prodi/${item.Kd_Prodi}`"
                                    class="p-2 bg-slate-700 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                                    title="Edit Detail">
                                    Edit
                                </NuxtLink>
                                <button @click="handleDelete(item.Kd_Prodi)"
                                    class="p-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors"
                                    title="Hapus">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-12 bg-slate-900 rounded-xl border border-dashed border-slate-700">
                    <p class="text-slate-500">Belum ada data prodi.</p>
            </div>
        </div>
    </div>
</div></template>