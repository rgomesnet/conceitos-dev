import React from 'react';
import { Container, Toast } from './styles';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { useToast } from '../../hooks/ToastContext';

interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info';
    title: string;
    description?: string;
}

interface ToastContainerProps {
    messages: ToastMessage[];
}

const icons = {
    info: <FiInfo size={24} />,
    error: <FiAlertCircle size={24} />,
    success: <FiCheckCircle size={24} />
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
    const { removeToast } = useToast();

    return (
        <Container>
            {
                messages.map(message => (

                    <Toast
                        key={message.id}
                        hasDescription={!!message.description}
                        type={message.type}
                    >
                        {icons[message.type]}
                        <div>
                            {<strong>{message.title}</strong>}
                            {
                                message.description &&
                                <p>{message.description}</p>
                            }
                        </div>

                        <button onClick={() => removeToast(message.id)} type="button">
                            <FiXCircle size={18} />
                        </button>
                    </Toast>

                ))
            }
        </Container>
    );
}

export default ToastContainer;
