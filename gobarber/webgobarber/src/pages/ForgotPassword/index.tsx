import React, { useRef, useCallback, useState } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '@unform/core';
import getValidationErros from '../../utils/getValidationErros';
import { useToast } from '../../hooks/ToastContext';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

interface ForgotPasswordData {
    email: string;
    password: string;
}

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const { addToast } = useToast();
    const formRef = useRef<FormHandles>(null);

    const handleSubmit = useCallback(async (data: ForgotPasswordData) => {
        try {
            setLoading(true);
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string()
                    .required('O e-mail é obrigatório.')
                    .email('Digie um e-mail válido.'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await api.post('/password/forgot', {
                email: data.email
            });

            history.push('/dashboard');

            addToast({
                type: 'success',
                title: 'Email de recuperação enviado',
                description: 'Enviammos um email para confirmar a recuperação de senha, cheque sua caixa de entrada.'
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErros(error);
                formRef.current?.setErrors(errors);
                return;
            }

            addToast({
                type: 'error',
                title: 'Erro na recuperação de senha',
                description: 'Ocorreu um erro ao tentar realizar recuperaração de senha, tente novamente.'
            });
        }
        finally {
            setLoading(false);
        }
    }, [addToast]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Recuperar a senha</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Button loading={loading} type="submit">
                            Recuperar
                        </Button>
                    </Form>

                    <Link to="/">
                        <FiLogIn />
                    Voltar ao login
                </Link>
                </AnimationContainer>
            </Content>
            <Background />

        </Container>
    )
};

export default ForgotPassword;
