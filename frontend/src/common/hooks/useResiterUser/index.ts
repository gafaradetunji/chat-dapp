import { chatAbi, publicClient } from "@/common/lib";
import { useCallback } from "react";
import { toast } from "sonner";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";

export const useRegisterUser = () => {
  const { address } = useAccount();
  const walletClient = useWalletClient();
  const { writeContractAsync } = useWriteContract();

  return useCallback(
    async (username: string, avatarHash: string) => {
      if (!address || !walletClient) {
        toast.error("Not connected", {
          description: "Kindly connect your wallet",
        });
        return;
      }

      if (!username) {
        toast.error("Invalid username", {
          description: "Username is required",
        });
        return;
      }

      try {
        const simulationResult = await publicClient.simulateContract({
          account: address,
          address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
          abi: chatAbi,
          functionName: "register",
          args: [username, avatarHash],
        });

        console.log("Simulation Result:", simulationResult);

        const txHash = await writeContractAsync({
          address: process.env["NEXT_PUBLIC_CONTRACT_ADDRESS"] as `0x${string}`,
          abi: chatAbi,
          functionName: "register",
          args: [username, avatarHash],
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
    },
    [address, walletClient, writeContractAsync]
  );
};
