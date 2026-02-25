// src/pages/TicketDetails.jsx (Example)
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTicketById, addAttachmentToTicket } from '../../';
import AttachmentUploader from '../components/AttachmentUploader'; // Import the new component

const TicketDetails = ({ ticketId }) => {
    const dispatch = useDispatch();
    const { ticket, isLoading, isError, message } = useSelector((state) => state.ticket);

    const [filesToUpload, setFilesToUpload] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (ticketId) {
            dispatch(getTicketById(ticketId));
        }
    }, [dispatch, ticketId]);

    const handleFilesSelected = (files) => {
        setFilesToUpload(files);
    };

    const handleUpload = async () => {
        if (filesToUpload.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('attachment', file); // 'attachment' matches the name in your multer config
        });

        try {
            await dispatch(addAttachmentToTicket({ ticketId, formData })).unwrap();
            setFilesToUpload([]); // Clear the files after successful upload
        } catch (error) {
            console.error('Failed to upload attachments:', error);
        } finally {
            setIsUploading(false);
        }
    };

    if (isLoading) return <div>Loading ticket...</div>;
    if (isError) return <div>Error: {message}</div>;
    if (!ticket) return <div>Ticket not found.</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            {/* Existing Ticket Details UI */}
            <h2 className="text-2xl font-bold">{ticket.subject}</h2>
            <p>{ticket.description}</p>

            {/* Section for Existing Attachments */}
            <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold">Attachments</h3>
                {ticket.attachments && ticket.attachments.length > 0 ? (
                    <ul className="list-disc ml-4 mt-2">
                        {ticket.attachments.map(att => (
                            <li key={att._id} className="text-blue-600 hover:underline">
                                <a href={att.src} target="_blank" rel="noopener noreferrer">
                                    {att.name} ({formatFileSize(att.size)})
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mt-2">No attachments yet.</p>
                )}
            </div>

            {/* New Attachment Upload UI */}
            <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold">Add New Attachment</h3>
                <AttachmentUploader onFilesSelected={handleFilesSelected} />
                <button
                    onClick={handleUpload}
                    disabled={filesToUpload.length === 0 || isUploading}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                    {isUploading ? 'Uploading...' : 'Upload Attachment'}
                </button>
            </div>

            {/* Existing Comments UI */}
            {/* ... */}
        </div>
    );
};

export default TicketDetails;