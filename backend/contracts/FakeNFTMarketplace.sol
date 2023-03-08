// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract FakeNFTMarketplace {
    /// @dev Maintain a mapping of Fake TokenId to Owner Addresse
    mapping(uint => address) public tokens;
    /// @dev Set the purchase price for each Fake NFT
    uint256 nftPrice = 0.1 ether;

    /// @dev purchase() accepts ETH and marks the owner of the given tokenId as the caller address
    /// @param _tokenId - the fake NFT token Id to purchase
    function purchase(uint _tokenId) external payable {
        require(msg.value == nftPrice, "This NFT costs 0.1 ether");
        tokens[_tokenId] = msg.sender;
    }

    /// @dev getPrice() returns the price of one NFT
    function getPrice() external view returns(uint256) {
        return nftPrice;
    }

    /// @dev available() checks whether the give tokenId has already been sold or not
    /// @param _tokenId - the tokenId to check for
    function available(uint256 _tokenId) external view returns(bool) {
        /// address(0) - 0x00000000000000000000000000000000
        // This is the default value of addresses in Solidity
        if(tokens[_tokenId] == address(0)) {
            return true;
        }
        return false;
    }
}