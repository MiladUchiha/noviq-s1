import { registerUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, email, password, idea } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Register user using the existing auth function
    const result = await registerUser({ name, email, password, idea });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Return success with user data (excluding password)
    return NextResponse.json({ 
      success: true, 
      data: {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email
      } 
    });
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error during registration' },
      { status: 500 }
    );
  }
} 