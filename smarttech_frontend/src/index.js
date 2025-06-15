import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import i18n from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import App from './App';
import { CartProvider } from './Context/CartContext';
import './index.css';
import reportWebVitals from './reportWebVitals';

const stripePromise = loadStripe('pk_test_51RVcDPQWDS94qpzpCLpwWbynwU2wm2diLxxuTPQcEKEDwHPtIGYvShL6XhLGXwtkMlfqqs7kp3LTD5l1DcjhZZjD00At2YoHKG');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <CartProvider>
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
         <Elements stripe={stripePromise}>
          <App />
         </Elements>
      </I18nextProvider>
    </React.StrictMode>
  </CartProvider>

);

reportWebVitals();
