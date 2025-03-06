<template>
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                    alt="logo">
                Flowbite
            </a>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>

                    <!-- Alert pour afficher les messages -->
                    <div v-if="message"
                        :class="{ 'bg-red-100 text-red-700': isError, 'bg-green-100 text-green-700': !isError }"
                        class="p-3 rounded">
                        {{ message }}
                    </div>

                    <form @submit.prevent="handleLogin" class="space-y-4 md:space-y-6">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Your email
                            </label>
                            <input v-model="email" type="email" name="email" id="email" placeholder="name@company.com"
                                required
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Password
                            </label>
                            <input v-model="password" type="password" name="password" id="password"
                                placeholder="••••••••" required
                                class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input v-model="rememberMe" id="remember" type="checkbox"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 dark:text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            <a href="#"
                                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Forgot password?
                            </a>
                        </div>
                        <button type="submit" :disabled="isLoading"
                            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50">
                            {{ isLoading ? 'Signing in...' : 'Sign in' }}
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account yet?
                            <RouterLink to="/register"
                                class="font-medium text-primary-600 hover:underline dark:text-primary-500">
                                Sign up
                            </RouterLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

// API URL - ajustez selon votre configuration
const API_URL = 'http://localhost:3000/user';

const handleLogin = async () => {
    try {
        isLoading.value = true;
        message.value = '';

        // Appel à l'endpoint /login
        const response = await axios.post(`${API_URL}/login`, {
            email: email.value,
            password: password.value
        });

        const { token, user } = response.data;

        // Stocker le token et les informations utilisateur selon le choix "Remember me"
        if (rememberMe.value) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));
        }

        message.value = 'Login successful! Redirecting...';
        isError.value = false;

        // Redirection vers la page d'accueil après un court délai
        setTimeout(() => {
            router.push('/reservations');
        }, 1500);
    } catch (error) {
        isError.value = true;
        if (error.response) {
            message.value = error.response.data.message || 'Login failed';
        } else if (error.request) {
            message.value = 'Network error. Please check your connection.';
        } else {
            message.value = 'An error occurred. Please try again.';
        }
        console.error('Login error:', error);
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Styles supplémentaires si nécessaire */
</style>