import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { signJwt } from "$lib/utils";
import { or } from "drizzle-orm";

export const POST: RequestHandler = async ({ request }) => {
    const { login, password }: { login: string, password: string } = await request.json();

    const res = await db.select()
        .from(users)
        .where(
            or(
                eq(users.email, login), 
                eq(users.username, login)
            )
        )
    
    if (!res) {
        return json({ error: 'Invalid login or password' }, { status: 401 });
    }

    const user = res.at(0)

    if (!user) {
        return json({ error: 'Invalid login or password' }, { status: 402 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return json({ error: 'Invalid login or password' }, { status: 403 });
    }

    const token = await signJwt(user.id);

    return json({
        message: 'User logged in successfully',
        userId: user.id,
        username: user.username,
        email: user.email,
        token
    }, { status: 201 });
}
