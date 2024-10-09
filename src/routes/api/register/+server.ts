import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { smolId, signJwt } from '$lib/utils';

interface RegistrationData {
    username: string;
    email: string;
    password: string;
}

export const POST: RequestHandler = async ({ request }) => {
    const { username, email, password }: RegistrationData = await request.json();

    try {
        // Check if user already exists
        const existingUsers = await db.select()
            .from(users)
            .where(or(eq(users.username, username), eq(users.email, email)));

        if (existingUsers.length > 0) {
            const hasUsername = existingUsers.some(user => user.username === username);
            const hasEmail = existingUsers.some(user => user.email === email);

            if (hasUsername && hasEmail) {
                return json({ error: 'Username and email already exist' }, { status: 400 });
            }

            if (hasUsername) {
                return json({ error: 'Username already exists' }, { status: 400 });
            }

            if (hasEmail) {
                return json({ error: 'Email already exists' }, { status: 400 });
            }

            return json({ error: 'Existing user check failed' }, { status: 400 });
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user in database
        const newUserDetails = {
            id: smolId(),
            username,
            email,
            password: hashedPassword,
        };

        console.warn("Creating new user in database", newUserDetails);
        const [newUser] = await db.insert(users)
            .values(newUserDetails)
            .returning({ id: users.id });

        const token = await signJwt(newUser.id);

        return json({
            message: 'User registered successfully',
            userId: newUser.id,
            username: username,
            token
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return json({ error: 'Error registering user' }, { status: 500 });
    }
};
