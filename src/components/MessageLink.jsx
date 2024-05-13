import React from "react";
import extractErrorCode from "../helpers/extractErrorCode";
import ReactModal from "react-modal";

const MessageLink = (props) => {
    let error = props.error;
    let openReasonModal = props.openReasonModal
    let openErrorReasonModal = props.openErrorReasonModal
    let closeReasonModal = props.closeReasonModal

    return (
        <>
            <div>
                <a onClick={openReasonModal} className='text-white'>
                    {extractErrorCode(error.message)} <br />
                    <span style={{ textDecoration: 'underline' }}>See Details</span>
                </a>
            </div>
        </>
    )
}

export default MessageLink