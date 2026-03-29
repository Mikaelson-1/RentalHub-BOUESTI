/**
 * POST /api/auth/register
 *
 * Register a new user (STUDENT or LANDLORD).
 * Admins can only be created via the seed script or direct DB access.
 */

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import type { Role } from '@prisma/client';

interface RegisterBody {
  name:     string;
  email:    string;
  password: string;
  role?:    Role;
}

export async function POST(request: Request) {
  try {
    const body: RegisterBody = await request.json();
    const { name, email, password, role = 'STUDENT' } = body;

    // Validation
    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 },
      );
    }

    if (!['STUDENT', 'LANDLORD'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Choose STUDENT or LANDLORD.' },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters.' },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check uniqueness
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists.' },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name:  name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
        verificationStatus: 'UNVERIFIED',
      },
      select: {
        id:                 true,
        name:               true,
        email:              true,
        role:               true,
        verificationStatus: true,
        createdAt:          true,
      },
    });

    return NextResponse.json(
      { success: true, data: user, message: 'Account created successfully.' },
      { status: 201 },
    );
  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error. Please try again.' },
      { status: 500 },
    );
  }
}
