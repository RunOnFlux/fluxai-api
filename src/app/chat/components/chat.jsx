"use client";
import ChatBox from "./ChatBox";
import TokenBalance from "@/components/TokenBalance";
import { useState } from "react";

export default function Chat() {
  const [balanceKey, setBalanceKey] = useState(0);
  return (
    <section id="fluxgpt" className="w-full px-0 min-h-[900px] pt-[80px]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center pb-[80px] font-montserrat">
        <div className="col-xl-7 col-lg-10 col-md-10 col-sm-12 col-12 gap-5 flex flex-col justify-between px-0 lg:px-10">
          <div className="gap-4 px-3 flex w-full flex-col">
            <div className="gap-4 px-3 flex w-full flex-col">
              <h1 className="text-[50px] text-center sm:text-left font-bold md:text-[60px] xl:text-[85px]">
                Interact with <span className="text-red-500/80">FluxGPT</span>
              </h1>
              <h6 className="text-[20px] text-center sm:text-left font-medium leading-5 text-contentTextSecondary">
                Use FluxGPT to add AI to your projects using text based prompts.
              </h6>
            </div>
          </div>
        </div>
      </div>
      <TokenBalance balanceKey={balanceKey} />
      <div className="w-full">
        <ChatBox setBalanceKey={setBalanceKey} />
      </div>
    </section>
  );
}
