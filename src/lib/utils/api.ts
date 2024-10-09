import { session } from '$lib/stores/session';
import { get } from 'svelte/store';

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const token = get(session).token;
    console.log('authfetch token', token);

    if (!token) {
        throw new Error('Not logged in');
    }

    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    return fetch(url, { method: 'POST', ...options, headers });
}

export async function anonFetch(url: string, options: RequestInit = {}) {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');

    return fetch(url, { method: 'POST', ...options, headers });
}
