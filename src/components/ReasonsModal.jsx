import React from "react";
import ReactModal from "react-modal";

const ReasonModal = (props) => {
    return (
        <ReactModal
            isOpen={props.openErrorReasonModal}
            onRequestClose={props.closeReasonModal}
            style={{
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
            }}
        >
            <div>
                <h3>Possible Reasons</h3>
            <ul>
                {props.errorReasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                ))}
            </ul>
            </div>
        </ReactModal>
    )
}

export default ReasonModal;