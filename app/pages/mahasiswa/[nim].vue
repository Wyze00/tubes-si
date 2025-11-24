<script setup lang="ts">
import type { Nilai } from '@prisma/client';

const route = useRoute();
const nim = route.params.nim as string;

// Fetch Student Info, Grades, and Available Courses
const { data: studentData } = await useFetch(`/api/mahasiswa/${nim}`);
const { data: gradeData, refresh: refreshGrades } = await useFetch(`/api/nilai/${nim}`);
const { data: matkulData } = await useFetch('/api/matkul');


// State
const isUpdateModal = ref(false);
const isSubmitting = ref(false);
const newGradeForm = ref({
  Kd_Matkul: '',
  Nilai: '',
  Grade: ''
});

// Computed
const student = computed(() => studentData.value?.data);
const grades = computed(() => gradeData.value?.data || []);

const availableMatkul = computed(() => {
  const allMatkul = matkulData.value?.data || [];
  const takenGrades = grades.value || [];

  return allMatkul.filter((m: any) => !takenGrades.some((g: any) => g.Kd_Matkul === m.Kd_Matkul));
});

const stats = computed(() => {
  const nilai70plus = grades.value.filter((g: any) => parseInt(g.Nilai) >= 70).length;
  const gradeA = grades.value.filter((g: any) => g.Grade === 'A').length;

  return {
    nilai70plus,
    gradeA
  }
});

// Actions
function openUpdateModal(item: Nilai) {
  newGradeForm.value = { ...item };
  isUpdateModal.value = true;
}

async function handleAddGrade(kode: string) {
  isSubmitting.value = true;
  try {
    await $fetch('/api/nilai', {
      method: 'POST',
      body: {
        NIM: nim,
        Kd_Matkul: kode,
        Nilai: '0',
        Grade: 'E'
      }
    });
    await refreshGrades();
    isUpdateModal.value = false;
  } catch (error: any) {
    alert(error.statusMessage || 'Gagal menambah nilai');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDeleteGrade(kodeMatkul: string) {
  if (!confirm('Hapus mata kuliah ini dari daftar nilai?')) return;
  try {
    await $fetch(`/api/nilai/${nim}/${kodeMatkul}`, { method: 'DELETE' });
    await refreshGrades();
  } catch (error) {
    alert('Gagal menghapus nilai');
    alert(error.getMessage());
  }
}

async function handleUpdateGrade() {
  isSubmitting.value = true;
  try {
    await $fetch(`/api/nilai/${nim}/${newGradeForm.value.Kd_Matkul}`, {
      method: 'PUT',
      body: newGradeForm.value
    });
    await refreshGrades();
    isUpdateModal.value = false;
  } catch (error: any) {
    alert(error.statusMessage || 'Gagal mengubah nilai');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 pb-20 py-8 font-sans text-gray-900">
    <div class="max-w-5xl mx-auto px-6 pt-8">

      <NuxtLink to="/mahasiswa"
        class="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali ke Daftar Mahasiswa
      </NuxtLink>

      <div v-if="student" class="bg-white rounded-xl shadow-card p-8 mb-8 border-l-4 border-blue-500">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-1">{{ student.Nama_Mhs }}</h1>
            <p class="text-gray-500 text-lg font-medium mb-4">{{ student.NIM }}</p>
            <div class="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-gray-600">
              <div>
                <span class="font-semibold text-gray-800 block">Program Studi:</span>
                {{ student.Kd_Prodi }}
              </div>
              <div>
                <span class="font-semibold text-gray-800 block">Alamat:</span>
                {{ student.Alamat }}
              </div>
            </div>
          </div>
          <div
            class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
            {{ student.Nama_Mhs.charAt(0) }}
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-card overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Mata Kuliah Diambil</h3>
          <span class="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{{ grades.length }}
            Matkul</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Matkul
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="grades.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 italic">
                  Belum ada mata kuliah yang diambil.
                </td>
              </tr>

              <tr v-for="(item, index) in grades" :key="item.Kd_Matkul" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 text-center">{{ item.Kd_Matkul }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{{ item.Matkul.Nama_Matkul }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-700">{{ item.Nilai }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="{
                    'bg-green-100 text-green-800': ['A', 'B'].includes(item.Grade),
                    'bg-yellow-100 text-yellow-800': item.Grade === 'C',
                    'bg-red-100 text-red-800': ['D', 'E'].includes(item.Grade)
                  }" class="px-2 py-1 rounded text-xs font-bold">
                    {{ item.Grade }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <button @click="openUpdateModal(item)"
                      class="inline-flex items-center cursor-pointer px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs font-medium">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                      </svg>
                      Edit
                    </button>
                    <button @click="handleDeleteGrade(item.Kd_Matkul)"
                      class="inline-flex items-center cursor-pointer px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-xs font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      <div class="bg-white rounded-xl shadow-card overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Tersedia untuk Diambil</h3>
          <span class="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">{{ availableMatkul.length
          }} Tersedia</span>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Matkul
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SKS</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="availableMatkul.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 italic">
                  Tidak ada mata kuliah tersedia (semua sudah diambil).
                </td>
              </tr>

              <tr v-for="(item, index) in availableMatkul" :key="item.Kd_Matkul"
                class="hover:bg-gray-50 transition-colors animate-fade-in">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{{ index + 1 }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 text-center">{{ item.Kd_Matkul }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{{ item.Nama_Matkul }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">{{ item.SKS }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center space-x-2">
                    <button @click="handleAddGrade(item.Kd_Matkul)"
                      class="inline-flex items-center cursor-pointer px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-xs font-medium">
                      <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Ambil Matkul
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mt-6 bg-white rounded-xl shadow-card p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center text-sm text-gray-500">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Total SKS Diambil: {{ grades.reduce((acc: number, curr: any) => acc + (curr.Matkul?.SKS || 0), 0)
            }}</span>
          </div>
          <div class="text-sm text-gray-500">
            Terakhir diperbarui: {{ new Date().toLocaleDateString('id-ID') }}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex gap-4">
            <div class="flex-1 text-center">
              <div class="text-2xl font-bold text-green-600">{{ grades.length }}</div>
              <div class="text-xs text-gray-500">Total Matkul Diambil</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-2xl font-bold text-blue-600">{{ stats.nilai70plus }}</div>
              <div class="text-xs text-gray-500">Nilai 70+</div>
            </div>
            <div class="flex-1 text-center">
              <div class="text-2xl font-bold text-purple-600">{{ stats.gradeA }}</div>
              <div class="text-xs text-gray-500">Grade A</div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="isUpdateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div @click="isUpdateModal = false" class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity">
      </div>
      <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 class="text-lg font-bold text-gray-900">Update Nilai</h3>
        </div>
        <div class="p-6">
          <form @submit.prevent class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mata Kuliah</label>
              <input v-model="newGradeForm.Kd_Matkul" required disabled
                class="w-full px-3 py-2 border border-gray-300 bg-gray-100 cursor-not-allowed rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nilai (Angka)</label>
                <input v-model="newGradeForm.Nilai" type="text" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="85" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Grade (Huruf)</label>
                <select v-model="newGradeForm.Grade" required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
              </div>
            </div>
            <div class="pt-4 flex gap-3">
              <button type="button" @click="isUpdateModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Batal</button>
              <button type="submit" :disabled="isSubmitting" @click="handleUpdateGrade()"
                class="flex-1 bg-green-100 text-green-500 py-2.5 rounded-lg shadow-md hover:bg-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>