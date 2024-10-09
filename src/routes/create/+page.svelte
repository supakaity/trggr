<script lang="ts">
	import { goto } from '$app/navigation';
	import { classificationsList, contentTypesList } from '$lib/types';
	import { authenticatedFetch } from '$lib/utils';
	import { getContext } from 'svelte';

	let classification = '';
	let warning = '';
	let description = '';
	let content = '';
	let type = '';

	const showToast = getContext<ShowToast>('showToast');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		const trggr = {
			classification,
			warning,
			description,
			type,
			content
		};

		const created = await authenticatedFetch('/api/trggr', {
			method: 'PUT',
			body: JSON.stringify(trggr)
		});

		if (created.ok) {
			const result = await created.json();
			console.log("Result", result);
			if (result.message) {
				showToast({ message: result.message });
				console.log('Trggr created successfully:', result.trggr);
				goto(`/trggr/${result.id}`);
			} else {
				showToast({ error: 'Failed to create trggr' });
				console.warn('Failed to create trggr', result);
			}
		} else {
			showToast({ error: 'Server responded with an error' });
			throw new Error('Server responded with an error');
		}
	}
</script>

<article>
	<section class="page">
		<h2>Create a new trggr:</h2>

		<form class="flex flex-col space-y-4" on:submit|preventDefault={handleSubmit}>
			<select
				bind:value={classification}
				class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="" disabled selected>Select Classification</option>
				{#each Object.entries(classificationsList) as [key, { label, description }]}
					<option value={key}>{label} - {description}</option>
				{/each}
			</select>
			<input
				type="text"
				bind:value={warning}
				placeholder="Warning"
				class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<textarea
				bind:value={description}
				placeholder="Description"
				class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				rows="3"
			></textarea>
			<select
				bind:value={type}
				class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="" disabled selected>Select Content Type</option>
				{#each Object.entries(contentTypesList) as [key, { label, description }]}
					<option value={key}>{label} - {description}</option>
				{/each}
			</select>
			{#if type === 'text'}
				<textarea
					bind:value={content}
					placeholder="Content"
					class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					rows="5"
				></textarea>
			{:else if type}
				<input
					type="url"
					bind:value={content}
					placeholder="URL"
					class="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			{/if}
			<button
				type="submit"
				class="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>Create Trggr</button
			>
		</form>
	</section>
</article>
