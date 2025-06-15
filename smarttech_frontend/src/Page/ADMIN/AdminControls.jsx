import { Autocomplete, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
const AdminControls = () => {
  const [users, setUsers] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  // Fetch users and chapters on mount
  useEffect(() => {
    fetchUsers();
    fetchChapters();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('https://smartech-production-1020.up.railway.app/api/apprenant');
    setUsers(await response.json());
  };

  const fetchChapters = async () => {
    const response = await fetch('https://smartech-production-1020.up.railway.app/api/chapters/Chapters');
    setChapters(await response.json());
  };

  const handleManualUnlock = async () => {
    try {
      if (!selectedUser || !selectedChapter) {
        throw new Error('Please select both user and chapter');
      }
      
      const response = await fetch(
        `https://smartech-production-1020.up.railway.app/api/chapter-progress/unlock-chapter?userId=${selectedUser}&chapterId=${selectedChapter}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Unlock failed');
      toast.success('Chapter unlocked successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
  <div className="p-4 bg-white sm:ml-64 min-h-screen font-montserrat">
  <div className="max-w-4xl mx-auto bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl p-10 sm:p-14">
    <h2 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-12">
      Manual Chapter Unlock
    </h2>

    <div className="space-y-6">
      {/* User Autocomplete */}
      <div>
        <Autocomplete
          options={users}
          getOptionLabel={(user) => user.fullname}
          onChange={(e, value) => setSelectedUser(value?.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Users"
              variant="outlined"
              className="w-full"
            />
          )}
        />
      </div>

      {/* Chapter Autocomplete */}
      <div>
        <Autocomplete
          options={chapters}
          getOptionLabel={(chapter) => chapter.titleEn}
          onChange={(e, value) => setSelectedChapter(value?.id)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Chapters"
              variant="outlined"
              className="w-full"
            />
          )}
        />
      </div>

      {/* Unlock Button */}
      <button
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-semibold text-lg rounded-xl shadow-md hover:shadow-lg transition duration-300"
        onClick={handleManualUnlock}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          className="w-5 h-5 fill-blue-800"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
        Unlock Chapter
      </button>
    </div>
    
    <ToastContainer />
  </div>
</div>

  );
};

export default AdminControls;
