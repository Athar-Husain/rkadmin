import React, { useState } from 'react';
import { FaPaperclip, FaFile, FaFilePdf, FaImage, FaTimes } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const getFileIcon = (file) => {
    const fileType = file.type;
    if (fileType.startsWith('image/')) return <FaImage className="text-blue-500" />;
    if (fileType === 'application/pdf') return <FaFilePdf className="text-red-500" />;
    return <FaFile className="text-gray-500" />;
};

const formatFileSize = (size) => {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const AttachmentUploader = ({ onFilesSelected }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map(file => ({
            file,
            id: uuidv4() // Use a unique ID for React keys
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
        onFilesSelected([...selectedFiles, ...newFiles].map(f => f.file));
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files).map(file => ({
            file,
            id: uuidv4()
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
        onFilesSelected([...selectedFiles, ...newFiles].map(f => f.file));
    };

    const handleRemoveFile = (id) => {
        setSelectedFiles(prev => {
            const updatedFiles = prev.filter(f => f.id !== id);
            onFilesSelected(updatedFiles.map(f => f.file));
            return updatedFiles;
        });
    };

    return (
        <div className="my-4 p-4 border border-dashed border-gray-300 rounded-lg">
            <div
                className="flex flex-col items-center justify-center p-6 text-gray-500 cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
            >
                <FaPaperclip className="text-4xl mb-2" />
                <p className="text-sm">Drag & drop files here, or</p>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="mt-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 cursor-pointer font-medium"
                >
                    Browse files
                </label>
            </div>

            {selectedFiles.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {selectedFiles.map(({ file, id }) => (
                        <li key={id} className="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                            <div className="flex items-center space-x-2">
                                {getFileIcon(file)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(id)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                aria-label="Remove file"
                            >
                                <FaTimes />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AttachmentUploader;