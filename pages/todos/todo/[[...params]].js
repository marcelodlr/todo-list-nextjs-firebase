import React, { useState } from 'react';
import { TextField, List, ListItem, IconButton, Box, Button } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { Delete } from '@mui/icons-material'
import styles from '../../../styles/TodoForm.module.css';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc, getDocs, query, collection, where, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuid } from 'uuid';
import { startOfDay } from 'date-fns';
const db = getFirestore();
const auth = getAuth();

const toIsoDate = (date) => {
    return startOfDay(date).toISOString();
}

export default function TodoForm() {
    const router = useRouter();
    const [todo, setTodo] = useState({ date: new Date(), items: [], todoTextbox: '' });
    let { date, items, todoTextbox } = todo;

    const onKeyUpHandler = (event) => {
        if (event.keyCode === 13 && todoTextbox) {
            setTodo({ ...todo, todoTextbox: '', items: [...items, todoTextbox] })
        }
    };

    const onDelete = (index) => {
        let newList = [...items];
        newList.splice(index, 1);
        setTodo({ ...todo, items: newList });
    };

    const onSubmit = async () => {
        const q = query(collection(db, "todo"), where("user_uid", "==", auth.currentUser.uid), where('date', '==', toIsoDate(date)));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            alert('There is already a todo list for this date');
        } else {
            try {
                console.log({
                    user_uid: auth.currentUser.uid,
                    items: items,
                    date: toIsoDate(date)
                });
                await setDoc(doc(db, 'todo', uuid()), {
                    user_uid: auth.currentUser.uid,
                    items: items,
                    date: toIsoDate(date)
                });
                alert('Todo added');
                router.push('/todos');
            } catch (error) {
                console.log(error.message)
            }
        }
    };

    return <div className={styles.container}>
        <Box className={styles.box}>
            <div className={styles.inputContainers}>
                <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newValue) => {
                        setTodo({ ...todo, date: newValue });
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />

                <TextField id="item"
                    label="Type your todo"
                    variant="outlined"
                    onKeyUp={onKeyUpHandler}
                    value={todoTextbox}
                    onChange={(e) => setTodo({ ...todo, todoTextbox: e.target.value })}
                />
            </div>
            <div className={styles.todosDisplay}>
                <p>Todos: </p>
                <List dense disablePadding>
                    {items.map((el, index) => {
                        return (
                            <ListItem disablePadding key={index}>
                                {el}
                                <IconButton onClick={(e) => onDelete(index)}>
                                    <Delete />
                                </IconButton>
                            </ListItem>
                        )
                    })}
                </List>
            </div>
            <div className={styles.buttonsContainer}>
                <Button onClick={() => router.push('/todos')} variant="contained">Cancel</Button>
                <Button className={styles.submitButton} onClick={onSubmit} variant="contained">Save</Button>
            </div>
        </Box>
    </div>
}