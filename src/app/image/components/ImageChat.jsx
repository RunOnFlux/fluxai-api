"use client";
import { useState } from "react";
import ImageBox from "./ImageBox";
import TokenBalance from "@/components/TokenBalance";

export default function ImageChat() {
  const [balanceKey, setBalanceKey] = useState(0);
  return (
    <section
      id="fluxone"
      className="container-fluid px-0 min-h-[900px] pt-[80px]"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center pb-[80px] font-montserrat">
        <div className="col-xl-7 col-lg-10 col-md-10 col-sm-12 col-12 gap-5 flex flex-col justify-between px-0 lg:px-10">
          <div className="gap-4 px-3 flex w-full flex-col justify-between">
            <div className="gap-4 px-3 flex w-full flex-col justify-between">
              <h1 className="text-[50px] text-center sm:text-left font-bold md:text-[60px] xl:text-[85px]">
                Interact with{" "}
                <span className="text-orange-500/80">FluxONE</span>
              </h1>
              <h6 className="text-[20px] text-center sm:text-left font-medium leading-5 text-contentTextSecondary">
                Generate AI generated images in seconds and display them in your
                projects.
              </h6>
            </div>
          </div>
        </div>
      </div>
      <TokenBalance balanceKey={balanceKey} />
      <div className="w-full flex-col">
        <ImageBox setBalanceKey={setBalanceKey} />
      </div>
    </section>
  );
}
