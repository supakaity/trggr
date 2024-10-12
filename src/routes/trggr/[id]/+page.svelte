<script lang="ts">
	import { anonFetch } from '$lib/utils/api';
	import Button from '../../../stories/Button.svelte';
	import { page } from '$app/stores';
	import { onMount, getContext } from 'svelte';
	import { classificationsList } from '$lib/types';
	import { decryptObject, getKeyFromUrl } from '$lib/utils/encryption';
	import { copyToClipboard } from '$lib/utils/copy';

	const { id } = $page.params;
	let trggr: Trggr | undefined;
	let user: { id: string; username: string } | undefined;
	let loaded = false;
	let error = false;
	let key = $page.url.hash ? $page.url.hash.split('#')[1] : undefined;

    const showToast = getContext<ShowToast>('showToast');

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
    let includeKeyInLink = true;

	// svelte-ignore reactive_declaration_non_reactive_property
	$: classified = classificationsList[trggr?.classification as keyof typeof classificationsList];

	$: content = !trggr?.encrypted
		? trggr?.content
		: key
			? (decryptObject(trggr.content, key) ?? null)
			: undefined;

	$: urlKey = getKeyFromUrl(key);
	$: fragment = urlKey && content ? `#${urlKey}` : '';
	$: stringContent = typeof content === 'string' ? content : JSON.stringify(content);
</script>

