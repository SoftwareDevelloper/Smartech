import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminProfile from '../../assest/AdminProfile.png';
import '../ADMIN/CSS/adminProfile.css';
const ProfileAdmin = () => {
      const [admin, setAdmin] = useState(null);
      const { userId } = useParams();
        const [imagePreview, setImagePreview] = useState(AdminProfile);
      
      useEffect(() => {
        fetch(`http://localhost:9000/api/user/${userId}`)
          .then((response) => response.json())
          .then((data) => {
            setAdmin(data);
          })
          .catch((error) => {
            console.error('Error fetching teacher', error);
          });
      }, [userId]);
  return (
    <div class="p-4 bg-white sm:ml-64" style={{fontFamily:"Montserrat, sans-serif"}}>
      <div class="p-4 ">
        <div class="grid grid-cols-4 gap-3 mb-5 ">

            <div className="admininfo">
                <span className="usernameadmin">
                   {admin?.fullname || <span className="skeleton-loading" style={{width: "200px"}}>&nbsp;</span> }
                </span><br />
                <span className="emailadmin">
                     {admin?.email}
                </span><br />
                <span className="bioadmin">
                    {admin?.about} 
                </span><br />
                <span className='phoneadmin'>
                    {admin?.phone}
                </span>
                <div className="leftbuttonadmin">
                <Link to={"/settings"}>
                <button className="updateInfo">
                  Edit Your Informations
                </button>
                </Link>
                </div>
            </div>

        </div>
       </div>
    </div>
  )
}

export default ProfileAdmin
