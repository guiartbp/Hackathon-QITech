import { ethers } from "hardhat";

async function main() {
  console.log("Deploying InvestmentRound contract...");

  // Get the contract factory
  const InvestmentRound = await ethers.getContractFactory("InvestmentRound");

  // Contract parameters - adjust these for your needs
  const tomadorAddress = "0x1234567890123456789012345678901234567890"; // Replace with actual tomador address
  const tomadorId = "tomador_001"; // Backend ID
  const totalAmount = ethers.parseEther("100"); // 100 ETH total round
  const minimumInvestment = ethers.parseEther("0.1"); // 0.1 ETH minimum
  const maximumInvestment = ethers.parseEther("10"); // 10 ETH maximum
  const roundDurationDays = 30; // 30 days duration
  const termsHash = "QmT4AeWE9Q8EiRxwjVbgGzBghQw9QxJ8LzqHRNPMJBvfBh"; // IPFS hash of terms document

  // Deploy the contract
  const investmentRound = await InvestmentRound.deploy(
    tomadorAddress,
    tomadorId,
    totalAmount,
    minimumInvestment,
    maximumInvestment,
    roundDurationDays,
    termsHash
  );

  await investmentRound.waitForDeployment();

  const contractAddress = await investmentRound.getAddress();
  console.log("InvestmentRound deployed to:", contractAddress);

  // Verify deployment by checking some contract state
  console.log("\nContract verification:");
  console.log("Tomador ID:", await investmentRound.tomadorId());
  const terms = await investmentRound.roundTerms();
  console.log("Total Amount:", ethers.formatEther(terms.totalAmount));
  console.log("Round Deadline:", new Date(Number(terms.roundDeadline) * 1000).toISOString());
  
  // Save contract address to file for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: contractAddress,
    deployedAt: new Date().toISOString(),
    network: "sepolia", // or whatever network you're using
    tomadorId,
    totalAmount: ethers.formatEther(totalAmount),
  };
  
  fs.writeFileSync(
    './deployed-contracts.json',
    JSON.stringify(contractInfo, null, 2)
  );
  
  console.log("\nContract info saved to deployed-contracts.json");
  console.log("\n🎉 Deployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Add the contract address to your .env.local file:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Update your frontend to use this contract");
  console.log("3. Add investors using the addInvestor function");
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });