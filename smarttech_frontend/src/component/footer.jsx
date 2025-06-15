import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import facebook from '../assest/facebook.png';
import gmail from '../assest/gmail.png';
import call from '../assest/telephone.png';
import '../i18n';
import './css/footer.css';
const Footer = ({isLoggedIn,role}) => {
  const{t,i18n} = useTranslation()
  const [darkMode, setDarkMode] = React.useState(false);

  useEffect(() => {
    // Vérifie si le dark mode est activé dans le localStorage
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  // Fonction pour appliquer les classes dark mode
  const getFooterClass = () => {
    return darkMode ? 'dark-footer' : '';
  };

  const getImgClass = () => {
    return darkMode ? 'dark-footer-img' : '';
  };
  return (
    <>
      {isLoggedIn ? (
        role === "ADMIN" || role === "ENSEIGNMENT" ? (
          <>
         <>
          <footer className={`bg-white m-4 ${getFooterClass()}`} style={{marginTop:"20%"}}>
            <div className={`p-4 sm:ml-64 bg-white ${getFooterClass()}`}>
              <div className={`grid grid-cols-12 gap-4 mb-4 bg-white ${getFooterClass()}`}>
                <footer className={`bg-white rounded-lg shadow-sm m-4 ${getFooterClass()}`}>
                  <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center">
                      {t('footerYear')} <Link to="/" className="hover:underline"> {t('footerLogo')} </Link>. {t('footerRight')} .
                    </span>
                      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
                        <li>
                          <Link to="/" className="hover:underline me-4 md:me-6"> {t('Privacy')} </Link>
                        </li>
                        <li>
                          <Link to="/" className="hover:underline me-4 md:me-6"> {t('Licensing')} </Link>
                        </li>
                      </ul>
                  </div>
                </footer>
              </div>
            </div>
         </footer>
          </>
          </>
        ) : (
          <footer className={`bg-white rounded-lg shadow-sm m-4 ${getFooterClass()} `}>
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-500 sm:text-center">
              {t('footerYear')} <Link to="/" className="">{t('footerLogo')}</Link>.{t('footerRight')}.
              </span>
              <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
                <li>
                  <Link to="/PrivacyPolicy" className=" me-4 md:me-6">{t('Privacy')}</Link>
                </li>
                <li>
                  <Link to="/Licensing" className="me-4 md:me-6">{t('Licensing')} </Link>
                </li>
              </ul>
            </div>
            <div style={{display:'flex',justifyContent:"center",alignItems:"center",gap:"5px"}}>
              <ul style={{display:'flex',justifyContent:"center",alignItems:"center",gap:"20px"}}>
                <li>
                <Link to={"https://www.facebook.com/SmartechCentreMahdia"} className=" me-4 md:me-6">
                <img src={facebook} alt="" width={"25px"}/>
                </Link>
                </li>
                <li>
                <a href="mailto:inspire.mahdia@gmail.com" className=" me-4 md:me-6">
                <img src={gmail} alt="" width={"25px"}/>
                </a>
                </li>
                <li>
                <Link to={"tel:+216 99 620 004"} className=" me-4 md:me-6">
                <img src={call} alt="" width={"25px"}/>
                </Link>
                </li>
              </ul>
            </div>
          </footer>
        )
      ) :
      <>
       <footer className={`bg-white rounded-lg shadow-sm m-4 ${getFooterClass()}`} >
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
              <span className="text-sm text-gray-500 sm:text-center">
                © 2023 <Link to="/" className="hover:underline">SMARTTECH ACADEMY™</Link>. All Rights Reserved.
              </span>
              <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
                <li>
                  <Link to="/PrivacyPolicy" className=" me-4 md:me-6">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/Licensing" className=" me-4 md:me-6">Licensing</Link>
                </li>
              </ul>
            </div>
            <div style={{display:'flex',justifyContent:"center",alignItems:"center",gap:"5px"}}>
              <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 sm:mt-0">
                <li>
                <Link to={"https://www.facebook.com/SmartechCentreMahdia"} className="hover:underline me-4 md:me-6">
                <img src={facebook} alt="" width={"20px"}/>
                </Link>
                </li>
                <li>
                <Link to={"https://www.facebook.com/SmartechCentreMahdia"}  className="hover:underline me-4 md:me-6">
                <img src={gmail} alt="" width={"20px"}/>
                </Link>
                </li>
                <li>
                <Link to={"https://www.facebook.com/SmartechCentreMahdia"} className="hover:underline me-4 md:me-6">
                <img src={call} alt="" width={"20px"}/>
                </Link>
                </li>
              </ul>
            </div>
          </footer>
      </>
      }
    </>
  );
};

export default Footer
