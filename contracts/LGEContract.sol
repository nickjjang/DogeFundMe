pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LGEContract is Context, Ownable {

    uint256 private totalContirbution;
    mapping(address => uint256) private contirbutions;

    bool private concluded;
    uint256 private immutable endtime;

    constructor(uint8 weeksAfter) {
        endtime = block.timestamp + weeksAfter * 1 weeks;
    }

    function ended() public view returns (bool) {
        return concluded;
    }

    function contributionOf(address account) public view returns (uint256) {
        return contirbutions[account];
    }

    modifier isOpened {
        require(!concluded, "DFM-Lge: has already concluded");
        require(block.timestamp >= endtime, "DFM-Lge: can't conclude before ending time");
        _;
    }

    function conclude(address token, address payable dfm) public payable onlyOwner isOpened returns (bool) {
        require(address(this).balance > 0, "DFM-Lge: can't conclude with zero balance");

        concluded = true;

        // provide liquidity to Uniswap
        uint uniShare = totalContirbution * 92 / 100;
        

        // send balance to DFM contract
        uint256 dfmShare = totalContirbution - uniShare;
        bool sent = dfm.send(dfmShare);
        require(sent, "DFM-Lge: Failed to send eth to DFM Contract");

        emit Concluded(block.timestamp, endtime);

        return true;
    }

    function contribute() public payable isOpened {
        require(msg.value > 0, "DFM-Lge: can't contribute zero ether");
        
        address sender = _msgSender();
        uint256 amount = msg.value;

        totalContirbution += amount;
        contirbutions[sender] += amount;

        emit Contributed(sender, amount);
    }

    event Contributed(address indexed from, uint256 amount);
    event Concluded(uint256 time, uint256 endtime);
}