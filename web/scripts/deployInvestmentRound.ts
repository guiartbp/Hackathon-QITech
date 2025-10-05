import { ethers } from "hardhat";

async function main() {
  // Hash de exemplo. Em um cenário real, gere este hash a partir do seu documento legal off-chain.
  const roundName = "Rodada Pre-Seed v1";
  const termsHash = ethers.keccak256(ethers.toUtf8Bytes("Aqui estao os termos completos do acordo."));

  console.log("Implantando o contrato InvestmentRound...");

  const investmentRound = await ethers.deployContract("InvestmentRound", [roundName, termsHash]);

  await investmentRound.waitForDeployment();

  console.log(`Contrato implantado em: ${investmentRound.target}`);
  console.log(`Verifique a transacao em: https://sepolia.etherscan.io/address/${investmentRound.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});