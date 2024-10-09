import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { signJwt } from "$lib/utils";

export const POST: RequestHandler = async ({ request }) => {
    const { email, password }: { email: string, password: string } = await request.json();

    const res = await db.select()
        .from(users)
        .where(eq(users.email, email))
    
    if (!res) {
        return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const user = res.at(0)

    if (!user) {
        return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const token = await signJwt(user.id);

    return json({
        message: 'User logged in successfully',
        userId: user.id,
        username: user.username,
        token
    }, { status: 201 });
}
