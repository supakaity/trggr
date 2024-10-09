<script lang="ts">
import { authenticatedFetch } from '$lib/utils/api';

interface UserData {
    username: string;
    email: string;
}

async function fetchUserData(): Promise<UserData | null> {
    try {
        const response = await authenticatedFetch('/api/user');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const userData: UserData = await response.json();
        return userData;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

let userDataPromise = fetchUserData();
</script>

{#await userDataPromise}
    <p>Loading user data...</p>
{:then userData}
    {#if userData}
        <h1>Welcome, {userData.username}!</h1>
        <p>Email: {userData.email}</p>
        <!-- Display other user data as needed -->
    {:else}
        <p>Failed to load user data. Please try again later.</p>
    {/if}
{:catch error}
    <p>Error: {error.message}</p>
{/await}