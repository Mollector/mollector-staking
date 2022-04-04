export const walletConversion = (wallet: string): string => {
	if (wallet.length <= 12) {
		return wallet;
	}
	const newWallet = wallet.split("");
	const firstPart = newWallet.slice(0, 10).join("");
	const lastPart = newWallet.slice(newWallet.length - 8, newWallet.length).join("");
	return firstPart + "..." + lastPart;
};
