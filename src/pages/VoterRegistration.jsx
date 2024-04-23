import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import Election from "../artifacts/contracts/Election.sol/Election.json";
import { contractAddress } from '../constant/constant';
import { toast } from 'react-toastify';
import extractErrorCode from "../helpers/extractErrorCode";

function VoterRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        sex: "",
        nationality: ""
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

        const { age } = formData;
        if (parseInt(age) < 18) {
            toast.error("Age must be 18 or above for registration.");
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const abi = Election.abi;
        const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

        try {
            const tx = await contract.registerVoter(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.age,
                formData.sex,
                formData.nationality
            );

            await tx.wait();

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                age: "",
                sex: "",
                nationality: ""
            });

            toast.success('Registration Successful');

        } catch (error) {
            toast.error("Seems like you have already registered or the input email already exist")
        
        }
    };

    return (
        <div className="registration-container">
            <div className="container mt-5 mb-5">
                <h4 className="mb-4">Voter's Registration Form</h4>
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col">
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="form-control" placeholder="First Name" required />
                        </div>
                        <div className="col">
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="form-control" placeholder="Last Name" required />
                        </div>
                    </div>
                    <div className="mb-3">
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-control" placeholder="Email" required />
                    </div>
                    <div className="mb-3">
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="form-control" placeholder="Age" required />
                    </div>
                    <div className="mb-3">
                        <select name="sex" value={formData.sex} onChange={handleInputChange} className="form-select" required>
                            <option value="" disabled>Select Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <input type="text" name="nationality" value={formData.nationality} onChange={handleInputChange} className="form-control" placeholder="Nationality" required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
        </div>
    );
}

export default VoterRegistration;
