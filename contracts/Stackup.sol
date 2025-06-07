// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StackUp {

    enum playerQuestStatus {
        NOT_JOINED,
        JOINED,
        SUBMITTED
    }

    struct Quest {
        uint256 questId;
        uint256 numberOfPlayers;
        string title;
        uint8 reward;
        uint256 numberOfRewards;
    }

    address public admin;
    uint256 public nextQuestId;
    mapping(uint256 => Quest) public quests;
    mapping(address => mapping(uint256 => playerQuestStatus)) public playerQuestStatuses;

    constructor() {
        admin = msg.sender;
    }

    function createQuest(string calldata _title, uint8 _reward, uint256 _numberOfRewards ) external {
        require(msg.sender == admin, "Only the admin can create a quest.");
        quests[nextQuestId] = Quest(nextQuestId, 0, _title, _reward, _numberOfRewards);
        nextQuestId++;
    }

    function joinQuest(uint256 _questId) external questExists(_questId) {
        require(playerQuestStatuses[msg.sender][_questId] == playerQuestStatus.NOT_JOINED, "Player already joined/submitted this quest.");
        playerQuestStatuses[msg.sender][_questId] = playerQuestStatus.JOINED;

        Quest storage quest = quests[_questId];
        quest.numberOfPlayers++;
    }

    function submitQuest(uint256 _questId) external questExists(_questId) {
        require(playerQuestStatuses[msg.sender][_questId] ==
        playerQuestStatus.JOINED, "Player must first join the quest");
        
        playerQuestStatuses[msg.sender][_questId] = playerQuestStatus.SUBMITTED;
    }

    modifier questExists(uint256 _questId) {
        require(quests[_questId].reward != 0, "Quest with given id does not exist");
        _;
    }
}
