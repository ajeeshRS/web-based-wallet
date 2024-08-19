'use client'
import { useRouter } from "next/navigation";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { HDNodeWallet } from "ethers";
import { useState } from "react";
import Loader from "@/components/Loader";

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const generateSeedPhrase = () => {
    setLoading(true)
    interface walletDetails {
      publicKey: string,
      address: string,
      path: string,
      privateKey: string
    }

    const mnemonic = generateMnemonic();

    const seed = mnemonicToSeedSync(mnemonic);

    const wallet = HDNodeWallet.fromSeed(seed);

    let wallets: walletDetails[] = [];

    let derivativePath = `m/44'/60'/0'/0/0`;

    const newWallet = wallet.derivePath(derivativePath);

    wallets.push({
      publicKey: newWallet.publicKey,
      address: newWallet.address,
      path: derivativePath,
      privateKey: newWallet.privateKey
    });

    const data = {
      mnemonic: mnemonic,
      wallets
    }

    localStorage.setItem('data', JSON.stringify(data))
   
    setLoading(false)
    router.push("/secret-phrases")
  };

  return (
    <>
      <div className="w-full h-[90vh] flex flex-col justify-start items-center py-40 ">
        <p className="md:text-5xl text-2xl text-center font-bold text-white px-2">One Click to Create Wallets and See Your Keys.</p>
        <button onClick={generateSeedPhrase} className="my-10 bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out text-white flex justify-center items-center">{loading ? <Loader /> : 'Create New Wallet'}</button>
      </div>
    </>
  );
}
