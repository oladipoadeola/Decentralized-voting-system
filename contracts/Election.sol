// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract Election {
    address public admin;
    bool public electionStarted;
    
    struct Candidate {
        uint256 id;
        string firstName;
        string lastName;
        string email;
        string gender;
        string position;
        string manifesto;
        uint256 voteCount;
        bool registered;
        address[] votersWhoVotedForCandidate;
    }
    
    struct Voter {
        string firstName;
        string lastName;
        string email;
        uint256 age;
        string gender;
        string nationality;
        mapping(string => bool) votedPositions; // Track voted positions
        bool voted;
    }
    
    Candidate[] public candidates; // Store candidates in an array
    
    mapping(address => Voter) public voters;
    
    mapping(string => bool) public candidateEmailExists; // Mapping to track used email addresses

    mapping(string => bool) public voterEmailExists; // Mapping to track used email addresses


    uint256 public candidateCount; // Track candidate count
    
    event CandidateRegistered(uint256 id, string firstName, string lastName, string email, string gender, string position, string manifesto);
    event VoteCast(address indexed voterAddress, uint256 indexed candidateId);
    event ElectionResult(string position, string winner);
    event VoterRegistered(address indexed voterAddress, string firstName, string lastName, string email, uint256 age, string gender, string nationality);
    
        // Event definition
    event ElectionResultss(string position, string winner, uint256 voteCount);

    event AdminAccessDenied(string message);
    modifier onlyAdmin() {
        if (msg.sender != admin) {
            emit AdminAccessDenied("___Only admin can perform this operation___");
            return;
        }
        _;
    }
    
    modifier onlyDuringElection() {
        require(electionStarted, "___Election has not started yet___");
        _;
    }
    
    string[] public positions = ["President", "Vice President", "Senator"];

    constructor(
        string[] memory _firstNames,
        string[] memory _lastNames,
        string[] memory _emails,
        string[] memory _genders,
        string[] memory _positions,
        string[] memory _manifestos
    ) {
        admin = msg.sender;
        require(
            _firstNames.length == _lastNames.length &&
            _lastNames.length == _emails.length &&
            _emails.length == _genders.length &&
            _genders.length == _positions.length &&
            _positions.length == _manifestos.length,
            "___Invalid input lengths___"
        );
        
        for (uint256 i = 0; i < _firstNames.length; i++) {
            address[] memory emptyVotersList;
            candidates.push(Candidate(
                i + 1,
                _firstNames[i],
                _lastNames[i],
                _emails[i],
                _genders[i],
                _positions[i],
                _manifestos[i],
                0,
                true,
                emptyVotersList
            ));
            emit CandidateRegistered(
                i + 1,
                _firstNames[i],
                _lastNames[i],
                _emails[i],
                _genders[i],
                _positions[i],
                _manifestos[i]
            );
        }
        
        candidateCount = _firstNames.length;

    }

    function startElection() public onlyAdmin {
        electionStarted = true;
    }

    modifier validPosition(string memory _position) {
        bool isValid = false;
        for (uint256 i = 0; i < positions.length; i++) {
            if (keccak256(abi.encodePacked(positions[i])) == keccak256(abi.encodePacked(_position))) {
                isValid = true;
                break;
            }
        }
        require(isValid, "___Invalid position___");
        _;
    }

    function registerCandidate(string memory _firstName, string memory _lastName, string memory _email,string memory _gender, string memory _position, string memory _manifesto) public onlyAdmin validPosition(_position) {
        require(!electionStarted, "___Cannot register candidates after election has started___");
        require(!candidateEmailExists[_email], "___Email address already exists___");
        candidateCount++;
        address[] memory emptyVotersList;
        candidates.push(Candidate(candidateCount, _firstName, _lastName, _email, _gender, _position, _manifesto, 0, true, emptyVotersList));
        candidateEmailExists[_email] = true;
        emit CandidateRegistered(candidateCount, _firstName, _lastName, _email, _gender, _position, _manifesto);
    }

    function vote(uint256 _candidateId) public onlyDuringElection {
        // require(!voters[msg.sender].voted, "___You have already voted___");
        require(_candidateId > 0 && _candidateId <= candidates.length, "___Invalid candidate ID___");
        require(candidates[_candidateId - 1].registered, "___Candidate not found or not registered___");
        require(bytes(voters[msg.sender].firstName).length > 0, "___You are not a registered voter___");
        
        string memory position = candidates[_candidateId - 1].position;
        
        require(!voters[msg.sender].votedPositions[position] || !voters[msg.sender].voted, "___You have already voted for a candidate in this position___");
        
        candidates[_candidateId - 1].voteCount++;
        candidates[_candidateId - 1].votersWhoVotedForCandidate.push(msg.sender);
        voters[msg.sender].votedPositions[position] = true;
        voters[msg.sender].voted = true;
        emit VoteCast(msg.sender, _candidateId);
    }
    
    function endElection() public onlyAdmin {
        require(electionStarted, "___Election has not started yet___");
        // Clear all votes
        // for (uint256 i = 0; i < candidates.length; i++) {
        //     candidates[i].voteCount = 0;
        // }

        electionStarted = false;
    }
    
    function getCandidateList() public view returns (Candidate[] memory) {
        return candidates;
    }
    
    function registerVoter(string memory _firstName, string memory _lastName, string memory _email, uint256 _age, string memory _gender, string memory _nationality) public {
        require(bytes(_firstName).length > 0 && bytes(_lastName).length > 0, "___First name and last name cannot be empty___");
        require(bytes(_email).length > 0, "___Email cannot be empty___");
        require(_age >= 18, "___Age must be equal to or greater than 18___");
        require(!voterEmailExists[_email], "___Email address already exists___");
        require(bytes(voters[msg.sender].firstName).length == 0, "___You are already a registered voter___"); // Check if sender is already registered

        Voter storage newVoter = voters[msg.sender];
        newVoter.firstName = _firstName;
        newVoter.lastName = _lastName;
        newVoter.email = _email;
        newVoter.age = _age;
        newVoter.gender = _gender;
        newVoter.nationality = _nationality;
        newVoter.voted = false;
        voterEmailExists[_email] = true;

        emit VoterRegistered(msg.sender, _firstName, _lastName, _email, _age, _gender, _nationality);
    }

}
