import React from 'react';
import { clsx } from 'clsx';

const PageContainer = ({ children, className }) => {
    return (
        <div className={clsx("w-full max-w-[1400px] mx-auto px-[32px] flex flex-col gap-[32px]", className)}>
            {children}
        </div>
    );
};

export default PageContainer;
