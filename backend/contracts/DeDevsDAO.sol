// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

/* 
    Interface for the FakeNFTMarketplace
*/
interface IFakeNFTMarketplace {
    /// @dev getPrice() returns the price of an NFT from the FakeNFTMarketplace
    /// @return Returns the price in Wei for an NFT
    function getPrice() external view returns (uint256);

    /// @dev available() returns whether or not the given _tokenId has already been purchased
    /// @return Returns a boolean value - true if available, false if not
    function available(uint256 _tokenId) external view returns (bool);

    /// @dev purchase() purchases an NFT from the FakeNFTMarketplace
    /// @param _tokenId - the fake NFT tokenID to purchase
    function purchase(uint256 _tokenId) external payable;
}


/**
 * Minimal interface for AiMintsNFT containing only two functions that are required
 */
interface IAiMintsNFT {
    /// @dev balanceOf return the number of NFTs owned by the given address
    /// @param owner - address the fetch number of NFTs for
    /// @return Returns the number of NFTs owned
    function balanceOf(address owner) external view returns(uint256);
}

    

contract DeDevsDAO is Ownable {
// Creating a struct named Proposal containing all relevant information
struct Proposal {
    // nftTokenId - the tokenID of the NFT to purchase from FakeNFTMarketplace if the proposal passes
    uint256 nftTokenId;
    // deadline - the UNIX timestamp until which this proposal is active. Proposal can be executed after the deadline has been exceeded.
    uint256 deadline;
    // yayVotes - number of yay votes for this proposal
    uint256 yayVotes;
    // nayVotes - number of nay votes for this proposal
    uint256 nayVotes;
    // executed - whether or not this proposal has been executed yet. Cannot be executed before the deadline has been exceeded.
    bool executed;
    // voters - a mapping of AiMintsNFT tokenIDs to booleans indicating whether that NFT has already been used to cast a vote or not
    mapping(address => bool) voters;
}

// Create a mapping of ID to Proposal
mapping(uint256 => Proposal) public proposals;
// Number of proposals that have been created
uint256 public numProposals;

IFakeNFTMarketplace nftMarketplace;
IAiMintsNFT aiMintsNFT;

// Create a payable constructor which initializes the contract
// instances for FakeNFTMarketplace and AiMintsNFT
// The payable allows this constructor to accept an ETH deposit when it is being deployed
constructor(address _nftMarketplace, address _aiMintsNFT) payable {
    nftMarketplace = IFakeNFTMarketplace(_nftMarketplace);
    aiMintsNFT = IAiMintsNFT(_aiMintsNFT);
}

// Create a modifier which only allows a function to be
// called by someone who owns at least 1 AiMintsNFT 
modifier nftHolderOnly() {
    require(aiMintsNFT.balanceOf(msg.sender) > 0, "NOT_A_DAO_MEMBER");
    _;
}

/// @dev createProposal allows a AiMintsNFT holder to create a new proposal in the DAO
/// @param _nftTokenId - the tokenID of the NFT to be purchased from FakeNFTMarketplace if this proposal passes
/// @return Returns the proposal index for the newly created proposal
function createProposal(uint256 _nftTokenId)
    external
    nftHolderOnly
    returns (uint256)
{
    require(nftMarketplace.available(_nftTokenId), "NFT_NOT_FOR_SALE");
    Proposal storage proposal = proposals[numProposals];
    proposal.nftTokenId = _nftTokenId;
    // Set the proposal's voting deadline to be (current time + 5 minutes)
    proposal.deadline = block.timestamp + 5 minutes;

    numProposals++;

    return numProposals - 1;
}


// Create a modifier which only allows a function to be
// called if the given proposal's deadline has not been exceeded yet
modifier activeProposalOnly(uint256 proposalIndex) {
    require(
        proposals[proposalIndex].deadline > block.timestamp,
        "DEADLINE_EXCEEDED"
    );
    _;
}

// Create an enum named Vote containing possible options for a vote
enum Vote {
    YAY, // YAY = 0
    NAY // NAY = 1
}

/// @dev voteOnProposal allows a AiMintsNFT holder to cast their vote on an active proposal
/// @param proposalIndex - the index of the proposal to vote on in the proposals array
/// @param vote - the type of vote they want to cast
function voteOnProposal(uint256 proposalIndex, Vote vote)
    external
    nftHolderOnly
    activeProposalOnly(proposalIndex)
{
    Proposal storage proposal = proposals[proposalIndex];

    require(!proposals[proposalIndex].voters[msg.sender], "You have already casted your vote!");
    uint256 voterNFTBalance = aiMintsNFT.balanceOf(msg.sender);
    

    if (vote == Vote.YAY) {
        proposal.yayVotes += voterNFTBalance;
    } else {
        proposal.nayVotes += voterNFTBalance;
    }

    proposal.voters[msg.sender] = true;
}


// Create a modifier which only allows a function to be
// called if the given proposals' deadline HAS been exceeded
// and if the proposal has not yet been executed
modifier inactiveProposalOnly(uint256 proposalIndex) {
    require(
        proposals[proposalIndex].deadline <= block.timestamp,
        "DEADLINE_NOT_EXCEEDED"
    );
    require(
        proposals[proposalIndex].executed == false,
        "PROPOSAL_ALREADY_EXECUTED"
    );
    _;
}

/// @dev executeProposal allows any AiMintsNFT holder to execute a proposal after it's deadline has been exceeded
/// @param proposalIndex - the index of the proposal to execute in the proposal array

function executeProposal(uint256 proposalIndex) external nftHolderOnly inactiveProposalOnly(proposalIndex) {
    Proposal storage proposal = proposals[proposalIndex];

    // If the proposal has more YAY votes than NAY votes
    // purchase the NFT from the FakeNFTMarketplace
    
    if(proposal.yayVotes > proposal.nayVotes) {
        uint256 nftPrice = nftMarketplace.getPrice();
        require(address(this).balance >= nftPrice, "NOT_ENOUGH_FUNDS");
        nftMarketplace.purchase{value: nftPrice}(proposal.nftTokenId);
    }

    proposal.executed = true;

}

/// @dev withdrawEther allows the contract owner (deployer) to withdraw the ETH from the contract
function withdrawEther() external onlyOwner {
    uint256 amount = address(this).balance;
    require(amount > 0, "Nothing to withdraw: contract balance empty");
    payable(owner()).transfer(amount);
}

// The following two functions allow the contract to accept ETH deposits
// directly from a wallet without calling a function
receive() external payable {}

fallback() external payable {}

}