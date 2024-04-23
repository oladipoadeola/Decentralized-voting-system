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



// ["John", "Alice", "Bob", "Emma"],
// ["Doe", "Smith", "Johnson", "Brown"],
// ["john@example.com", "alice@example.com", "bob@example.com", "emma@example.com"],
// ["Male", "Female", "Male", "Female"],
// ["President", "Vice President", "Senate", "President"],
// [
//     "I promise to lead with integrity, transparency, and accountability.",
//     "I pledge to advocate for inclusivity and equality in all decisions.",
//     "I vow to uphold the values of honesty and dedication in serving our community.",
//     "I am committed to managing our resources responsibly for the benefit of all.",
// ]