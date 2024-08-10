'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {

    interface walletDetails {
        publicKey: string,
        address: string,
        path: string,
    }

    interface data {
        mnemonic: string,
        wallets: walletDetails[]
    }

    const [data, setData] = useState<data | null>(null)
    const [phrases, setPhrases] = useState<string[]>([])
    const router = useRouter()

    const handleCopy = (text: string) => {
        window.navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard")
        }).catch(() => {
            toast.error("Failed to copy")
        })

    }

    const handleClick = () => {
        const text = phrases.join(" ")
        handleCopy(text)
    }

    const handleNextBtn = () => {
        const wallets = data?.wallets

        if (wallets) {
            localStorage.setItem("data", JSON.stringify(wallets))
        }
        router.push("/wallet")

    }

    useEffect(() => {
        const details = localStorage.getItem("data")
        if (details) {
            const parsedData = JSON.parse(details) as data
            if (!parsedData.mnemonic) {
                router.push("/")
            }
            setData(JSON.parse(details))
        }
    }, [router])

    useEffect(() => {
        if (data?.mnemonic) {
            const array: string[] = data.mnemonic.split(" ")
            setPhrases(array)
        }
    }, [data])

    return (
        <div className="w-full h-[100vh] flex justify-center items-center">
            <div className="flex flex-col justify-center items-center">
                <p className="text-white text-4xl font-bold">Secret Phrases</p>
                <p className="text-white text-sm py-4">save these phrases somewhere safe</p>
                <div onClick={handleClick} className="w-full bg-[#111111] rounded-lg p-10 md:mx-0 mx-4 grid md:grid-cols-4 grid-cols-2 md:gap-12 gap-8 cursor-pointer">
                    {
                        phrases.map((phrase, index) => (
                            <p key={index} className="text-[#ffffff]"><span className="text-[#888] mr-3">{index + 1}</span>    {phrase}</p>
                        ))
                    }
                </div>
                <p className="text-[#636262] py-2 my-3 font-semibold ">Note: Click anywhere in the card to copy</p>
                <button onClick={handleNextBtn} className="text-white bg-blue-600 px-8 py-2 my-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out">
                    Next
                </button>
            </div>
        </div>
    );
}