/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from '@/config/database';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';

connectDB();

export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json();
        const {token} = reqBody;
        if(!token){
            return NextResponse.json(
                {error:"Please provide token"},
                {status: 400}
            )
        }
        console.log(token);

        const user = await User.findOne({verifyToken:token, verifyTokenExpiry : {$gt:Date.now()}})

        if(!user){
            return NextResponse.json(
                {error:"User not found"},
                {status: 404}
            )
        }

        user.isVerfied = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json(
            {
                message:"User verified successfully",
                success:true
            },
            {status: 200}
        )

    } catch (error : any) {
        return NextResponse.json(
            {error:error.message},
            {status:500}
        )
    }
}