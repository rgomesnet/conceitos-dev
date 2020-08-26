import React, { useCallback, useRef, FormEvent, ChangeEvent } from 'react';
import { Container, Content, AvatarInput } from './styles';
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Form } from '@unform/web'
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import getValidationErros from '../../utils/getValidationErros'
import { useHistory, Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/ToastContext';
import { useAuth } from '../../hooks/AuthContext';
import { da } from 'date-fns/locale';

interface ProfileFormData {
    name: string;
    email: string;
    old_password: string;
    password: string;
    password_confirmation: string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const { user, updateUser } = useAuth();

    const handleSubmit = useCallback(async (data: ProfileFormData) => {
        try {
            formRef.current?.setErrors({});
            const schema = Yup.object().shape({
                name: Yup.string()
                    .required('O nome é obrigatório.'),

                email: Yup.string()
                    .required('O e-mail é obrigatório.')
                    .email('Digie um e-mail válido.'),

                old_password: Yup.string(),

                password: Yup.string().when('old_password', {
                    is: val => !!val.length,
                    then: Yup.string().required('Campo obrigatório'),
                    otherwise: Yup.string()
                }),

                password_confirmation: Yup.string()
                    .when('password', {
                        is: val => !!val.length,
                        then: Yup.string().required('Campo obrigatório'),
                        otherwise: Yup.string()
                    })
                    .oneOf([Yup.ref('password')], 'Confirmação incorreta')
            });

            await schema.validate(data, {
                abortEarly: false
            });

            const {
                name,
                email,
                old_password,
                password,
                password_confirmation
            } = data;

            const formData = {
                name,
                email,
                ... (old_password ?
                    {
                        old_password,
                        password,
                        password_confirmation
                    } : {})
            };

            const response = await api.put('/profile', formData);

            updateUser(response.data);

            history.push('/dashboard');

            addToast({
                type: "success",
                title: 'Perfil atualizado',
                description: 'Suas informações foram atualizadas com sucesso!'
            });

        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErros(error);
                formRef.current?.setErrors(errors);
                return;
            }
            addToast({
                type: "error",
                title: "Erro na atualização",
                description: 'Ocorreu um erro ao atualizar perfil, tente novamente.'
            });
        }
    }, [addToast, history]);

    const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {

        if (e.target.files && e.target.files.length == 1) {

            const data = new FormData();
            data.append('avatar', e.target.files[0]);

            api.patch('/users/avatar', data)
                .then(response => {
                    updateUser(response.data);

                    addToast({
                        type: 'success',
                        title: 'Avatar atualizado'
                    });
                });
        }
    }, [addToast, updateUser]);

    return (
        <Container>

            <header>
                <div>
                    <Link to='/dashboard'>
                        <FiArrowLeft />
                    </Link>
                </div>
            </header>

            <Content>
                <Form ref={formRef}
                    initialData={{
                        name: user.name,
                        email: user.email
                    }}
                    onSubmit={handleSubmit}>
                    <AvatarInput>
                        <img src={user.avatar_url} alt={user.name} />
                        <label htmlFor="avatar">
                            <FiCamera />
                            <input type="file" id="avatar" onChange={handleAvatarChange} />
                        </label>

                    </AvatarInput>

                    <h1>Meu perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome" />
                    <Input name="email" icon={FiMail} placeholder="E-mail" />

                    <Input
                        containerStyle={{ marginTop: 24 }}
                        name="old_password"
                        icon={FiLock}
                        type="password"
                        placeholder="Senha atual"
                    />

                    <Input
                        name="password"
                        icon={FiLock}
                        type="password"
                        placeholder="Nova senha"
                    />

                    <Input
                        name="password_confirmation"
                        icon={FiLock}
                        type="password"
                        placeholder="Confirmação senha"
                    />

                    <Button type="submit">Confirmar mudanças</Button>
                </Form>
            </Content>
        </Container>
    )
};

export default Profile;
