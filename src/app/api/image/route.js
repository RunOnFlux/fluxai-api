export async function POST(req) {
  const data = await req.json();

  const getBalance = async () => {
    try {
      const response = await fetch(`${process.env.FLUX_API_URL}/balance`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": process.env.FLUX_API_KEY,
        },
      });
      if (response.ok) {
        console.log(await response.json());
      } else {
        console.log(response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const customReadable = new ReadableStream({
    async start(controller) {
      try {
        const response = await fetch(
          `${process.env.FLUX_API_URL}/chat/images`,
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

        const reader = response.body.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          controller.enqueue(value);
        }
        controller.close();
      } catch (error) {
        const errorMessage = `data: ${JSON.stringify({
          error: true,
          message: error.message || "An unexpected error occurred",
        })}\n\n`;
        console.error("Error during stream:", error);
        controller.enqueue(new TextEncoder().encode(errorMessage));
        controller.close();
      }
    },
  });

  getBalance();

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
