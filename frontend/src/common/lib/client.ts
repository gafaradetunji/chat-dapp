import { createPublicClient, fallback, http } from 'viem'
import { sepolia } from 'viem/chains'
import { chatAbi, multicallAbi } from './abi';
 
export const publicClient = createPublicClient({ 
  chain: sepolia,
  // transport: http(`${process.env["NEXT_PUBLIC_SEPOLIA_RPC_URL"]}`)
  transport: fallback([
    http('https://rpc.sepolia.org'),
    http(`${process.env["NEXT_PUBLIC_SEPOLIA_RPC_URL"]}`),
    http('https://rpc.ankr.com/eth_sepolia')
  ])
})

export const multicalCaontract = {
  address: process.env["NEXT_PUBLIC_MULTICALL_CONTRACT"]!,
  abi: multicallAbi,
};

export const chatContract = {
  address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"]!,
  abi: chatAbi,
};
