import { NextResponse } from "next/server";

// eslint-disable-next-line no-unused-vars
export async function GET(req) {
  try {
    const response = await fetch(`${process.env.FLUX_API_URL}/balance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.FLUX_API_KEY,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: response.statusText },
        { status: response.status },
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
