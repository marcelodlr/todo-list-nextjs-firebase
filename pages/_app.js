import React, { useEffect, useState } from 'react';
import '../styles/globals.css'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ForbiddenPage from './../atoms/ForbiddenPage';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import app from '../firebase/firebase';
const auth = getAuth();

function MyApp({ Component, pageProps }) {
  const [authCheck, setAuthCheck] = useState({ hasVerified: false, user: null });
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setAuthCheck({ hasVerified: true, user })
    });
  }, []);

  if (pageProps.protected && authCheck.hasVerified && !authCheck.user) return <ForbiddenPage />;
  return <LocalizationProvider dateAdapter={AdapterDateFns}>
    <Component {...pageProps} />
  </LocalizationProvider>;
}

export default MyApp
