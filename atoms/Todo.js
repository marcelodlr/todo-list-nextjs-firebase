import React from 'react';
import { Card, CardActions, CardContent, IconButton } from '@mui/material';
import { format } from 'date-fns';
import { Edit } from '@mui/icons-material'
import styles from '../styles/TodoComponent.module.css';

export default function TodoItem({ item }) {
    return (
        <Card classes={{ root: styles.card }} >
            <CardContent>
                <h3>{format(new Date(item.date), 'P')}</h3>
                <ul>
                    {item.items.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            </CardContent>
            <CardActions>
                <IconButton aria-label="edit">
                    <Edit />
                </IconButton>
            </CardActions>
        </Card>
    )
}