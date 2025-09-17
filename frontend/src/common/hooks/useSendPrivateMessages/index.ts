import { chatAbi, publicClient } from "@/common/lib";
import { useCallback } from "react"
import { toast } from "sonner";
import { useAccount, useWriteContract } from "wagmi"

export const useSendPrivateMessages = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();


  const sendPrivateMessage = useCallback( async (to: string, contentHash: string) => { 
    if (!address) {
      toast.error("Not connected", {
        description: "Kindly connect your wallet",
      });
      return;
    }
    try {
      const simulationResult = await publicClient.simulateContract({
        account: address,
        address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
        abi: chatAbi,
        functionName: "sendPrivateMessage",
        args: [to, contentHash],
      });

      console.log("Simulation Result:", simulationResult);

      const txHash = await writeContractAsync({
        address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
        abi: chatAbi,
        functionName: "sendPrivateMessage",
        args: [to, contentHash],
      });

      console.log("Transaction Hash:", txHash);

      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (txReceipt.status === "success") {
        toast.success("Registration successful", {
          description: "You have successfully registered",
        });
        return txReceipt;
      } else {
        toast.error("Registration failed", {
          description: "Transaction was not successful",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration");
    }
  }, [address, writeContractAsync])

  return { sendPrivateMessage };
}
