import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers'; // Import ethers.js
import extractErrorCode from '../helpers/extractErrorCode';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Modal from 'react-modal';
import MessageLink from '../components/MessageLink';
import ReasonModal from '../components/ReasonsModal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};
const Home = (props) => {
    const [candidates, setCandidates] = useState([]);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [manifesto, setManifesto] = useState('');

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const handleVote = async (candidateId) => {
        try {
            // if (!props.contract) {
            //     throw new Error('Contract not initialized');
            // }

            if (!props.isConnected) {
                toast.error(!props.isAdmin ? "You have to login to vote. Go to the login page" : 'You cannot vote as an admin');
                return;
            }

            props.showLoader();
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
            props.hideLoader();
            toast.error(
                <MessageLink error={error} openReasonModal={props.openReasonModal} />
            );

        }
    };

    async function getTransactionStatus(transactionHash) {
        const receipt = await provider.getTransactionReceipt(transactionHash);
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

    function openModal(candidate) {
        setIsOpen(true);
        setManifesto(candidate.manifesto);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    let modalStyle = {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '500px',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }
    }
    return (
        <div>
            {props.isLoading ? <Loader /> : ''}
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
                                    <button
                                        className="btn btn-primary fw-bolder fs-8" type='button' onClick={() => openModal(candidate)}>View Manifesto </button>
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
                                <span className="pill-button btn-info text-white p-2" style={{ cursor: 'not-allowed' }}>Looks like you are not connected to any Metamask account!</span>
                            </div>}

                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={modalStyle}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '20px', color: '#333' }}>Manifesto</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#555' }}>{manifesto}</p>
                    <button className='btn btn-danger' style={{ marginTop: '30px' }} onClick={closeModal}>Close</button>
                </div>
            </Modal>

            <ReasonModal openErrorReasonModal={props.openErrorReasonModal} closeReasonModal={props.closeReasonModal} errorReasons={[
                'You are not a registered voter',
                'You have already voted for a candidate in this position',
                'Election has not started yet'
            ]} />
        </div>
    );
};

export default Home;




// #eb6e01
// #a0a603

