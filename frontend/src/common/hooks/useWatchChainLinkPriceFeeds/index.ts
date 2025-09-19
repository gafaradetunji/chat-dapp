// import { chatContract, publicClient } from "@/common/lib"
// import { useCallback, useEffect, useState } from "react"
// import { toast } from "sonner";
// import { useAccount } from "wagmi"

// export const useGetPriceFeeds = () => {
//   const { address } = useAccount();
//   const [prices, setPrices] = useState()

//   useEffect(() => {
//     if (!address) return;

//     const unwatch = publicClient.watchContractEvent({
//       address: chatContract.address as `0x${string}`,
//       abi: chatContract.abi,
//       eventName: "PricePosted",
//       onLogs: (logs) => {
//         logs.forEach((log) => {
//           const { args } = log as unknown as {
//             args: {
//               btcUsd: bigint;
//               ethUsd: bigint;
//               btcEth: bigint;
//               timestamp: bigint;
//             };
//           };

//           setPrices({
//             btcUsd: args.btcUsd.toString(),
//             ethUsd: args.ethUsd.toString(),
//             btcEth: args.btcEth.toString(),
//             timestamp: Number(args.timestamp),
//           });

//           toast.success("📈 New prices updated from Chainlink Automation");
//         });
//       },
//     });

//     return () => {
//       unwatch?.();
//     };
//   }, [address]);

//   return { prices };
// }
