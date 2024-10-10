<script lang="ts">
  import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import Password from './Password.svelte';

  const dispatch = createEventDispatcher();

  let username: string = '';
  let email: string = '';
  let password: string = '';

  function handleSubmit() {
    if (password) {
      dispatch('createAccount', { username, email, password });
    } else {
      alert("Passwords don't match");
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
    <input
      type="text"
      id="username"
      bind:value={username}
      required
      class="mt-1 px-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />
  </div>
  <div>
    <label for="email" class="block text-sm font-medium text-gray-700">Email (optional)</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      class="mt-1 px-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />
    <span class="text-xs leading-none text-gray-500">* only to recover account, we won't send any emails.</span>
  </div>
  <div>
    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
    <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mt-1 px-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />
  </div>

  <Button
    label="Create Account"
    primary
    size="large"
    on:click={handleSubmit}
  />
</form>