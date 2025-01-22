import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");

    const serverFormData = new FormData();
    files.forEach((file) => {
      serverFormData.append("files", file);
    });

    const response = await fetch(`${process.env.FLUX_API_URL}/files`, {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.FLUX_API_KEY,
      },
      body: serverFormData,
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
    console.error("Error processing files:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  const response = await fetch(`${process.env.FLUX_API_URL}/files`);
  const data = await response.json();
  return NextResponse.json(data);
}
