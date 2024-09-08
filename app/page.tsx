"use client";
import { useRouter } from "next/navigation";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDNodeWallet } from "ethers";
import { useState } from "react";
import Loader from "@/components/Loader";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";
export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [inputPhrase, setInputPhrase] = useState<string>("");
  const [crypto, setCrypto] = useState<string>("");

  const chooseCypto = (input: string) => {
    setCrypto(input);
  };
  let mnemonic;
  const generateETH = () => {
    setLoading(true);
    interface walletDetails {
      publicKey: string;
      address: string;
      path: string;
      privateKey: string;
    }

    mnemonic = inputPhrase ? inputPhrase : generateMnemonic();

    const seed = mnemonicToSeedSync(mnemonic);

    const wallet = HDNodeWallet.fromSeed(seed);

    let wallets: walletDetails[] = [];

    let derivativePath = `m/44'/60'/0'/0/0`;

    const newWallet = wallet.derivePath(derivativePath);

    wallets.push({
      publicKey: newWallet.publicKey,
      address: newWallet.address,
      path: derivativePath,
      privateKey: newWallet.privateKey,
    });

    const data = {
      mnemonic: mnemonic,
      wallets,
    };

    localStorage.setItem("data", JSON.stringify(data));

    setLoading(false);
    router.push("/secret-phrases");
  };

  const generateSOL = () => {
    setLoading(true);
    interface walletDetails {
      publicKey: string;
      address: string;
      path: string;
      privateKey: string;
    }

    mnemonic = inputPhrase ? inputPhrase : generateMnemonic();

    const seed = mnemonicToSeedSync(mnemonic);

    let wallets: walletDetails[] = [];

    let derivativePath = `m/44'/501'/0'/0'`;

    const derivedKey = derivePath(derivativePath, seed.toString("hex")).key;

    const keypair = Keypair.fromSeed(derivedKey);

    wallets.push({
      publicKey: keypair.publicKey.toBase58(),
      address: keypair.publicKey.toBase58(),
      path: derivativePath,
      privateKey: bs58.encode(keypair.secretKey),
    });

    const data = {
      mnemonic: mnemonic,
      wallets,
    };

    localStorage.setItem("data", JSON.stringify(data));

    setLoading(false);
    router.push("/secret-phrases");
  };

  const createWallet = () => {
    if (crypto === "ETH") {
      generateETH();
    } else if (crypto === "SOL") {
      generateSOL();
    }
  };

  return (
    <>
      <div className="w-full h-[90vh] flex flex-col justify-start items-center py-40 ">
        <p className="md:text-5xl text-2xl text-center font-bold text-white px-2">
          One Click to Create Wallets and See Your Keys.
        </p>
        <div className="w-full flex justify-center items-center flex-col py-10">
          <div className="w-full flex justify-center items-center">
            <input
              className="p-3 rounded-lg sm:w-2/4 w-2/4 bg-[#272727] outline-none border-0 text-white placeholder:sm:text-sm placeholder:text-[10px]"
              type="text"
              placeholder="Enter Mnemonic phrase (optional)"
              onChange={(e) => setInputPhrase(e.target.value)}
            />
            <DropDownMenu chooseCrypto={chooseCypto} />
          </div>
          <button
            onClick={createWallet}
            className="my-10 bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out text-white flex justify-center items-center mx-2"
          >
            {loading ? <Loader /> : "Create New Wallet"}
          </button>
        </div>
      </div>
    </>
  );
}
