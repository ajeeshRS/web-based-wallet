"use client"

import Loader from "@/components/Loader";
import { mnemonicToSeedSync } from "bip39";
import { HDNodeWallet } from "ethers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Page() {

    interface walletDetails {
        publicKey: string,
        address: string,
        path: string,
        privateKey: string
    }

    interface Data {
        mnemonic: string,
        wallets: walletDetails[]
    }

    const router = useRouter()

    const [wallets, setWallets] = useState<walletDetails[]>([])
    const [mnemonic, setMnemonic] = useState<string>("")
    const [lsData, setLsData] = useState<Data | []>([])
    const [loading, setLoading] = useState<boolean>(false)

    const handleCopy = (text: string) => {
        window.navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard")
        }).catch(() => {
            toast.error("Failed to copy")
        })

    }

    const createWallet = (mnemonic: string) => {
        try {
            setLoading(true)
            const seed = mnemonicToSeedSync(mnemonic);

            const HDwallet = HDNodeWallet.fromSeed(seed);

            let derivativePath = `m/44'/60'/0'/0/${wallets?.length}`;

            const newWallet = HDwallet.derivePath(derivativePath);

            const createdWallet: walletDetails = {
                publicKey: newWallet.publicKey,
                address: newWallet.address,
                path: derivativePath,
                privateKey: newWallet.privateKey
            }
            setWallets((prevWallets) => [...prevWallets, createdWallet])
            setLoading(false)
            toast.success("Wallet created")

        } catch (err) {
            console.error("Err: ", err)

        }
    }

    const deleteWallet = (indexToDelete: number) => {
        setWallets((prevWallets) => {
            const updatedWallet = prevWallets.filter((_, index) => index !== indexToDelete)
            const data = {
                mnemonic,
                wallets: updatedWallet
            }
            localStorage.setItem("data", JSON.stringify(data))
            return updatedWallet
        })
        toast.success("Wallet deleted")

    }

    const navigateToViewWallet = (address: string) => {
        router.push(`/wallet/${address}`)
    }


    useEffect(() => {
        const data = localStorage.getItem('data')
        if (data) {
            const details: any = JSON.parse(data)
            setLsData(details)
            setWallets(details?.wallets)
            setMnemonic(details?.mnemonic)
        }
    }, [])

    useEffect(() => {
        if (wallets.length > 0) {
            const data = {
                mnemonic,
                wallets
            }
            localStorage.setItem("data", JSON.stringify(data))
        }
    }, [wallets,mnemonic]);

    return (
        <div className="w-full md:h-fit h-fit flex justify-center py-5 grid_background_dark">
            <div className="md:w-4/6 w-5/6 md:h-fit h-fit bg-[#111111] flex flex-col justify-between items-center rounded-lg md:p-6 p-3 cursor-pointer">
                {
                    wallets?.map((wallet, index) => (
                        <div className="md:py-0 py-4 px-1 md:px-4 my-4 w-full" key={index}>
                            <div className="w-full flex justify-between items-center">
                                <p className="text-white font-semibold text-lg md:text-xl py-2" onClick={() => navigateToViewWallet(wallet.address)}>Wallet {index + 1}</p>
                                <button className="bg-red-600 p-2 text-sm rounded-lg hover:bg-red-700 transition duration-200 ease-in-out text-white" onClick={() => deleteWallet(index)}>Delete</button>
                            </div>
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
                <button onClick={() => createWallet(mnemonic)} className="my-10 bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out text-white flex justify-center items-center">{loading ? <Loader /> : "Add New Wallet"}</button>
            </div>

        </div>
    );
}