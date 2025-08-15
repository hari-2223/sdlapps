import { useState, useEffect, useCallback } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const FileDashboard = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    // Wrapped fetchFiles in useCallback.
    // tells React to not recreate this function on every render,
    // which makes it safe to use as dependency in useEffect.
    const fetchFiles = useCallback(async () => {
        if (!user) return; // Don't fetch if there's no user.

        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/api/files', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setFiles(response.data);
        } catch (error) {
            alert('Failed to fetch files.');
        } finally {
            setIsLoading(false);
        }
    }, [user]); 

    // This effect calls fetchFiles on initial load.
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // The onUploadSuccess prop directly calls stable fetchFiles function.
   
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Cloud Storage</h1>
            <FileUpload onUploadSuccess={fetchFiles} />
            <div className="mt-8">
                <FileList files={files} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default FileDashboard;