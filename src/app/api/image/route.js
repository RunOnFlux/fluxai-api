export async function POST(req) {
  try {
    const data = await req.json();
    const response = await fetch(
      `${process.env.FLUX_API_URL}/images/generations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.FLUX_API_KEY,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      console.log(response.status, response.statusText);
      throw new Error(
        `API request failed: ${response.status} - ${response.statusText}`,
      );
    }

    const imageData = await response.json();

    if (!imageData.data) {
      throw new Error("No image data received");
    }

    if (imageData.status === "error") {
      throw new Error("Error generating image");
    }

    return new Response(JSON.stringify(imageData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
