// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ChatDapp {
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
    mapping(string => address) public usernameToAddress; // Key is "username.zest"
    mapping(address => mapping(address => Message[])) private privateMessages;
    Message[] private groupMessages;
    mapping(address => Message[]) private userGroupMessages;

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

    function register(
        string calldata rawUsername,
        string calldata avatarHash
    ) external {
        if (bytes(rawUsername).length == 0) revert UsernameRequired();

        string memory ensName = createEnsName(rawUsername);

        if (usernameToAddress[ensName] != address(0)) {
            revert UsernameAlreadyExists(ensName);
        }
        if (bytes(users[msg.sender].username).length != 0) {
            revert UserAlreadyRegistered(msg.sender);
        }

        users[msg.sender] = User({
            username: ensName,
            avatarHash: avatarHash,
            owner: msg.sender,
            registeredAt: block.timestamp
        });

        usernameToAddress[ensName] = msg.sender;

        emit UserRegistered(msg.sender, ensName, avatarHash);
    }

    function updateAvatar(string calldata newAvatarHash) external {
        if (bytes(users[msg.sender].username).length == 0) {
            revert UserNotFound(msg.sender);
        }
        users[msg.sender].avatarHash = newAvatarHash;
        emit AvatarUpdated(msg.sender, newAvatarHash);
    }

    function getUser(address userAddr) external view returns (User memory) {
        if (bytes(users[userAddr].username).length == 0) {
            revert UserNotFound(userAddr);
        }
        return users[userAddr];
    }

    function resolveUsername(
        string calldata rawUsername
    ) external view returns (address) {
        string memory ensName = createEnsName(rawUsername);
        return usernameToAddress[ensName];
    }

    function sendPrivateMessage(
        address to,
        string calldata contentHash
    ) external {
        if (bytes(users[msg.sender].username).length == 0) {
            revert NotRegistered(msg.sender);
        }
        if (bytes(users[to].username).length == 0) {
            revert UserNotFound(to);
        }
        if (bytes(contentHash).length == 0) {
            revert EmptyMessage();
        }

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
        if (bytes(users[msg.sender].username).length == 0) {
            revert NotRegistered(msg.sender);
        }
        return privateMessages[msg.sender][withUser];
    }

    function sendGroupMessage(string calldata contentHash) external {
        if (bytes(users[msg.sender].username).length == 0) {
            revert NotRegistered(msg.sender);
        }
        if (bytes(contentHash).length == 0) {
            revert EmptyMessage();
        }

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
        if (bytes(users[user].username).length == 0) {
            revert UserNotFound(user);
        }
        return userGroupMessages[user];
    }

    function createEnsName(
        string memory name
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(name, SUFFIX_STRING));
    }
}
