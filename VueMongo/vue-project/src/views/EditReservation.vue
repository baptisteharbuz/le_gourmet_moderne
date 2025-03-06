<template>
    <div class="container mx-auto mt-5 p-4">
        <h2 class="text-2xl font-bold mb-4">Modifier la réservation</h2>
        <form @submit.prevent="updateReservation" class="space-y-4">
            <div>
                <label class="block text-gray-700">Date et heure</label>
                <input type="datetime-local" v-model="reservationDate" class="border rounded p-2 w-full" required />
            </div>
            <div>
                <label class="block text-gray-700">Nombre de personnes</label>
                <input type="number" v-model="numberOfGuests" min="1" class="border rounded p-2 w-full" required />
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Mettre à jour</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const reservationId = route.params.id;

const reservationDate = ref('');
const numberOfGuests = ref('');

const token = localStorage.getItem('token') || sessionStorage.getItem('token');

const fetchReservation = async () => {
    try {
        const response = await axios.get('http://localhost:3000/reservation/user', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const reservation = response.data.find(r => r._id === reservationId);
        if (reservation) {
            // Convertir la date pour le champ datetime-local
            const dateObj = new Date(reservation.reservationDate);
            reservationDate.value = dateObj.toISOString().substring(0, 16);
            numberOfGuests.value = reservation.numberOfGuests;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de la réservation", error);
    }
};

const updateReservation = async () => {
    try {
        await axios.put(`http://localhost:3000/reservation/update/${reservationId}`, {
            reservationDate: reservationDate.value,
            numberOfGuests: numberOfGuests.value
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        router.push('/reservations');
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la réservation", error);
    }
};

onMounted(fetchReservation);
</script>

<style scoped>
/* Ajoutez ici vos styles personnalisés */
</style>