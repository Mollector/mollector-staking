import React, { FC } from "react";
import { Promo } from "./ui/promo";

type HomeType = {};

const Home: FC<HomeType> = () => {
	return (
		<>
			<Promo />
		</>
	);
};

export default Home