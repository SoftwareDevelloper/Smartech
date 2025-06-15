import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Archive, Bell, Book, BookKey, BookPlus, BotMessageSquare, CalendarClock, FilePlus2, FileUser, LayoutDashboardIcon, LogOutIcon, MessageSquareText, ShoppingCart, User, UserRoundPlus } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminProfile from '../assest/AdminProfile.png';
import downArrow from '../assest/down-arrow.png';
import arabe from '../assest/flag.png';
import fr from '../assest/france.png';
import globe from '../assest/globe (1).png';
import icon from "../assest/smarttechAcademy.png";
import usa from '../assest/united-states.png';
import { CartContext } from '../Context/CartContext';
import '../i18n';
import './css/Navbar.css';
const Navbar = ({isLoggedIn,role}) => {

  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [imagePreview, setImagePreview] = useState(AdminProfile);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // Mobile menu toggle
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Responsive sidebar toggle
  useEffect(() => {
      const token = localStorage.getItem("auth-token");
      if (token) {
          const decodedToken = jwtDecode(token);
          setUserId(decodedToken.sub);
      }
  }, []);
  useEffect(() => {
    if (!userId) return; 
    
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:9000/notifications/unread", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("auth-token")}`
          }
        });
        
        // Deduplicate based on messageHash
        const uniqueNotifications = response.data.reduce((acc, current) => {
          const exists = acc.some(item => item.messageHash === current.messageHash);
          if (!exists) {
            return [...acc, current];
          }
          return acc;
        }, []);
        
        setNotifications(prev => {
          // Only update if notifications actually changed
          if (JSON.stringify(prev) !== JSON.stringify(uniqueNotifications)) {
            return uniqueNotifications;
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
  
    // Fetch immediately and then every 30 seconds (reduced from 10s)
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);
  const MarkAllRead = async () => {
    try {
      await axios.post(
        "http://localhost:9000/notifications/markAsRead",
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("auth-token")}`
          }
        }
      );
      setNotifications([]); // Clear all notifications immediately
    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };
const [isOpen, setIsOpen] = useState(false);
const [isNotificationOpen, setIsNotificationOpen] = useState(false);
const[isProfileOpen,setisProfileOpen] = useState(false);

const{t,i18n} = useTranslation()
const changeLanguage=(lng)=>{i18n.changeLanguage(lng)}
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  },[currentLanguage])

const navbarBgColor = role === "ADMIN" || role=== "ENSEIGNMENT" ? "bg-white  dark-bg" : "bg-white  dark-bg";
  const { cartCount } = useContext(CartContext);

// get event 

  const [event,setevent]=useState([]);
  useEffect(()=>{
    fetch("http://localhost:9000/event/GetEvent")
    .then(response => response.json())
    .then(data => {
      console.log('Fetched course:', data);
      if (Array.isArray(data)) {
        setevent(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setevent([]); 
      }
    })
    .catch(error => {
      console.error("Error fetching course:", error);
      setevent([]);
    });
  },[])

    const [allcourse, setAllcourse]=useState([]);

     useEffect(() => {
          fetch(`http://localhost:9000/api/GetFormations?lang=${currentLanguage}`)
            .then(response => response.json())
            .then(data => {
              console.log('Fetched course:', data);
              if (Array.isArray(data)) {
                setAllcourse(data);
              } else {
                console.error("Fetched data is not an array:", data);
                setAllcourse([]);
              }
            })
            .catch(error => {
              console.error("Error fetching course:", error);
              setAllcourse([]); 
            })
        }, [currentLanguage]);

      const [user, setUser] = useState(null);

        useEffect(() => {
          const token = localStorage.getItem("auth-token");
          if (token) {
            const decodedToken = jwtDecode(token);
            const adminId = decodedToken.sub;
          fetch(`http://localhost:9000/api/user/${adminId}`)
            .then((response) => response.json())
            .then((data) => {
              setUser(data);
            })
            .catch((error) => {
              console.error('Error fetching teacher', error);
            });
          }
        }, []);

  const toggleCart=async()=>{
    navigate('/cart')
  }
     const updateActiveStatus = async (activeStatus) => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          toast.error("No authentication token found.");
          return;
        }
        const decodedToken = jwtDecode(token);
        const id = decodedToken.sub;
        
        const response = await fetch(`http://localhost:9000/api/updateActive/${id}`, {
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
return (
<nav className="{navbarBgColor}" style={{fontFamily:"Montserrat,sans-serif"}}>
    <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
  {
  !isLoggedIn ? (
   <>
  <header className="w-full  sticky top-0 z-50" >
    <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between  h-20">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-4">
        <img src={icon} alt="SmartTech Academy Logo" className="w-10 md:w-14" />
      </Link>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-gray-600 0 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

        {/* Links */}
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 text-center md:text-left">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-lg font-medium transition duration-300 ${isActive ? 'text-blue-600' : 'text-gray-700  hover:text-blue-600'}`
            }
          >
            {t('home')}
          </NavLink>
          <NavLink
            to="/Cours"
            className={({ isActive }) =>
              `text-lg font-medium transition duration-300 ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`
            }
          >
            {t('courses')}
          </NavLink>
        </div>

        {/* Right-side Buttons */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6 md:mt-0">
          {/* Sign In */}
          <Link to="/Login">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full md:w-auto">
              {t('SignIn')}
            </button>
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 "
            >
              <img src={globe} alt="Language" className="w-5 h-5 " />
              <img src={downArrow} alt="Dropdown" className="w-4 h-4 " />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 "
                    >
                      <img src={usa} className="w-5 h-5" alt="EN" /> {t('english')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('fr')}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 "
                    >
                      <img src={fr} className="w-5 h-5" alt="FR" /> {t('french')}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => changeLanguage('ar')}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 "
                    >
                      <img src={arabe} className="w-5 h-5" alt="AR" /> {t('arabic')}
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          {/* Cart Button */}
                          <Link to={"/cart"}>
                            <button className="relative p-2 rounded-full bg-gray-200  hover:bg-gray-300 ">
                              <ShoppingCart />
                              {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                  {cartCount}
                                </span>
                              )}
                            </button>
                          </Link>
        </div>
    </div>
  </header>
</>

  ):(
  <>
  </>
  )}
  </div>
  {
  isLoggedIn ? (
    role==="ADMIN"? (
<>
  <nav className="p-4 sm:ml-64 bg-white shadow-sm flex justify-between items-center">
    {/* Partie gauche - Logo et bouton mobile */}
    <div className="flex items-center">
      {/* Bouton mobile - seulement sur petits écrans */}
      <button
        className="md:hidden mr-4 p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Logo */}
      <div className="flex items-center">
        <img src={icon} alt="Logo" className="w-12 h-12 object-contain" />
      </div>
    </div>

    {/* Partie droite - Contrôles de navigation */}
    <div className="flex items-center gap-4">
      {/* Notifications */}
      <div className="relative">
        <button 
          onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative"
        >
          <Bell className="w-6 h-6" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full w-4 h-4 text-xs">
              {notifications.length}
            </span>
          )}
        </button>
        
        {isNotificationOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b ">
              <h3 className="font-semibold ">Notifications</h3>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500 ">No notifications</p>
              ) : (
                notifications.map((notif) => (
                  <Link 
                    key={notif.messageHash} 
                    to="/Approvecomments" 
                    className="block p-4 hover:bg-gray-50 border-b "
                  >
                    <div className="text-sm text-gray-800 ">{notif.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </div>
                  </Link>
                ))
              )}
            </div>
            <button 
              onClick={MarkAllRead} 
              className="w-full p-3 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2 "
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
              Mark all as read
            </button>
          </div>
        )}
      </div>
      
      {/* Sélecteur de langue */}
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg "
        >
          <img src={globe} alt="Globe" className="w-5 h-5" />
          <img src={downArrow} alt="Dropdown" className="w-3 h-3" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 ">
            <ul className="py-2">
              <li>
                <button 
                  onClick={() => changeLanguage('en')} 
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full "
                >
                  <img src={usa} alt='English' className="w-5 h-5 mr-2" />
                  {t('english')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => changeLanguage('fr')} 
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full "
                >
                  <img src={fr} alt='French' className="w-5 h-5 mr-2" />
                  {t('french')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => changeLanguage('ar')} 
                  className="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full "
                >
                  <img src={arabe} alt='Arabic' className="w-5 h-5 mr-2" />
                  {t('arabic')}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Profil utilisateur */}
      <div className="relative">
        <button
          onClick={() => setisProfileOpen(!isProfileOpen)}
          className="flex text-sm bg-white rounded-full focus:ring-4 focus:ring-yellow-400 "
          type="button"
        >
          <span className="sr-only">Open user menu</span>
            <div className="flex-shrink-0 rounded-full w-10 h-10 bg-blue-100 flex items-center justify-center" >
              <span className="text-blue-600 font-medium text-2xl">
                {user?.fullname.charAt(0).toUpperCase()}
              </span>
            </div>
        </button>
        
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 ">
            <div className="px-4 py-3 border-b dark:border-gray-600">
              <div className="text-sm font-medium truncate ">{user?.fullname}</div>
              <div className="text-xs text-gray-500 truncate ">{user?.email}</div>
            </div>
            <ul className="py-1">
              <li>
                <Link 
                  to="/dashboard" 
                  className="block px-4 py-2 hover:bg-gray-100 "
                >
                  {t('Dashboard')}
                </Link>
              </li>
              <li>
                <Link 
                  to={`/Admin/${userId}`} 
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {t('Profile')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className="block px-4 py-2 hover:bg-gray-100 "
                >
                  {t('Settings')}
                </Link>
              </li>
            </ul>
            <div className="py-2 border-t dark:border-gray-600">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
               {t('Logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </nav>
  {/* Sidebar */}
  <aside
    id="default-sidebar"
    className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 bg-white shadow-lg `}
  >
    <div className="h-full px-4 py-6 overflow-y-auto ">
      <div className="flex justify-center mb-8">
        <img src={icon} alt="Logo" className="w-24 " />
      </div>
      
      <nav className="space-y-1">
        {[
          { to: '/Dashboard', text: t('Dashboard'), icon: LayoutDashboardIcon },
          { to: '/usermanagement', text: t('userManagement'), icon: User },
          { to: '/coursManagement', text: t('courseManagement'), icon: Book },
          { to: '/Events', text: t('Events'), icon: CalendarClock },
          { to: '/AddCourses', text: t('Adding'), icon: BookPlus },
          { to: '/CreateChapters', text: t('CreateChapter'), icon: FilePlus2 },
          { to: '/UnlockChapters', text: t('UnlockChapters'), icon: BookKey },
          { to: '/IAManagement', text: t('AIManagement'), icon: BotMessageSquare },
          { to: '/AddUser', text: t('Teacher'), icon: UserRoundPlus },
          { to: '/Approvecomments', text: t('Community'), icon: MessageSquareText },
          { to: '/archive', text: t('Archive'), icon: Archive },
          { to: '/EnrolledUser', text: t('EnrollmentTracking'), icon: FileUser }
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center p-3 text-gray-600 rounded-lg hover:bg-gray-100 "
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.text}</span>
          </Link>
        ))}
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <LogOutIcon className="w-5 h-5 mr-3" />
          {t('Logout')}
        </button>
      </nav>
    </div>
  </aside>
</>
      ): role==="APPRENANT" ?(
                  <>
                    <div className="max-w-screen-xl mx-auto px-4 py-3 " style={{ fontFamily: "Montserrat,sans-serif" }}>
                      <div className="flex flex-wrap items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center z-10 ">
                          <img src={icon} alt="" className="w-16 md:w-20" />
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg z-10"
                          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                          <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M4 6h16M4 12h16m-7 6h7" 
                            />
                          </svg>
                        </button>

                        {/* Navigation Items */}
                            <div
                              className={`w-full md:w-auto   ${isMobileMenuOpen ? 'block' : 'hidden'} md:flex`}
                              style={{
                                fontFamily: "Montserrat, sans-serif",
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:flex-grow ">
                            {/* Main Links */}
                            <div className="md:flex absolute left-1/2 -translate-x-1/2  ">
                            <div className="flex items-center space-x-8">
                                <NavLink
                                  to="/" 
                                  className={({ isActive }) => 
                                    `text-lg transition-colors duration-300 ${
                                      isActive ? 'text-blue-800' : 'text-gray-600 hover:text-blue-800 '
                                    }`
                                  }
                                  end
                                >
                                  {t('home')}
                                </NavLink>
                                <NavLink
                                  to="/Cours"
                                  className={({ isActive }) => 
                                    `text-lg transition-colors duration-300 ${
                                      isActive ? 'text-blue-800' : 'text-gray-600 hover:text-blue-800'
                                    }`
                                  }
                                >
                                  {t('courses')}
                                </NavLink>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto dark-bg">
                              <div className="relative ">
                                <button 
                                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative  "
                                >
                                  <Bell className="w-6 h-6" />
                                  {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-yellow-500 text-white rounded-full w-4 h-4 text-xs ">
                                      {notifications.length}
                                    </span>
                                  )}
                                </button>

                                {/* Notifications Dropdown */}
                                {isNotificationOpen && (
                                  <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50 dark-bg ">
                                    <div className="p-4 border-b text-gray-500 ">
                                      <h3 className="font-semibold text-gray-500  "> {t('Notifications')} </h3>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                      {notifications.length === 0 ? (
                                        <p className="p-4 text-sm text-gray-900 ">{t('Nonotifications')}</p>
                                      ) : (
                                        notifications.map((notif, index) => (
                                          <Link
                                            key={index}
                                            to="/Cours"
                                            className="block p-4 hover:bg-gray-50 border-b"
                                          >
                                            <div className="text-sm text-gray-800 ">{notif.message}</div>
                                            <div className="text-xs text-gray-500 mt-1 ">{notif.timestamp}</div>
                                          </Link>
                                        ))
                                      )}
                                    </div>
                                    <button
                                      onClick={MarkAllRead}
                                      className="w-full p-3 text-sm text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path 
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      {t('MarkAll')}
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="relative">
                                <Link to={"/cart"}>
                                  <button className="relative p-2 rounded-full hover:bg-gray-300">
                                    <ShoppingCart />
                                    {cartCount > 0 && (
                                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                      </span>
                                    )}
                                  </button>
                                </Link>
                              </div>
                              {/* Language Selector */}
                              <div className="relative" >
                                <button
                                  onClick={() => setIsOpen(!isOpen)}
                                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg  "
                                >
                                  <img src={globe} alt="Globe" className="w-5 h-5 " />
                                  <img src={downArrow} alt="Dropdown" className="w-3 h-3 " />
                                </button>

                                {/* Language Dropdown */}
                                {isOpen && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 ">
                                    <ul className="py-2">
                                      <li>
                                        <button
                                          onClick={() => changeLanguage('en')}
                                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100  "
                                        >
                                          <img src={usa} alt="English" className="w-6 h-6" />
                                          {t('english')}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => changeLanguage('fr')}
                                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 "
                                        >
                                          <img src={fr} alt="French" className="w-6 h-6" />
                                          {t('french')}
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          onClick={() => changeLanguage('ar')}
                                          className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-100 "
                                        >
                                          <img src={arabe} alt="Arabic" className="w-6 h-6" />
                                          {t('arabic')}
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                )}
                              </div>


                            {/* Profil utilisateur */}
                          <div className="relative">
                            <button
                              onClick={() => setisProfileOpen(!isProfileOpen)}
                              className="flex  text-sm bg-white rounded-full focus:ring-4 focus:ring-yellow-400" 
                              type="button">
                                <span className="sr-only">Open user menu</span>
                                <div className="flex-shrink-0 rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center" >
                                  <span className="text-blue-600 font-medium text-2xl">
                                    {user?.fullname.charAt(0).toUpperCase()} 
                                  </span>
                                </div>
                            </button>
                            {isProfileOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 ">
                                <div className="px-4 py-3 border-b dark:border-gray-600">
                                  <div className="text-sm font-medium truncate ">{user?.fullname}</div>
                                    <div className="text-xs text-gray-500 truncate ">{user?.email}</div>
                                </div>
                                <ul className="py-1">
                                  <li>
                                    <Link to="/Profile" className="block px-4 py-2 hover:bg-gray-100 ">
                                      {t('Profile')}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to="/Profile/Mycourse"  className="block px-4 py-2 hover:bg-gray-100 ">
                                      {t('Mycourse')}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link to={"/Profile/Update"} className="block px-4 py-2 hover:bg-gray-100">
                                      {t('Settings')}
                                    </Link>
                                  </li>
                                </ul>
                                <div className="py-2 border-t dark:border-gray-600">
                                  <button
                                   onClick={handleLogout}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                                      {t('Logout')}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div> 
                      </div>
                    </div>
                  </div>
                </div>
              </>
              )  : role === "ENSEIGNMENT" && (
                  <>
                    <nav className="p-4 sm:ml-64 bg-white shadow-sm flex justify-between items-center">
                           {/* Partie gauche - Logo et bouton mobile */}
                          <div className="flex items-center">
                            {/* Bouton mobile - seulement sur petits écrans */}
                            <button
                              className="md:hidden mr-4 p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            >
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            
                            {/* Logo */}
                            <div className="flex items-center">
                              <img src={icon} alt="Logo" className="w-12 h-12 object-contain" />
                            </div>
                          </div>
                      <div className="flex items-center">

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100"
                            aria-label="Toggle menu"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        <div className="flex items-center space-x-4 md:space-x-6">
                          <div className="relative">
                            <button 
                              onClick={() => setIsNotificationOpen(!isNotificationOpen)} 
                              className="relative p-2 rounded-lg hover:bg-gray-100"
                            >
                              <Bell className="text-gray-700 w-6 h-6" />
                              {notifications.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                  {notifications.length}
                                </span>
                              )}
                            </button>
                            {isNotificationOpen && (
                              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                                <div className="p-3 border-b border-yellow-500 flex justify-center bg-yellow-50">
                                  <Bell className="text-yellow-500 w-6 h-6" />
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                  {notifications.length === 0 ? (
                                    <p className="text-sm text-yellow-500 p-4 text-center">No notifications</p>
                                  ) : (
                                    <div className="divide-y divide-gray-200">
                                      {notifications.map(notif => (
                                        <div key={notif.id} className="hover:bg-gray-50">
                                          <Link 
                                            to="/Cours" 
                                            className="block p-4"
                                            onClick={() => setIsOpen(false)}
                                          >
                                            <p className="text-sm text-blue-800 font-medium">{notif.message}</p>
                                            <p className="text-xs text-blue-600 mt-1">{notif.timestamp}</p>
                                          </Link>
                                        </div>
                                      ))}
                                      <div className="p-3 border-t border-gray-200">
                                        <button 
                                          onClick={() => {
                                            MarkAllRead();
                                            setIsOpen(false);
                                          }} 
                                          className="text-xs text-gray-500 flex items-center hover:text-gray-700"
                                        >
                                          <svg 
                                            className="w-3 h-3 mr-1" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                          </svg>
                                          {t('MarkAll')}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                                {/* Profil utilisateur */}
                          <div className="relative">
                            <button
                              onClick={() => setisProfileOpen(!isProfileOpen)}
                              className="flex text-sm bg-white rounded-full focus:ring-4 focus:ring-yellow-400 "
                              type="button"
                            >
                              <span className="sr-only">Open user menu</span>
                                <div className="flex-shrink-0 rounded-full w-10 h-10 bg-blue-100 flex items-center justify-center" >
                                  <span className="text-blue-600 font-medium text-2xl">
                                    {user?.fullname.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                            </button>
                            
                            {isProfileOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 ">
                                <div className="px-4 py-3 border-b dark:border-gray-600">
                                  <div className="text-sm font-medium truncate ">{user?.fullname}</div>
                                  <div className="text-xs text-gray-500 truncate ">{user?.email}</div>
                                </div>
                                <ul className="py-1">
                                  <li>
                                    <Link 
                                      to="/DashboardENS" 
                                      className="block px-4 py-2 hover:bg-gray-100 "
                                    >
                                      {t('Dashboard')}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link 
                                      to={`/ProfileENSPrivate/${userId}`} 
                                      className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                      {(t('Profile'))}
                                    </Link>
                                  </li>
                                  <li>
                                    <Link 
                                      to="/Update" 
                                      className="block px-4 py-2 hover:bg-gray-100 "
                                    >
                                      {t('Settings')}
                                    </Link>
                                  </li>
                                </ul>
                                <div className="py-2 border-t dark:border-gray-600">
                                  <button
                                   onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                                    {t('Logout')}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                                {/* Sélecteur de langue */}
                          <div className="relative">
                            <button 
                              onClick={() => setIsOpen(!isOpen)} 
                              className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg "
                            >
                              <img src={globe} alt="Globe" className="w-5 h-5" />
                              <img src={downArrow} alt="Dropdown" className="w-3 h-3" />
                            </button>
                            
                            {isOpen && (
                              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 ">
                                <ul className="py-2">
                                  <li>
                                    <button 
                                      onClick={() => changeLanguage('en')} 
                                      className="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full "
                                    >
                                      <img src={usa} alt='English' className="w-5 h-5 mr-2" />
                                      {t('english')}
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      onClick={() => changeLanguage('fr')} 
                                      className="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full "
                                    >
                                      <img src={fr} alt='French' className="w-5 h-5 mr-2" />
                                      {t('french')}
                                    </button>
                                  </li>
                                  <li>
                                    <button 
                                      onClick={() => changeLanguage('ar')} 
                                      className="inline-flex items-center px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 w-full "
                                    >
                                      <img src={arabe} alt='Arabic' className="w-5 h-5 mr-2" />
                                      {t('arabic')}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
  
                        <aside  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`} >                        
                        <div className="p-5 flex flex-col h-full ">
                          <div className="flex justify-center items-center z-10 ">
                            <img src={icon} alt="" className="w-20 md:w-20" />
                          </div>
                          <nav className="mt-8 flex-1">
                            <NavLink 
                              to="/DashboardENS" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                              </svg>
                              <span>{t('Dashboard')}</span>
                            </NavLink>
                            <NavLink 
                              to="/comments" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z"/>
                              </svg>
                              <span> {t('Community')} </span>
                            </NavLink>
                            <NavLink 
                              to={`/ProfileENSPrivate/${userId}`}
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a7.5 7.5 0 0 1-7.5-7.5c0-.75.125-1.5.375-2.2C3.5 10 5 10 5 10h10s1.5 0 2.125.8c.25.7.375 1.45.375 2.2A7.5 7.5 0 0 1 10 18Z"/>
                              </svg>
                              <span> {t('Profile')} </span>
                            </NavLink>
                            <NavLink 
                              to="/Update" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.75 4H19M7.75 4a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 4h2.25m13.5 6H19m-2.25 0a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 10h11.25m-4.5 6H19M7.75 16a2.25 2.25 0 0 1-4.5 0m4.5 0a2.25 2.25 0 0 0-4.5 0M1 16h2.25"/>
                              </svg>
                              <span> {t('Settings')} </span>
                            </NavLink>
                             <NavLink 
                              to="/AddFormations" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                      <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z"/>
                                  </svg>
                              <span> {t('Formations')} </span>
                            </NavLink>
                             <NavLink 
                              to="/AddNewChapter" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    <line x1="12" y1="8" x2="12" y2="14"></line>
                                    <line x1="9" y1="11" x2="15" y2="11"></line>
                                  </svg>
                              <span>{t('Chapters')}</span>
                            </NavLink>
                             <NavLink 
                              to="/CreateEvent" 
                              className={({isActive}) => `flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="15" y2="16"></line>
                                  </svg>
                              <span> {t('Events')} </span>
                            </NavLink>
                            <button 
                              onClick={handleLogout}
                              className="flex items-center space-x-3 p-3 rounded-lg mb-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 16 16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"/>
                              </svg>
                              <span> {t('Logout')} </span>
                            </button>
                          </nav>
                        </div>
                      </aside>
                    </nav>
                  </>
              )
            ):(
              <>
              </>
            )
}

</nav>


  )
}

export default Navbar
