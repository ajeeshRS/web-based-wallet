'use client'
import { useState } from "react";
import QRCode from "react-qr-code";


interface showQrcodeProps {
    address: string,
    onClose: () => void
}

export default function ShowQrCode({ address, onClose }: showQrcodeProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181818] bg-opacity-50">
            <div className="relative w-5/6 h-fit rounded-lg p-8 shadow-lg bg-[#181818] sm:w-2/3 md:w-1/3 flex justify-center items-center flex-col">
                <button
                    className="absolute top-2 right-2 flex justify-center items-center text-white  hover:bg-gray-800 rounded-lg px-2 py-1"
                    onClick={onClose}
                >
                    &times;
                </button>
                <p className="py-4">Ethereum Address</p>
                <QRCode className="w-40 h-40 rounded-lg" value={address} />
            </div>
        </div>);
}