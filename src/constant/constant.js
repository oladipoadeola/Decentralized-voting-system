//  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; //hardhat
// const contractAddress = "0x32EEce76C2C2e8758584A83Ee2F522D4788feA0f" //linea
const contractAddress = "0xF9c0bF1CFAAB883ADb95fed4cfD60133BffaB18a" //volta

const data = {
    firstNames: [
        "John", "Alice", "Bob", "Emma", "Michael",
        "Sara", "David", "Laura", "Chris", "Emily"
    ],
    lastNames: [
        "Doe", "Smith", "Johnson", "Brown", "Williams",
        "Taylor", "Jones", "Anderson", "Martinez", "Wilson"
    ],
    emails: [
        "john@example.com", "alice@example.com", "bob@example.com",
        "emma@example.com", "michael@example.com", "sara@example.com",
        "david@example.com", "laura@example.com", "chris@example.com",
        "emily@example.com"
    ],
    genders: [
        "Male", "Female", "Male", "Female", "Male",
        "Female", "Male", "Female", "Male", "Female"
    ],
    positions: [
        "President", "Vice President", "Senate", "President", "Vice President",
        "Vice President", "President", "Senate", "Senate", "Senate"
    ],
    manifestos: [
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
};

module.exports = { contractAddress, data };


// New RPC url: https://linea-sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161
