import { ArchiveRestore } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import '../../i18n';
import i18n from '../../i18n';

const Archive = () => {
 const [archivedUsers,setArchivedUser]=useState([]);
 const [archivedFormations,setArchivedFormations]=useState([]);

 const { t} = useTranslation();
 const currentLanguage = i18n.language;
 useEffect(() => {window.document.dir = i18n.dir();}, [currentLanguage]);   
  useEffect(() => {
     fetch("http://localhost:9000/api/ArchiveUser")
       .then(response => response.json())
       .then(data => {
         console.log('Fetched users:', data);
         setArchivedUser(Array.isArray(data) ? data : []);
       })
       .catch(error => {
         console.error("Error fetching users:", error);
         setArchivedUser([]);
       });
   }, []);

     useEffect(() => {
     fetch("http://localhost:9000/api/ArchivedFormations")
       .then(response => response.json())
       .then(data => {
         console.log('Fetched users:', data);
         setArchivedFormations(Array.isArray(data) ? data : []);
       })
       .catch(error => {
         console.error("Error fetching users:", error);
         setArchivedFormations([]);
       });
   }, []);



   //Restore archive 

 const restoreUsers = (id) => {
    fetch(`http://localhost:9000/api/RestoreUsers/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Restore failed');
        return response.json();
      })
      .then(data => {
        console.log('User Restored Successfully:', data);
        toast.success('User Restored Successfully');
        // Remove restored user from the UI list
        setArchivedUser(prev => prev.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('Error Restoring User:', error);
        toast.error('Error restoring user');
      });
  };


  const restoreFormations = (id) => {
    fetch(`http://localhost:9000/api/RestoreFormations/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Restore failed');
        return response.json();
      })
      .then(data => {
        console.log('formation Restored Successfully:', data);
        toast.success('formation Restored Successfully');
        // Remove restored user from the UI list
        setArchivedFormations(prev => prev.filter(course => course.id !== id));
      })
      .catch(error => {
        console.error('Error Restoring formation:', error);
        toast.error('Error restoring formation');
      });
  };
  return (
<div className="p-4 sm:ml-64" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <ToastContainer/>
      <div className="p-4">
        {/* Archive Users Section */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-white text-gray-500 text-sm p-4 sm:p-6 rounded-lg shadow-md shadow-white-500/50 overflow-x-auto">
            <h2 className="text-lg font-medium font-serif mb-4">{t('Archive Users')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-50 min-w-[600px]">
                <thead>
                  <tr className="bg-indigo-300 text-white">
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Name')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Email')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Role')}</th>
                    <th className="border-2 border-white px-2 sm:px-4 py-2">{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {archivedUsers.map(user => (
                    <tr key={user.id}>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.fullname}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2 truncate max-w-[150px] sm:max-w-none">{user.email}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">{user.role}</td>
                      <td className="border-2 border-white px-2 sm:px-4 py-2">
                        <button onClick={() => restoreUsers(user.id)} title="Restore User">
                            <ArchiveRestore />
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

          <div className="p-4">
        {/* Archive formations Section */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="bg-white text-gray-500 text-sm p-4 sm:p-6 rounded-lg shadow-md shadow-white-500/50 overflow-x-auto">
            <h2 className="text-lg font-medium font-serif mb-4">{t('Archive Formations')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-50 min-w-[600px]">
                <thead>
                        <tr className="bg-indigo-300 text-white">
                        <th className="border-2 border-white px-4 py-2"> {t('Title')} </th>
                        <th className="border-2 border-white px-4 py-2 " > {t('Description')} </th>
                        <th className="border-2 border-white px-8 py-2"> {t('Price')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Category')} </th>
                        <th className="border-2 border-white px-4 py-2" > {t('Class')} </th>
                        <th className="border-2 border-white px-4 py-2" > {t('Published Date')} </th>
                        <th className="border-2 border-white px-4 py-2"> {t('Actions')} </th>
                      </tr>
                </thead>
                <tbody>
                  {archivedFormations.map(course => (
                           <tr key={course.id}>
                            <td className="border-2 border-white px-4 py-2" > {currentLanguage === 'fr'
                                ? course.titleFr
                                : currentLanguage === 'ar'
                                ? course.titleAr
                                : course.titleEn} 
                            </td>
                            <td className="border-2 border-white px-4 py-2" > {currentLanguage === 'fr'
                                ? course.descriptionFr
                                : currentLanguage === 'ar'
                                ? course.descriptionAr
                                : course.descriptionEn} 
                            </td>
                          <td className="border-2 border-white px-9 py-2" > {course.price} {currentLanguage === 'fr'
                                ? "TND"
                                : currentLanguage === 'ar'
                                ? " دينار"
                                : "TND"}
                          </td>
                          <td className="border-2 border-white px-4 py-2" > 
                            {course.category}
                          </td>
                          <td className="border-2 border-white px-4 py-2" > 
                            {course.classe} 
                          </td>
                          <td className="border-2 border-white px-4 py-2" > 
                            {course.publisheddate} 
                          </td>
                          <td className="border-2 border-white px-2 sm:px-4 py-2">
                            <button onClick={() => restoreFormations(course.id)} title="Restore course">
                                <ArchiveRestore />
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
        </div>
  )
}

export default Archive
