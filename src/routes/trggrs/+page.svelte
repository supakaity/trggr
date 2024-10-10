<script lang="ts">
    import { authenticatedFetch } from '$lib/utils/api';

	import { onMount } from 'svelte';

	type MyTrggr = Pick<
        Trggr,
        'id' | 'classification' | 'warning' | 'description' | 'encrypted'
    >;

	let trggrs: MyTrggr[] = [];
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
			<h2>Your Trggrs</h2>

			{#if trggrs.length > 0}
				<ul>
					{#each trggrs as trggr}
						<li>
							{#if trggr.encrypted}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="#18d30e"
									class="icon icon-tabler icons-tabler-filled icon-tabler-shield-check"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm3.71 7.293a1 1 0 0 0 -1.415 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
									/></svg
								>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#0e59d3"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="icon icon-tabler icons-tabler-outline icon-tabler-shield-off"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M17.67 17.667a12 12 0 0 1 -5.67 3.333a12 12 0 0 1 -8.5 -15c.794 .036 1.583 -.006 2.357 -.124m3.128 -.926a11.997 11.997 0 0 0 3.015 -1.95a12 12 0 0 0 8.5 3a12 12 0 0 1 -1.116 9.376"
									/><path d="M3 3l18 18" /></svg
								>
							{/if}
							<a href={`/trggr/${trggr.id}`}>{trggr.id}</a>
							<strong>[{trggr.classification}]</strong>: {trggr.warning}<br>
							<small class="quote">{trggr.description}</small>
						</li>
					{/each}
				</ul>
			{:else}
				<p>You don't have any trggrs yet.</p>
			{/if}
		{/if}
	</section>
</article>
