import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function Login(props) {
    return (
        <div className="login-container">
            {props.error === -32002 ? (
                <div className="connected-box">
                    <h1 className="not-connected-title">Not Connected</h1>
                    <div className="account-info">
                        <p className="account-label text-center">Looks Like you have not installed or login to MetaMask</p>
                    </div>
                </div>
            ) : props.isConnected ? (
                <div className="connected-box">
                    <h1 className="connected-title">Connected</h1>
                    <div className="account-info">
                        <p className="account-label text-center">Your MetaMask Account:</p>
                        <p className="account-address">{props.account}</p>
                    </div>
                </div>
            ) : (
                <>
                    <img src="assets/images/MetaMask.png" alt="MetaMask Logo" className="meta-logo" />
                    {/* <h1 className="login-title">Login</h1> */}
                    <button className="btn btn-primary btn-connect" onClick={props.connectToMetamask}>Connect to MetaMask</button>
                    <span className="login-description">Login with your MetaMask account</span>
                </>
            )}

        </div>
    );


}

export default Login;
