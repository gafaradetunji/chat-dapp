// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

contract ChatDapp is AutomationCompatibleInterface {
    AggregatorV3Interface internal btcToUsdDataFeed;
    AggregatorV3Interface internal ethToUsdDataFeed;
    AggregatorV3Interface internal btcToEthDataFeed;

    uint256 public lastTimeStamp;
    uint256 public interval;

    int256 public lastBtcUsd;
    int256 public lastEthUsd;
    int256 public lastBtcEth;

    string private constant SUFFIX_STRING = ".zest";

    struct User {
        string username;
        string avatarHash;
        address owner;
        uint256 registeredAt;
    }

    struct Message {
        address from;
        address to;
        string contentHash;
        uint256 timestamp;
    }

    error UsernameRequired();
    error UsernameAlreadyExists(string username);
    error UserAlreadyRegistered(address user);
    error UserNotFound(address user);
    error NotRegistered(address user);
    error EmptyMessage();

    mapping(address => User) public users;
    mapping(string => address) public usernameToAddress;
    mapping(address => mapping(address => Message[])) private privateMessages;
    Message[] private groupMessages;
    mapping(address => Message[]) private userGroupMessages;

    address[] private registeredUsers;
    uint256 public totalUsers;

    event UserRegistered(
        address indexed user,
        string username,
        string avatarHash
    );
    event AvatarUpdated(address indexed user, string newAvatarHash);
    event PrivateMessageSent(
        address indexed from,
        address indexed to,
        string contentHash,
        uint256 timestamp
    );
    event GroupMessageSent(
        address indexed from,
        string contentHash,
        uint256 timestamp
    );
    event PricePosted(
        int256 btcUsd,
        int256 ethUsd,
        int256 btcEth,
        uint256 timestamp
    );

    constructor(uint256 updateInterval) {
        btcToUsdDataFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
        ethToUsdDataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        btcToEthDataFeed = AggregatorV3Interface(
            0x5fb1616F78dA7aFC9FF79e0371741a747D2a7F22
        );

        interval = updateInterval;
        lastTimeStamp = block.timestamp;
    }

    function register(
        string calldata rawUsername,
        string calldata avatarHash
    ) external {
        if (bytes(rawUsername).length == 0) revert UsernameRequired();

        string memory ensName = createEnsName(rawUsername);

        if (usernameToAddress[ensName] != address(0))
            revert UsernameAlreadyExists(ensName);
        if (bytes(users[msg.sender].username).length != 0)
            revert UserAlreadyRegistered(msg.sender);
        if (users[msg.sender].owner != address(0))
            revert UserAlreadyRegistered(msg.sender);

        users[msg.sender] = User({
            username: ensName,
            avatarHash: avatarHash,
            owner: msg.sender,
            registeredAt: block.timestamp
        });

        usernameToAddress[ensName] = msg.sender;
        registeredUsers.push(msg.sender);
        totalUsers++;

        emit UserRegistered(msg.sender, ensName, avatarHash);
    }

    function updateAvatar(string calldata newAvatarHash) external {
        if (bytes(users[msg.sender].username).length == 0)
            revert UserNotFound(msg.sender);
        users[msg.sender].avatarHash = newAvatarHash;
        emit AvatarUpdated(msg.sender, newAvatarHash);
    }

    function getUser(address userAddr) external view returns (User memory) {
        if (bytes(users[userAddr].username).length == 0)
            revert UserNotFound(userAddr);
        return users[userAddr];
    }

    function resolveUsername(
        string calldata rawUsername
    ) external view returns (address) {
        string memory ensName = createEnsName(rawUsername);
        return usernameToAddress[ensName];
    }

    function getTotalUsers() external view returns (uint256) {
        return totalUsers;
    }

    function getAllUserAddresses() external view returns (address[] memory) {
        return registeredUsers;
    }

    function isUserRegistered(address userAddr) external view returns (bool) {
        return bytes(users[userAddr].username).length != 0;
    }

    function sendPrivateMessage(
        address to,
        string calldata contentHash
    ) external {
        if (bytes(users[msg.sender].username).length == 0)
            revert NotRegistered(msg.sender);
        if (bytes(users[to].username).length == 0) revert UserNotFound(to);
        if (bytes(contentHash).length == 0) revert EmptyMessage();

        Message memory newMessage = Message({
            from: msg.sender,
            to: to,
            contentHash: contentHash,
            timestamp: block.timestamp
        });

        privateMessages[msg.sender][to].push(newMessage);
        privateMessages[to][msg.sender].push(newMessage);

        emit PrivateMessageSent(msg.sender, to, contentHash, block.timestamp);
    }

    function getPrivateMessages(
        address withUser
    ) external view returns (Message[] memory) {
        return privateMessages[msg.sender][withUser];
    }

    function sendGroupMessage(string calldata contentHash) external {
        if (bytes(contentHash).length == 0) revert EmptyMessage();

        Message memory newMessage = Message({
            from: msg.sender,
            to: address(0),
            contentHash: contentHash,
            timestamp: block.timestamp
        });

        groupMessages.push(newMessage);
        userGroupMessages[msg.sender].push(newMessage);
        emit GroupMessageSent(msg.sender, contentHash, block.timestamp);
    }

    function getGroupMessages() external view returns (Message[] memory) {
        return groupMessages;
    }

    function getUserGroupMessages(
        address user
    ) external view returns (Message[] memory) {
        return userGroupMessages[user];
    }

    function createEnsName(
        string memory name
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(name, SUFFIX_STRING));
    }

    function checkUpkeep(
        bytes calldata
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        performData = "";
        return (upkeepNeeded, performData);
    }

    function performUpkeep(bytes calldata) external override {
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;

            (, int256 btcPrice, , , ) = btcToUsdDataFeed.latestRoundData();
            (, int256 ethPrice, , , ) = ethToUsdDataFeed.latestRoundData();
            (, int256 btcEthPrice, , , ) = btcToEthDataFeed.latestRoundData();

            lastBtcUsd = btcPrice;
            lastEthUsd = ethPrice;
            lastBtcEth = btcEthPrice;

            emit PricePosted(btcPrice, ethPrice, btcEthPrice, block.timestamp);
        }
    }
}
