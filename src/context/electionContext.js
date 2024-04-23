import React, { createContext, useState, useContext, useEffect } from 'react';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { contractAddress } from '../constant/constant'
import Election from "../artifacts/contracts/Election.sol/Election.json";

import 'react-toastify/dist/ReactToastify.css';

const ElectionContext = createContext();

export const ElectionProvider = ({ children }) => {
  const [electionStarted, setElectionStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [metamaskInstalled, setMetamaskInstalled] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  function removeAccountFromStorage(){
    localStorage.removeItem('isConnected');
    localStorage.removeItem('account');
    localStorage.removeItem('isAdmin')
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
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
      // getCandidatesList();
  }, []);
  const fetchAdminStatus = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, Election.abi, signer);
      const admin = await contract.admin();
      const currentAddress = await signer.getAddress();
      setIsAdmin(admin === currentAddress);

      // Check if election has started
      const isElectionStarted = await contract.electionStarted();
      setElectionStarted(isElectionStarted);
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


  const fetchData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      setProvider(provider);
      const contract = new ethers.Contract(
        contractAddress,
        Election.abi,
        provider.getSigner()
      );
      const isElectionStarted = await contract.electionStarted();
      setElectionStarted(isElectionStarted);
      setContract(contract);
      const candidateList = await contract.getCandidateList();
      setCandidates(candidateList);
    } catch (error) {
      console.error(error);
      setError(error.code);
    }
  };
  

  useEffect(() => {
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
      // getCandidatesList();
    } else {
      setAccount(null);
      setIsConnected(false);
      removeAccountFromStorage()
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <ElectionContext.Provider value={{ electionStarted, setElectionStarted, isConnected, isAdmin, candidates, contract, account, connectToMetamask, metamaskInstalled }}>
      {children}
    </ElectionContext.Provider>
  );
};

export const useElection = () => useContext(ElectionContext);
