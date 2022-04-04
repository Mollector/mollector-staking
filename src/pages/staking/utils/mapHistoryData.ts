import BigNumber from "bignumber.js"
import get from 'lodash/get'
import { getBalanceAmount } from "utils/formatBalance"
import { FilteredStakingData, StakingHistory } from "../types"

export const mapStakingHistoryData = (data: StakingHistory): FilteredStakingData[] => {
  const amount = get(data, 'amount', []).map(am => getBalanceAmount(new BigNumber(am)).toString())
  const time = get(data, 'time', [])
  const result: FilteredStakingData[] = []
  for (let index = 0; index < amount.length; index++) {
    const stakeObj: FilteredStakingData = {}
    stakeObj[time[index]] = amount[index]

    result.push(stakeObj)
  }

  return result
}



