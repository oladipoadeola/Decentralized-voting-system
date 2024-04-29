import React from 'react';

const Loader = () => {
    return (
        <div className="position-relative">
            <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
            <div className="position-fixed top-50 start-50 translate-middle">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Loader;