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
    </div>
  );
}
