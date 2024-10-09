<script lang="ts">
	import { anonFetch } from '$lib/utils/api';
	import Button from '../../../stories/Button.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { classificationsList } from '$lib/types';

	const { id } = $page.params;
	let trggr: Trggr | undefined;
	let user: { id: string; username: string } | undefined;
	let loaded = false;
	let error = false;

	onMount(async () => {
		const response = await anonFetch(`/api/trggr`, {
			body: JSON.stringify({ id })
		});

		loaded = true;
		if (response.ok) {
			const data = await response.json();
			console.log('got trigger', data);
			trggr = data.trggr;
			user = data.user;
		} else {
			error = true;
		}
	});

	let revealOne = false;
	let revealTwo = false;

    // svelte-ignore reactive_declaration_non_reactive_property
	$: classified = classificationsList[trggr?.classification as keyof typeof classificationsList];
</script>

<article>
	<section class="page">
        <h2>This content may be sensitive</h2>
		{#if loaded && trggr}
			<h3 title={classified.description}>
                Classification: {classified.label}
            </h3>
			<p>
                <strong>Warning:</strong> {trggr.warning}<br/>
                <strong>Type:</strong> {trggr.type}<br/>

			{#if !revealOne}
				<Button on:click={() => (revealOne = true)} primary size="pill" label="Reveal" />
			{:else}
                <Button on:click={() => { revealOne = false; revealTwo = false; }} danger size="pill" label="Hide" /><br/>

				<strong>Description:</strong> {trggr.description}<br/>
				{#if !revealTwo}
					<Button on:click={() => (revealTwo = true)} primary size="pill" label="Reveal" />
				{:else}
                    <Button on:click={() => (revealTwo = false)} danger size="pill" label="Hide" /><br/>
                    <strong>User:</strong> {user?.username} <small>({user?.id})</small><br/>
                    {#if trggr.type === 'text'}
                        <strong>Text:</strong><br/>
                        <span class="quote">
                            {trggr.content}
                        </span>
                    {:else if trggr.type === 'image'}
                        <strong>Image:</strong><br/>
                        <img src={trggr.content} alt="Content" />
                    {:else if trggr.type === 'video'}
                        <strong>Video:</strong><br/>
                        <video src={trggr.content} controls>
                            <track kind="captions" src="" label="English" />
                        </video>
                    {:else if trggr.type === 'audio'}
                        <strong>Audio:</strong><br/>
                        <audio src={trggr.content} controls>
                            <track kind="captions" src="" label="English" />
                        </audio>
                    {:else if trggr.type === 'link'}
                        <strong>Link:</strong><br/>
                        <a href={trggr.content} target="_blank" rel="nofollow noopener noreferrer">Link</a>
                    {:else}
                        <strong>Content ({trggr.type}):</strong><br/>
                        {trggr.content}
                    {/if}
                {/if}
			{/if}
            </p>

			<p>
                <strong>Created at:</strong> {new Date(trggr.createdAt ?? '').toLocaleString()}<br/>
                {#if trggr.replacementOf}
                    <strong>Replacement of:</strong> <a href={`/trggr/${trggr.replacementOf}`}>{trggr.replacementOf}</a><br/>
                {/if}
                {#if trggr.replacement}
                    <strong>Replaced by:</strong> <a href={`/trggr/${trggr.replacement}`}>{trggr.replacement}</a><br/>
                    <strong>Replaced at:</strong> {new Date(trggr.replacedAt ?? '').toLocaleString()}<br/>
                {/if}
            </p>

            <strong>Markdown:</strong>
            <pre>[tw: {trggr.classification}](https://trggr.link/trggr/{trggr.id})</pre>
            <strong>HTML:</strong>
            <pre>&lt;a href=&quot;https://trggr.link/trggr/{trggr.id}&quot;&gt;tw: {trggr.classification}&lt;/a&gt;</pre>

		{:else if error}
			<p>Error loading trigger</p>
		{:else}
			<p>Loading...</p>
		{/if}
	</section>
</article>
