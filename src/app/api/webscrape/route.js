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

        if (data.messages) {
            const lastMessage = data.messages[data.messages.length - 1];
            if (lastMessage.content.includes("https://")) {
                const urlPattern = /(https?:\/\/[^\s]+)/;
                const match = lastMessage.content.match(urlPattern);
                data.url = match ? match[0] : lastMessage.content;
            }
        }

        const newData = {
            messages: data.messages,
            url: data.url,
            stream: true,
            model: data.model,
        }
  
        try {
          const response = await fetch(
            `${process.env.FLUX_API_URL}/chat/webscrape`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": process.env.FLUX_API_KEY,
              },
              body: JSON.stringify(newData),
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
  