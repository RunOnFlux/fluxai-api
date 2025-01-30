import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
    const tags = formData.getAll("tags");

    const serverFormData = new FormData();
    files.forEach((file) => {
      serverFormData.append("files", file);
    });

    if (tags.length > 0) {
      serverFormData.append("tags", tags);
    }

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
  const response = await fetch(`${process.env.FLUX_API_URL}/files`, {
    headers: {
      "X-API-KEY": process.env.FLUX_API_KEY,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return NextResponse.json(data?.data);
  } else {
    return NextResponse.json(
      { error: response.statusText },
      { status: response.status },
    );
  }
}

