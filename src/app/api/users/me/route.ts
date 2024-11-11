/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from '@/config/database';
import User from '@/models/user.model';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/utils/getDataFromToken';

connectDB();

export async function POST(request : NextRequest){
    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id:userId}).select("-password");
        if(!user){
           return NextResponse.json(
                {error:"User not found"},
                {status:404}
            ) 
        }

        return NextResponse.json(
            {
                message:"User found successfully",
                success:true,
                data:user
            },
            {status:200}
        )

    } catch (error: any) {
        return NextResponse.json(
            {error:error.message},
            {status:500}
        )
    }
}