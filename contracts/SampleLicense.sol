// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SampleLicense
 * @dev NFT contract for SampleSync license provenance
 * Each NFT represents a license to use a specific sample
 */
contract SampleLicense is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // USDC token contract on Base
    IERC20 public immutable usdcToken;
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    
    // Events
    event LicenseCreated(
        uint256 indexed tokenId,
        address indexed licensee,
        address indexed rightsHolder,
        string sampleId,
        uint256 price,
        string licenseType
    );
    
    event LicenseTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );
    
    event RoyaltyPaid(
        uint256 indexed tokenId,
        address indexed rightsHolder,
        uint256 amount
    );
    
    // License data structure
    struct LicenseData {
        string sampleId;           // Unique identifier for the sample
        string sampleTitle;        // Title of the sample
        string originalArtist;     // Original artist name
        address rightsHolder;     // Rights holder address
        uint256 price;            // License price in USDC
        string licenseType;       // Type of license (commercial, shortClip, etc.)
        string terms;             // License terms
        uint256 startDate;        // License start date
        uint256 endDate;          // License end date (0 for perpetual)
        bool transferable;        // Whether license can be transferred
        uint256 royaltyRate;      // Royalty rate in basis points
    }
    
    // Mapping from token ID to license data
    mapping(uint256 => LicenseData) public licenses;
    
    // Mapping from sample ID to rights holder
    mapping(string => address) public sampleRightsHolders;
    
    // Mapping from rights holder to their samples
    mapping(address => string[]) public rightsHolderSamples;
    
    // Mapping to track revenue sharing
    mapping(uint256 => uint256) public totalRoyaltiesPaid;
    
    constructor(address _usdcToken) ERC721("SampleSync License", "SSL") {
        usdcToken = IERC20(_usdcToken);
    }
    
    /**
     * @dev Register a sample with its rights holder
     * @param sampleId Unique identifier for the sample
     * @param rightsHolder Address of the rights holder
     */
    function registerSample(
        string memory sampleId,
        address rightsHolder
    ) external onlyOwner {
        require(rightsHolder != address(0), "Invalid rights holder");
        require(sampleRightsHolders[sampleId] == address(0), "Sample already registered");
        
        sampleRightsHolders[sampleId] = rightsHolder;
        rightsHolderSamples[rightsHolder].push(sampleId);
    }
    
    /**
     * @dev Create a new license NFT
     * @param to Address to mint the license to
     * @param licenseData License information
     * @param tokenURI Metadata URI for the NFT
     */
    function createLicense(
        address to,
        LicenseData memory licenseData,
        string memory tokenURI
    ) external nonReentrant returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(licenseData.rightsHolder != address(0), "Invalid rights holder");
        require(licenseData.price > 0, "Invalid price");
        require(
            sampleRightsHolders[licenseData.sampleId] == licenseData.rightsHolder,
            "Rights holder mismatch"
        );
        
        // Calculate platform fee
        uint256 platformFeeAmount = (licenseData.price * platformFee) / 10000;
        uint256 rightsHolderAmount = licenseData.price - platformFeeAmount;
        
        // Transfer USDC from buyer to rights holder and platform
        require(
            usdcToken.transferFrom(to, licenseData.rightsHolder, rightsHolderAmount),
            "Rights holder payment failed"
        );
        
        if (platformFeeAmount > 0) {
            require(
                usdcToken.transferFrom(to, owner(), platformFeeAmount),
                "Platform fee payment failed"
            );
        }
        
        // Mint the NFT
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store license data
        licenses[tokenId] = licenseData;
        
        emit LicenseCreated(
            tokenId,
            to,
            licenseData.rightsHolder,
            licenseData.sampleId,
            licenseData.price,
            licenseData.licenseType
        );
        
        return tokenId;
    }
    
    /**
     * @dev Pay royalties for a license
     * @param tokenId Token ID of the license
     * @param amount Amount of royalties to pay
     */
    function payRoyalties(uint256 tokenId, uint256 amount) external nonReentrant {
        require(_exists(tokenId), "License does not exist");
        require(amount > 0, "Invalid amount");
        
        LicenseData memory license = licenses[tokenId];
        require(license.royaltyRate > 0, "No royalties required");
        
        // Transfer USDC from payer to rights holder
        require(
            usdcToken.transferFrom(msg.sender, license.rightsHolder, amount),
            "Royalty payment failed"
        );
        
        totalRoyaltiesPaid[tokenId] += amount;
        
        emit RoyaltyPaid(tokenId, license.rightsHolder, amount);
    }
    
    /**
     * @dev Check if a license is currently valid
     * @param tokenId Token ID of the license
     */
    function isLicenseValid(uint256 tokenId) external view returns (bool) {
        if (!_exists(tokenId)) return false;
        
        LicenseData memory license = licenses[tokenId];
        
        // Check if license has expired
        if (license.endDate > 0 && block.timestamp > license.endDate) {
            return false;
        }
        
        // Check if license has started
        if (block.timestamp < license.startDate) {
            return false;
        }
        
        return true;
    }
    
    /**
     * @dev Get license information
     * @param tokenId Token ID of the license
     */
    function getLicense(uint256 tokenId) external view returns (LicenseData memory) {
        require(_exists(tokenId), "License does not exist");
        return licenses[tokenId];
    }
    
    /**
     * @dev Get all samples for a rights holder
     * @param rightsHolder Address of the rights holder
     */
    function getRightsHolderSamples(address rightsHolder) external view returns (string[] memory) {
        return rightsHolderSamples[rightsHolder];
    }
    
    /**
     * @dev Override transfer to check transferability
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Allow minting and burning
        if (from == address(0) || to == address(0)) return;
        
        // Check if license is transferable
        require(licenses[tokenId].transferable, "License is not transferable");
        
        emit LicenseTransferred(tokenId, from, to);
    }
    
    /**
     * @dev Update platform fee (only owner)
     * @param newFee New platform fee in basis points
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }
    
    /**
     * @dev Emergency function to update rights holder for a sample
     * @param sampleId Sample identifier
     * @param newRightsHolder New rights holder address
     */
    function updateRightsHolder(
        string memory sampleId,
        address newRightsHolder
    ) external onlyOwner {
        require(newRightsHolder != address(0), "Invalid rights holder");
        
        address oldRightsHolder = sampleRightsHolders[sampleId];
        require(oldRightsHolder != address(0), "Sample not registered");
        
        sampleRightsHolders[sampleId] = newRightsHolder;
        
        // Remove from old rights holder's list
        string[] storage oldSamples = rightsHolderSamples[oldRightsHolder];
        for (uint256 i = 0; i < oldSamples.length; i++) {
            if (keccak256(bytes(oldSamples[i])) == keccak256(bytes(sampleId))) {
                oldSamples[i] = oldSamples[oldSamples.length - 1];
                oldSamples.pop();
                break;
            }
        }
        
        // Add to new rights holder's list
        rightsHolderSamples[newRightsHolder].push(sampleId);
    }
    
    /**
     * @dev Batch create licenses for efficiency
     * @param recipients Array of recipient addresses
     * @param licensesData Array of license data
     * @param tokenURIs Array of token URIs
     */
    function batchCreateLicenses(
        address[] memory recipients,
        LicenseData[] memory licensesData,
        string[] memory tokenURIs
    ) external nonReentrant returns (uint256[] memory) {
        require(
            recipients.length == licensesData.length && 
            licensesData.length == tokenURIs.length,
            "Array length mismatch"
        );
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            tokenIds[i] = createLicense(recipients[i], licensesData[i], tokenURIs[i]);
        }
        
        return tokenIds;
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete licenses[tokenId];
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
