import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";
import {
  contract,
  tokenContract,
  ERC20,
  toEth,
  TOKEN_ICO_CONTRACT,
} from "./constants";

const STAKING_DAPP_ADDRESS = process.env.NEXT_PUBLIC_STAKING_DAPP;
const DEPOSIT_TOKEN = process.env.NEXT_PUBLIC_DEPOSIT_TOKEN;
const REWARD_TOKEN = process.env.NEXT_PUBLIC_REWARD_TOKEN;
const TOKEN_LOGO = process.env.NEXT_PUBLIC_TOKEN_LOGO;

const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
const notifyError = (msg) => toast.error(msg, { duration: 2000 });

function CONVERT_TIMESTAMP_TO_READABLE(timeStamp) {
  const date = new Date(timeStamp * 1000);

  const readableTime = date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return readableTime;
}

function toWei(amount) {
  const toWei = ethers.utils.parseUnits(amount.toString());
  return toWei.toString();
}

function parseErrorMsg(e) {
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.message;
}

export const SHORTEN_ADDRESS = (address) =>
  `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`;

export const copyAddress = (text) => {
  navigator.clipboard.writeText(text);
  notifySuccess(" Copied successfully");
};

export const getBalance = async (address) => {
  try {
    // Initialize provider (MetaMask or any injected provider)
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Ensure the user is connected to a wallet
    await provider.send("eth_requestAccounts", []);

    // Get the balance of the given address
    const balance = await provider.getBalance(address);

    // Convert the balance from Wei to Ether
    const balanceInEther = ethers.utils.formatEther(balance);

    return balanceInEther;
  } catch (error) {
    console.error("Error fetching balance: ", error);
  }
};

// Usage: Pass in the connected wallet address

