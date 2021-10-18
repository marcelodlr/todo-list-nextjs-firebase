import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where, FirestoreErrorCode, orderBy } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import styles from '../../styles/Todos.module.css';
import AddIcon from '@mui/icons-material/Add';
import Todo from '../../atoms/Todo';
import { Fab, Button } from '@mui/material';
import { useRouter } from 'next/router';

const db = getFirestore();

const TodoListComponent = () => {
    const [todos, setTodos] = useState([]);
    const router = useRouter();
    const auth = getAuth();

    useEffect(async () => {
        try {
            const q = query(collection(db, "todo"), where("user_uid", "==", auth.currentUser.uid), orderBy('date'));
            const querySnapshot = await getDocs(q);
            setTodos(querySnapshot.docs.map(el => ({ id: el.id, ...el.data() })));
        } catch (error) {
            alert(error.message);
        }
    }, []);


    const signOutHandler = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            alert(error.message);
        }
    }


    return (
        <div className={styles.container}>
            <Button onClick={signOutHandler} className={styles.logOut} variant="text">Log Out</Button>
            {todos && todos.length > 0 ? todos.map(todo => <Todo key={todo.id} item={todo} />)
            :
            <p>Your Todo list is Empty</p>
            }
            <Fab onClick={() => router.push('todos/todo')} className={styles.fab} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
        </div>
    );
}

export async function getStaticProps(context) {
    return {
        props: {
            protected: true
        }
    };
}

export default TodoListComponent;