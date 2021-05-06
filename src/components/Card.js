import React from 'react';

export function Card({ children }){
    return (
        <div style={{
            display: 'block',
            padding: '32px',
            marginBottom: '30px',
            borderRadius: '7px',
            boxShadow: 'rgb(0 0 0 / 16%) 0px 0px 20px'
        }}
            >{children}</div>
    )
}