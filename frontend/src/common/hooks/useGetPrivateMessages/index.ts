import { chatContract, publicClient } from "@/common/lib"
import { useCallback } from "react"
import { toast } from "sonner";
import { useAccount } from "wagmi"

export const useGetPrivateMessages = () => {
  const { address } = useAccount();
  const getPrivateMessages = useCallback( async (addr: string) => { 
    if(!address) {
      toast.error("please connect your wallet")
    }
    console.log("To Address::", addr)
    const getMessages = await publicClient.readContract({
      address: chatContract.address as `0x${string}`,
      abi: chatContract.abi,
      functionName: "getPrivateMessages",
      args: [addr],
      account: address,
    })
    return getMessages;
  }, [address])

  return { getPrivateMessages };
}
