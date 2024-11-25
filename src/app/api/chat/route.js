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

  getBalance();

  // Set up streaming response headers
  const customReadable = new ReadableStream({
    async start(controller) {
      console.log("Starting stream");
      try {
        const response = await fetch(
          `${process.env.FLUX_API_URL}/chat/completions/stream`,
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
          const errorMessage = {
            error: true,
            status: response.status,
            message: response.statusText || "An error occurred",
          };

          // Handle specific status codes
          if (response.status === 403) {
            errorMessage.message =
              "Authentication failed. Please check your API key.";
          }

          console.error("API Error:", errorMessage);
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify(errorMessage)}\n\n`,
            ),
          );
          controller.close();
          return;
        }

        const reader = response.body.getReader();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            controller.enqueue(value);
          }
          controller.close();
          console.log("Stream closed");
        } catch (error) {
          console.error("Error during stream:", error);
          controller.error(error);
        }
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(customReadable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
