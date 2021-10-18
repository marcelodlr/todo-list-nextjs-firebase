import React from 'react';
import { Card, CardActions, CardContent, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { Edit } from '@mui/icons-material'
import styles from '../styles/TodoComponent.module.css';
import { useRouter } from 'next/router';

export default function TodoItem({ item }) {
    const router = useRouter();

    return (
        <Card classes={{ root: styles.card }} >
            <CardContent>
                <h3>{format(new Date(item.date), 'P')}</h3>
                <ul>
                    {item.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </CardContent>
            <CardActions>
                <IconButton onClick={() => router.push('/todos/todo/' + item.id)} aria-label="edit">
                    <Edit />
                </IconButton>
            </CardActions>
        </Card>
    )
}