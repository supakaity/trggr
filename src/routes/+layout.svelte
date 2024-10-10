<script lang="ts">
	import '../app.css';
	import './page.css';

	import Header from '../stories/Header.svelte';
	import Login from '../stories/Login.svelte';
	import Toast from '../stories/Toast.svelte';
	import Register from '../stories/Register.svelte';
	
	import { session } from '$lib/stores/session';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import Button from '../stories/Button.svelte';
	import { goto } from '$app/navigation';

	let showLoginModal = false;
	let showCreateAccountModal = false;

	const toastStore = writable<{error?: string; message?: string} | null>(null);

	function showToast(data: {error?: string; message?: string}) {
		toastStore.set(data);
		setTimeout(() => toastStore.set(null), 3000); // Hide toast after 3 seconds
	}

	setContext('showToast', showToast);

	// Replace the existing toastData variable with a subscription to the store
	let toastData: {error?: string; message?: string} | null;
	toastStore.subscribe(value => {
		toastData = value;
	});

	$: isLoggedIn = $session.token !== null;

	function openLoginModal() {
		showLoginModal = true;
		showCreateAccountModal = false;
	}

	function closeLoginModal() {
		showLoginModal = false;
	}

	setContext('openLoginModal', openLoginModal);
  
	function openRegisterModal() {
		showLoginModal = false;
		showCreateAccountModal = true;
	}

	function closeRegisterModal() {
		showCreateAccountModal = false;
	}
  
	async function handleLogin(event: CustomEvent) {
		// Handle login logic here
		console.log('Login attempt:', event.detail);
		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				login: event.detail.login,
				password: event.detail.password
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Login data:', data);

			if (data.error) {
				showToast({ error: data.error });
			} else if (data.message) {
				showToast({ message: data.message });
			}

			closeLoginModal();
			session.setSession(data.token, {
				userId: data.userId,
				username: data.username,
				email: data.email
			});
		} else {
			console.log('Failed login response:', response);
			showToast({ error: 'Error logging in' });
		}
	}
  
	async function handleRegister(event: CustomEvent) {
		// Handle account creation logic here
		console.log('Register attempt:', event.detail);
		const response = await fetch('/api/register', {
			method: 'POST',
			body: JSON.stringify({
				username: event.detail.username,
				email: event.detail.email,
				password: event.detail.password
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log('Register data:', data);

			if (data.error) {
				showToast({ error: data.error });
			} else if (data.message) {
				showToast({ message: data.message });
			}

			closeRegisterModal();
			session.setSession(data.token, {
				userId: data.userId,
				username: data.username,
				email: data.email
			});
		} else {
			console.log('Failed create account response:', response);
			showToast({ error: 'Error creating account' });
		}
	}
    
	function handleKeydown(event: KeyboardEvent, action: () => void, unaction: () => void) {
		if (event.key === 'Enter' || event.key === ' ') {
			action();
		}
		if (event.key === 'Escape') {
			unaction();
		}
	}
</script>

<Header
	on:login={openLoginModal}
	on:logout={() => session.clearSession()}
	on:register={openRegisterModal}
	on:trggrs={() => goto('/trggrs')}
	on:profile={() => goto('/profile')}
/>

<slot></slot>

{#if showLoginModal}
	<div class="modal-backdrop" on:click={closeLoginModal} on:keydown={(event) => handleKeydown(event, closeLoginModal, closeLoginModal)} tabindex="0" role="button"></div>
	<div class="modal">
	<button class="close-button" on:click={closeLoginModal}>&times;</button>
	<Login on:login={handleLogin} />
	<Button label="…or, create an account" size="text" on:click={openRegisterModal} />
	</div>
{/if}

{#if showCreateAccountModal}
	<div class="modal-backdrop" on:click={closeRegisterModal} on:keydown={(event) => handleKeydown(event, closeRegisterModal, closeRegisterModal)} tabindex="0" role="button"></div>
	<div class="modal">      
	<button class="close-button" on:click={closeRegisterModal}>&times;</button>
	<Register on:createAccount={handleRegister} />
	<Button label="…or, login" size="text" on:click={openLoginModal} />
	</div>
{/if}

<Toast data={toastData} />

<footer>
	<p>
		Brought to you by
		<a href="https://blahaj.zone">
			<img class="icon" src="/shonky-solid.svg" alt="Shonky" />
			Blåhaj Zone
		</a>
		<span>|</span>
		Source at
		<a href="https://github.com/supakaity/trggr">
			<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-github"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" /></svg>
			GitHub
		</a>
		<span>|</span>
		Support on
		<a href="https://matrix.to/#/@trggr:chat.blahaj.zone">
			<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-matrix"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 3h-1v18h1" /><path d="M20 21h1v-18h-1" /><path d="M7 9v6" /><path d="M12 15v-3.5a2.5 2.5 0 1 0 -5 0v.5" /><path d="M17 15v-3.5a2.5 2.5 0 1 0 -5 0v.5" /></svg>
			Matrix
		</a>
	</p>
</footer>
