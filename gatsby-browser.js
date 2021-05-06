import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import "./src/styles/global.css"
import CodeBlock from './src/components/CodeBlock';

const components = {
    pre: CodeBlock
}

export const wrapRootElement = ({ element }) => {
    return <MDXProvider components={components}>{element}</MDXProvider>;
};