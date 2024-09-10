"use client";
import { getEthBalance, getUsdRate } from "@/utils/utils";
import { formatEther } from "ethers";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ethIcon from "../../../public/ethereum-branded.svg";
import solIcon from "../../../public/solana-sol-logo.png";
import sendIcon from "../../../public/Send.svg";
import scanIcon from "../../../public/Scan.svg";
import Image from "next/image";
import ShowQrCode from "@/components/QrCodeDialog";
import Loader from "@/components/Loader";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import TransactDialog from "@/components/TransactDialog";
import toast from "react-hot-toast";

export default function ViewWallet() {
  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);

  const { id } = useParams();
  const [crypto, setCrypto] = useState<string>("");
  const [wallet, setWallet] = useState<any>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [balanceInUsd, setBalanceInUsd] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isTransactDialogOpen, setIsTransactDialogOpen] =
    useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");

  const getBalanceETH = async (address: any) => {
    try {
      const balanceInWei = await getEthBalance(address);
      const balanceInEth = formatEther(balanceInWei);
      setBalance(balanceInEth);

      const usdRate = await getUsdRate(balanceInEth, "ethereum");
      setBalanceInUsd(usdRate);
    } catch (err) {
      console.error("Error fetching balance: ", err);
    }
  };

  const getBalanceSOL = async (address: any) => {
    try {
      const connection = new Connection(clusterApiUrl("devnet"));
      const pubKey = new PublicKey(address);

      const balance = await connection.getBalance(pubKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;
      console.log("balanceInSol: ", balanceInSol);

      setBalance(balanceInSol.toString());
      const usdRate = await getUsdRate(balanceInSol.toString(), "solana");
      console.log("usdRate:", usdRate);
      setBalanceInUsd(usdRate);
    } catch (err) {
      console.error("Error fetching balance: ", err);
    }
  };

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };
  const handleTransactOpen = () => {
    if(crypto === "ETH"){
      return toast.success("Coming soon for ETH")
    }
    setIsTransactDialogOpen(true);
  };

  const handleTransactClose = () => {
    setIsTransactDialogOpen(false);
  };

  useEffect(() => {
    if (id) {
      const data: any = localStorage.getItem("data");
      const details = JSON.parse(data);
      if (details.wallets) {
        const walletData = details.wallets.find((w: any) => w.address === id);
        setWallet(walletData);
        if (walletData.address === walletData.publicKey) {
          setCrypto("SOL");
          setPrivateKey(walletData.privateKey);
          getBalanceSOL(id);
        } else {
          setCrypto("ETH");
          setPrivateKey(walletData.privateKey);
          getBalanceETH(id);
        }
      }
    }
  }, [id]);

  if (!balanceInUsd) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center py-5 grid_background_dark">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full md:h-fit h-fit flex justify-center py-5 grid_background_dark">
      <div className="md:w-4/6 w-5/6 md:h-fit h-fit bg-[#111111] flex flex-col justify-between items-center rounded-lg md:p-6 p-3 cursor-pointer">
        <div className="text-white w-full text-center">
          <div className="text-center">
            <p>
              {crypto === "SOL" ? "Solana" : crypto === "ETH" && "Ethereum"}
            </p>
            <div className="w-full flex items-center justify-center my-2">
              <p className="text-5xl font-bold">${balanceInUsd}</p>
              <Image
                src={crypto === "SOL" ? solIcon : crypto === "ETH" && ethIcon}
                alt={`${crypto}-icon`}
                className="w-10 h-10 ml-2"
              />
            </div>
            <div className="text-center">
              <p>{`${crypto} : ${balance}`}</p>
            </div>
          </div>
          <div className="my-10">
            <p className="md:text-lg text-[10px] md:py-0 py-2">{`Address:  ${id}`}</p>
            <div className="flex w-full justify-center items-center md:text-lg text-[10px]">
              <p
                className={`overflow-hidden ${isVisible && "text-ellipsis"}  whitespace-nowrap`}
              >{`Private Key: ${isVisible ? privateKey : "•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}`}</p>
              <button
                className="p-1 text-white bg-black hover:bg-[#4d4d4d] rounded-xl text-sm duration-200 transition ease-in-out mx-2"
                onClick={() => setIsVisible(!isVisible)}
              >{`${isVisible ? "Hide" : "Show"}`}</button>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="p-3 text-white bg-black hover:bg-[#3f3f3f] rounded-xl text-sm duration-300 transition ease-in-out mx-2 flex items-center"
              onClick={handleTransactOpen}
            >
              Send{" "}
              <Image src={sendIcon} alt="send-icon" className="w-6 h-6 ml-1" />
            </button>
            {isTransactDialogOpen && (
              <TransactDialog
                address={wallet.address}
                onClose={handleTransactClose}
                crypto={crypto}
                privateKey={wallet.privateKey}
              />
            )}
            <button
              className="p-3 text-white bg-black hover:bg-[#3f3f3f] rounded-xl text-sm duration-300 transition ease-in-out mx-2 flex items-center"
              onClick={handleOpen}
            >
              Receive{" "}
              <Image src={scanIcon} alt="scan-icon" className="w-6 h-6 ml-1" />
            </button>
            {isDialogOpen && (
              <ShowQrCode
                address={wallet.address}
                onClose={handleClose}
                crypto={crypto}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
