import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import arrowDown from './assest/arrowDown.svg';
import close from './assest/close.svg';
import About from './component/About';
import ChatBotIcon from './component/ChatBotIcon';
import ChatForm from './component/ChatForm';
import Contact from './component/Contact';
import Footer from './component/footer';
import Navbar from './component/Navbar';
import PaymentSuccess from './component/PaymentSuccess';
import Test from './component/testAi/testAI';
import ErrorPage from './Page/404/ErrorPage';
import AddChapters from './Page/ADMIN/AddChapters';
import AddCourse from './Page/ADMIN/AddCourse';
import AdminControls from './Page/ADMIN/AdminControls';
import AdminUsersView from './Page/ADMIN/AdminUsersView';
import Archive from './Page/ADMIN/archiveUsers';
import CommentApprove from './Page/ADMIN/CommentApprove';
import CreateChapters from './Page/ADMIN/CreateChapters';
import Dashboard from './Page/ADMIN/Dashboard';
import Events from './Page/ADMIN/Events';
import Formations from './Page/ADMIN/Formations';
import IAManage from './Page/ADMIN/IAManage';
import ProfileAdmin from './Page/ADMIN/ProfileAdmin';
import ProfileSettings from './Page/ADMIN/profileSettings';
import Enseignant from './Page/ADMIN/Teachers';
import Users from './Page/ADMIN/Users';
import Edit from './Page/APPRENANT/Edit';
import Mycourse from './Page/APPRENANT/Mycourse';
import Profile from './Page/APPRENANT/Profile';
import Cart from './Page/Cart';
import Cours from './Page/Cours';
import DisplayCours from './Page/displayCours/displaycours';
import DisplayCourse from './Page/DisplayCourse/DisplayCourse';
import { default as Addcourse, default as AddNewcourse } from './Page/ENSEIGNMENT/Addcourse';
import AddNewChapters from './Page/ENSEIGNMENT/AddNewChapters';
import CreateEvent from './Page/ENSEIGNMENT/CreateEvent';
import DashboardENS from './Page/ENSEIGNMENT/DashboardENS';
import Comment from './Page/ENSEIGNMENT/GestionComment/Comment';
import ProfileEns from './Page/ENSEIGNMENT/ProfileENS';
import ProfileEnsPrivate from './Page/ENSEIGNMENT/ProfileEnsPrivate';
import Update from './Page/ENSEIGNMENT/Update';
import Home from './Page/Home';
import Inscription from './Page/Inscription';
import Licensing from './Page/Licencing/Licensing';
import Login from './Page/Logins/Login';
import PrivacyPolicy from './Page/Privacy Policy/PrivacyPolicy';
import RegisterLearner from './Page/Registers/RegisterLearner';
import TwoFAComponent from './Page/TwoFAComponent/TwoFAComponent';
import Unauthorized from './Page/unthorized/Unauthorized';
import WaitApprove from './Page/WaitApprove';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  const [showChatbot, setshowChatbot] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hello! how can i help you with?' }]);
  const [role, setRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);
  useEffect(() => {
    // Check if there's a token in localStorage when the component mounts
    const token = localStorage.getItem('auth-token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.Role;  // Assuming the role is stored in the 'Role' property of the token
        setRole(role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('auth-token'); // Remove invalid token
      }
    }
  }, []);
  const handleLogin = (newToken) => {
    if (!newToken || typeof newToken !== "string") {
      console.error("Invalid token received:", newToken);
      return;
    }
  
    localStorage.setItem("auth-token", newToken);
    const decodedToken = jwtDecode(newToken);
    const role = decodedToken.Role;  // Assuming the role is stored in the 'Role' property of the token
    console.log("User role:", role);
    setRole(role);  // Update the role state
    setIsLoggedIn(true);  // Update the login state
  };
  

  
  const handleChatSubmit = async (message) => {
    setMessages(prev => [...prev, { from: "user", text: message }]);
  
    try {
      const maxMessages = 10; // Limit to the last 10 messages
      const recentMessages = messages.slice(Math.max(messages.length - maxMessages, 0));
  
      const response = await axios.post(
        'https://smartech-production-1020.up.railway.app/api/chat',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant at SmartTech Academy. Reply in a friendly, concise, and informative way. You understand Arabic, French, and English.' },
            ...recentMessages.map(msg => ({ role: msg.from === 'bot' ? 'assistant' : 'user', content: msg.text })),
            { role: 'user', content: message }
          ],
          temperature: 0.7
        }
      );
  
      console.log(response.data);  // Log the full response for debugging
  
      const botMessage = response.data.reply || 'No response from bot';
      setMessages(prev => [...prev, { from: "bot", text: botMessage }]);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setMessages(prev => [...prev, { from: "bot", text: "🚫 Too many requests! Please wait a moment and try again." }]);
      } else {
        console.error("Error:", error);
        setMessages(prev => [...prev, { from: "bot", text: "Oops, something went wrong 🤖. Please try again later." }]);
      }
    }
  };
  
  

  return (
    <BrowserRouter>
      <div className="App">
        <div className='header'>
          <Navbar isLoggedIn={isLoggedIn} role={role} />
        </div>

        <div className='main'>
          <Routes>
            <Route path='/Login' element={<Login onLogin={handleLogin} />} />
            <Route path='/SignUp' element={<RegisterLearner />} />
            <Route path='/*' element={<ErrorPage/>} />
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='/' element={<Home />} />
            <Route path='/Cours' element={<Cours />} />
            <Route path='/Cours/:id' element={<DisplayCourse />} />
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/ProfileENS/:teacherId' element={<ProfileEns />} />
            <Route element={<PrivateRoute allowedRoles={['APPRENANT']}/>}>
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Profile/Mycourse' element={<Mycourse />} />
            <Route path='/Profile/Mycourse/:id' element={<DisplayCours />} />
            <Route path='/Profile/Update' element={<Edit />} />
            <Route path='/ProfileENS/:teacherId' element={<ProfileEns />} />
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path='/VerifyOTP'  element={ <TwoFAComponent/> } />
            <Route path='/testAi/:id' element={<Test/>}/>
            <Route path='/Approve' element={<WaitApprove />} />
            <Route path='/cart' element={<Cart/>}/>
            <Route path='/Cours/:id/Inscription' element={<Inscription />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

          </Route>
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/coursManagement' element={<Formations />} />
            <Route path='/usermanagement' element={<Users />} />
            <Route path='/Addcourse' element={<Addcourse />} />
            <Route path='/IAManagement' element={<IAManage />} />
            <Route path='/AddUser' element={<Enseignant />} />
            <Route path='/AddCourses' element={<AddCourse />} />
            <Route path='/Events' element={<Events />} />
            <Route path='/Admin/:userId' element={<ProfileAdmin />} />
            <Route path='/Approvecomments' element={<CommentApprove/>}/>
            <Route path='/addChapter' element={<AddChapters/>}/>
            <Route path='/UnlockChapters' element={<AdminControls/>}/> 
            <Route path='/CreateChapters' element={<CreateChapters/>} />
            <Route path='/settings' element={<ProfileSettings />} />
            <Route path='/unauthorized' element={<Unauthorized />} />
            <Route path= '/archive' element={<Archive/>}/>
            <Route path= '/EnrolledUser' element={<AdminUsersView/>}/>
          </Route>
          <Route element={<PrivateRoute allowedRoles={['ENSEIGNMENT']} />}>
            <Route path='/ProfileENSPrivate/:teacherId' element={<ProfileEnsPrivate />} />
            <Route path='/DashboardENS' element={<DashboardENS />} />
            <Route path='/comments' element={<Comment />} />
            <Route path='/Update' element={<Update />} />
            <Route path='/AddFormations' element={<AddNewcourse/>}/>
            <Route path='/AddNewChapter' element={<AddNewChapters/>}/>
            <Route path='/CreateEvent' element={<CreateEvent/>}/>
          </Route>
            <Route path='/PrivacyPolicy' element={<PrivacyPolicy />} />
            <Route path='/Licensing' element={<Licensing />} />
          </Routes>
          {role === 'APPRENANT' && (
          <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setshowChatbot(prev => !prev)} id="chatbot-toggler">
              <span className="material-symbols-rounded">chat</span>
              <img src={close} alt='' style={{ color: "white" }} />
            </button>
            <div className="chatbot-popup">
              <div className="chat-header">
                <div className="header-info">
                  <ChatBotIcon />
                  <h2 className='logo-text'>{t('logo')}</h2>
                </div>
                <button onClick={() => setshowChatbot(prev => !prev)} className="material-symbols-rounded">
                  <img src={arrowDown} alt='' />
                </button>
              </div>

              <div className="chat-body">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.from}-message`}>
                    <p className="message-text">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className='chat-footer'>
                <ChatForm onChatSubmit={handleChatSubmit} />
              </div>
            </div>
          </div>
          )}
        </div>

        <div className='footer'>
          <Footer isLoggedIn={isLoggedIn} role={role} />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
