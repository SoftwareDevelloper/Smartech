import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import master from '../assest/card.png';
import cards from '../assest/contactless.png';
import credit_card from '../assest/credit-card.png';
import user from '../assest/id-card.png';
import mail from '../assest/mail.png';
import level from '../assest/next-level.png';
import price from '../assest/payment-method.png';
import tag from '../assest/tag.png';
import visa from '../assest/visa.png';
import '../i18n';
import './css/inscription.css';

// Load Stripe with the publishable key
const stripePromise = loadStripe('pk_test_51RVcDPQWDS94qpzpCLpwWbynwU2wm2diLxxuTPQcEKEDwHPtIGYvShL6XhLGXwtkMlfqqs7kp3LTD5l1DcjhZZjD00At2YoHKG');

const StripePaymentForm = ({ handlePayment, price }) => {
  
  const stripe = useStripe();
  const elements = useElements();
  const{t,i18n} = useTranslation()
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe has not been initialized.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch('https://smartech-production-1020.up.railway.app/api/v1/Checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: price * 100, currency: 'usd' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create PaymentIntent');
      }

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error('Client secret is missing in the response');
      }
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Payment successful!');
        handlePayment(); 
      }
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe} className="btn_pay">
        {t('pay')}
      </button>
    </form>
  );
};
const Inscription = () => {
  const [course, setCourse] = useState([]);
  const { id } = useParams() || {};
  const navigate = useNavigate();
  const{t,i18n} = useTranslation()
  const currentLanguage = i18n.language;
  const [formData, setformData] = useState({
    fullname: '',
    email: '',
    proficiencyLevel: '',
    title: '',
    price: '',
    isPayed: false,
  });

  useEffect(() => {
    if (!id) {
      console.error('Course ID is missing');
      return;
    }

    fetch(`https://smartech-production-1020.up.railway.app/api/GetFormationsById/${id}?lang=${currentLanguage}`)
      .then((response) => response.json())
      .then((data) => {
        setCourse(data);
        const translatedTitle =
        currentLanguage === 'fr'
          ? data.titleFr
          : currentLanguage === 'ar'
          ? data.titleAr
          : data.titleEn;
        setformData((prevData) => ({
          ...prevData,
          title:  translatedTitle,
          price: data.price,
        }));
      })
      .catch((error) => {
        console.error(`Error fetching course for ${id}:`, error);
      });
  }, [id,currentLanguage]);

  const changeHandler = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const inscrire = async () => {

    try {
      const token = localStorage.getItem('auth-token');
      let apprenant_id = '';
      if (token) {
        const decodedToken = jwtDecode(token);
        apprenant_id = decodedToken.sub;
      }

      const response = await fetch(`https://smartech-production-1020.up.railway.app/api/inscrire/${apprenant_id}/${id}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (response.ok) {
        toast.success('Thanks for subscribing!');
        toast.success('Welcome to Our Course');
        navigate(`/testAi/${id}`);
      } else {
        toast.error(responseData || 'Subscription failed');
      }
    } catch (error) {
      console.error('Error during subscription:', error);
      toast.error('An error occurred during subscription');
    }
  };

  const handlePayment = async () => {
    setformData((prevData) => ({
      ...prevData,
      isPayed: true,
    }));
    await inscrire();
  };

  return (
    <div className="Inscription">
      <form className="inscription_form" onSubmit={(e) => { e.preventDefault(); inscrire(); }}>
        <h1> {t('Inscription')} </h1>
        <hr />
        <div className="input">
          <input type="text" name="fullname" value={formData.fullname} onChange={changeHandler} placeholder={t('YourFullname')} />
          <img src={user} alt="" width={'18px'} />
        </div>
        <div className="input">
          <input type="email" name="email" value={formData.email} onChange={changeHandler} placeholder={t('mail')} />
          <img src={mail} alt="" width={'18px'} />
        </div>
        <div className="input">
          <select name="proficiencyLevel" id="proficiencyLevel" value={formData.proficiencyLevel} onChange={changeHandler}>
            <option value="" disabled> {t('Selectproficiencylevel')} </option>
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
          <img src={level} alt="" width={'18px'} />
        </div>
        {course ? (
          <>
            <div key={course.id} className="input">
              <input type="text" name="title" value={formData.title} onChange={changeHandler} readOnly />
              <img src={tag} alt="" width={'18px'} />
            </div>
            <div className="input">
              <div className="price-input-container">
                <input className="price" type="text" name="price" value={formData.price} onChange={changeHandler} readOnly />
                <img src={price} alt="" width={'18px'} />
                <span className="currency-symbol">    
                {currentLanguage === 'fr'
                    ? "TND"
                    : currentLanguage === 'ar'
                    ? " دينار"
                    : "TND"}
                </span>
              </div>
            </div>
          </>
        ) : (
          <button disabled type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
            <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
            </svg>
            Loading...
          </button>
        )}
      </form>
      <div className="payment_forms">
        <div className="OnlinePaymentCard">
          <div className="cards_img">
            <img src={cards} alt="" width={'40px'} />
            <img src={credit_card} alt="" width={'40px'} />
            <img src={visa} alt="" width={'40px'} />
            <img src={master} alt="" width={'70px'} />
          </div>
        </div>
        <Elements stripe={stripePromise}>
          <StripePaymentForm handlePayment={handlePayment} price={formData.price} />
        </Elements>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Inscription;
