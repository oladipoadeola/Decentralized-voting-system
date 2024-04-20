import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { contractAddress } from '../constant/constant';
import Election from "../artifacts/contracts/Election.sol/Election.json";

export default function Result() {
    const [candidates, setCandidates] = useState([]);
    const [provider, setProvider] = useState(null);
    const [candidatesByPosition, setCandidatesByPosition] = useState([]);

    useEffect(() => {
        getCandidatesList();
    }, []); // Empty dependency array to run only once when the component mounts

    const getCandidatesList = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            setProvider(provider);
            const contract = new ethers.Contract(
                contractAddress,
                Election.abi,
                provider.getSigner()
            );
            const candidateList = await contract.getCandidateList();
            console.log(candidateList, 'llll')

            setCandidatesByPosition(candidateList.filter(data => data.position === 'President'));

            setCandidates(candidateList);
        } catch (error) {
            console.log('Error fetching candidates:', error);
        }
    };

    function handlePositionChange(event) {
        const selectedPosition = event.target.value;
        setCandidatesByPosition(candidates.filter(data => data.position === selectedPosition));
    }


    const convertBigNumber = (bigNumberFromSolidity) => {
        if (!bigNumberFromSolidity || !bigNumberFromSolidity._hex) {
            return 0;
        }
        const javascriptNumber = ethers.BigNumber.from(bigNumberFromSolidity._hex).toString();
        console.log(javascriptNumber);
        return javascriptNumber;
    }

    const sortedCandidatesByPosition = [...candidatesByPosition].sort((a, b) => {
        return convertBigNumber(b.voteCount) - convertBigNumber(a.voteCount);
    });

    const totalVotesForPosition = sortedCandidatesByPosition.reduce((total, candidate) => total + parseInt(convertBigNumber(candidate.voteCount), 10), 0);

    const getProgressBarColor = (voteCount) => {
        const percentage = (convertBigNumber(voteCount) / totalVotesForPosition) * 100;
    
        if (percentage >= 70) {
            return 'bg-success';
        } else if (percentage >= 50 && percentage <= 69) {
            return 'bg-primary';
        } else if (percentage >= 40 && percentage <= 49) {
            return 'bg-warning';
        } else {
            return 'bg-danger';
        }
    };
    

    return (
        <>
            <div className="container py-5 big-padding">
                <div className="row section-title">
                    <h2 className="fs-5 text-center">Election Outcome Announcement</h2>
                    <p>The results of the recent election have been tallied, representing the collective voice of our community. Dive into the details and implications of this momentous occasion.</p>
                </div>

                <div className="row justify-content-center mb-5">
                    <div className="col-md-6">
                        <select className="form-select form-select-lg" aria-label="Big select example" onChange={handlePositionChange}>
                            <option disabled defaultValue>Select Position</option>
                            <option value="President">President</option>
                            <option value="Vice President">Vice President</option>
                            <option value="Senate">Senate</option>
                        </select>
                    </div>
                </div>

                <div className="row mb-5">
                    {sortedCandidatesByPosition.map(candidate => (
                        <div className="col-md-6 mb-4" key={candidate.id}>
                            <div className="row shado-md p-2 m-0 rounded shadow-md bg-white">
                                <div className="col-md-3">
                                <img className="rounded-pill shadow-md p-2" src={'assets/images/testimonial/' + (candidate.gender === 'Male' ? 'm-avatar.jpg' : 'f-avatar.jpg')} alt="" />
                                </div>
                                <div className="col-md-9 align-self-center">
                                    <h4 className="mt-3 fs-5 mb-1 fw-bold">{candidate.firstName + ' ' + candidate.lastName}</h4>
                                    <p className="fs-8 mb-2 fw-bold">Votes : {convertBigNumber(candidate.voteCount)}</p>
                                    <div className="progress">
                                    <div className={`progress-bar ${getProgressBarColor(candidate.voteCount)} fw-bold`} role="progressbar" aria-label="Example with label" style={{ width: `${totalVotesForPosition !== 0 ? (convertBigNumber(candidate.voteCount)/totalVotesForPosition)*100 : 0}%` }} aria-valuenow={totalVotesForPosition !== 0 ? (convertBigNumber(candidate.voteCount)/totalVotesForPosition)*100 : 0} aria-valuemin="0" aria-valuemax="100">{totalVotesForPosition !== 0 ? ((convertBigNumber(candidate.voteCount)/totalVotesForPosition)*100).toFixed(0) : 0}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
