<script setup lang="ts">
// --- Fetch Data ---
const { data: matkulData, refresh, status } = await useFetch('/api/matkul');

// --- Form State ---
const formData = ref({
    Kd_Matkul: '',
    Nama_Matkul: '',
    SKS: 0,
});

const isSubmitting = ref(false);

// --- Action: Create ---
async function handleCreate() {
    isSubmitting.value = true;
    try {
        await $fetch('/api/matkul', {
            method: 'POST',
            body: formData.value,
        });
        await refresh();
        formData.value = { Kd_Matkul: '', Nama_Matkul: '', SKS: 0 }; // Reset form
        alert('Matkul berhasil ditambahkan!');
    } catch (err) {
        console.error(err);
        alert('Gagal menambah data.');
    } finally {
        isSubmitting.value = false;
    }
}

// --- Action: Delete ---
async function handleDelete(kode: string) {
    if (!confirm(`Hapus matkul ${kode}?`)) return;
    try {
        await $fetch(`/api/matkul/${kode}`, { method: 'DELETE' });
        await refresh();
    } catch (err) {
        alert('Gagal menghapus data.');
    }
}
</script>

<template>
    <div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-white">

        <div class="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
            <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Portal Akademik
                </h1>
                <div class="flex gap-4 text-sm font-medium">
                     <NuxtLink to="/prodi" class="text-slate-400 hover:text-white transition-colors">Prodi</NuxtLink>
                     <span class="text-emerald-400">Matkul</span>
                </div>
            </div>
        </div>

        <div class="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

            <div class="lg:col-span-1">
                <div class="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 sticky top-24 shadow-xl">
                    <h2 class="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                        <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
                        Tambah Matkul
                    </h2>

                    <form @submit.prevent="handleCreate" class="space-y-5">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Kode Matkul</label>
                            <input v-model="formData.Kd_Matkul" maxlength="10" required placeholder="Contoh: IF101"
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Matkul</label>
                            <input v-model="formData.Nama_Matkul" maxlength="50" required placeholder="Algoritma"
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">SKS</label>
                            <input v-model="formData.SKS" type="number" required placeholder="3" min="1" max="6"
                                class="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent block p-3 transition-all placeholder:text-slate-600" />
                        </div>

                        <button type="submit" :disabled="isSubmitting"
                            class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95 disabled:opacity-50 mt-4">
                            {{ isSubmitting ? 'Menyimpan...' : '+ Simpan Matkul' }}
                        </button>
                    </form>
                </div>
            </div>

            <div class="lg:col-span-2 space-y-6">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-white">Daftar Mata Kuliah</h2>
                    <div class="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-400">
                        Total: {{ matkulData?.data?.length || 0 }}
                    </div>
                </div>

                <div v-if="status === 'pending'" class="space-y-4 animate-pulse">
                    <div v-for="i in 3" :key="i" class="h-24 bg-slate-800/50 rounded-xl"></div>
                </div>

                <div v-else-if="matkulData?.data?.length" class="grid gap-4">
                    <div v-for="item in matkulData.data" :key="item.Kd_Matkul" 
                        class="group bg-slate-800 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-emerald-900/10 relative overflow-hidden">

                        <div class="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/10"></div>

                        <div class="flex justify-between items-start relative z-10">
                            <div>
                                <div class="flex items-center gap-3 mb-1">
                                    <span class="font-mono text-xs bg-slate-950 text-emerald-400 px-2 py-1 rounded border border-slate-700">
                                        {{ item.Kd_Matkul }}
                                    </span>
                                    <h3 class="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                                        {{ item.Nama_Matkul }}
                                    </h3>
                                </div>
                                <p class="text-slate-400 text-sm flex items-center gap-2 mt-2">
                                    <span class="bg-slate-700 px-2 py-0.5 rounded text-xs text-white font-medium">
                                        {{ item.SKS }} SKS
                                    </span>
                                </p>
                            </div>

                            <div class="flex gap-2">
                                <NuxtLink :to="`/matkul/${item.Kd_Matkul}`"
                                    class="p-2 bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Edit">
                                    Edit
                                </NuxtLink>
                                <button @click="handleDelete(item.Kd_Matkul)"
                                    class="p-2 bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors" title="Hapus">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="text-center py-12 bg-slate-900 rounded-xl border border-dashed border-slate-700">
                    <p class="text-slate-500">Belum ada data mata kuliah.</p>
                </div>
            </div>
        </div>
    </div>
</template>