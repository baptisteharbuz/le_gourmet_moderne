<template>
    <div class="container mx-auto mt-5 p-4">
        <h2 class="text-2xl font-bold mb-4">Calendrier des réservations</h2>
        <!-- Ajout de l'événement "cell-click" pour créer une réservation -->
        <vue-cal class="vuecal--blue-theme" locale="fr" :events="reservations" :disable-views="['years', 'year']"
            @event-click="showEventDetails" @cell-click="openCreateModal" :time="true" />

        <!-- Modal d'édition de réservation -->
        <div v-if="selectedEvent" class="fixed inset-0 z-50">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-black opacity-50" @click="selectedEvent = null"></div>
            <!-- Modal content -->
            <div class="relative flex items-center justify-center min-h-screen">
                <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-10">
                    <div class="flex justify-between items-center mb-4">
                        <h5 class="text-xl font-bold">Détails de la réservation</h5>
                        <button @click="selectedEvent = null" class="text-gray-600 hover:text-gray-800">&times;</button>
                    </div>
                    <p><strong>Date :</strong> {{ formatDate(selectedEvent.start) }}</p>
                    <p><strong>Nombre de personnes :</strong> {{ selectedEvent.numberOfGuests }}</p>
                    <div class="mt-4 flex justify-end space-x-2">
                        <button @click="editReservation(selectedEvent)"
                            class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                            Modifier
                        </button>
                        <button @click="deleteReservation(selectedEvent)"
                            class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                            Supprimer
                        </button>
                        <button @click="selectedEvent = null"
                            class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de création d'une réservation -->
        <div v-if="createModalVisible" class="fixed inset-0 z-50">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-black opacity-50" @click="createModalVisible = false"></div>
            <!-- Modal content -->
            <div class="relative flex items-center justify-center min-h-screen">
                <div class="bg-white rounded-lg shadow-lg p-6 w-96 z-10">
                    <h5 class="text-xl font-bold mb-4">Créer une réservation</h5>
                    <div class="mb-4">
                        <label class="block text-gray-700">Date et heure</label>
                        <input type="datetime-local" v-model="newReservationDate" class="border rounded p-2 w-full"
                            required />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Nombre de personnes</label>
                        <input type="number" v-model="newNumberOfGuests" min="1" class="border rounded p-2 w-full"
                            required />
                    </div>
                    <div class="flex justify-end space-x-2">
                        <button @click="createModalVisible = false"
                            class="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">
                            Annuler
                        </button>
                        <button @click="createReservation"
                            class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                            Créer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'ReservationsCalendar' })

import { ref, onMounted } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import axios from 'axios';
import { useRouter } from 'vue-router';

const reservations = ref([]);
const selectedEvent = ref(null);
const createModalVisible = ref(false);
const newReservationDate = ref('');
const newNumberOfGuests = ref(1);
const router = useRouter();

const token = localStorage.getItem('token') || sessionStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');

const fetchReservations = async () => {
    if (!user || !user.id) {
        console.error("Utilisateur non connecté");
        return;
    }
    try {
        const response = await axios.get('http://localhost:3000/reservation/user', {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Mapper les réservations pour vue-cal
        reservations.value = response.data.map(appt => {
            const start = new Date(appt.reservationDate);
            const end = new Date(start);
            end.setHours(end.getHours() + 1);
            return {
                id: appt._id,
                title: `Réservation pour ${appt.numberOfGuests} personnes`,
                numberOfGuests: appt.numberOfGuests,
                start: start,
                end: end
            };
        });
    } catch (error) {
        console.error("Erreur lors du chargement des réservations", error);
    }
};

const showEventDetails = (event) => {
    selectedEvent.value = event;
};

const editReservation = (event) => {
    router.push({ name: 'edit-reservation', params: { id: event.id } });
};

const deleteReservation = async (event) => {
    if (!confirm("Voulez-vous vraiment supprimer cette réservation ?")) return;
    try {
        await axios.delete(`http://localhost:3000/reservation/delete/${event.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        selectedEvent.value = null;
        fetchReservations();
    } catch (error) {
        console.error("Erreur lors de la suppression de la réservation", error);
    }
};

const openCreateModal = (cellInfo) => {
    const clickedDate = cellInfo instanceof Date ? cellInfo : cellInfo.date;
    newReservationDate.value = new Date(clickedDate).toISOString().substring(0, 16);
    newNumberOfGuests.value = 1;
    createModalVisible.value = true;
};

const createReservation = async () => {
    try {
        await axios.post('http://localhost:3000/reservation/create', {
            reservationDate: newReservationDate.value,
            numberOfGuests: newNumberOfGuests.value
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        createModalVisible.value = false;
        fetchReservations();
    } catch (error) {
        console.error("Erreur lors de la création de la réservation", error);
    }
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date);
};

onMounted(fetchReservations);
</script>

<style scoped>
/* Vous pouvez ajuster ou ajouter des styles pour améliorer la réactivité et l'apparence */
</style>