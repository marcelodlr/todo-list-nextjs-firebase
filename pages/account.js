import React, { useState } from 'react';
import { Container, TextField, Box, Button, Link } from '@mui/material';
import styles from '../styles/CreateAccount.module.css';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/router';

export default function CreateAccount() {
    const router = useRouter();
    var [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
        passwordConfirmation: ''
    });
    let { email, password, passwordConfirmation } = loginInfo;

    const validatePassword = () => {
        let isValid = true;
        if (password.length < 6) {
            alert('The password must have at least 6 characters');
            isValid = false;
        } else if (password != passwordConfirmation) {
            alert('The password and password confirmation are different!');
            isValid = false;
        }
        return isValid;
    };

    const onCreateAccountClick = () => {
        if (validatePassword()) {
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    router.push('/todos')
                })  
                .catch((error) => {
                    alert(error.message);
                });
        }
    };

    return (
        <Container className={styles.container}>
            <Box className={styles.box}>
                <TextField classes={{ root: styles.input }} label="Email" value={email} onChange={(event) => setLoginInfo({ ...loginInfo, email: event.target.value })} />
                <TextField classes={{ root: styles.input }} label="Password" type="password" value={password} onChange={(event) => setLoginInfo({ ...loginInfo, password: event.target.value })} />
                <TextField classes={{ root: styles.input }} label="Password Confirmation" type="password" value={passwordConfirmation} onChange={(event) => setLoginInfo({ ...loginInfo, passwordConfirmation: event.target.value })} />
                <Button onClick={onCreateAccountClick} className={styles.loginButton} variant="contained">Create Account</Button>
            </Box>
        </Container>
    );
}
