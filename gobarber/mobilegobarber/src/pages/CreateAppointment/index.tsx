import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
    Container,
    Header,
    Content,
    BackButtom,
    HeaderTitle,
    UserAvatar,
    ProvidersListContainer,
    ProvidersList,
    ProviderContainer,
    ProviderAvatar,
    ProviderName,
    Calendar,
    Title,
    OpenDatePickerButton,
    OpenDatePickerText,
    Schedule,
    Section,
    SectionTitle,
    SectionContent,
    Hour,
    HourText,
    CreateAppointmentButton,
    CreateAppointmentButtonText
} from './styles';

import DateTimePicker from '@react-native-community/datetimepicker';

import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import { Platform, Alert } from 'react-native';
import { format } from 'date-fns';

interface RouteParams {
    providerId: string;
}

interface AvailabilityItem {
    hour: number;
    available: boolean
}

export interface Provider {
    id: string;
    name: string;
    avatar_url: string;
}

const CreateAppointment: React.FC = () => {
    const route = useRoute();
    const { user } = useAuth();
    const { goBack, navigate } = useNavigation();
    const routeParams = route.params as RouteParams;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState(
        routeParams.providerId
    );

    const [selectedHour, setSelectedHour] = useState(0);

    const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

    useEffect(() => {
        api.get('providers')
            .then(response => {
                setProviders(response.data);
            });
    }, []);

    const navigateBack = useCallback(() => {
        goBack();
    }, [goBack]);

    const handleSelecProvider = useCallback((providerId: string) => {
        setSelectedProvider(providerId);
    }, []);

    const handleToggleDatePicker = useCallback(() => {
        setShowDateTimePicker(state => !state);
    }, []);

    const handleDateChanged = useCallback((event: any, date: Date | undefined) => {
        if (Platform.OS === 'android') {
            setShowDateTimePicker(false);
        }

        if (date) {
            setSelectedDate(date);
        }
    }, []);

    const handleSelectHour = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, [setSelectedHour]);

    useEffect(() => {
        api.get(`providers/${selectedProvider}/day-availability`, {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate(),
                provider_id: selectedProvider
            }
        }).then(response => {
            setAvailability(response.data);
        });
    }, [selectedDate, selectedProvider]);

    const morningAvailability = useMemo(() => {
        return availability.filter(({ hour }) => hour < 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                }
            });
    }, [availability]);

    const afternoonAvailability = useMemo(() => {
        return availability.filter(({ hour }) => hour >= 12)
            .map(({ hour, available }) => {
                return {
                    hour,
                    available,
                    hourFormatted: format(new Date().setHours(hour), 'HH:00'),
                }
            });
    }, [availability]);

    const handleCreateAppointment = useCallback(async () => {
        try {
            const date = new Date(selectedDate);
            date.setHours(selectedHour);
            date.setMinutes(0);

            await api.post('appointments', {
                provider_id: selectedProvider,
                date,
            });

            navigate('AppointmentCreated', { date: date.getTime() });
        } catch (error) {
            Alert.alert(
                'Erro ao criar agendamento',
                'Ocorreu umerro ao tentar criar um agendamento, tente novamente'
            );
        }
    }, [navigate, selectedDate, selectedHour, selectedProvider]);

    return (
        <Container>
            <Header>
                <BackButtom onPress={navigateBack}>
                    <Icon name="chevron-left" size={24} color="#999591" />
                </BackButtom>
                <HeaderTitle>Cabeleireiros</HeaderTitle>
                <UserAvatar source={{ uri: user.avatar_url }} />
            </Header>

            <Content>
                <ProvidersListContainer>
                    <ProvidersList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={providers}
                        keyExtractor={(provider) => provider.id}
                        renderItem={({ item: provider }) => (
                            <ProviderContainer
                                selected={provider.id === selectedProvider}
                                onPress={() => handleSelecProvider(provider.id)}
                            >
                                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                                <ProviderName selected={provider.id === selectedProvider}>
                                    {provider.name}
                                </ProviderName>
                            </ProviderContainer>
                        )}
                    />
                </ProvidersListContainer>


                <Calendar>
                    <Title>Escolha a data</Title>
                    <OpenDatePickerButton onPress={handleToggleDatePicker}>
                        <OpenDatePickerText>Selecionar outra data</OpenDatePickerText>
                    </OpenDatePickerButton>

                    {showDateTimePicker &&
                        <DateTimePicker
                            mode="date"
                            is24Hour
                            display="calendar"
                            onChange={handleDateChanged}
                            value={selectedDate}
                        />
                    }
                </Calendar>

                <Schedule>
                    <Title>Escolha o horário</Title>
                    <Section>
                        <SectionTitle>Manhã</SectionTitle>
                        <SectionContent>
                            {morningAvailability.map(({ hour, hourFormatted, available }) => (
                                <Hour
                                    enabled={available}
                                    selected={selectedHour === hour}
                                    available={available}
                                    key={hourFormatted}
                                    onPress={() => handleSelectHour(hour)}
                                >
                                    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>

                    <Section>
                        <SectionTitle>Manhã</SectionTitle>
                        <SectionContent>
                            {afternoonAvailability.map(({ hour, hourFormatted, available }) => (
                                <Hour
                                    enabled={available}
                                    selected={selectedHour === hour}
                                    available={available}
                                    key={hourFormatted}
                                    onPress={() => handleSelectHour(hour)}
                                >
                                    <HourText selected={selectedHour === hour}>{hourFormatted}</HourText>
                                </Hour>
                            ))}
                        </SectionContent>
                    </Section>
                </Schedule>

                <CreateAppointmentButton onPress={handleCreateAppointment}>
                    <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
                </CreateAppointmentButton>

            </Content>
        </Container>
    )
}

export default CreateAppointment;