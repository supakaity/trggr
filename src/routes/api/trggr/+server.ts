import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { trggrs } from "$lib/server/db/schema";
import { smolId, verifyJwt } from "$lib/utils";
import { json, type RequestHandler } from "@sveltejs/kit";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

interface AddData {
    classification: string;
    warning: string;
    description: string;
    content: string;
    type: string;
    encrypted: boolean;
    replacementOf: string | null;
}

interface DeleteData {
    id: string;
}

interface GetData {
    id?: string;
}

export const PUT: RequestHandler = async ({ request, locals }) => {
    try {
        const userId = locals.userId;

        if (!userId) {
            return json({ error: 'User not logged in' }, { status: 400 });
        }

        // Add a trggr to the database
        const {
            classification,
            warning,
            description,
            content,
            type,
            encrypted,
            replacementOf
        }: AddData = await request.json();

        if (replacementOf) {
            const res = await db.select()
                .from(trggrs)
                .where(eq(trggrs.id, replacementOf))

            if (!res) {
                return json({
                    error: 'Replacement trggr not found',
                    id: replacementOf
                }, { status: 400 });
            }

            const oldTrggr = res.at(0);

            if (!oldTrggr) {
                return json({
                    error: 'Replacement trggr not returned',
                    id: replacementOf
                }, { status: 400 });
            }

            if (oldTrggr.userId !== userId) {
                return json({
                    error: 'You are not authorized to replace this trggr',
                    id: replacementOf
                }, { status: 400 });
            }
        }

        const newId = smolId();
        const newTrggr = await db.insert(trggrs).values({
            id: newId,
            userId,
            classification: classification,
            warning: warning,
            description: description,
            content: content,
            type: type,
            encrypted: encrypted,
            replacementOf: replacementOf ?? null,
        }).returning({ id: trggrs.id });

        const createdId = newTrggr.at(0)?.id;

        if (replacementOf && createdId) {
            db.update(trggrs).set({
                replacement: createdId,
                replacedAt: new Date(),
            }).where(eq(trggrs.id, replacementOf))
        }

        return json({
            message: 'Trggr added',
            id: createdId
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding trggr:', error);
        return json({ error: 'Error adding trggr' }, { status: 500 });
    }
}

export const DELETE: RequestHandler = async ({ request }) => {
    const jwt = request.headers.get('Authorization')?.split(' ')[1];

    if (!jwt) {
        return json({ error: 'No JWT provided' }, { status: 400 });
    }
    
    const {
        sub,
        id: userId,
    } = await verifyJwt(jwt);

    if (sub !== 'urn:trggr.link:user') {
        return json({ error: 'Invalid JWT' }, { status: 400 });
    }

    if (!userId) {
        return json({ error: 'Invalid JWT' }, { status: 400 });
    }

    const {
        id
    }: DeleteData = await request.json();

    const res = await db.select()
        .from(trggrs)
        .where(eq(trggrs.id, id))
    
    if (!res) {
        return json({ error: 'Trggr not found' }, { status: 400 });
    }

    const trggr = res.at(0);

    if (!trggr) {
        return json({ error: 'Trggr not found' }, { status: 400 });
    }

    if (trggr.userId !== userId) {
        return json({ error: 'You are not authorized to delete this trggr' }, { status: 400 });
    }

    db.update(trggrs).set({
        deletedAt: new Date(),
    }).where(eq(trggrs.id, id));

    return json({
        message: 'Trggr deleted',
    }, { status: 200 });
}

export const POST: RequestHandler = async ({ request }) => {
    const {
        id
    }: GetData = await request.json();

    if (id) {
        const trggrRes = await db.select()
            .from(trggrs)
            .where(eq(trggrs.id, id))
        
        if (!trggrRes) {
            return json({ error: 'Trggr not found' }, { status: 400 });
        }

        const trggr = trggrRes.at(0);

        if (!trggr) {
            return json({ error: 'Trggr not found' }, { status: 400 });
        }

        const userRes = await db.select()
            .from(users)
            .where(eq(users.id, trggr.userId!))  

        const user = userRes.at(0);
        if (!user) {
            return json({ error: 'Trggr user not found' }, { status: 400 });
        }

        const result = {
            trggr,
            user: {
                id: user.id,
                username: user.username,
            }
        }   

        return json(result, { status: 201 });
    }

    const jwt = request.headers.get('Authorization')?.split(' ')[1];

    if (!jwt) {
        return json({ error: 'No JWT provided' }, { status: 400 });
    }

    const {
        sub,
        id: userId,
    } = await verifyJwt(jwt);

    if (sub !== 'urn:trggr.link:user') {
        return json({ error: 'Invalid JWT' }, { status: 400 });
    }

    if (!userId) {
        return json({ error: 'Invalid JWT' }, { status: 400 });
    }

    const res = await db.select()
        .from(trggrs)
        .where(eq(trggrs.userId, userId))
        .orderBy(desc(trggrs.createdAt))
        .limit(20);

    return json({
        trggrs: res.map(trggr => ({
            id: trggr.id,
            classification: trggr.classification,
            warning: trggr.warning,
            description: trggr.description,
            encrypted: trggr.encrypted,
        }))
    }, { status: 200 });
}