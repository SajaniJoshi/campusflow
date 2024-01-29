import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "../assets/css/TransferCredits.css";
import "../assets/css/Footer.css";
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { CSSTransition } from 'react-transition-group';
import AdminNavbar from "./components/Navbar/AdminNavbar";


const TransferCredits = () => {
    const [transferRequests, setTransferRequests] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Access the state object from location
    const { state } = location;

    // Destructure email and full_name from the state object
    const { email, full_name } = state || {};

    const handleCloseToast = () => {
        setShowToast(false);
    };
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:8000/adminapp/fetchTransferCreditRequests', {
                    email: email
                });
                setTransferRequests(response.data.transfer_credit_requests);
            } catch (error) {
                console.error('Error fetching transfer requests:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ flex: 1 }}>
            <AdminNavbar />
            <p id="transferHeading">Transfer Credit Request Management</p>
            <div id="user_details">
                <h5> Full Name: <b>{full_name}</b> </h5>
                <h5> Email: <b>{email}</b></h5>
            </div>
            <ToastContainer position="top-end" className="p-3" style={{ marginTop: "50px" }}>
                <CSSTransition
                    in={showToast}
                    timeout={300}
                    classNames="toast-slide"
                    unmountOnExit
                    onExited={handleCloseToast}
                >
                    <Toast className="bg-primary text-white" show={showToast} onClose={handleCloseToast} delay={3000} autohide>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </CSSTransition>
            </ToastContainer>
            <RequestsTable transferRequests={transferRequests} email={email} setTransferRequests={setTransferRequests} setShowToast={setShowToast} setToastMessage={setToastMessage} />
            <BackToUserPage navigate={navigate} />

        </div >
    );
};

const handleApprove = async (request, email, setTransferRequests, setShowToast, setToastMessage) => {

    const updatedRequest = { ...request, status: 'ACCEPTED' };

    try {
        const response = await axios.put('http://127.0.0.1:8000/adminapp/updateTransferRequest', {
            email: email,
            updatedRequest: updatedRequest
        });

        if (response.status === 200) {
            // Update the local state to trigger a re-render
            setTransferRequests(prevRequests => {
                return prevRequests.map(req => (req === request ? updatedRequest : req));
            });
            // Show a success toast
            setShowToast(true);
            setToastMessage('Transfer credit request approved successfully');
        } else {
            // Handle errors
            setShowToast(true);
            setToastMessage('Failed to execute your credit transfer request');
        }
    } catch (error) {
        setShowToast(true);
        setToastMessage('Error approving credit transfer request');
        console.error('Error approving credit transfer request', error);
    }
};

const handleCancel = async (request, email, setTransferRequests, setShowToast, setToastMessage) => {

    const updatedRequest = { ...request, status: 'REJECTED' };

    try {
        const response = await axios.put('http://127.0.0.1:8000/adminapp/updateTransferRequest', {
            email: email,
            updatedRequest: updatedRequest
        });

        if (response.status === 200) {
            console.log('Request rejected successfully', updatedRequest);
            // Update the local state to trigger a re-render
            setTransferRequests(prevRequests => {
                return prevRequests.map(req => (req === request ? updatedRequest : req));
            });
            // Show a success toast
            setShowToast(true);
            setToastMessage('Transfer credit request rejected successfully');
        } else {
            // Handle errors
            setShowToast(true);
            setToastMessage('Failed to execute your credit transfer request');
            console.error('Failed to execute your credit transfer request', response.statusText);
        }
    } catch (error) {
        setShowToast(true);
        setToastMessage('Error approving credit transfer request');
        console.error('Error approving credit transfer request', error);
    }
};

const handleNavigation = async (navigate) => {
    navigate('/admin/users/transferCreditRequests');
};

function RequestsTable({ transferRequests, email, setTransferRequests, setShowToast, setToastMessage }) {
    return (
        <div style={{ padding: "10px 30px 10px 30px" }}>
            <Table responsive="lg" borderless>
                <thead>
                    <tr>
                        <th>Transfer initiated from module</th>
                        <th>Transfer initiated to module</th>
                        <th>Status</th>
                        <th>Manage Request</th>
                    </tr>
                </thead>
                <tbody>
                    {transferRequests.length === 0 ? (
                        <tr>
                            <td colSpan="4">No transfer credit requests available.</td>
                        </tr>
                    ) : (
                        transferRequests.map((request, index) => (
                            <tr key={index}>
                                <td>
                                    {request.fromModule.map((module, index) => (
                                        <div key={index}>
                                            {module.moduleName} - {module.credits} credits
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {request.toModule.map((module, index) => (
                                        <div key={index}>
                                            {module.moduleName} - {module.credits} credits
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {request.status === 'PENDING' ? (
                                        <Badge variant="primary">{request.status}</Badge>
                                    ) : request.status === 'ACCEPTED' ? (
                                        <Badge variant="success" className="bg-success">{request.status}</Badge>
                                    ) : (
                                        <Badge variant="danger" className="bg-danger">{request.status}</Badge>
                                    )}
                                </td>
                                <td>
                                    {request.status === 'PENDING' ? (
                                        <div>
                                            <Button variant="success" style={{ fontSize: '14px' }} onClick={() => handleApprove(request, email, setTransferRequests, setShowToast, setToastMessage)}>
                                                Approve
                                            </Button>{' '}
                                            <Button variant="danger" style={{ fontSize: '14px' }} onClick={() => handleCancel(request, email, setTransferRequests, setShowToast, setToastMessage)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    ) : (
                                        <Badge variant="info" className="bg-dark">Request Executed Already</Badge>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>
        </div>
    );
}

function BackToUserPage({ navigate }) {
    return (
        <div id="backToUser">
            <Button variant="success" style={{ fontSize: '14px' }} onClick={() => handleNavigation(navigate)}>
                Back to User Page
            </Button>
        </div>
    );
}

export default TransferCredits;