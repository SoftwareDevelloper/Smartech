import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { jwtDecode } from 'jwt-decode';
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CartContext } from "../Context/CartContext";

const stripePromise = loadStripe(
  "pk_test_51RVcDPQWDS94qpzpCLpwWbynwU2wm2diLxxuTPQcEKEDwHPtIGYvShL6XhLGXwtkMlfqqs7kp3LTD5l1DcjhZZjD00At2YoHKG"
);

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) throw error;

      onSuccess();
    } catch (error) {
      toast.error(error.message || t("checkoutFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? t("processing") : t("proceedToCheckout")}
      </button>
    </form>
  );
};

const Cart = () => {
  const { cartItems, getCartItems, removeFromCart } = useContext(CartContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    setIsLoggedIn(!!token);
    if (token) getCartItems();
  }, [getCartItems]);

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success(t("courseRemoved"));
  };

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) throw new Error("User not logged in");

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.sub;

      const response = await fetch(
        `https://smartech-production-1020.up.railway.app/api/v1/create-payment-intent?apprenantId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: cartItems.reduce((sum, item) => sum + item.price, 0) * 100,
            currency: "usd",
            metadata: { itemCount: cartItems.length },
          }),
        }
      );

      if (!response.ok)
        throw new Error("Failed to create payment intent on server");

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast.error(error.message || t("checkoutFailed"));
    }
  };

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    createPaymentIntent();
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setClientSecret(null);
    navigate("/payment-success");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t("yourCart")}</h1>
        <p className="text-gray-500">
          {t("itemsInCart")} {cartItems.length}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-800">{t("emptyCart")}</h3>
          <button
            onClick={() => navigate("/Cours")}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {t("browseCourses")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.titleEn}
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {i18n.language === "ar"
                        ? item.titleAr
                        : i18n.language === "fr"
                        ? item.titleFr
                        : item.titleEn}
                    </h3>
                    <p className="text-gray-600">
                      {item.price} {i18n.language === "ar" ? "دينار" : "TND"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 p-6 bg-white rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">{t("Total")}:</h3>
              <span className="text-xl font-bold text-blue-600">
                {cartItems.reduce((sum, item) => sum + item.price, 0)}{" "}
                {i18n.language === "ar" ? "دينار" : "TND"}
              </span>
            </div>

            {showPaymentForm && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm onSuccess={handlePaymentSuccess} />
              </Elements>
            ) : (
              <button
                onClick={handleCheckoutClick}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                {t("proceedToCheckout")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {t("loginRequired")}
            </h3>
            <p className="mb-6">{t("pleaseLoginToCheckout")}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/login");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                {t("login")}
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={i18n.language === "ar"}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
    </div>
  );
};

export default Cart;