<article>
	<section class="page">
		<h3>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="#f07923"
				class="icon icon-tabler icons-tabler-filled icon-tabler-alert-triangle"
				><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
					d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
				/></svg
			>
			This content may be sensitive
		</h3>
		{#if loaded && trggr}
			<h3 title={classified.description}>
				Classification: {classified.label}
			</h3>
			<p>
				<strong>Warning:</strong>
				{trggr.warning}<br />
				<strong>Type:</strong>
				{trggr.type}<br />

				{#if !revealOne}
					<Button on:click={() => (revealOne = true)} primary size="pill" label="Reveal" />
				{:else}
					<Button
						on:click={() => {
							revealOne = false;
							revealTwo = false;
						}}
						danger
						size="pill"
						label="Hide"
					/><br />

					<strong>Description:</strong>
					{trggr.description}<br />
					{#if !revealTwo}
						<Button on:click={() => (revealTwo = true)} primary size="pill" label="Reveal" />
					{:else}
						<Button on:click={() => (revealTwo = false)} danger size="pill" label="Hide" /><br />
						<strong>User:</strong>
						{user?.username} <small>({user?.id})</small><br />

						{#if trggr.encrypted}
							<label>
								<strong>Encryption key:</strong><br />
								<input
									type="text"
									id="key"
									bind:value={key}
									class="mt-1 block w-full rounded-md border border-gray-300 text-xs shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
							</label>
						{/if}
						{#if !trggr.encrypted || key}
							{#if content === null}
								<span class="text-lg">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="#d3280e"
										class="icon icon-tabler icons-tabler-filled icon-tabler-alert-octagon"
										><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
											d="M14.897 1a4 4 0 0 1 2.664 1.016l.165 .156l4.1 4.1a4 4 0 0 1 1.168 2.605l.006 .227v5.794a4 4 0 0 1 -1.016 2.664l-.156 .165l-4.1 4.1a4 4 0 0 1 -2.603 1.168l-.227 .006h-5.795a3.999 3.999 0 0 1 -2.664 -1.017l-.165 -.156l-4.1 -4.1a4 4 0 0 1 -1.168 -2.604l-.006 -.227v-5.794a4 4 0 0 1 1.016 -2.664l.156 -.165l4.1 -4.1a4 4 0 0 1 2.605 -1.168l.227 -.006h5.793zm-2.887 14l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -8a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"
										/></svg
									>
									Incorrect key, unable to decrypt.
								</span>
							{:else if !content}
								<span class="text-lg">No content</span>
							{:else if trggr.type === 'text'}
								<strong>Text:</strong><br />
								<span class="quote">
									{stringContent}
								</span>
							{:else if trggr.type === 'image'}
								<strong>Image:</strong> <a href={stringContent} target="_blank" rel="nofollow noopener noreferrer">{content}</a><br />
								<img src={stringContent} alt="Content" />
							{:else if trggr.type === 'video'}
								<strong>Video:</strong> <a href={stringContent} target="_blank" rel="nofollow noopener noreferrer">{content}</a><br />
								<video src={stringContent} controls>
									<track kind="captions" src="" label="English" />
								</video>
							{:else if trggr.type === 'audio'}
								<strong>Audio:</strong> <a href={stringContent} target="_blank" rel="nofollow noopener noreferrer">{content}</a><br />
								<audio src={stringContent} controls>
									<track kind="captions" src="" label="English" />
								</audio>
							{:else if trggr.type === 'link'}
								<strong>Link:</strong><br />
								<a href={stringContent} target="_blank" rel="nofollow noopener noreferrer">{stringContent}</a>
							{:else}
								<strong>Content ({trggr.type}):</strong><br />
								{stringContent}
							{/if}
						{:else}
							<span class="text-lg">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="#0ebfd3"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="icon icon-tabler icons-tabler-outline icon-tabler-forms"
									><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
										d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3"
									/><path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" /><path
										d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7"
									/><path d="M5 7h-1a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h1" /><path
										d="M17 12h.01"
									/><path d="M13 12h.01" /></svg
								> Please enter the encryption key.
							</span>
						{/if}
					{/if}
				{/if}
			</p>

			<p>
				<strong>Created at:</strong>
				{new Date(trggr.createdAt ?? '').toLocaleString()}<br />
				{#if trggr.replacementOf}
					<strong>Replacement of:</strong>
					<a href={`/trggr/${trggr.replacementOf}${fragment}`}>{trggr.replacementOf}</a><br />
				{/if}
				{#if trggr.replacement}
					<strong>Replaced by:</strong>
					<a href={`/trggr/${trggr.replacement}${fragment}`}>{trggr.replacement}</a><br />
					<strong>Replaced at:</strong>
					{new Date(trggr.replacedAt ?? '').toLocaleString()}<br />
				{/if}
			</p>

			<strong>Markdown:</strong>
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<span
                class="text-sm pre copyable"
                on:click={(e) => copyToClipboard(e.target, showToast)}
                on:keypress={(e) => copyToClipboard(e.target, showToast)}
                role="code"
            >[tw: {trggr.classification}](https://trggr.link/trggr/{trggr.id}{includeKeyInLink ? fragment : ''})</span>
			<strong>HTML:</strong>
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<span
                class="text-sm pre copyable"
                on:click={(e) => copyToClipboard(e.target, showToast)}
                on:keypress={(e) => copyToClipboard(e.target, showToast)}
                role="code"
            >&lt;a href=&quot;https://trggr.link/trggr/{trggr.id}{includeKeyInLink ? fragment : ''}&quot;&gt;tw: {trggr.classification}&lt;/a&gt;</span>

            {#if trggr && trggr.encrypted}
				<div class="mt-4 mb-4">
					<label for="includeKey" class="flex items-center cursor-pointer">
						<div class="relative">
							<input type="checkbox" id="includeKey" class="sr-only" bind:checked={includeKeyInLink}>
							<div class="w-9 h-4 {includeKeyInLink ? 'bg-green-500' : 'bg-gray-300'} rounded-full shadow-inner"></div>
							<div class="dot absolute w-4 h-4 {includeKeyInLink ? 'bg-white right-1' : 'bg-red-500 left-1'} rounded-full shadow -top-0 transition"></div>
						</div>
						<div class="ml-3 text-gray-700 font-medium">
							Include encryption key in link
						</div>
					</label>
				</div>
			{/if}
		{:else if error}
			<p>Error loading trigger</p>
		{:else}
			<p>Loading...</p>
		{/if}
	</section>
</article>
