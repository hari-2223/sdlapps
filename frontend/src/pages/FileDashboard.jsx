import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const FileDashboard = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    const fetchFiles = async () => {
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
    };

    useEffect(() => {
        if (user) {
            fetchFiles();
        }
    }, [user]);

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