import React, { useRef, useCallback } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '@unform/core';
import getValidationErros from '../../utils/getValidationErros';
import { useToast } from '../../hooks/ToastContext';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import api from '../../services/api';

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;

}

const ResetPassword: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const location = useLocation();

    const handleSubmit = useCallback(async (data: ResetPasswordFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                password: Yup.string().required('A senha é obrigatória.'),
                password_confirmation: Yup.string().oneOf(
                    [Yup.ref('password')],
                    'Confirmação incorreta',
                ),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            const token = location.search.replace('?token=', '');

            if (!token) {
                throw new Error('Não há token');
            }

            const { password, password_confirmation } = data;

            await api.post('/password/reset', {
                password,
                password_confirmation,
                token
            });

            history.push('/');
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErros(error);
                formRef.current?.setErrors(errors);

                return;
            }

            addToast({
                type: 'error',
                title: 'Erro ao resetar senha',
                description: 'Ocorreu um erro ao resetar sua semnha, tente novamente.'
            });
        }
    }, [addToast, history]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Resetar senha</h1>

                        <Input
                            name="password"
                            icon={FiLock}
                            type="password"
                            placeholder="Nova Senha"
                        />

                        <Input
                            name="password_confirmation"
                            icon={FiLock}
                            type="password"
                            placeholder="Confirmação da senha"
                        />

                        <Button type="submit">Alterar senha</Button>
                    </Form>
                </AnimationContainer>
            </Content>
            <Background />

        </Container>
    )
};

export default ResetPassword;