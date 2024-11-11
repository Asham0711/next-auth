/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from '@/config/database';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

connectDB();

export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json();
        const {email, password} = reqBody;
        if(!email || !password){
            return NextResponse.json(
                {error:"All fields are required"},
                {status: 401}
            )
        }

        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json(
                {error:"User not found"},
                {status: 404}
            )
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json(
                {error:"Please check your password"},
                {status: 400}
            )
        }

        const payload = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        const token = await jwt.sign(
            payload,
            process.env.TOKEN_SECRET!,
            {expiresIn: '2d'}
        )

        const response = NextResponse.json(
            {
                message:"User logged in successfully",
                success: true
            },
            {status: 200}
        )

        response.cookies.set("token", token, {
            httpOnly: true
        });

        return response;

    } catch (error: any) {
        return NextResponse.json(
            {error:error.message},
            {status:500}
        )
    }
}