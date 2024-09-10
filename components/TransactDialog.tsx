import Image from "next/image";
import { useState } from "react";
import sendIcon from "../public/Send.svg";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import Loader from "./Loader";
import toast from "react-hot-toast";
interface showTransactDialog {
  address: string;
  onClose: () => void;
  crypto: string;
  privateKey: string;
}

export default function TransactDialog({
  address,
  onClose,
  crypto,
  privateKey,
}: showTransactDialog) {
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const handleSendTransaction = async () => {
    if (crypto === "SOL") {
      setLoading(true);
      const connection = new Connection(clusterApiUrl("devnet"));
      const publicKey = new PublicKey(address);
      const recipientPubKey = new PublicKey(recipientAddress);
      const transaction = new Transaction();
      const instructions = SystemProgram.transfer({
        toPubkey: recipientPubKey,
        fromPubkey: publicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      });
      transaction.add(instructions);

      const secretKey = bs58.decode(privateKey);
      const keypair = Keypair.fromSecretKey(secretKey);
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );
      toast.success("Sent !");
      setAmount(0);
      setRecipientAddress("");
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181818] bg-opacity-50">
      <div className="relative w-5/6 h-fit rounded-lg p-8 shadow-lg bg-[#181818] sm:w-2/3 md:w-1/3 flex justify-center items-center flex-col">
        <button
          className="absolute top-2 right-2 flex justify-center items-center text-white  hover:bg-gray-800 rounded-lg px-2 py-1"
          onClick={onClose}
        >
          &times;
        </button>
        <p className="py-4">{`Send ${crypto}`}</p>
        <input
          className="p-3 rounded-lg sm:w-3/4 w-2/4 bg-[#272727] outline-none border-0 text-white placeholder:sm:text-sm placeholder:text-[10px]"
          type="text"
          placeholder="Enter Recipient Address"
          value={recipientAddress}
          onChange={(e) => {
            setRecipientAddress(e.target.value);
          }}
        />
        <input
          className="p-3 rounded-lg my-2 sm:w-3/4 w-2/4 bg-[#272727] outline-none border-0 text-white placeholder:sm:text-sm placeholder:text-[10px]"
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => {
            setAmount(parseFloat(e.target.value));
          }}
        />
        <button
          className="p-3 text-white bg-black hover:bg-[#3f3f3f] rounded-xl text-sm duration-300 transition ease-in-out mx-2 flex items-center group"
          onClick={handleSendTransaction}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              Send{" "}
              <Image
                src={sendIcon}
                alt="send-icon"
                className="w-6 h-6 ml-1 group-hover:translate-x-1 duration-200 ease-in-out transition-all"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
