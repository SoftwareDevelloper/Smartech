import { jwtDecode } from 'jwt-decode'
import { useState } from 'react'
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import delete_user from '../assest/delete.png'
import mycourse from '../assest/my_course_icon.png'
import logout from '../assest/user-logout.png'
import '../i18n'
import './css/Drawer.css'
const Drawer = () => {
  const{t,i18n} = useTranslation()
  const navigate = useNavigate();

  const [users,setUsers] = useState([]);
   const updateActiveStatus = async (activeStatus) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("No authentication token found.");
        return;
      }
      const decodedToken = jwtDecode(token);
      const id = decodedToken.sub;
      
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/updateActive/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({ active: activeStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update active status");
      }
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // First update active status to false
      await updateActiveStatus(false);
      
      // Then remove token and redirect
      localStorage.removeItem('auth-token');
      window.location.replace('/Login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

   const removeAccount = async (id) => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("No authentication token found.");
        return;
      }
      const decodedToken = jwtDecode(token);
      id = decodedToken.sub;
      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "auth-token": token,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ user: id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete account.");
      }
      const data = await response.json();
      toast.success("Account deleted successfully");
      localStorage.removeItem("auth-token");
      navigate("/Login");
      console.log(data);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className='drawer'>
            <Link to={'/Profile/Mycourse'} className="course">
            <img src={mycourse} alt="" width={"18px"} height={"18px"}  />
            {t('Mycourse')}
            </Link>
            <Link to={'/Profile/Update'} className="course gap-4">
            <svg class="w-5 h-5 text-gray-800 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2ZM2 18V7h6.7l.4-.409A4.309 4.309 0 0 1 15.753 7H18v11H2Z"/>
            <path d="M8.139 10.411 5.289 13.3A1 1 0 0 0 5 14v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .7-.288l2.886-2.851-3.447-3.45ZM14 8a2.463 2.463 0 0 0-3.484 0l-.971.983 3.468 3.468.987-.971A2.463 2.463 0 0 0 14 8Z"/>
            </svg>
            {t('Edit')}
            </Link>
            <button  type="submit" onClick={handleLogout} className='deconnexion'>
            <img src={logout} alt="" width={"20px"} height={"20px"} />
              {t('Logout')}
            </button>
            <button onClick={()=>removeAccount(users.id)} className="settings" data-modal-target="popup-modal" data-modal-toggle="popup-modal">
               <img src={delete_user} alt="" width={"20px"} height={"20px"} />
                {t('RemoveAccount')}
            </button>
       
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="light" />

    </div>
  )
}

export default Drawer
