import FileUpload from '../components/FileUpload';

const FileDashboard = () => {
    //  the file list logic to be added to this later
    const handleUploadSuccess = () => {
        console.log("Upload successful! We will refresh the list soon.");
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Cloud Storage</h1>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
            {/* FileList will go here */}
        </div>
    );
};

export default FileDashboard;