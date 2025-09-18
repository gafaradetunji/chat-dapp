import { chatContract, publicClient } from "@/common/lib"
import { useCallback } from "react"
import { toast } from "sonner";
import { useAccount } from "wagmi"

export const useGetGroupMessages = () => {
  const { address } = useAccount();
  const getGroupMessages = useCallback( async () => { 
    if(!address) {
      toast.error("please connect your wallet")
    }
    const getMessages = await publicClient.readContract({
      address: chatContract.address as `0x${string}`,
      abi: chatContract.abi,
      functionName: "getGroupMessages",
      account: address
    })
    return getMessages;
  }, [address])

  return { getGroupMessages };
}
