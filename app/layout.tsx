import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/Navbar/NavBar";

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
          <NavBar />
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
