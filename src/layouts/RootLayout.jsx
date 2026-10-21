import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import HoverFooter from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import SearchModal from '../components/search/SearchModal';
import CursorFollower from '../components/ui/cursor-follower';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white flex flex-col justify-between">
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <HoverFooter />
      <CartDrawer />
      <SearchModal />
      <CursorFollower />
    </div>
  );
}
