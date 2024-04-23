const contractAddress = "0x46b142DD1E924FAb83eCc3c08e4D46E82f005e0E"; //hardhat
// const contractAddress = "0xF85895D097B2C25946BB95C4d11E2F3c035F8f0C"

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
