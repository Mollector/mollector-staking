// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';

contract LockToken {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping(address => mapping(address => uint256)) public amounts;
    mapping(address => mapping(address => uint256[])) public history;

    function lock(address token, uint256 amount) public {
        require(amount > 0, 'Wrong amount');
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        amounts[token][msg.sender] = amounts[token][msg.sender].add(amount);

        history[token][msg.sender].push(amount * 10**18 + block.timestamp * 1000 + 1);
    }

    function withdraw(address token, uint256 amount) public {
        require(amounts[token][msg.sender] >= amount, 'Wrong amount');

        amounts[token][msg.sender] = amounts[token][msg.sender].sub(amount);
        IERC20(token).safeTransfer(msg.sender, amount);

        history[token][msg.sender].push(amount * 10**18 + block.timestamp * 1000);
    }

    function ewithdraw(address token) public {
        uint amount = amounts[token][msg.sender];
        amounts[token][msg.sender] = 0;
        IERC20(token).safeTransfer(msg.sender, amount);
    }

    function getHistory(
        address token,
        address add,
        uint256 limit
    )
        public
        view
        returns (
            uint256 lastIndex,
            uint256[] memory amount,
            uint256[] memory time
        )
    {
        uint256 n = history[token][add].length;
        uint256 nitem = n > limit ? limit : n;

        amount = new uint256[](nitem);
        time = new uint256[](nitem);

        for (uint256 i = 1; i <= nitem; i++) {
            uint256 v = history[token][add][n - i];
            amount[i - 1] = v / (10**18);
            time[i - 1] = v % (10**18);
        }

        lastIndex = n - nitem;
    }
}
