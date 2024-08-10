import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "CryptoVault",
  description: "A simple web based wallet",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="w-full h-[100vh] grid_background_dark">
          <Navbar />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
