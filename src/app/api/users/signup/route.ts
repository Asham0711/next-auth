/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from '@/config/database';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/utils/mailer';

connectDB();

export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, email, password} = reqBody;
        if(!username || !email || !password){
            return NextResponse.json({
                error:'All fields are required',
                status: 401
            })
        }

        const user = await User.findOne({email});
        if(user){
            return NextResponse.json({
                error:'User Already Exists',
                status: 400
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            email,
            username,
            password:hashedPassword
        });

        const savedUser = await newUser.save();
        await sendEmail({email, emailType:'VERIFY', userId: savedUser._id});

        return NextResponse.json({
            success: true,
            message:'User successfully registered',
            savedUser,
            status:200
        })

    } catch (error: any) {
        return NextResponse.json({
            message:'Error while signing in',
            error: error.message,
            status: 500
        })
    }
}