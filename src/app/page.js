export default function Home() {
  return (
    <div className="w-full max-w-screen-lg mx-auto items-center p-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold  mb-14">
          Leverage the power of FluxAI in your projects!
        </h1>
      </div>
      <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center h-full">
        <div className="flex flex-col items-center justify-between border rounded-lg p-10 h-full">
          <a
            href="/chat"
            className="flex flex-col w-full max-w-[500px] justify-center items-center gap-4"
          >
            <span className="text-2xl sm:text-4xl text-red-500/80 font-semibold">
              FluxGPT
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            <p className="text-sm sm:text-lg  text-center break-words">
              Chat with the most advanced AI Models, with optional document
              references.
            </p>
          </a>
        </div>
        <div className="flex flex-col items-center justify-between border rounded-lg p-10 h-full">
          <a
            href="/image"
            className="flex flex-col w-full max-w-[500px] justify-center items-center gap-4"
          >
            <span className="text-2xl sm:text-4xl text-orange-500/80 font-semibold">
              FluxONE
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <p className="text-sm sm:text-lg  text-center break-words">
              Create AI generated images in seconds.
            </p>
          </a>
        </div>
      </div>

      {/* Combined API and GitHub Section */}
      <div className="mt-14 text-center">
        <div className="inline-block border rounded-lg p-6">
          <div className="flex flex-col items-center gap-8">
            <a
              href="https://ai.runonflux.com/api/home"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center w-full max-w-[500px]"
            >
              <span className="text-2xl sm:text-3xl text-blue-500/80 font-semibold mb-3 block">
                Try FluxAI API
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12 mx-auto mb-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                />
              </svg>
              <p className="w-[80%] text-sm sm:text-lg">
                Sign up now and get $1 in free API credits!
              </p>
            </a>

            <div className="w-3/4 h-px bg-gray-200"></div>

            <a
              href="https://github.com/RunOnFlux/fluxai-api"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center w-full max-w-[500px]"
            >
              <span className="text-2xl sm:text-3xl text-green-500/80 font-semibold mb-3 block">
                Components
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-12 h-12 mx-auto mb-3"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <p className="w-[80%] text-sm sm:text-lg">
                Check out our open source components on GitHub
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
