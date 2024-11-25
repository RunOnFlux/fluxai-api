"use client";
import ChatBot from "./ChatBot";

export default function Chat() {
  return (
    <section id="fluxasset" className="w-full px-0 min-h-[900px] pt-[98px]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center pb-[100px] font-montserrat">
        <div className="col-xl-7 col-lg-10 col-md-10 col-sm-12 col-12 gap-5 flex flex-col justify-between px-0 lg:px-10">
          <div className="gap-4 px-3 flex w-full flex-col justify-between">
            <div className="gap-4 px-3 flex w-full flex-col justify-between">
              <h1 className="text-[50px] font-bold text-contentText md:text-[60px] xl:text-[85px]">
                Interact with <span className="text-fluxBlue">FluxAI</span>
              </h1>
              <h6 className="text-[20px] font-medium leading-5 text-contentTextSecondary">
                Use FluxGPT to add AI to your projects using text based prompts.
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] mx-auto flex justify-center">
        <ChatBot />
      </div>
    </section>
  );
}
