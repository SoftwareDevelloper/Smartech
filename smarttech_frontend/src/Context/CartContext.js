import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import LoginPromptModal from '../component/LoginPromptModal';
import i18n from '../i18n';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const token = localStorage.getItem('auth-token');
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  
  useEffect(() => {
    window.document.dir = i18n.dir();
  }, [currentLanguage]);

  let apprenantId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      apprenantId = decoded.sub;
    } catch (error) {
      console.error('❌ Invalid token:', error);
    }
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getCartItems = async () => {
    try {
      const response = await axios.get(`https://smartech-production-1020.up.railway.app/api/cart/${apprenantId}`, config);
      setCartItems(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch cart items:', error);
    }
  };

  const addToCart = async (formation) => {
    try {
      await axios.post(
        `https://smartech-production-1020.up.railway.app/api/cart/add?apprenantId=${apprenantId}&formationId=${formation.id}`,
        {},
        config
      );
      toast.success(t('CourseAdded'));
      getCartItems();
    } catch (error) {
      setShowLoginModal(true);
      console.error('Add to cart error:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`https://smartech-production-1020.up.railway.app/api/cart/remove/${itemId}`, config);
      toast.success(t('CourseRemoved'));
      getCartItems();
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(`https://smartech-production-1020.up.railway.app/api/cart/clear/${apprenantId}`, config);
      setCartItems([]);
      toast.success(t('cartCleared'));
    } catch (error) {
      console.error('Clear error:', error);
    }
  };

  useEffect(() => {
    if (token && apprenantId) getCartItems();
  }, [token]);

  return (
    <>
      <CartContext.Provider value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        getCartItems 
      }}>
        {children}
      </CartContext.Provider>
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};
