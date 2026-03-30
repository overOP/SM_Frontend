import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useDashboard = (defaultActiveItem = 'Dashboard') => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(defaultActiveItem);
  const [dateInfo, setDateInfo] = useState({ day: '', fullDate: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/login');
  };

  useEffect(() => {
    const now = new Date();
    setDateInfo({
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
  }, []);

  return {
    collapsed, setCollapsed,
    mobileOpen, setMobileOpen,
    activeItem, setActiveItem,
    dateInfo,
    showNotifications, setShowNotifications,
    showProfile, setShowProfile,
    handleLogout,
    auth,
  };
};
