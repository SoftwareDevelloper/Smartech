import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Drawer from '../../component/Drawer';
import './CSS/profile.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [imagePreview, setImagePreview] = useState("https://cdn-icons-png.flaticon.com/512/17434/17434008.png");

   const{t,i18n} = useTranslation()
      const currentLanguage = i18n.language; 
        useEffect(()=>{
          window.document.dir = i18n.dir();
        },[currentLanguage])
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      fetch(`https://smartech-production-1020.up.railway.app/api/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('User fetched:', data);
          setUser(data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, []);

  return (
    <div className="profile flex min-h-screen bg-gray-50">
      <Drawer />
      <div className="flex-1 p-4 md:p-6 lg:p-8 flex justify-center items-start">
        <div className="w-full max-w-4xl bg-transparent rounded-xl shadow-md overflow-hidden p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-6 border-b border-gray-200">
            <img src={user?.image || imagePreview} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500 object-cover"/>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-semibold text-yellow-500">{user?.fullname}</h1>
              <hr style={{width:"100px",height:"3px",background:"#fdc401",border:"none",outline:"none",borderRadius:"25px"}}/>
            </div>
          </div>
          <hr style={{height:"2px",background:"#E3E3E3FF",border:"none",outline:"none",borderRadius:"25px",marginLeft:"1px"}}/>
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-yellow-500"> {t('AboutMe')} </h2>
              <p className="text-gray-500">{user?.about}</p>
            </div> 
            <div>
              <h2 className="text-lg font-semibold text-yellow-500"> {t('ContactInformation')} </h2>
              <p className="text-gray-500">{user?.email}</p>
              <p className="text-gray-500 flex items-center gap-2">📞 +216 {user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
