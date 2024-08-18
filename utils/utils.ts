import axios from "axios";
const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_URL || "";
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price";

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

export const getUsdRate = async (ethValue: string) => {
  try {
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: "ethereum",
        vs_currencies: "usd",
      },
    });

    const balanceInUsd = (
      parseFloat(ethValue) * response.data.ethereum.usd
    ).toFixed(2);

    return balanceInUsd;
  } catch (err) {
    console.error("Error fetching USD rate: ", err);
    return null;
  }
};
