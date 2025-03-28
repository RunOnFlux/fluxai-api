export async function POST(req) {
  const data = await req.json();
  const signal = req.signal; // Get the abort signal from the request

  // Set up streaming response headers
  const customReadable = new ReadableStream({
    async start(controller) {
      console.log("Starting stream");
      let isClosed = false;

      const closeController = () => {
        if (!isClosed) {
          isClosed = true;
          controller.close();
        }
      };

      try {
        const response = await fetch(
          `${process.env.FLUX_API_URL}/interactive-search`,
          //`${process.env.FLUX_API_URL}/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-KEY": process.env.FLUX_API_KEY,
            },
            body: JSON.stringify(data),
            signal, // Pass the abort signal to the upstream request
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
            new TextEncoder().encode(`${JSON.stringify(errorMessage)}\n\n`),
          );
          closeController();
          return;
        }

        const reader = response.body.getReader();

        // Handle abort signal
        signal?.addEventListener("abort", () => {
          console.log("Request aborted");
          reader.cancel();
          closeController();
        });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            //console.log("Value:", new TextDecoder().decode(value));
            controller.enqueue(value);
          }
          closeController();
          console.log("Stream closed");
        } catch (error) {
          console.error("Error during stream:", error);
          controller.error(error);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
          closeController();
        } else {
          controller.error(error);
        }
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
