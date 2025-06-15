import { Transition } from "@headlessui/react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

const LoginPromptModal = ({ isOpen, onClose, onLogin}) => {
   const { t} = useTranslation()
    const currentLanguage = i18n.language; 
     useEffect(()=>{
       window.document.dir = i18n.dir();
     },[currentLanguage])
  return (
    // Use Headless UI Transition for smooth fade & scale animation
    <Transition
      show={isOpen}
      as={Fragment}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 scale-90"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-90"
    >
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Alert Box */}
        <div className="relative bg-white rounded-lg shadow-lg max-w-sm w-full mx-4 p-6 border border-yellow-400 ring-1 ring-yellow-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Icon + Title */}
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
            <h3 className="text-lg font-semibold text-yellow-700"> {t('LoginRequired')} </h3>
          </div>
          {/* Message */}
          <p className="mt-4 text-yellow-800">
            {t('LoginP')}
          </p>
          <div className="mt-5">
              <a href="/Login" role="button" className="px-4 py-2 bg-yellow-500 text-white transition w-full md:w-auto">
                {t('RegisterNow')}
              </a>
          </div>
          </div>
      </div>
    </Transition>
  );
};

export default LoginPromptModal;
