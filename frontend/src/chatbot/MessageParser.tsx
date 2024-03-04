import React, { ReactNode } from 'react';

interface MessageParserProps {
    children: ReactNode;
    actions: {
        handleHello: () => void;
        handleNull: () => void;
    };
}


const MessageParser: React.FC<MessageParserProps> = ({ children, actions }) => {
    
    const parse = (message: string) => {
        if (message.includes('hello')) {
            actions.handleHello();
        }
        if (message === '') {
            actions.handleNull();
        }
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    parse: parse,
                    actions: actions,
                });
            })}
        </div>
    );
};

export default MessageParser;
