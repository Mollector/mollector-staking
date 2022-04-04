import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./Airdrop.module.scss";
import theme from "ui/styles/Theme.module.scss";
import { GutterBox } from "ui/gutter-box";
import { getModeClassName } from "ui/utils/get-theme-class-name";
import { useWeb3React } from "@web3-react/core";
import { TX_SCANERS, NAME, VESTING_CONTRACT_ADDRESS } from "const/const";
import { useWeb3Provider } from "web3/web3";
import { useVestingContract } from "web3/contract";
import { Contract } from "web3-eth-contract";
import BN from "bn.js";
import { Button, NavLink } from "ui/button";
import { Box } from "modules/box";
import { walletConversion } from "utils/convertWallet";
import { useHistory } from "react-router-dom";


type TokensType = {};
const fetchInformation = async (contract: Contract, address: string) => {
	var [releaseAmount, lockedAmount, totalShare, released, unlocked, tge, cliff, duration] =
		await Promise.all([
			contract.methods.calculateReleaseAmount(address).call(),
			contract.methods.tgeUnlock(address).call(),
			contract.methods.shares(address).call(),
			contract.methods.released(address).call(),
			contract.methods.unlocked(address).call(),
			contract.methods.TGE().call(),
			contract.methods.cliff().call(),
			contract.methods.duration().call(),
		]);

	return {
		releaseAmount: new BN(releaseAmount.toString(), 10)
			.div(new BN("1000000000000000000"))
			.toNumber(),
		lockedAmount: new BN(lockedAmount.toString(), 10).div(new BN("1000000000000000000")).toNumber(),
		totalShare: new BN(totalShare.toString(), 10).div(new BN("1000000000000000000")).toNumber(),
		released: new BN(released.toString(), 10).div(new BN("1000000000000000000")).toNumber(),
		unlocked: new BN(unlocked.toString(), 10).div(new BN("1000000000000000000")).toNumber(),
		tge: new BN(tge.toString(), 10).toNumber() * 1000,
		cliff: new BN(cliff.toString(), 10).toNumber() * 1000,
		duration: new BN(duration.toString(), 10).toNumber() * 1000,
	};
};

const Airdrop: FC<TokensType> = () => {
	const [amount, setAmount] = useState<{
		releaseAmount: number;
		lockedAmount: number;
		totalShare: number;
		released: number;
		unlocked: number;
		tge: number;
		cliff: number;
		duration: number;
	}>({
		releaseAmount: 0,
		lockedAmount: 0,
		totalShare: 0,
		released: 0,
		unlocked: 0,
		tge: 0,
		cliff: 0,
		duration: 0,
	});
	const [txHash, setTxHash] = useState<string>("");
	const [error, setError] = useState<string>("");

	const provider = useWeb3Provider();
	const { active, chainId = 56, account } = useWeb3React();
	const contract = useVestingContract(provider, window.location.search.replace('?', ''));
	const history = useHistory()

	const onCancel = () => {
		history.push('/')
	}

	const updateData = useCallback(async () => {
		if (account) {
			const myAmount = await fetchInformation(contract, account);
			if (myAmount.tge <= new Date().getTime()) {
				setAmount(myAmount);
			} else {
				setAmount({
					releaseAmount: 0,
					lockedAmount: 0,
					totalShare: 0,
					released: 0,
					unlocked: 0,
					tge: myAmount.tge,
					cliff: myAmount.cliff,
					duration: myAmount.duration,
				});
			}
		}
	}, [contract, account]);

	useEffect(() => {
		const tm = setInterval(updateData, 5000);
		return () => clearInterval(tm);
	}, [contract, updateData]);

	useEffect(() => {
		if (active) {
			updateData();
		}
	}, [active, updateData]);

	const claimAction = async () => {
		try {
			if (amount.lockedAmount > 0 && amount.releaseAmount > 0) {
				const claimResult = await contract.methods.unlockAndRelease().send({ from: account });
				setTxHash(claimResult.transactionHash);
			} else if (amount.lockedAmount > 0) {
				const claimResult = await contract.methods.unlock().send({ from: account });
				setTxHash(claimResult.transactionHash);
			} else if (amount.releaseAmount > 0) {
				const claimResult = await contract.methods.release().send({ from: account });
				setTxHash(claimResult.transactionHash);
			}
		} catch (ex: any) {
			console.error(ex);
			setError(ex.message || ex.toString());
		}
	};

	return (
		<>
			<section className={styles.component}>
				<GutterBox className={styles.gutter}>
					<div className={classNames(styles.wrapper, getModeClassName("light", theme))}>
						{!active ? (
							<></>
						) : (
							<div>
								<Box className={styles.box}>
									<p className={styles.title}>
										Available Amount:
										<br />
										<span>
											{parseFloat(
												(amount.releaseAmount + amount.lockedAmount).toFixed(4)
											).toLocaleString()}{" "}
											{NAME}
										</span>
									</p>

									<p className={styles.text}>{walletConversion(account as any)}</p>
									<div
										style={{
											display: "flex",
											width: "100%",
											justifyContent: "space-around",
											marginTop: 20,
										}}
									>
										<Button
											color="pink"
											size="large"
											variant="outlined"
											onClick={onCancel}
											style={{ width: "46%" }}
										>
											Cancel
										</Button>
										<Button
											color="pink"
											size="large"
											variant="contained"
											onClick={claimAction}
											disabled={amount.releaseAmount + amount.lockedAmount == 0}
											style={{ width: "46%" }}
										>
											Claim
										</Button>
									</div>
									<br />
									<div style={{ fontFamily: "monospace" }}>
										<p className={styles.text}>
											TGE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
											{new Date(amount.tge).toLocaleDateString()}{" "}
											{new Date(amount.tge).toLocaleTimeString()}
										</p>
										<p className={styles.text}>
											Cliff at:&nbsp;&nbsp;{new Date(amount.cliff).toLocaleDateString()}{" "}
											{new Date(amount.cliff).toLocaleTimeString()}
										</p>
										<p className={styles.text}>
											Finish at:&nbsp;{new Date(amount.tge + amount.duration).toLocaleDateString()}{" "}
											{new Date(amount.tge + amount.duration).toLocaleTimeString()}
										</p>
									</div>
								</Box>
								{/* {
									error&&
									<div style={{textAlign: 'center', color: 'red'}}><br/>{error}</div>
								} */}
								{txHash && (
									<div style={{ textAlign: "center" }}>
										<br />
										Transaction:{" "}
										<a href={`${TX_SCANERS[chainId]}${txHash}`} target="__blank">
											{txHash}
										</a>
									</div>
								)}
							</div>
						)}
					</div>
				</GutterBox>
			</section>
		</>
	);
};

export default Airdrop