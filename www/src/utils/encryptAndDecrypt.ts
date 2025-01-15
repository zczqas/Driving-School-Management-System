import * as jose from 'jose';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || "default_secret";

interface EncryptOptions {
    expirationTime?: string;
}

export async function encrypt<T>(
    data: T,
    options: EncryptOptions = {}
): Promise<string> {
    const { expirationTime = '24h' } = options;
    console.log("JWT_SECRET", JWT_SECRET);
    console.log("data inside utils", data);

    const token = await new jose.SignJWT({ data })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expirationTime)
        .setIssuedAt()
        .sign(new TextEncoder().encode(JWT_SECRET));

    return token;
}

export async function decrypt<T>(token: string): Promise<T> {
    try {
        console.log("token", token);
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        console.log("payload", payload);
        return payload.data as T;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

// Example usage:
// interface UserData {
//   id: number;
//   name: string;
// }
// 
// const encryptedData = await encrypt<UserData>({ id: 1, name: 'John' });
// const decryptedData = await decrypt<UserData>(encryptedData);
