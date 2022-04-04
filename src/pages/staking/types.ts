export interface STAKE_TOKEN_TYPE {
  [key: number] : {
      ADDRESS: string,
      SYMBOL: string,
      NAME: string,
  }
}

export interface StakingHistory {
  amount: string[],
  time: string[],
  lastIndex: string
}

export interface FilteredStakingData {
  [key: string]: string
}