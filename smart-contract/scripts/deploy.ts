import { ethers } from "hardhat";

export async function deployChatty() {
  const ChatDapp = await ethers.getContractFactory("ChatDapp");
  const chatty = await ChatDapp.deploy();
  await chatty.waitForDeployment();

  return chatty;
}

deployChatty().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
