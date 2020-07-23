import React, { useCallback, useRef } from 'react';
import { Container, Content, Background, AnimationContainer } from './styles';
import logoImg from '../../assets/logo.svg';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Form } from '@unform/web'
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import getValidationErros from '../../utils/getValidationErros'
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/ToastContext';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    const handleSubmit = useCallback(async (data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string().required('O nome é obrigatório.'),
                email: Yup.string().required('O e-mail é obrigatório.').email('Digie um e-mail válido.'),
                password: Yup.string()
                    .min(6, 'A senha deve ter o mínimo de 6 dígitos.'),
            });

            await schema.validate(data, {
                abortEarly: false
            });

            await api.post('/users', data);

            history.push('/');

            addToast({
                type: "success",
                title: 'Cadastro realizado!',
                description: 'Você já pode fazer o seu logon'
            });

        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErros(error);
                formRef.current?.setErrors(errors);
                return;
            }
            addToast({
                type: "error",
                title: "Erro no cadastro do usuário!"
            });
        }
    }, [addToast, history]);

    return (
        <Container>
            <Background />

            <Content>
                <AnimationContainer>
                    <img src={logoImg} alt="GoBarber" />
                    <Form
                        ref={formRef}
                        onSubmit={handleSubmit}>
                        <h1>Faça o seu cadastro</h1>
                        <Input name="name" icon={FiUser} placeholder="Nome" />
                        <Input name="email" icon={FiMail} placeholder="E-mail" />
                        <Input name="password" icon={FiLock} type="password" placeholder="Senha" />
                        <Button type="submit">Cadastrar</Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />
                    Voltar para o logon
                </Link>
                </AnimationContainer>
            </Content>

        </Container>
    )
};

export default SignUp;
