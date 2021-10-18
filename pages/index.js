import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css'
import { Container, TextField, Box, Button, Link } from '@mui/material';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const auth = getAuth();
  var [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });
  var [displayLogin, setDisplayLogin] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/todos');
      } else {
        setDisplayLogin(true);
      }
    });
  }, [])

  const signInHandler = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
    } catch (error) {
      alert(error.message);
    }

  };

  return (
    <Container className={styles.container}>
      {displayLogin &&
        < Box className={styles.box}>
          <TextField classes={{ root: styles.input }} label="Email" value={loginInfo.email} onChange={(event) => setLoginInfo({ ...loginInfo, email: event.target.value })} />
          <TextField classes={{ root: styles.input }} label="Password" type="password" value={loginInfo.password} onChange={(event) => setLoginInfo({ ...loginInfo, password: event.target.value })} />
          <Button onClick={signInHandler} className={styles.loginButton} variant="contained">Login</Button>
          <Link href="/account">Create Account</Link>
        </Box>}
    </Container >
  );
}

