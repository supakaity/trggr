<script lang="ts">
    import { authenticatedFetch } from '$lib/utils/api';

    import { onMount } from 'svelte';

    interface Trggr {
        id: string;
        description: string;
    }

    let trggrs: Trggr[] = [];
    let loading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            const response = await authenticatedFetch('/api/trggr', {
                method: 'POST',
                body: '{}'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch trggrs');
            }
            const data = await response.json();
            trggrs = data.trggrs || [];
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unknown error occurred';
        } finally {
            loading = false;
        }
    });
</script>

<article>
    <section class="page">
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p>Error: {error}</p>
    {:else}
        <h1>Your Trggrs</h1>

        {#if trggrs.length > 0}
            <ul>
                {#each trggrs as trggr}
                    <li><a href={`/trggrs/${trggr.id}`}>{trggr.id}</a>: {trggr.description}</li>
                {/each}
            </ul>
        {:else}
            <p>You don't have any trggrs yet.</p>
        {/if}
    {/if}
    </section>
</article>
