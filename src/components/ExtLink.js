import React from 'react';

export function ExtLink({ src, title }){
    return (
        <a style={{
            display: 'block',
            marginBottom: '10px'
        }}
            target="_blank"
            href={src}>{title}</a>
    )
}