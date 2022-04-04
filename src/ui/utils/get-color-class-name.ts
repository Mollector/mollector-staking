import { ColorType } from "ui/types";

export const getColorClassName = (color: ColorType, theme: any): string | false =>
	color && theme[color];
