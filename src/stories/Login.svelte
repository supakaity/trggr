<script lang="ts">
    import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
  
    const dispatch = createEventDispatcher();
  
    let email: string = '';
    let password: string = '';
  
    function handleSubmit() {
      console.log('login form submitted', { email, password });
      dispatch('login', { email, password });
    }
  </script>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
    </div>
    
    <Button
      label="Log in"
      primary
      size="large"
      on:click={handleSubmit}
    />
  </form>