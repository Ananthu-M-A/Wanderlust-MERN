import React, { ReactNode } from 'react';

interface ActionProviderProps {
    createChatBotMessage: (message: string) => any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    children: ReactNode;
}

const ActionProvider: React.FC<ActionProviderProps> = ({ createChatBotMessage, setState, children }) => {
    const handleHello = () => {
        const botMessage = createChatBotMessage(
            `Thank you for providing your email.
        Now Enter the name of hotel for booking`);
        handleState(botMessage);
    };

    const handleNull = () => {
        const botMessage = createChatBotMessage('Enter a valid input!!!');
        handleState(botMessage);
    };

    const handleState = (botMessage: any) => {
        if (botMessage) {
            setState((prev: any) => ({
                ...prev,
                messages: [...prev.messages, botMessage],
            }));
        }
    }

    return (
        <div>
            {React.Children.map(children, (child) => {
                return React.cloneElement(child as React.ReactElement<any>, {
                    actions: {
                        handleHello,
                        handleNull
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
