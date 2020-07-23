import React, { useRef, useCallback } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import logoImg from '../../assets/logo.png';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErros from '../../utils/getValidationErros';
import api from '../../services/api';

import {
    Image,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    Alert
} from 'react-native';

import {
    Container,
    Title,
    BackToSigInButton,
    BackToSigInText
} from './styles';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);

    const navigation = useNavigation();


    const handleSignUp = useCallback(async (data: SignUpFormData) => {
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

            Alert.alert(
                "Cadastro realizado com sucesso!",
                "Você já pode fazer login na aplicação."
            );

            navigation.goBack();
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErros(error);
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert(
                "Erro no cadastro do usuário!",
                'Ocorreu um erro ao fazer o cadastro'
            );
        }
    }, [navigation]);


    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                enabled
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Container>
                        <Image source={logoImg} />
                        <View>
                            <Title>Crie sua conta</Title>
                        </View>
                        <Form
                            style={{
                                width: '100%'
                            }}
                            ref={formRef}
                            onSubmit={handleSignUp}>

                            <Input
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={emailInputRef}
                                keyboardType="email-address"
                                autoCorrect={false}
                                autoCapitalize="words"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType={"next"}
                                onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />

                            <Input
                                ref={passwordInputRef}
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                textContentType="newPassword"
                                secureTextEntry
                            />

                            <Button onPress={() => { formRef.current?.submitForm() }}>Entrar</Button>
                        </Form>
                    </Container>
                </ScrollView>

                <BackToSigInButton
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={20} color="#fff" />
                    <BackToSigInText>Voltar para o logon</BackToSigInText>
                </BackToSigInButton>
            </KeyboardAvoidingView>
        </>
    )
};

export default SignUp;
