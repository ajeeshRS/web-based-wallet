"use client"

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {

    interface walletDetails {
        publicKey: string,
        address: string,
        path: string,
    }
    const [wallets, setWallets] = useState<walletDetails[] | null>(null)

    const handleCopy = (text: string) => {
        window.navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard")
        }).catch(() => {
            toast.error("Failed to copy")
        })

    }

    useEffect(() => {
        const data = localStorage.getItem('data')
        if (data) {
            setWallets(JSON.parse(data))
        }
    }, [])
    return (
        <div className="w-full md:h-[80vh] h-[90vh] flex justify-center py-5">
            <div className="md:w-4/6 w-5/6 h-6/6 bg-[#111111] rounded-lg md:p-4 p-3 cursor-pointer">
                {
                    wallets?.map((wallet, index) => (
                        <div className="md:py-0 py-4 px-1 md:px-4 my-2" key={index}>
                            <p className="text-white font-semibold text-lg md:text-xl py-2">Wallet {index + 1}</p>
                            <div className="w-full flex flex-col mb-2">
                                <p className="text-[#747474] text-xs md:text-sm">Address</p>
                                <p className="text-white text-xs md:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                    {wallet?.address}
                                </p>
                            </div>
                            <div className="w-full flex flex-col">
                                <p className="text-[#747474] text-xs md:text-sm">Public key</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-white text-xs md:text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                        {wallet?.publicKey}
                                    </p>
                                    <button onClick={() => handleCopy(wallet.publicKey)} className="text-xs text-white mx-1 p-1 hover:bg-[#575757] rounded-lg transition duration-200 ease-in-out ">copy</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    );
}