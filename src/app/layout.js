import { Montserrat, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "FluxAI API Demo",
  description: "Explore using the FluxAI API with this demo app.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${montserrat.variable} ${inter.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
