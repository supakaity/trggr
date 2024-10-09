import { jwtVerify, SignJWT } from 'jose';

export interface JwtPayload {
    sub: string;
    id: string;
}

export const signJwt = async (id: string) => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = 'HS256'
    const jwt = await new SignJWT({
            sub: 'urn:trggr.link:user',
            id: id,
        })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('urn:trggr.link:issuer')
        .setAudience('urn:trggr.link:audience')
        .setExpirationTime('7d')
        .sign(secret);
    return jwt;
}

export const verifyJwt = async (jwt: string): Promise<JwtPayload> => {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(jwt, secret);
    return payload as unknown as JwtPayload;
}
