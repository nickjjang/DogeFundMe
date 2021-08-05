//"SPDX-License-Identifier: MIT"
pragma solidity ^0.8.4;

interface IDFMContract {

    function donate(address token, uint256 amount) public external returns (bool);
}