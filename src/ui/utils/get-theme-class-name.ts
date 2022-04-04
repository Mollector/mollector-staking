import { ModeType } from "ui/types";


export const getModeClassName = (mode: ModeType, theme: any): string | false => mode && theme[mode];
