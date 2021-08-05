pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IDFMContract.sol";

contract DonationContract is Context, Ownable {

    address private immutable dfm;

    uint256 private totalDonation;
    mapping(address => uint256) private donations;
    address[] private donators = new address[]();

    uint256 private today;
    bool private paused = false;
            
    constructor(address _dfm) {
        dfm = _dfm;
        today = _today();
    }

    function _today() private pure returns (uint256) {
        return block.timestamp / 86400;
    }

    function resume() public onlyOwner {
        paused = false;
    }

    function pause() public onlyOwner {
        paused = true;
        emit Paused(today);
    }

    function distribute(address ddtoken) public returns (bool) {
        require(paused, "DFM-Don: donating isn't paused");
        require(totalDonation > 0, "DFM-Don: no doantions");

        uint256 minted = IERC20(ddtoken).balanceOf(address(this));
        require(minted > 0, "DFM-Don: not minted for daily distribution");
        
        for (uint i = 0; i < donators.length; i++) {
            uint256 share = minted / totalDonation * donations[donators[i]];
            IERC20(ddtoken).approve(donators[i], share);
            donations[donators[i]] = 0;
        }
        totalDonation = 0;
        delete donators;

        return true;
    }

    // estmiate the price($) of token
    function _priceOf(address token, uint256 amount) private returns (uint256) {
        return 1000 * amount;
    }

    function donate(address token, uint256 amount) public returns (bool) {
        uint256 date = _today();
        if (today != date) {
            today = date;
            paused = true;
            emit Paused(today);
        }

        require(!paused, "DFM-Don: paused temporarily");
        require(amount > 0, "DFM-Don: can't donate with zero");

        address sender = _msgSender();
        IERC20(token).transferFrom(sender, address(this), amount);
        IERC20(token).approve(dfm, amount);
        IDFMContract(dfm).donate(token, amount);
        
        uint256 price = _priceOf(token, amount);
        donations[sender] += price;
        totalDonation += price;
        donators.push(sender);

        return true;
    }

    function claim(address ddtoken, uint256 amount) public returns(bool) {
        IERC20(ddtoken).transferFrom(address(this), _msgSender(), amount);
        return true;
    }

    event Paused(uint256 today);
}