const { expect } = require("chai");
const { ethers } = require("hardhat");
const { data } = require("../src/constant/constant");

describe('Election', function () {
    let electionInstance;

    beforeEach(async () => {
        const Election = await ethers.getContractFactory("Election");
        const args = Object.values(data).map(value => Array.isArray(value) ? value : [value]);
        // Deploy the contract
        electionInstance = await Election.deploy(...args);
        await electionInstance.deployed();
    });

    it("should register candidates during deployment", async () => {
        const candidateCount = await electionInstance.candidateCount();
        expect(candidateCount.toNumber()).to.equal(6);

        const candidates = await electionInstance.getCandidateList();
        expect(candidates).to.have.lengthOf(6);

        // Perform additional assertions on candidate details if needed
    });

    // Write more test cases as needed

});



["John", "Alice", "Bob", "Emma", "Michael", "Sara", "David", "Laura", "Chris", "Emily"],
["Doe", "Smith", "Johnson", "Brown", "Williams", "Taylor", "Jones", "Anderson", "Martinez", "Wilson"],
["john@example.com", "alice@example.com", "bob@example.com", "emma@example.com", "michael@example.com", "sara@example.com", "david@example.com", "laura@example.com", "chris@example.com", "emily@example.com"],
["Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female", "Male", "Female"],
["President", "Vice President", "Senate", "President", "Vice President", "Vice President", "President", "Senate", "Senate", "Senate"],
[
    "I promise to lead with integrity, transparency, and accountability.",
    "I pledge to advocate for inclusivity and equality in all decisions.",
    "I vow to uphold the values of honesty and dedication in serving our community.",
    "I am committed to managing our resources responsibly for the benefit of all.",
    "I will strive to foster a collaborative environment for progress and innovation.",
    "I promise to listen to the concerns of every member and work towards solutions.",
    "I pledge to prioritize sustainability and environmental conservation efforts.",
    "I vow to promote diversity and celebrate the uniqueness of each individual.",
    "I am committed to promoting education and lifelong learning opportunities.",
    "I will work tirelessly to ensure the well-being and prosperity of our community."
]