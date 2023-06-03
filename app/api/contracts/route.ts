import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    const data = await request.json();

    // deploy

    // contract


    console.log(data)
    return NextResponse.json({data});
}