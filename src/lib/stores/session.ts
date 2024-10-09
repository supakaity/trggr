import { writable } from 'svelte/store';

interface User {
    userId: string;
    username: string;
    email: string;
}

interface SessionData {
    token: string | null;
    user: User | null;
}

function createSessionStore() {
    // Initialize the store with values from localStorage, if they exist
    const storedSession = typeof localStorage !== 'undefined' ? localStorage.getItem('session') : null;
    const initialSession: SessionData = storedSession ? JSON.parse(storedSession) : { token: null, user: null };

    const { subscribe, set, update } = writable<SessionData>(initialSession);

    return {
        subscribe,
        setSession: (token: string, user: User) => {
            const sessionData: SessionData = { token, user };
            localStorage.setItem('session', JSON.stringify(sessionData));
            set(sessionData);
        },
        clearSession: () => {
            localStorage.removeItem('session');
            set({ token: null, user: null });
        },
        updateUser: (userData: Partial<User>) => {
            update(session => {
                if (session.user) {
                    const updatedSession = { ...session, user: { ...session.user, ...userData } };
                    localStorage.setItem('session', JSON.stringify(updatedSession));
                    return updatedSession;
                }
                return session;
            });
        }
    };
}
export const session = createSessionStore();
