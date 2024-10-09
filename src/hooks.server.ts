import { verifyJwt } from '$lib/utils';
import type { Handle } from '@sveltejs/kit';
import { session } from '$lib/stores/session';

export const handle: Handle = async ({ event, resolve }) => {    
    const token =
        event.cookies.get('token') ||
        event.request.headers.get('Authorization')?.split(' ')[1] ||
        session.token;

    console.log('token', token);

    if (token) {
        const decodedToken = await verifyJwt(token)
        if (decodedToken &&
            decodedToken.sub === 'urn:trggr.link:user' &&
            decodedToken.id
        ) {
            event.locals.userId = decodedToken.id
        }
    }
    return await resolve(event);
};