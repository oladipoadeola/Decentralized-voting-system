import React, { useEffect, useState } from 'react';


import { Link } from 'react-router-dom';
import Login
    from '../../pages/Login';


const Navbar = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    let data = props.data


    return (
        <div className="header container-fluid bg-white">
            <div id="menu-jk" className="nav-col text-white shadow-md mb-3">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-xl-2 pt-1 pb-1 align-items-center">
                            <Link to="/"><img className="max-230 mt-1" src="assets/images/logo.png" alt="" height="40" /></Link>
                            <Link onClick={handleToggleMenu} className="float-end text-dark d-lg-none pt-1 ps-3"><i className="bi pt-1 fs-1 cp bi-list"></i></Link>
                        </div>
                        <div id="menu" className={`col-lg-10 col-xl-10 ${isMenuOpen ? '' : 'd-none'} d-lg-block`}>

                            <ul className="float-end mul d-inline-block">
                                <li className="float-md-start px-4 pe-1 pt-4">
                                    <Link to="/result" className="fw-bold fs-8 text-primary"> View Result</Link>
                                </li>



                                {!data.isAdmin && (
                                    <React.Fragment>
                                        <li className="float-md-start px-4 pe-1 py-3">
                                            <Link to="/login" component={Login} className="btn fw-bold fs-8 btn-outline-primary px-5">
                                                {data.isConnected ? <i className="bi bi-person-check"></i> : <i className="bi bi-box-arrow-in-right"></i>} {data.isConnected ? 'Account' : 'Login'}
                                            </Link>
                                        </li>
                                    </React.Fragment>
                                )}

                                {!data.isAdmin && data.isConnected ? (<li className="float-md-start px-4 pe-1 py-3">
                                    <Link to="/voter-registration" className='btn fw-bold fs-8 btn-primary'><i className="bi bi-r-circle-fill"></i> Register as Voter</Link>
                                </li>) : ''}
                                
                                {data.isAdmin && (
                                    <React.Fragment>
                                        <li className="float-md-start px-4 pe-1 py-3">
                                            <Link to="/candidate-registration" className='btn fw-bold fs-8 btn-primary'>
                                                <i className="bi bi-r-circle-fill"></i> Add Candidate
                                            </Link>
                                        </li>
                                        <li className="float-md-start px-4 pe-1 py-3">
                                            {data.isElectionStarted ? (<button onClick={data.endElection} className='btn fw-bold fs-8 btn-danger'><i className="bi bi-skip-start-fill"></i> End Election</button>) :
                                            (<button onClick={data.startElection} className='btn fw-bold fs-8 btn-success'><i className="bi bi-skip-start-fill"></i> {data.isElectionStarted} Start Election</button>)}
                                        </li>
                                    </React.Fragment>
                                )}

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
