const fs = require('fs')
// const data = require('./data.js')
const history = require('./history.js')
const Web3 = require('web3')
const BN = require('bignumber.js')

var web3 = new Web3('https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/')
var contract = new web3.eth.Contract([{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"amounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"ewithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"address","name":"add","type":"address"},{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"getHistory","outputs":[{"internalType":"uint256","name":"lastIndex","type":"uint256"},{"internalType":"uint256[]","name":"amount","type":"uint256[]"},{"internalType":"uint256[]","name":"time","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"history","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}], '0xE101C3D7a6aF4699C8cDc7B2e212e093b976708f');
var add = {}
var listReward = {}

function estimateUSD(v) {
    var reserve = {
        usd: 76238.39509047121,
        mol: 9982923.237136107,
        totalSupply: 864799.035925471
    }

    if (reserve.usd / reserve.mol < 0.015) {
      return parseFloat((
        (v / reserve.totalSupply) * reserve.usd 
        + (v / reserve.totalSupply) * reserve.mol * 0.015
      ).toFixed(2))
    }
    else {
      return parseFloat((
        (v / reserve.totalSupply) * reserve.usd * 2
      ).toFixed(2))
    }
  }


function getChestImage(SYMBOL, amount) {

    if (SYMBOL != 'MOL') {
      var v = estimateUSD(amount)
      if (v < 500) return 'nonechest'

      if (v < 1249) return 'merchantchest'
      if (v < 2499) return 'vipchest'
      if (v < 4999) return 'noblechest'

      return 'royalchest'
    }

    if (amount < 12000) return 'nonechest'
    if (amount < 30000) return 'fighterchest'
    if (amount < 60000) return 'veteranchest'
    if (amount < 120000) return 'masterchest'
    if (amount >= 120000) return 'championchest'
    
    return ''
  }
  
  function getChestName(SYMBOL, amount) {

    if (SYMBOL != 'MOL') {
        var v = estimateUSD(amount)
      if (v < 500) return ''

      if (v < 1249) return '3 MERCHANT CHEST'
      if (v < 2499) return '6 VIP CHEST'
      if (v < 4999) return '9 NOBLECHEST'

      return '15 ROYAL CHEST'
    }

    if (amount < 12000) return ''
    if (amount < 30000) return '1 FIGHTER CHEST'
    if (amount < 60000) return '2 VETERAN CHEST'
    if (amount < 120000) return '3 MASTER CHEST'
    if (amount >= 120000) return '4 CHAMPION CHEST'
    
    return ''
  }

// async function main() {
//     for (var i = 0; i < data.length; i++) {
//         var v = data[i].From.toLowerCase()
//         console.log(v)
//         if (!add[v]) {
//             var mol = await contract.methods.getHistory('0x06597FFaFD82E66ECeD9209d539032571ABD50d9', v, 200).call()
//             var lp = await contract.methods.getHistory('0xdf3df1CAaC971EBEA3D1E606Bd7fb4A12b5adA96', v, 200).call()

//             add[v] = {
//                 add: v,
//                 mol: {
//                     amount: mol.amount,
//                     time: mol.time
//                 },
//                 lp: {
//                     amount: lp.amount,
//                     time: lp.time
//                 }
//             }

//             console.log(add[v])
//         }
//     }
    
//     fs.writeFileSync('./history.json', JSON.stringify(add, null, 4))
// }

async function main() {
    Object.keys(history).forEach(k => {
        var e = history[k]

        var mol = 0
        e.mol.amount.forEach((a, i) => {
            var t = e.mol.time[i]
            a = BN(a).div(10 ** 18).toNumber()
            
            var isWithdraw = parseInt(t) % 100 == 0
            if (isWithdraw) {
                mol -= a
            }
            else {
                mol += a
            }
        })

        var lp = 0
        e.lp.amount.forEach((a, i) => {
            var t = e.lp.time[i]
            a = BN(a).div(10 ** 18).toNumber()
            
            var isWithdraw = parseInt(t) % 100 == 0
            if (isWithdraw) {
                lp -= a
            }
            else {
                lp += a
            }
        })

        listReward[k] = {
            molText: getChestName('MOL', mol),
            lpText: getChestName('LP', lp),
            molImage: getChestImage('MOL', mol),
            lpImage: getChestImage('LP', lp)
        }
    })

    console.log(listReward)
}

main()

// var listReward: any = {
//     '0x40e7c5aa34846968d37e2c6a2eaeec0072967872': {
//       molText: '4 CHAMPION CHEST',
//       lpText: '15 ROYAL CHEST',
//       molImage: championchest,
//       lpImage: royalchest
//     }
//   }