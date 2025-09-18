import { chatAbi, publicClient } from "@/common/lib";
import { useCallback } from "react"
import { toast } from "sonner";
import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi"

export const useSendGroupMessages = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();


  const sendGroupMessage = useCallback( async (contentHash: string) => { 
    if (!address) {
      toast.error("Not connected", {
        description: "Kindly connect your wallet",
      });
      return;
    }
    try {
      await publicClient.simulateContract({
        account: address,
        address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
        abi: chatAbi,
        functionName: "sendGroupMessage",
        args: [contentHash],
      });

      const txHash = await writeContractAsync({
        address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
        abi: chatAbi,
        functionName: "sendGroupMessage",
        args: [contentHash],
      });

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

  return { sendGroupMessage };
}
export const useWatchGroupMessages = (onMessageReceived?: (logs: any[]) => void) => {
  useWatchContractEvent({
    abi: chatAbi,
    address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
    eventName: "GroupMessageSent",
    onLogs: (logs) => {
      console.log("New group message events:", logs);
      
      const processedLogs = logs.map(log => ({
        // @ts-expect-error hrm
        ...log.args,
      }));

      if (processedLogs.length > 0) {
        console.log("Processed group message logs:", processedLogs);
        onMessageReceived?.(processedLogs);
      }
    },
  });
};
