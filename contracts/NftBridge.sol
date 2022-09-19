// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';
import '@chainlink/contracts/src/v0.8/ConfirmedOwner.sol';

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract APIConsumer is ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;

    // uint256 public volume;

    bytes32 private jobId;
    uint256 private fee;
    mapping(bytes32 => uint) public requestStage;
    mapping(bytes32 => string) public transaction_url;

    event RequestVolume(bytes32 indexed requestId, string transaction_url);

    /**
     * @notice Initialize the link token and target oracle
     *
     * Goerli Testnet details:
     * Link Token: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Oracle: 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7 (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor() ConfirmedOwner(msg.sender) {
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = '7d80a6386ef543a3abb52817f6707e3b';
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function deleteContract(string memory chainId, string memory contract_address, string memory nft_id, string memory from_address) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest('7d80a6386ef543a3abb52817f6707e3b', address(this), this.fulfill.selector);

        string memory url = string(abi.encodePacked('https://thentic.herokuapp.com/api/v1/deleteNft?from_chain_id=', chainId, '&contract_address=', contract_address, '&nft_id=', nft_id,'&from_address=',from_address));
        // Set the URL to perform the GET request on
        req.add('get', url);
        req.add('path', 'transaction_url'); // Chainlink nodes 1.0.0 and later support this format

        requestStage[requestId]=1;
        sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
    }

    function createContract(string memory chain_id, string memory name, string memory short_name) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest('7d80a6386ef543a3abb52817f6707e3b', address(this), this.fulfill.selector);
        string memory url = string(abi.encodePacked('https://thentic.herokuapp.com/api/v1/createNftContract?chain_id=', chain_id, '&name=', name, '&short_name=', short_name));
        // Set the URL to perform the GET request on
        req.add('get', url);
        req.add('path', 'transaction_url'); // Chainlink nodes 1.0.0 and later support this format
        
        requestStage[requestId]=2;
        sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
    }


    function mintNft(string memory chain_id, string memory contract_address, string memory nft_id, string memory nft_data, string memory to_address) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest('7d80a6386ef543a3abb52817f6707e3b', address(this), this.fulfill.selector);
        
        string memory url = string(abi.encodePacked('https://thentic.herokuapp.com/api/v1/mintNft?chain_id=', chain_id, '&contract_address=', contract_address, '&nft_id=', nft_id, '&nft_data=',nft_data,'&to_address=',to_address));
        // Set the URL to perform the GET request on
        req.add('get', url);
        req.add('path', 'transaction_url'); // Chainlink nodes 1.0.0 and later support this format
        
        requestStage[requestId]=3;
        sendChainlinkRequest(req, (1 * LINK_DIVISIBILITY) / 10); // 0,1*10**18 LINK
    }

    function fulfill(bytes32 _requestId, string memory _id) public recordChainlinkFulfillment(_requestId) {
        emit Fulfilled(_requestId, _id);
        transaction_url[_requestId] = _id;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }
}
