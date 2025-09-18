import { chatAbi, chatContract, publicClient } from "@/common/lib"
import { useCallback } from "react"
import { useAccount } from "wagmi";

// interface User {
//   address: string,
//   username: string,
//   avatarHash: string,
//   owner: string,
//   registeredAt: number;
// }

export const useGetUser = () => {
  // const [user, setUser] = useState<User>();
  const { address: accountAddress } = useAccount();

  // if(!accountAddress) return console.error("Please connect your wallet to get you up to speed")
  
  return useCallback(async () => {
    const getUser = await publicClient.readContract({
      address: chatContract.address as `0x${string}`,
      abi: chatAbi,
      functionName: "getUser",
      args: [accountAddress]
    })
    console.log("User", getUser);
    // setUser(getUser);
  }, [accountAddress])

  // return user;
}
