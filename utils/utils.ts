import axios from "axios";
const ALCHEMY_URL: string = process.env.NEXT_PUBLIC_ALCHEMY_URL ||"";

export const getEthBalance = async (address: String) => {
  try {
    const data = {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address, "latest"],
    };
    const res = await axios.post(ALCHEMY_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.data.result) {
      return res.data.result;
    } else {
      throw new Error("Failed to fetch balance");
    }
  } catch (err) {
    console.error("Err: ", err);
  }
};

export const getUsdRate = async (value: string, crypto: string) => {
  try {
    console.log(crypto);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    );
    let balanceInUsd: any;
    if (crypto === "ethereum") {
      balanceInUsd = (parseFloat(value) * response.data.ethereum.usd).toFixed(
        2
      );
    } else if (crypto === "solana") {
      balanceInUsd = (parseFloat(value) * response.data.solana.usd).toFixed(2);
    }

    return balanceInUsd;
  } catch (err) {
    console.error("Error fetching USD rate: ", err);
    return null;
  }
};
