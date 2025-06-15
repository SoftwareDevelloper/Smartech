import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import Approved from '../../assest/approved.png';
import rejected from '../../assest/rejected.png';
import '../../i18n';

const Users = () => {
  const [allUser, setAllUser] = useState([]);
  const [allEnseignant, setEnseignant] = useState([]);
  const [allApprenant, setApprenant] = useState([]);
  const [selectedApprenantId, setSelectedApprenantId] = useState(null);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState(null);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    let status = '';
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;
      const emailaddress = decodedToken.email;
      status = decodedToken.status || true;
      console.log("id of user:", userId);
      console.log("email:", emailaddress);
      console.log("status:", status);
    }
    fetch(`https://smartech-production-1020.up.railway.app/api/allUser/${status}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched users:', data);
        setAllUser(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
        setAllUser([]);
      });
  }, []);

  useEffect(() => {
    fetch("https://smartech-production-1020.up.railway.app/api/enseignant")
      .then(response => response.json())
      .then(data => {
        console.log('Fetched enseignants:', data);
        setEnseignant(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error("Error fetching enseignants:", error);
        setEnseignant([]);
      });
  }, []);

  useEffect(() => {
    fetch("https://smartech-production-1020.up.railway.app/api/apprenant")
      .then(response => response.json())
      .then(data => {
        console.log('Fetched apprenants:', data);
        setApprenant(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error("Error fetching apprenants:", error);
        setApprenant([]);
      });
  }, []);

  const RemoveUsers = async (id) => {
    setAllUser((prev) => prev.filter((user) => user.id !== id));
    if (localStorage.getItem("auth-token")) {
      fetch(`https://smartech-production-1020.up.railway.app/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ user: id })
      })
        .then((response) => response.json() , toast.success("Users deleted successfully!"))
        .then((data) => console.log(data))
        .catch((error) => console.error('Error removing users', error));
    } else {
      toast.warning("Please authenticate first");
    }
  };

  const handleAssignEnseignant = (apprenantId, enseignantId) => {
    if (!apprenantId || !enseignantId) {
      toast.error("Both student and teacher must be selected.");
      return;
    }

    fetch(`https://smartech-production-1020.up.railway.app/api/assignEnseignant/${apprenantId}/${enseignantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Enseignant assigned successfully:', data);
        toast.success("Teacher assigned successfully");
      })
      .catch(error => {
        console.error('Error assigning enseignant:', error);
        toast.error("Error assigning teacher");
      });
  };

  const handleSelectChange = (e) => {
    setSelectedApprenantId(e.target.value);
  };

  const handleEnseignantSelectChange = (e) => {
    setSelectedEnseignantId(e.target.value);
  };

  return (
    <div className="p-4 sm:ml-64" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <ToastContainer/>
      <div className="p-4">
        {/* Approved Users Section */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-white text-gray-500 text-sm p-4 sm:p-6 rounded-lg shadow-md shadow-white-500/50 overflow-x-auto">
            <h2 className="text-lg font-medium font-serif mb-4">{t('ApprovedUsers')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-50 min-w-[600px]">
                <thead>
                  <tr className="bg-indigo-300 text-white">
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Name')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Email')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Status')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Role')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {allUser.map(user => (
                    <tr key={user.id}>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.fullname}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                          {user.active ? t('online') : t('offline')}
                        </div>
                      </td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.role}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">
                        <button 
                          onClick={() => RemoveUsers(user.id)} 
                          className="bg-white text-white p-1 sm:px-3 sm:py-1 rounded"
                          aria-label={t('RemoveUser')}
                        >
                          <img src={rejected} alt="Remove" width="20px" height="20px" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Teachers Section */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-white text-gray-500 text-sm p-4 sm:p-6 rounded-lg shadow-md shadow-white-500/50 overflow-x-auto">
            <h2 className="text-lg font-medium font-serif mb-4">{t('Teachers')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-50 min-w-[800px]">
                <thead>
                  <tr className="bg-indigo-300 text-white">
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Name')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Email')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Speciality')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Role')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Students')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {allEnseignant.map(user => (
                    <tr key={user.id}>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.fullname}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.specialitée}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.role}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">
                        <select 
                          onChange={handleSelectChange} 
                          className="border-none rounded text-sm w-full max-w-[200px]"
                        >
                          <option value="">{t('ChooseStudent')}...</option>
                          {allApprenant.map(apprenant => (
                            <option key={apprenant.id} value={apprenant.id}>
                              {apprenant.fullname}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">
                        <button 
                          onClick={() => handleAssignEnseignant(selectedApprenantId, user.id)} 
                          className="bg-blue-50 text-white p-1 sm:px-3 sm:py-1 rounded"
                          aria-label={t('AssignTeacher')}
                        >
                          <img src={Approved} alt="Approve" width="20px" height="20px" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        closeOnClick 
        pauseOnHover 
        draggable 
        theme="light" 
      />
    </div>
  );
};

export default Users;
