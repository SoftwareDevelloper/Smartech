import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [testQueue, setTestQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const confirmPayment = async () => {
    try {
      const query = new URLSearchParams(location.search);
      const paymentIntentId = query.get('payment_intent');
      const token = localStorage.getItem('auth-token');
      if (!paymentIntentId || !token) throw new Error('Missing payment info');

      const decoded = jwtDecode(token);
      const userId = decoded.sub;
      console.log("Sending to backend:", {
        paymentIntentId,
        apprenantId: userId,
      });

      const response = await axios.post(
        'http://localhost:9000/api/v1/confirm-payment',
        null,
        {
          params: { paymentIntentId, apprenantId: userId },
        }
      );

      const courses = response.data.purchasedCourses;
      if (!courses || courses.length === 0) throw new Error('No courses found');

      toast.success(t('paymentSuccessful'));

      // Sauvegarder les tests restants en localStorage
      localStorage.setItem('remaining-tests', JSON.stringify(courses.slice(1)));

      // Rediriger vers le premier test
      navigate(`/testAi/${courses[0]}`);
    } catch (err) {
      toast.error(t('paymentVerificationFailed'));
      console.error(err);
      navigate('/');
    }
  };

  confirmPayment();
}, [location, navigate, t]);


  useEffect(() => {
    if (testQueue.length > 0 && currentIndex < testQueue.length) {
      const nextCourseId = testQueue[currentIndex];
      setTimeout(() => {
        navigate(`/testAi/${nextCourseId}`);
        setCurrentIndex((prev) => prev + 1);
      }, 2000); // délai pour éviter trop de redirections immédiates
    }
  }, [testQueue, currentIndex, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">{t('paymentSuccessful')}</h1>
      <p className="text-lg mb-6">{t('redirectingToTest')}</p>
    </div>
  );
};

export default PaymentSuccess;
