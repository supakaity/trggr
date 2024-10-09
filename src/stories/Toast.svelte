<script lang="ts">
	import './toast.css';

	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';

	const toastStore = writable({ message: '', type: '', visible: false });
    export let data: {
        error?: string;
        message?: string;
    } | null = null;

	function showToast(message: string, type = 'info', duration = 3000) {
		toastStore.set({ message, type, visible: true });
		setTimeout(() => {
			toastStore.set({ message: '', type: '', visible: false });
		}, duration);
	}

	$: if (data && data.error) {
		showToast(data.error, 'error');
	}

	$: if (data && data.message) {
		showToast(data.message, 'success');
	}
</script>

{#if $toastStore.visible}
	<div class="toast-container" transition:fade={{ duration: 300 }}>
		<div class="toast {$toastStore.type}">
			{$toastStore.message}
		</div>
	</div>
{/if}
