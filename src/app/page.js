export default function Home() {
  return (
    <div className="w-full max-w-screen-lg mx-auto items-center p-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-14">
          Leverage the power of FluxAI in your projects!
        </h1>
      </div>
      <div className="w-full max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center h-full">
        <div className="flex flex-col items-center justify-between border border-gray-200 rounded-lg p-10 h-full">
          <div className="flex flex-col min-w-[280px] max-w-[500px] justify-center items-center gap-4">
            <a href="/chat" className="text-4xl text-red-500/80 font-bold">
              FluxGPT
            </a>
            <p className="text-lg text-center break-words">
              Chat with the most advanced AI Models.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between border border-gray-200 rounded-lg p-10 h-full">
          <div className="flex flex-col min-w-[280px] max-w-[500px] justify-center items-center gap-4">
            <a href="/image" className="text-4xl text-orange-500/80 font-bold">
              FluxONE
            </a>
            <p className="text-lg text-center break-words">
              Create AI generated images in seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
