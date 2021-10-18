import React, { useEffect, useState } from 'react';
import { TextField, List, ListItem, IconButton, Box, Button } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import { Delete } from '@mui/icons-material'
import styles from '../../../styles/TodoForm.module.css';
import { useRouter } from 'next/router';
import { doc, setDoc, getDoc, getDocs, query, collection, where, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { v4 as uuidGenerator } from 'uuid';
import { startOfDay } from 'date-fns';
const db = getFirestore();
const auth = getAuth();

const toIsoDate = (date) => {
    return startOfDay(date).toISOString();
}

export async function getServerSideProps(ctx) {
    const { params } = ctx.query;
    return {
        props: {
            uuid: params && params.length > 0 ? params[0] : null,
        },
    };
}

export default function TodoForm({ uuid }) {
    const router = useRouter();
    const [todo, setTodo] = useState({ date: new Date(), items: [], todoTextbox: '' });
    let { date, items, todoTextbox } = todo;

    useEffect(async () => {
        if (uuid) {
            let todoItem = await getDoc(doc(db, "todo", uuid));
            if (todoItem.exists()) {
                let item = todoItem.data();
                setTodo({ date: new Date(item.date), items: item.items })
            } else {
                alert("an error occured when fetching the todo item.")
            }
        }
    }, []);

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

    const tryAdd = async () => {
        const q = query(collection(db, "todo"), where("user_uid", "==", auth.currentUser.uid), where('date', '==', toIsoDate(date)));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            alert('There is already a todo list for this date');
        } else {
            try {
                await setDoc(doc(db, 'todo', uuidGenerator()), {
                    user_uid: auth.currentUser.uid,
                    items: items,
                    date: toIsoDate(date)
                });
                alert('Todo added');
                router.push('/todos');
            } catch (error) {
                alert(error.message)
            }
        }
    };

    const tryUpdate = async () => {
        await setDoc(doc(db, 'todo', uuid), {
            user_uid: auth.currentUser.uid,
            items: items,
            date: toIsoDate(date)
        });
        alert('Todo updated');
        router.push('/todos');
    };

    const onSubmit = async () => {
        if (!uuid) {
            await tryAdd();
        } else {
            await tryUpdate();
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
                    disabled={!!uuid}
                />

                <TextField id="item"
                    label="Type your todo"
                    variant="outlined"
                    onKeyUp={onKeyUpHandler}
                    value={todoTextbox}
                    defaultValue={todoTextbox}
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