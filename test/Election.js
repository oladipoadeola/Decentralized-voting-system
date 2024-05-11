const { expect } = require("chai");
const { ethers } = require("hardhat");
const { data } = require("../src/constant/constant");

describe('Election', function () {
  let electionInstance;

  // Deploy the contract
  beforeEach(async () => {
    const Election = await ethers.getContractFactory("Election");
    const args = Object.values(data).map(value => Array.isArray(value) ? value : [value]);
    electionInstance = await Election.deploy(...args);
    await electionInstance.deployed();
  });

  it("should register candidates during deployment", async () => {
    const candidateCount = await electionInstance.candidateCount();
    expect(candidateCount.toNumber()).to.equal(10);
    const candidates = await electionInstance.getCandidateList();
    expect(candidates).to.have.lengthOf(10);
  });

  it("should register a candidate", async () => {
    const candidateCountBefore = await electionInstance.candidateCount();

    // Register a new candidate
    await electionInstance.registerCandidate(
      "Eve",
      "Johnson",
      "eve@example.com",
      "Female",
      "Vice President",
      "I promise to work for the welfare of the people."
    );

    const candidateCountAfter = await electionInstance.candidateCount();
    expect(candidateCountAfter.toNumber()).to.equal(candidateCountBefore.toNumber() + 1);

    // Retrieve the newly registered candidate
    const candidates = await electionInstance.getCandidateList();
    const newCandidate = candidates[candidates.length - 1];
    expect(newCandidate.firstName).to.equal("Eve");
    expect(newCandidate.lastName).to.equal("Johnson");
    expect(newCandidate.email).to.equal("eve@example.com");
    expect(newCandidate.gender).to.equal("Female");
    expect(newCandidate.position).to.equal("Vice President");
    expect(newCandidate.manifesto).to.equal("I promise to work for the welfare of the people.");
    // Add more assertions as needed
  });

  it("should allow voter registration for age 18 or above", async () => {
    const validAge = 18;
    const firstName = 'Alice';
    const lastName = 'Smith';
    const email = 'alice@example.com';
    const gender = 'Female';
    const nationality = 'USA';
  
    const result = await electionInstance.registerVoter(
      firstName,
      lastName,
      email,
      validAge,
      gender,
      nationality
    );
  
    const voter = await electionInstance.voters(electionInstance.signer.address);
    expect(voter.firstName).to.equal(firstName);
    expect(voter.lastName).to.equal(lastName);
    expect(voter.email).to.equal(email);
    expect(voter.age.toString()).to.equal(ethers.BigNumber.from(validAge).toString()); // Convert to strings before comparing
    expect(voter.gender).to.equal(gender);
    expect(voter.nationality).to.equal(nationality);
    expect(voter.voted).to.be.false;
  });

  it("should not allow voter registration for age below 18", async () => {
    const invalidAge = 17;
    const firstName = 'Bob';
    const lastName = 'Johnson';
    const email = 'bob@example.com';
    const gender = 'Male';
    const nationality = 'Canada';

    try {
      await electionInstance.registerVoter(
        firstName,
        lastName,
        email,
        invalidAge,
        gender,
        nationality
      );
      expect.fail('Registration should have thrown an error for age below 18');
    } catch (error) {
      expect(error.message).to.include('Age must be equal to or greater than 18');
    }
  });
});