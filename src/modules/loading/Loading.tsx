import React, { FC } from "react";
import { Box } from "modules/box";
import { HeadlinePlusSubline } from "modules/headline-plus-subline";
import styles from "./Loading.module.scss";

export const Loading: FC<{ headline?: string }> = ({ headline }) => {
	return (
		<Box className={styles.component}>
			{headline && (
				<div className={styles.title}>
					<HeadlinePlusSubline headline={headline} />
				</div>
			)}
			<div className={styles.spinner} />
		</Box>
	);
};
