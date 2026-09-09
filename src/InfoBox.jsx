import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'
import './InfoBox.css';

function InfoBox({title, cases, total, ...props}) {
  return (
    <Card onClick={props.onClick} className='InfoBox'>
        <CardContent>
            {/* title i.e. coronavirus cases */}
            <Typography className='InfoBox_title' color='textSecondary'>
                {title}
            </Typography>

            {/* +120k no of cases */}
            <h2 className='InfoBox_cases'>{cases}</h2>

            {/* 1.2M Total */}
            <Typography className='InfoBox_total' color='textSecondary'>
                {total} Total
            </Typography>
        </CardContent>
    </Card>
  )
}

export default InfoBox
