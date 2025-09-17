import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { chatAbi, multicallAbi } from './abi';
 
export const publicClient = createPublicClient({ 
  chain: sepolia,
  transport: http(`${process.env["NEXT_PUBLIC_SEPOLIA_RPC_URL"]}`)
})

export const multicalCaontract = {
  address: process.env["NEXT_PUBLIC_MULTICALL_CONTRACT"]!,
  abi: multicallAbi,
};

export const chatContract = {
  address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"]!,
  abi: chatAbi,
};
