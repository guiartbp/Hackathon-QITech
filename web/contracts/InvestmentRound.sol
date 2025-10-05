// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InvestmentRound
 * @dev Smart contract for managing investment rounds with investor signatures and terms
 * Handles investor onboarding, term acceptance, and investment tracking
 */
contract InvestmentRound {
    
    // Structs
    struct Investor {
        address walletAddress;
        string investorId; // ID from backend system
        uint256 investmentAmount;
        uint256 percentage; // Percentage of total round (scaled by 10000, so 1500 = 15%)
        bool hasSigned;
        uint256 signedAt;
    }
    
    struct RoundTerms {
        uint256 totalAmount;
        uint256 minimumInvestment;
        uint256 maximumInvestment;
        uint256 roundDeadline;
        string termsHash; // Hash of investment terms document
        bool isActive;
    }
    
    // State variables
    address public owner;
    address public tomador; // Borrower/company receiving investment
    string public tomadorId; // Backend ID for tomador
    
    RoundTerms public roundTerms;
    
    mapping(address => Investor) public investors;
    mapping(string => address) public investorIdToAddress;
    address[] public investorAddresses;
    
    uint256 public totalInvested;
    uint256 public investorCount;
    bool public roundClosed;
    
    // Events
    event RoundCreated(
        address indexed tomador,
        string tomadorId,
        uint256 totalAmount,
        uint256 deadline,
        string termsHash
    );
    
    event InvestorAdded(
        address indexed investor,
        string investorId,
        uint256 amount,
        uint256 percentage
    );
    
    event InvestorSigned(
        address indexed investor,
        string investorId,
        uint256 timestamp
    );
    
    event RoundClosed(uint256 totalInvested, uint256 investorCount);
    
    event TermsUpdated(string newTermsHash);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyTomador() {
        require(msg.sender == tomador, "Only tomador can call this function");
        _;
    }
    
    modifier roundActive() {
        require(roundTerms.isActive && !roundClosed, "Round is not active");
        require(block.timestamp <= roundTerms.roundDeadline, "Round deadline has passed");
        _;
    }
    
    modifier validInvestor() {
        require(investors[msg.sender].walletAddress == msg.sender, "Not a registered investor");
        _;
    }
    
    // Constructor
    constructor(
        address _tomador,
        string memory _tomadorId,
        uint256 _totalAmount,
        uint256 _minimumInvestment,
        uint256 _maximumInvestment,
        uint256 _roundDurationDays,
        string memory _termsHash
    ) {
        owner = msg.sender;
        tomador = _tomador;
        tomadorId = _tomadorId;
        
        roundTerms = RoundTerms({
            totalAmount: _totalAmount,
            minimumInvestment: _minimumInvestment,
            maximumInvestment: _maximumInvestment,
            roundDeadline: block.timestamp + (_roundDurationDays * 1 days),
            termsHash: _termsHash,
            isActive: true
        });
        
        emit RoundCreated(_tomador, _tomadorId, _totalAmount, roundTerms.roundDeadline, _termsHash);
    }
    
    /**
     * @dev Add investor to the round (only owner/backend can add)
     * @param _investorAddress Wallet address of investor
     * @param _investorId Backend ID of investor
     * @param _investmentAmount Amount investor will invest
     * @param _percentage Percentage of total round (scaled by 10000)
     */
    function addInvestor(
        address _investorAddress,
        string memory _investorId,
        uint256 _investmentAmount,
        uint256 _percentage
    ) external onlyOwner roundActive {
        require(_investorAddress != address(0), "Invalid investor address");
        require(_investmentAmount >= roundTerms.minimumInvestment, "Investment below minimum");
        require(_investmentAmount <= roundTerms.maximumInvestment, "Investment above maximum");
        require(investors[_investorAddress].walletAddress == address(0), "Investor already exists");
        require(totalInvested + _investmentAmount <= roundTerms.totalAmount, "Would exceed round total");
        
        investors[_investorAddress] = Investor({
            walletAddress: _investorAddress,
            investorId: _investorId,
            investmentAmount: _investmentAmount,
            percentage: _percentage,
            hasSigned: false,
            signedAt: 0
        });
        
        investorIdToAddress[_investorId] = _investorAddress;
        investorAddresses.push(_investorAddress);
        
        totalInvested += _investmentAmount;
        investorCount++;
        
        emit InvestorAdded(_investorAddress, _investorId, _investmentAmount, _percentage);
    }
    
    /**
     * @dev Investor signs the investment terms
     * This is the key function for legal compliance - investor must call this themselves
     */
    function signTerms() external validInvestor roundActive {
        require(!investors[msg.sender].hasSigned, "Already signed");
        
        investors[msg.sender].hasSigned = true;
        investors[msg.sender].signedAt = block.timestamp;
        
        emit InvestorSigned(msg.sender, investors[msg.sender].investorId, block.timestamp);
    }
    
    /**
     * @dev Close the investment round (only tomador can close)
     */
    function closeRound() external onlyTomador {
        require(!roundClosed, "Round already closed");
        roundClosed = true;
        roundTerms.isActive = false;
        
        emit RoundClosed(totalInvested, investorCount);
    }
    
    /**
     * @dev Update terms hash (only owner, and only if no investors have signed yet)
     * @param _newTermsHash New hash of the terms document
     */
    function updateTerms(string memory _newTermsHash) external onlyOwner {
        // Check that no investor has signed yet
        for (uint i = 0; i < investorAddresses.length; i++) {
            require(!investors[investorAddresses[i]].hasSigned, "Cannot update terms after signatures");
        }
        
        roundTerms.termsHash = _newTermsHash;
        emit TermsUpdated(_newTermsHash);
    }
    
    /**
     * @dev Get investor details by address
     */
    function getInvestor(address _investorAddress) external view returns (
        string memory investorId,
        uint256 investmentAmount,
        uint256 percentage,
        bool hasSigned,
        uint256 signedAt
    ) {
        Investor memory investor = investors[_investorAddress];
        return (
            investor.investorId,
            investor.investmentAmount,
            investor.percentage,
            investor.hasSigned,
            investor.signedAt
        );
    }
    
    /**
     * @dev Get investor details by backend ID
     */
    function getInvestorById(string memory _investorId) external view returns (
        address walletAddress,
        uint256 investmentAmount,
        uint256 percentage,
        bool hasSigned,
        uint256 signedAt
    ) {
        address investorAddress = investorIdToAddress[_investorId];
        require(investorAddress != address(0), "Investor not found");
        
        Investor memory investor = investors[investorAddress];
        return (
            investor.walletAddress,
            investor.investmentAmount,
            investor.percentage,
            investor.hasSigned,
            investor.signedAt
        );
    }
    
    /**
     * @dev Get all investor addresses
     */
    function getAllInvestors() external view returns (address[] memory) {
        return investorAddresses;
    }
    
    /**
     * @dev Get signed investor addresses only
     */
    function getSignedInvestors() external view returns (address[] memory) {
        uint256 signedCount = 0;
        
        // Count signed investors
        for (uint i = 0; i < investorAddresses.length; i++) {
            if (investors[investorAddresses[i]].hasSigned) {
                signedCount++;
            }
        }
        
        // Create array of signed investors
        address[] memory signedInvestors = new address[](signedCount);
        uint256 index = 0;
        
        for (uint i = 0; i < investorAddresses.length; i++) {
            if (investors[investorAddresses[i]].hasSigned) {
                signedInvestors[index] = investorAddresses[i];
                index++;
            }
        }
        
        return signedInvestors;
    }
    
    /**
     * @dev Get round statistics
     */
    function getRoundStats() external view returns (
        uint256 _totalInvested,
        uint256 _investorCount,
        uint256 _signedInvestorCount,
        bool _roundClosed,
        bool _roundActive,
        uint256 _deadline
    ) {
        uint256 signedCount = 0;
        for (uint i = 0; i < investorAddresses.length; i++) {
            if (investors[investorAddresses[i]].hasSigned) {
                signedCount++;
            }
        }
        
        return (
            totalInvested,
            investorCount,
            signedCount,
            roundClosed,
            roundTerms.isActive && !roundClosed && block.timestamp <= roundTerms.roundDeadline,
            roundTerms.roundDeadline
        );
    }
    
    /**
     * @dev Check if all investors have signed
     */
    function allInvestorsSigned() external view returns (bool) {
        if (investorCount == 0) return false;
        
        for (uint i = 0; i < investorAddresses.length; i++) {
            if (!investors[investorAddresses[i]].hasSigned) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * @dev Emergency pause (only owner)
     */
    function pauseRound() external onlyOwner {
        roundTerms.isActive = false;
    }
    
    /**
     * @dev Emergency unpause (only owner)
     */
    function unpauseRound() external onlyOwner {
        require(!roundClosed, "Cannot unpause closed round");
        require(block.timestamp <= roundTerms.roundDeadline, "Round deadline has passed");
        roundTerms.isActive = true;
    }
}