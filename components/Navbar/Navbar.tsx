'use client'
import Image from "next/image";
import { useState } from "react";
export default function Navbar() {

    return (
        <nav className="w-full h-[10vh] flex justify-start items-center md:px-20 px-10 text-white ">
            <p className="font-extrabold text-lg text-white">
                CryptoVault.
            </p>
        </nav>
    );
}