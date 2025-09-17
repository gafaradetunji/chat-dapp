'use client';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Chat dApp",
  projectId: process.env["NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID"]!,
  chains: [sepolia],
});
