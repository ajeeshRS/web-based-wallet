'use client'
import { useRouter } from "next/navigation";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { HDNodeWallet } from "ethers";

export default function Home() {
  const router = useRouter()

  const generateSeedPhrase: any = () => {
    interface walletDetails {
      publicKey: string,
      address: string,
      path: string,
    }

    const mnemonic = generateMnemonic();

    const seed = mnemonicToSeedSync(mnemonic);

    const wallet = HDNodeWallet.fromSeed(seed);

    let wallets: walletDetails[] = [];

    for (let i = 0; i < 3; i++) {
      let derivativePath = `m/44'/60'/0'/0/${i}`;

      const newWallet = wallet.derivePath(derivativePath);

      wallets.push({
        publicKey: newWallet.publicKey,
        address: newWallet.address,
        path: derivativePath,
      });
    }

    const data = {
      mnemonic: mnemonic,
      wallets
    }

    localStorage.setItem('data', JSON.stringify(data))
    router.push("/secret-phrases")
  };

  return (
    <>
      <div className="w-full h-[90vh] flex flex-col justify-start items-center py-40 ">
        <p className="md:text-5xl text-2xl text-center font-bold text-white px-2">One Click to Create Wallets and See Your Keys.</p>
        <button onClick={generateSeedPhrase} className="my-10 bg-blue-600 p-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out text-white">Create New Wallet</button>
      </div>
    </>
  );
}
