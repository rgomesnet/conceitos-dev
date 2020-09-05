import React, { useRef, useCallback } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { FormHandles } from '@unform/core';
import getValidationErros from '../../utils/getValidationErros';
import { useAuth } from '../../hooks/AuthContext';
import { useToast } from '../../hooks/ToastContext';
import { Link, useHistory } from 'react-router-dom';

interface SignInForm {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { signIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: SignInForm) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                email: Yup.string().required('O e-mail é obrigatório.').email('Digie um e-mail válido.'),
                password: Yup.string().required('A senha é obrigatória.'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await signIn({ email: data.email, password: data.password });
            history.push('/dashboard');
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErros(error);
                formRef.current?.setErrors(errors);
            }

            addToast({
                title: 'Erro na autenticação',
                type: 'error',
                description: 'Ocorreu um erro ao fazer o login.'
            });
        }
    }, [signIn, addToast, history]);

    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Faça o seu logon</h1>
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Button type="submit">Entrar</Button>
                        <Link to="/forgot-password">Esqueci minha senha</Link>
                    </Form>

                    <Link to="/signup">
                        <FiLogIn />
                    Criar conta
                </Link>
                </AnimationContainer>
            </Content>
            <Background />

        </Container>
    )
};

export default SignIn;
