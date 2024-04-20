import React, { useState } from "react";
import { ethers } from "ethers";
import Election from "../artifacts/contracts/Election.sol/Election.json";
import { contractAddress } from '../constant/constant';
import extractErrorCode from "../helpers/extractErrorCode";
import { toast } from 'react-toastify';

function CandidateRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        position: "President",
        manifesto: ""
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Connect to the Ethereum provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const abi = Election.abi; // ABI of your Solidity contract
        const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());
        
        try {
            const tx = await contract.registerCandidate(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.gender,
                formData.position,
                formData.manifesto
            );

            await tx.wait();

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                // age: "",
                gender: "",
                position: "",
                manifesto: ""
            });
            toast.success('Registration Successful');
        } catch (error) {
            toast.error(extractErrorCode
                (error.toString()))
        }
    };

    return (
        <>
            <div className="registration-container">
                <div className="container mt-5 mb-5">
                    <h4 className="mb-4">Candidate's Registration Form</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col">
                                <input type="text" className="form-control" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                            </div>
                            <div className="col">
                                <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} required />
                        </div>
                        {/* <div className="mb-3">
                            <input type="number" className="form-control" placeholder="Age" name="age" value={formData.age} onChange={handleInputChange} required />
                        </div> */}
                        <div className="mb-3">
                            <select className="form-select" name="gender" value={formData.gender} onChange={handleInputChange} required>
                                <option value="" disabled>Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <select className="form-select" name="position" value={formData.position} onChange={handleInputChange} required>
                                <option value="President">President</option>
                                <option value="Vice President">Vice President</option>
                                <option value="Senator">Senator</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <textarea className="form-control" id="manifesto" name="manifesto" rows="5" placeholder="Manifesto" value={formData.manifesto} onChange={handleInputChange}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CandidateRegistration;
