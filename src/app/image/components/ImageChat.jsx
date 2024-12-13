"use client";
import { useState } from "react";
import ImageBox from "./ImageBox";
import TokenBalance from "@/components/TokenBalance";

export default function ImageChat() {
  const [balanceKey, setBalanceKey] = useState(0);
  return (
    <section
      id="fluxone"
      className="flex flex-col w-full min-h-[calc(100vh-100px)]"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center pt-[50px] font-montserrat">
        <div className="col-xl-7 col-lg-10 col-md-10 col-sm-12 col-12 gap-5 flex flex-col justify-between px-0 lg:px-10">
          <div className="px-3 flex w-full flex-col justify-between">
            <h1 className="text-[50px] mx-auto text-center sm:text-left font-bold md:text-[60px]">
              <span className="text-orange-500/80">FluxONE</span>
            </h1>
            <p className="text-center sm:text-left text-lg">
              Create AI generated images in seconds and display them in your
              projects.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <TokenBalance balanceKey={balanceKey} />
        <ImageBox setBalanceKey={setBalanceKey} />
      </div>
    </section>
  );
}
