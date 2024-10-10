"use server";

import { redirect } from 'next/navigation';
import { createUser } from '@/lib/user';
import { hashUserPassword } from '@/lib/hash';
import { createAuthSession } from '@/lib/auth';

export async function signup(prevState, formData) {
    const email = formData.get('email');
    const password = formData.get('password'); 

    let errors = {};

    if(!email.includes('@')) {
        errors.email = 'Please enter a valid email address';
    }
    
    if(password.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters long';
    }
    
    if(Object.keys(errors).length > 0) {
        return { errors };
    }

    if(Object.keys(errors).length){
        return { errors };
    }

    // store in the database (create a new user)
    const hashedPassword = hashUserPassword(password);
    try {
        const id = createUser(email, hashedPassword);
        createAuthSession(id)
        redirect('/training');
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return {
                errors: { 
                    email: 'Email already exists'
                }
            };
        }
        throw error;
    }
}