export async function CONTRACT_DATA(address) {
  try {
    const contractObj = await contract();
    const stakingTokenObj = await tokenContract();

    if (address) {
      const contractOwner = await contractObj.owner();
      const contractAddress = await contractObj.address;

      //NOTIFICATION
      const notifications = await contractObj.getNotifications();

      const _notificationsArray = await Promise.all(
        notifications.map(
          async ({ poolID, amount, user, typeOf, timestamp }) => {
            return {
              poolID: poolID.toNumber(),
              amount: toEth(amount),
              user: user,
              typeOf: typeOf,
              timestamp: CONVERT_TIMESTAMP_TO_READABLE(timestamp),
            };
          }
        )
      );

      let poolInfoArray = [];
      const poolLenght = await contractObj.poolCount();
      const length = poolLenght.toNumber();

      for (let i = 0; i < length; i++) {
        const poolInfo = await contractObj.poolInfo(i);

        const userInfo = await contractObj.userInfo(i, address);
        const userReward = await contractObj.pendingReward(i, address);
        const tokenPoolInfoA = await ERC20(poolInfo.depositToken, address);
        const tokenPoolInfoB = await ERC20(poolInfo.rewardToken, address);

        const pool = {
          depositTokenAddress: poolInfo.depositToken,
          rewardTokenAddress: poolInfo.rewardToken,
          depositToken: tokenPoolInfoA,
          rewardToken: tokenPoolInfoB,
          depositedAmount: toEth(poolInfo.depositedAmount.toString()),
          apy: poolInfo.apy.toString(),
          lockDays: poolInfo.lockDays.toString(),
          //USER
          amount: toEth(userInfo.amount.toString()),
          userReward: toEth(userReward),
          lockUntil: CONVERT_TIMESTAMP_TO_READABLE(
            userInfo.lockUntil.toNumber()
          ),
          lastRewardAt: toEth(userInfo.lastRewardAt.toString()),
        };

        poolInfoArray.push(pool);
      }

      const totalDepositAmount = poolInfoArray.reduce((total, pool) => {
        return total + parseFloat(pool.depositedAmount);
      }, 0);

      const rewardToken = await ERC20(REWARD_TOKEN, address);
      const depositToken = await ERC20(DEPOSIT_TOKEN, address);

      const data = {
        contractOwner: contractOwner,
        contractAddress: contractAddress,
        notifications: _notificationsArray.reverse(),
        rewardToken: rewardToken,
        depositToken: depositToken,
        poolInfoArray: poolInfoArray,
        totalDepositAmount: totalDepositAmount,
        contractTokenBalance:
          depositToken.contractTokenBalance - totalDepositAmount,
      };

      return data;
    }
  } catch (e) {
    console.log(e);
    console.log(parseErrorMsg(e));
    return parseErrorMsg(e);
  }
}
export async function deposit(poolID, amount, address) {
  try {
    notifySuccess("Calling contract...");

    // Get the contract and token instances
    const contractObj = await contract();
    const stakingTokenObj = await tokenContract();

    console.log(poolID, amount);

    // Convert amount to Wei (assuming 18 decimal places, adjust if needed)
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    const fee = ethers.utils.parseUnits("0.69", 18); // Adjust the fee if necessary

    // Check current allowance
    const currentAllowance = await stakingTokenObj.allowance(
      address,
      contractObj.address
    );

    console.log(`Current Allowance: ${currentAllowance.toString()}`);

    // If the current allowance is less than the amount to be staked, prompt the user to approve
    if (currentAllowance.lt(amountInWei)) {
      notifySuccess("Approving token...");
      const approveTx = await stakingTokenObj.approve(
        contractObj.address,
        amountInWei
      );
      await approveTx.wait();
      console.log(`Approved ${amountInWei.toString()} tokens for staking`);
    }

    // Estimate gas
    const gasEstimation = await contractObj.estimateGas.deposit(
      poolID,
      amountInWei,
      {
        value: fee, // If the contract requires ETH as a fee, pass it here
      }
    );

    const gasLimit = gasEstimation.toString(); // Convert to a regular number

    // Proceed with staking
    notifySuccess("Staking token...");
    console.log("Gas limit estimation:", gasLimit);

    // Perform the deposit transaction
    const stakeTx = await contractObj.deposit(poolID, amountInWei, {
      gasLimit, // Set the gas limit
      value: fee, // Send the payable ETH if required by the contract
    });

    const receipt = await stakeTx.wait();
    notifySuccess("Token staked successfully");
    return receipt;
  } catch (e) {
    console.log(e);
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

export async function transferToken(amount, transferAddress) {
  try {
    notifySuccess("calling contract token...");

    const stakingTokenObj = await tokenContract();
    console.log(stakingTokenObj);

    const transferAmount = ethers.utils.parseEther(amount);

    const approveTx = await stakingTokenObj.transfer(
      transferAddress,
      transferAmount
    );
    await approveTx.wait();
    notifySuccess("Token stake successfully");
    return approveTx;
  } catch (e) {
    console.log(e);
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

export async function withdraw(poolID, amount) {
  console.log(poolID, amount);
  try {
    notifySuccess("calling contract...");
    // Convert amount to Wei (assuming 18 decimal places, adjust if needed)
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
    const fee = ethers.utils.parseUnits("0.69", 18); // Adjust the fee if necessary

    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.withdraw(
      Number(poolID),
      amountInWei,
      {
        value: fee,
      }
    );
    const data = await contractObj.withdraw(Number(poolID), amountInWei, {
      gasLimit: gasEstimation,
      value: fee, // Send the payable ETH if required by the contract
    });

    const receipt = await data.wait();
    notifySuccess("transaction successfully completed");
    return receipt;
  } catch (e) {
    console.log(e);
    console.log(parseErrorMsg(e));
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

export async function claimReward(poolID) {
  try {
    notifySuccess("calling contract...");
    const contractObj = await contract();
    const fee = ethers.utils.parseUnits("0.69", 18); // Adjust the fee if necessary

    const gasEstimation = await contractObj.estimateGas.claimReward(
      Number(poolID),
      {
        value: fee, // Send the payable ETH if required by the contract
      }
    );
    const data = await contractObj.claimReward(Number(poolID), {
      gasLimit: gasEstimation,
      value: fee, // Send the payable ETH if required by the contract
    });

    const receipt = await data.wait();
    notifySuccess("Reward claim successfully received");
    return receipt;
  } catch (e) {
    console.log(e);
    console.log(parseErrorMsg(e));
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

export async function createPool(pool) {
  try {
    const { _depositToken, _rewardToken, _apy, _lockDays } = pool;
    if (!_depositToken || !_rewardToken || !_apy || !_lockDays)
      return notifyError("Provide all details");

    notifySuccess("calling contract...");
    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.addPool(
      _depositToken,
      _rewardToken,
      Number(_apy),
      Number(_lockDays)
    );

    const stakeTx = await contractObj.addPool(
      _depositToken,
      _rewardToken,
      Number(_apy),
      Number(_lockDays),
      {
        gasLimit: gasEstimation,
      }
    );
    console.log(stakeTx);

    const receipt = await stakeTx.wait();
    notifySuccess("Token stake successfully");
    return receipt;
  } catch (e) {
    console.log(e);
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

export async function modifyPool(poolID, amount) {
  console.log(poolID, amount);
  try {
    notifySuccess("calling contract...");

    const contractObj = await contract();

    const gasEstimation = await contractObj.estimateGas.modifyPool(
      Number(poolID),
      Number(amount)
    );
    const data = await contractObj.modifyPool(Number(poolID), Number(amount), {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("transaction successfully completed");
    return receipt;
  } catch (e) {
    console.log(e);
    console.log(parseErrorMsg(e));
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

export async function sweep(tokenData) {
  try {
    const { token, amount } = tokenData;
    if (!token || !amount) return notifyError("Date is missing");
    notifySuccess("calling contract...");

    const contractObj = await contract();
    const transferAmount = ethers.utils.parseEther(amount);

    const gasEstimation = await contractObj.estimateGas.sweep(
      token,
      transferAmount
    );
    const data = await contractObj.sweep(token, transferAmount, {
      gasLimit: gasEstimation,
    });

    const receipt = await data.wait();
    notifySuccess("transaction successfully completed");
    return receipt;
  } catch (e) {
    console.log(e);
    console.log(parseErrorMsg(e));
    const errorMsg = parseErrorMsg(e);
    notifyError(errorMsg);
  }
}

//ADD TOKEN METAMASK
export const addTokenToMetaMask = async (token) => {
  if (window.ethereum) {
    const contract = await tokenContract();
    console.log(contract);
    const tokenDecimals = await contract.decimals();
    const tokenAddress = await contract.address;
    const tokenSymbol = await contract.symbol();
    const tokenImage = TOKEN_LOGO;

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        notifySuccess("Token added!");
      } else {
        notifyError("Token not added");
      }
    } catch (error) {
      notifyError("Failed to add");
    }
  } else {
    notifyError("MetaMask is not installed");
  }
};

//BUY TOKEN
export const BUY_TOKEN = async (amount) => {
  try {
    const contract = await TOKEN_ICO_CONTRACT();

    const toeknDetails = await contract.getTokenDetails();
    const avalableToken = ethers.utils.formatEther(
      toeknDetails.balance.toString()
    );

    if (avalableToken > 1) {
      const price =
        ethers.utils.formatEther(toeknDetails.tokenPrice.toString()) *
        Number(amount);

      const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

      const transaction = await contract.buyToken(Number(amount), {
        value: payAmount.toString(),
        gasLimit: ethers.utils.hexlify(8000000),
      });

      const receipt = await transaction.wait();

      notifySuccess("Transaction successfully");
      console.log(transaction);
      return receipt;
    } else {
      notifyError("Token balance is lower than expected");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

//OWNER TOKEN WITHDRAW
export const TOKEN_WITHDRAW = async () => {
  try {
    notifySuccess("Transaction proccessing...");
    const contract = await TOKEN_ICO_CONTRACT();

    const toeknDetails = await contract.getTokenDetails();
    const avalableToken = ethers.utils.formatEther(
      toeknDetails.balance.toString()
    );

    if (avalableToken > 1) {
      const transaction = await contract.withdrawAllTokens();

      const receipt = await transaction.wait();
      console.log(transaction);
      notifySuccess("Transaction successfully");
      return receipt;
    } else {
      notifyError("Token balance is lower than expected");
      return "receipt";
    }
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

//OWNER UPDATE TOKEN
export const UPDATE_TOKEN = async (_address) => {
  try {
    if (!_address) return notifyError("Data is missing");
    notifySuccess("Transaction proccessing...");
    const contract = await TOKEN_ICO_CONTRACT();

    const gasEstimation = await contract.estimateGas.updateToken(_address);
    const transaction = await contract.updateToken(_address, {
      gasLimit: gasEstimation,
    });

    const receipt = await transaction.wait();
    console.log(transaction);
    notifySuccess("Transaction successfully");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};

//OWNER PRICE TOKEN
export const UPDATE_TOKEN_PRICE = async (price) => {
  try {
    if (!price) return notifyError("Data is missing");
    notifySuccess("Transaction proccessing...");
    const contract = await TOKEN_ICO_CONTRACT();
    const payAmount = ethers.utils.parseUnits(price.toString(), "ether");

    const gasEstimation = await contract.estimateGas.updateTokenSalePrice(
      payAmount
    );

    const transaction = await contract.updateTokenSalePrice(payAmount, {
      gasLimit: gasEstimation,
    });

    const receipt = await transaction.wait();
    console.log(transaction);
    notifySuccess("Transaction successfully");
    return receipt;
  } catch (error) {
    console.log(error);
    const errorMsg = parseErrorMsg(error);
    notifyError(errorMsg);
  }
};
