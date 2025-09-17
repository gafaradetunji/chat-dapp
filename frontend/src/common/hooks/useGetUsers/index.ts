import { chatAbi, chatContract, multicalCaontract, publicClient } from "@/common/lib"
import { useEffect, useState } from "react"
import { decodeFunctionResult, encodeFunctionData } from "viem";
import { useAccount } from "wagmi";

interface User {
  address: string,
  username: string,
  avatarHash: string,
  owner: string,
  registeredAt: number;
}

export const useGetUsers = () => {
  const [users, setUsers] = useState<User[]>();
  const { address: accountAddress } = useAccount();

  useEffect(() => {
    (async () => {
      const getAllAddresses = await publicClient.readContract({
        address: chatContract.address as `0x${string}`,
        abi: chatAbi,
        functionName: "getAllUserAddresses",
      })
      const getTotalUsers = await publicClient.readContract({
        address: chatContract.address as `0x${string}`,
        abi: chatAbi,
        functionName: "getTotalUsers",
      })
      // @ts-expect-error hrm
      const data = [];
      const calls = [];
      if (!getAllAddresses) return;
      // console.log("getAllAddresses: ", getAllAddresses);

      for (let i = 0; i < Number(getTotalUsers); i++) {
        calls.push({
            target: chatContract.address,
            callData: encodeFunctionData({
                abi: chatContract.abi,
                functionName: "users",
                // @ts-expect-error hrm
                args: [getAllAddresses[i]],
            }),
        });
      }

      // console.log("calls: ", calls);
      const callResults = await publicClient.readContract({
        address: multicalCaontract.address as `0x${string}`,
        abi: multicalCaontract.abi,
        functionName: "aggregate",
        args: [calls],
      });
      // @ts-expect-error hrm
      callResults[1].forEach((r, i) => {
        const p = decodeFunctionResult({
            abi: chatContract.abi,
            functionName: "users",
            data: r,
        });

        data.push({
          // @ts-expect-error hrm
            address: getAllAddresses[i],
            // @ts-expect-error hrm
            username: p[0],
            // @ts-expect-error hrm
            avatarHash: p[1],
            // @ts-expect-error hrm
            owner: p[2],
            // @ts-expect-error hrm
            registeredAt: new Date(Number(p[3]) * 1000).toLocaleString(),
        });
        // @ts-expect-error hrm
        const newData = data.filter(t => t.address !== accountAddress);

        setUsers(newData);
      });
    })();
  }, [accountAddress])
  return users;
}
