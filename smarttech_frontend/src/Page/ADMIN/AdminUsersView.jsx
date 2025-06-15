import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
const AdminUsersView = () => {
const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [viewMode, setViewMode] = useState('enrolled'); // 'enrolled' or 'paid'

  useEffect(() => {
    fetchUsers();
  }, [viewMode]);

  const fetchUsers = async () => {
    try {
      const endpoint = viewMode === 'enrolled' 
        ? 'https://smartech-production-1020.up.railway.app/api/admin/enrolled-users'
        : 'https://smartech-production-1020.up.railway.app/api/admin/paid-users';
      
      const response = await fetch(endpoint, {
        headers: {
          'auth-token': localStorage.getItem('auth-token')
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-4 sm:ml-64 font-[Montserrat] bg-gray-50 min-h-screen">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {viewMode === 'enrolled' ? t('Enrolled Users') : t('Paid Users')}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('enrolled')}
              className={`px-4 py-2 rounded-md ${viewMode === 'enrolled' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('Enrolled')}
            </button>
            <button
              onClick={() => setViewMode('paid')}
              className={`px-4 py-2 rounded-md ${viewMode === 'paid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('Paid')}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Email')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Role')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('Formations')}
                </th>
                {viewMode === 'paid' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Payment Status')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.fullname}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'APPRENANT' ? 'bg-green-100 text-green-800' : 
                          user.role === 'ENSEIGNMENT' ? 'bg-blue-100 text-blue-800' : 
                          'bg-purple-100 text-purple-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {user.formationsSuivies?.length || 0}
                    </td>
                    {viewMode === 'paid' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {t('Paid')}
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={viewMode === 'paid' ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                    {t('No users found')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersView;
