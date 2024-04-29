import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers.js
import { contractAddress } from '../constant/constant';
import Election from "../artifacts/contracts/Election.sol/Election.json";
import extractErrorCode from '../helpers/extractErrorCode';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const Home = (props) => {
    const [provider, setProvider] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const convertBigNumber = (bigNumberFromSolidity) => {
        if (!bigNumberFromSolidity || !bigNumberFromSolidity._hex) {
            return 0;
        }
        const javascriptNumber = ethers.BigNumber.from(bigNumberFromSolidity._hex).toNumber();
        return javascriptNumber;
    }


    // const handleVote = async (candidateId) => {
    //     try {
    //         if (!props.contract) {
    //             throw new Error('Contract not initialized');
    //         }
    //         await props.contract.vote(candidateId);
    //         setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate.id !== candidateId));
    //         toast.success("Your vote is successful")
    //         setTimeout(() => {
    //             window.location.reload();
    //         }, 15000);
    //     } catch (error) {
    //         toast.error(extractErrorCode(error.message))
    //     }
    // };

    const provide = new ethers.providers.Web3Provider(window.ethereum);
    const handleVote = async (candidateId) => {
        try {
            if (!props.contract) {
                throw new Error('Contract not initialized');
            }

            showLoader();

            const transaction = await props.contract.vote(candidateId);
            const transactionHash = transaction.hash;

            const intervalId = setInterval(async () => {
                const transactionStatus = await getTransactionStatus(transactionHash);
                if (transactionStatus === 'confirmed') {
                    clearInterval(intervalId);
                    setCandidates(prevCandidates => prevCandidates.filter(candidate => candidate.id !== candidateId));
                    toast.success("Your vote is successful")
                    setTimeout(() => {
                        window.location.reload();
                    }, 15000);
                }
            }, 3000);
        } catch (error) {
            hideLoader();
            toast.error(extractErrorCode(error.message));
        }
    };

    // Show loader
    function showLoader() {
        setIsLoading(true)
        console.log('Loader displayed');
    }

    // Hide loader
    function hideLoader() {
        console.log('Loader hidden');
        setIsLoading(false)

    }

    async function getTransactionStatus(transactionHash) {
        const receipt = await provide.getTransactionReceipt(transactionHash);
        if (receipt && receipt.status === 1) {
            return 'confirmed';
        } else {
            return 'pending';
        }
    }

    const truncateWord = (word, maxLength) => {
        if (!word) return null;
        if (word.length > maxLength) {
            const truncatedWord = word.substring(0, maxLength) + "...";
            return <span title={word}>{truncatedWord}</span>;
        } else {
            return <span>{word}</span>;
        }
    }

    return (
        <div>
            {isLoading ? <Loader/> : ''}
            <div className="home">
                <div className="container-xl big-padding">
                    <div className="row section-title">
                        <h2 className="fs-4">E-VOTE - A blockchain based application</h2>
                        <p>Welcome to our secure and convenient electronic voting platform! We're delighted to have you participate
                            in the democratic process from the comfort of your own home..</p>
                    </div>
                    {props.error === null && !props.isAdmin && (
                        <div align="center">
                            {props.isElectionStarted ? (
                                <span className="pill-button btn-success blink text-white p-2" style={{ cursor: 'not-allowed' }}>The election has started, now you are permitted to vote</span>
                            ) : (
                                <span className="pill-button btn-danger blink text-white p-2" style={{ cursor: 'not-allowed' }}>The election has not started, you are not permitted to vote </span>
                            )}
                            <br />
                            <br />
                        </div>
                    )}

                    <div className="row">
                        {props.error === null ? props.candidates.map(candidate => (
                            <div className="col-lg-4 col-md-6">
                                <div className="text-white text-center mb-4 votcard shadow-md bg-white p-4 pt-5">
                                    <img className="rounded-pill shadow-md p-2" src={'assets/images/testimonial/' + (candidate.gender === 'Male' ? 'm-avatar.jpg' : 'f-avatar.jpg')} alt="" />
                                    <h4 className="mt-3 fs-5 mb-1 fw-bold">{candidate.firstName + ' ' + candidate.lastName}</h4>
                                    <h6 className="fs-7">Running to Be: <span className="text-primary fw-bold">{candidate.position}</span></h6>
                                    <p className="text-dark mt-3 mb-3 fs-8">{truncateWord(candidate.manifesto, 70)}.</p>
                                    <button data-bs-toggle="modal" data-bs-target="#exampleModal"
                                        className="btn btn-primary fw-bolder fs-8">View Manifesto </button>
                                    {props.account ? candidate.votersWhoVotedForCandidate.map(voter => voter.toLowerCase()).includes(props.account.toLowerCase()) ? (
                                        <button className="btn btn-success fw-bolder px-4 ms-2 fs-8" disabled>Voted</button>
                                    ) : (
                                        <button className="btn btn-danger fw-bolder px-4 ms-2 fs-8" onClick={() => handleVote(candidate.id)}>Vote</button>
                                    )
                                        : (<button className="btn btn-danger fw-bolder px-4 ms-2 fs-8" onClick={() => handleVote(candidate.id)}>Vote</button>)}
                                </div>
                            </div>
                        )) :
                            <div className='p-5 text-center'>
                                <span className="pill-button btn-info text-white p-2" style={{ cursor: 'not-allowed' }}>Looks like you are not connected to Metamask!</span>
                            </div>}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;




// #eb6e01
// #a0a603

