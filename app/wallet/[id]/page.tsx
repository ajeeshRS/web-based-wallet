"use client"
import { getEthBalance, getUsdRate } from "@/utils/utils";
import { formatEther } from "ethers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ethIcon from "../../../public/ethereum-branded.svg"
import sendIcon from "../../../public/Send.svg"
import scanIcon from "../../../public/Scan.svg"
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import ShowQrCode from "@/components/QrCodeDialog";

export default function viewWallet() {
    const { id } = useParams()
    const [wallet, setWallet] = useState<any>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [balanceInUsd, setBalanceInUsd] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [qrCode, setQrCode] = useState<boolean>(false)

    const getBalance = async (address: any) => {
        try {
            const balanceInWei = await getEthBalance(address);
            if (balanceInWei) {
                const balanceInEth = formatEther(balanceInWei)
                setBalance(balanceInEth)
                const usdRate = await getUsdRate(balanceInEth)
                setBalanceInUsd(usdRate)
            }
        } catch (err) {
            console.error("Error fetching balance: ", err);
        }
    }

    const viewQrCode = () => {
        setQrCode(true)
    }

    useEffect(() => {
        if (id) {
            const data: any = localStorage.getItem('data');
            const details = JSON.parse(data);
            if (details.wallets) {
                const walletData = details.wallets.find((w: any) => w.address === id);
                setWallet(walletData);
                getBalance(id)
            }
        }
    }, [id]);

    if (!wallet) {
        return <p>Wallet not found or Loading...</p>;
    }

    return (
        <div className="w-full md:h-fit h-fit flex justify-center py-5 grid_background_dark">
            <div className="md:w-4/6 w-5/6 md:h-fit h-fit bg-[#111111] flex flex-col justify-between items-center rounded-lg md:p-6 p-3 cursor-pointer">
                <div className="text-white w-full text-center">

                    <div className="text-center">
                        <p>Ethereum</p>
                        <div className="w-full flex items-center justify-center my-2">
                            <p className="text-5xl font-bold">$0.00</p>
                            <Image src={ethIcon} alt="eth-icon" className="w-10 h-10" />
                        </div>
                    </div>
                    <div className="my-10">
                        <p className="md:text-lg text-[10px] md:py-0 py-2">{`Address:  ${id}`}</p>
                        <div className="flex w-full justify-center items-center md:text-lg text-[10px]">
                            <p className={`overflow-hidden ${isVisible && 'text-ellipsis'}  whitespace-nowrap`}>{`Private Key: ${isVisible ? wallet.privateKey : '•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}`}</p>
                            <button className="p-1 text-white bg-black hover:bg-[#4d4d4d] rounded-xl text-sm duration-200 transition ease-in-out mx-2" onClick={() => setIsVisible(!isVisible)}>{`${isVisible ? 'Hide' : 'Show'}`}</button>
                        </div>
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <button className="p-3 text-white bg-black hover:bg-[#3f3f3f] rounded-xl text-sm duration-300 transition ease-in-out mx-2 flex items-center">
                            Send <Image src={sendIcon} alt="send-icon" className="w-6 h-6 ml-1" />
                        </button>
                        <button className="p-3 text-white bg-black hover:bg-[#3f3f3f] rounded-xl text-sm duration-300 transition ease-in-out mx-2 flex items-center" onClick={viewQrCode}>
                            Receive <Image src={scanIcon} alt="scan-icon" className="w-6 h-6 ml-1" />
                        </button>
                    </div>
                    {
                        qrCode && <ShowQrCode address={id} />
                    }
                </div>
            </div>
        </div>
    );
}