// The base URL of backend, needed for download links
// IMPORTANT: change this to EC2 instance's public IP
const API_BASE_URL = 'http://localhost:5001';

const FileList = ({ files, isLoading }) => {
    if (isLoading) {
        return <p className="text-center mt-8">Loading files...</p>;
    }

    if (files.length === 0) {
        return <p className="text-center mt-8">No files uploaded yet. Upload the first file!</p>;
    }

    return (
        <div className="bg-white p-6 shadow-md rounded">
            <h2 className="text-2xl font-bold mb-4">My Files</h2>
            <ul className="space-y-2">
                {files.map(file => (
                    <li key={file._id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 rounded-md">
                        {/* The link points to the file on the server */}
                        <a
                            href={`${API_BASE_URL}/${file.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            {file.originalName}
                        </a>
                        <span className="text-gray-500 text-sm">{(file.size / 1024).toFixed(2)} KB</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;