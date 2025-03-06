<template>
    <nav class="bg-gray-800 p-4 flex justify-between items-center">
        <div>
            <router-link to="/reservations" class="text-white font-bold text-xl">Restaurant</router-link>
        </div>
        <div>
            <template v-if="isLoggedIn">
                <button @click="logout" class="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600">
                    Logout
                </button>
            </template>
        </div>
    </nav>
</template>

<script setup>
defineOptions({
    name: 'AppNavbar'
})

import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoggedIn = computed(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
});

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    router.push('/login');
};
</script>

<style scoped>
/* Vous pouvez ajouter ici des styles supplémentaires */
</style>