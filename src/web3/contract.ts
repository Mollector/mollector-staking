import { useMemo } from "react";
import Contract from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import type { Contract as ContractType } from "web3-eth-contract";
import VestingABI from "./abi/Vesting.json";
import StakingABI from './abi/Staking.json'
import TokenABI from './abi/erc20.json'

const factoryContract = (abi: any, provider: string, address: string): ContractType => {
	// @ts-ignore
	const airdropContract = new Contract(abi as AbiItem[], address);
	if (provider) {
		airdropContract.setProvider(provider);
	}
	return airdropContract;
};

export const useVestingContract = (provider: string, address: string) => {
	return useMemo(() => factoryContract(VestingABI, provider, address), [provider]);
};

export const useStakingContract = (provider: string, address: string) => {
	return useMemo(() => factoryContract(StakingABI, provider, address), [provider]);
};

export const useBep20TokenContract = (provider: string, address: string) => {
	return useMemo(() => factoryContract(TokenABI, provider, address), [provider]);
};