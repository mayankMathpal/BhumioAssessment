import { NextResponse } from 'next/server';

export async function POST(request) {
  // Simulate delay
  const delay = Math.random() < 0.2 ? 3000 : 1000;
  await new Promise(resolve => setTimeout(resolve, delay));

  const outcome = Math.random();
  // randomize mock api message
  // 40% chance of Success (200) 
  if (outcome < 0.4) {
    return NextResponse.json({ message: "Success" }, { status: 200 });
  }
  // 40% chance of 503
  if (outcome < 0.8) {
    return NextResponse.json({ message: "Server Busy" }, { status: 503 });
  }
    // 20% chance of error 500
  return NextResponse.json({ message: "Server Error" }, { status: 500 });
}