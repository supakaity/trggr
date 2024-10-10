<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';

	const dispatch = createEventDispatcher();

  let login: string = '';
  let password: string = '';

  function handleSubmit() {
    console.log('login form submitted', { login, password });
    dispatch('login', { login, password });
  }
</script>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="login" class="block text-sm font-medium text-gray-700">Username (or email)</label>
      <input
        type="email"
        id="login"
        bind:value={login}
        required
        class="mt-1 px-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
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
      label="Log in"
      primary
      size="large"
      on:click={handleSubmit}
    />
  </form>