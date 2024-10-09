<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../stories/Button.svelte';

	import { session } from '$lib/stores/session';
	import { getContext } from 'svelte';

	const openLoginModal = getContext<VoidFunction>('openLoginModal');

	$: isLoggedIn = $session.user !== null;

</script>

<article>
	<section class="page">
		<h2>https://trggr.link</h2>
		<p>
			trggr.link is a platform for creating and sharing content that requires content/trigger
			warnings or spoilers.
		</p>
		<p>
			Many platforms don't have a way to warn readers about content that may be triggering or
			spoilers for some readers. trggr.link is designed to fill this gap.
		</p>
		<p>
			We believe that everyone should be able to enjoy content without having to worry about
			triggering content.
		</p>
		<p>
			It is not permissable to use trggr.link to harass, bully, promote or glorify harm or violence,
			or to post illegal content. We reserve the right to remove any content that is deemed to be in
			violation of this policy.
		</p>

        <Button
            label="Create Trggr"
            primary
            size="large"
            on:click={() => {
				if (isLoggedIn) {
					goto('/create');
				} else {
					openLoginModal();
				}
            }}
        />
	</section>
</article>
