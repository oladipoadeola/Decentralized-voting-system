import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import VoterRegistration from './pages/VoterRegistration';
import CandidateRegistration from './pages/CandidateRegistration';
import Result from './pages/Result';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAddress } from './constant/constant';
import Election from "./artifacts/contracts/Election.sol/Election.json";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import Loader from './components/Loader';
import extractErrorCode from './helpers/extractErrorCode';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [account, setAccount] = useState(null);
  const [theProvider, setTheProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isElectionStarted, setIsElectionStarted] = useState(false);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    connectToEthereum();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      setMetamaskInstalled(true); // Set to true if MetaMask is detected
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, []);

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setError(null);
      setAccount(accounts[0]);
      localStorage.setItem('account', accounts[0]);
      fetchAdminStatus();
      getCandidatesList();
    } else {
      setAccount(null);
      setIsConnected(false);
      removeAccountFromStorage()
      return <Navigate to="/login" replace />;
    }
  }

  function removeAccountFromStorage() {
    localStorage.removeItem('isConnected');
    localStorage.removeItem('account');
    localStorage.removeItem('isAdmin')
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        setTheProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const currentAddress = await signer.getAddress();
        setAccount(currentAddress);
        console.log("Metamask Connected : " + currentAddress);
        setIsConnected(true);
        localStorage.setItem('isConnected', 'true');
        localStorage.setItem('account', currentAddress);
        fetchAdminStatus();
      } catch (err) {
        console.log(err, 'consollll');
        setIsConnected(false);
        removeAccountFromStorage()

      }
    } else {
      setIsConnected(false);
      removeAccountFromStorage()
      console.log("Metamask is not detected in the browser");
    }
  }

  useEffect(() => {
    const storedIsConnected = localStorage.getItem('isConnected');
    if (storedIsConnected === 'true') {
      setIsConnected(true);
      setAccount(localStorage.getItem('account'));
    }
    fetchAdminStatus();
    getCandidatesList();
  }, []);
  const fetchAdminStatus = async () => {
    try {
      setTheProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Election.abi, signer);
      const admin = await contract.admin();
      const currentAddress = await signer.getAddress();
      setIsAdmin(admin === currentAddress);

      if (admin === currentAddress) {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
      } else {
        setIsAdmin(false);
        localStorage.setItem('isAdmin', 'false');
      }
    } catch (error) {
      removeAccountFromStorage()
      setError(error.code);
      console.log(error, 'check');
    }
  };

  const getCandidatesList = async () => {

    try {
      await provider.send('eth_requestAccounts', []);
      setTheProvider(provider);
      const contract = new ethers.Contract(
        contractAddress,
        Election.abi,
        provider.getSigner()
      );
      setContract(contract);
      const candidateList = await contract.getCandidateList();
      setCandidates(candidateList);
    } catch (error) {
      console.log(error);

      setError(error.code);
      removeAccountFromStorage()
    }
  };


  // Function to start the election
  const startElection = async () => {
    try {
      const abi = Election.abi;
      const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

      const tx = await contract.startElection();
      await tx.wait();
      const isElectionStarted = await contract.electionStarted();
      setIsElectionStarted(isElectionStarted);

      toast.success('Election started successfully');
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(extractErrorCode(error.message))

    }
  };

  const endElection = async () => {
    const abi = Election.abi;
    const contract = new ethers.Contract(contractAddress, abi, provider.getSigner());

    try {
      const tx = await contract.endElection();

      await tx.wait();
      const isElectionStarted = await contract.electionStarted();
      setIsElectionStarted(isElectionStarted);
      toast.info('Election ended successfully');
    } catch (error) {
      setErrorMessage(error.message);
      toast.error(extractErrorCode(error.message))

    }
  };


  const connectToEthereum = async () => {
    try {
      const contract = new ethers.Contract(contractAddress, Election.abi, provider.getSigner());
      const isElectionStarted = await contract.electionStarted();
      setIsElectionStarted(isElectionStarted);

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const ProtectedRoute = ({ element, ...rest }) => {
    if (!isAdmin) {
      return isConnected && error === null ? (
        <React.Fragment {...rest} element={element} />
      ) : (
        <Navigate to="/login" replace />
      );
    }
    return <React.Fragment {...rest} element={element} />

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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {metamaskInstalled ? (
          <Layout error={error} isConnected={isConnected} isAdmin={isAdmin} isElectionStarted={isElectionStarted} startElection={startElection} endElection={endElection}>
            {loading ? (
              <Loader />
            ) : (
              <div className="main-content">
                <ToastContainer position="bottom-right" draggable pauseOnHover theme='dark' />
                <Routes>
                  <Route path="/" element={<Home candidates={candidates} contract={contract} account={account} error={error} isElectionStarted={isElectionStarted} isAdmin={isAdmin} isLoading={isLoading} showLoader={showLoader} hideLoader={hideLoader} isConnected={isConnected} />} />
                  <Route path="/login" element={<Login isConnected={isConnected} connectToMetamask={connectToMetamask} account={account} />} />

                  <Route path="/result"
                    element={
                      <ProtectedRoute>
                        <Result />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/voter-registration"
                    element={
                      <ProtectedRoute>
                        <VoterRegistration isAdmin={isAdmin} isLoading={isLoading} showLoader={showLoader} hideLoader={hideLoader} />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/candidate-registration"
                    element={
                      <ProtectedRoute>
                        <CandidateRegistration isLoading={isLoading} showLoader={showLoader} hideLoader={hideLoader} />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            )}
          </Layout>
        ) : (
          <div className="w-50 d-flex justify-content-center align-items-center min-vh-100 m-auto">
            <h5 className='text-danger text-center'>MetaMask is not installed in the browser. Please install MetaMask and refresh this page to use this application.</h5>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
