import { expect } from "chai";
import hre from "hardhat";
import { deployChatty } from "../scripts/deploy";

describe("Chatty", function () {
  describe("Register", function () {
    it("Should register a user", async function () {
      const chatty = await deployChatty();   
      const [owner] = await hre.ethers.getSigners();
      const registerTx = await chatty.register("Alice", "gibberish");
      await registerTx.wait();

      const user = await chatty.getUser(owner.address);
      expect(user.name).to.equal("Alice");
    });
  })
});
