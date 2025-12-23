import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// User credentials
// rodrigo's access expires 5 days from first deployment
const RODRIGO_EXPIRY = new Date('2025-12-28T23:59:59Z').getTime(); // 5 days from Dec 23, 2025

const USERS: Record<string, { password: string; expiry?: number }> = {
  pablo: {
    password: '79454772',
  },
  rodrigo: {
    password: 'p1nhso%98las',
    expiry: RODRIGO_EXPIRY,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Check if user exists
    const user = USERS[username.toLowerCase()];

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Contrasena incorrecta' },
        { status: 401 }
      );
    }

    // Check if access has expired (for rodrigo)
    if (user.expiry && Date.now() > user.expiry) {
      return NextResponse.json(
        { error: 'Tu acceso ha expirado. Contacta al administrador.' },
        { status: 403 }
      );
    }

    // Create session token (simple base64 encoding for this use case)
    const sessionData = {
      username: username.toLowerCase(),
      loginTime: Date.now(),
      expiry: user.expiry || null,
    };

    const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Login exitoso',
      username: username.toLowerCase(),
    });

  } catch {
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}
