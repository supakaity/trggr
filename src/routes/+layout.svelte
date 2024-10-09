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
				email: event.detail.email,
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
				email: event.detail.email
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
				email: event.detail.email
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

<style>
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 100;
}

.modal {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: white;
	padding: 2rem;
	border-radius: 0.5rem;
	z-index: 101;
	max-width: 90%;
	width: 400px;
}

.close-button {
	position: absolute;
	top: 0.5rem;
	right: 1rem;
	font-size: 1.5rem;
	background: none;
	border: none;
	cursor: pointer;
}
</style>
