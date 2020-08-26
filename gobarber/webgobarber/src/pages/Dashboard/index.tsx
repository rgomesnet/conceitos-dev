import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { isToday, format, isAfter } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import {
    Container,
    Header,
    HeaderContent,
    Profile,
    Schedule,
    Calendar,
    Content,
    NextAppintment,
    Section,
    Appointment
} from './styles';
import logoImg from '../../assets/logo.svg';
import penguinturtle from '../../assets/penguinturtle.svg';

import { FiPower, FiClock } from 'react-icons/fi';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';
import { parseISO } from 'date-fns/esm';
import { Link } from 'react-router-dom';

interface MonthAvailabilityItem {
    day: number;
    available: boolean;
}

interface Appointment {
    id: string;
    date: string;
    user: {
        name: string;
        avatar_url: string;
    },
    hourFormatted: string;
}

const Dashboard: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityItem[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const { signOut, user } = useAuth();

    const disabledDays = useMemo(() => {
        const dates = monthAvailability.filter(monthDay => !monthDay.available)
            .map(monthDay => {

                return new Date(currentMonth.getFullYear(), currentMonth.getMonth(), monthDay.day);
            });

        return dates;
    }, [currentMonth, monthAvailability]);

    const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
        if (modifiers.available) {
            setSelectedDate(day);
        }
    }, []);

    const handleMonthChange = useCallback((month: Date) => {
        setCurrentMonth(month);
    }, []);

    useEffect(() => {
        api.get(`/providers/${user.id}/month-availability`, {
            params: {
                year: currentMonth.getFullYear(),
                month: currentMonth.getMonth() + 1
            }
        }).then(response => {
            setMonthAvailability(response.data);
        });

    }, [currentMonth, user.id]);

    useEffect(() => {
        api.get<Appointment[]>('/appointments/me', {
            params: {
                year: selectedDate.getFullYear(),
                month: selectedDate.getMonth() + 1,
                day: selectedDate.getDate()
            }
        })
            .then(response => {
                const appointsFormatted = response.data.map(appointment => {
                    return {
                        ...appointment,
                        hourFormatted: format(parseISO(appointment.date), 'HH:mm')
                    }
                });

                setAppointments(appointsFormatted);
            })

    }, [selectedDate]);

    const selectedDateAsText = useMemo(() => {
        return format(selectedDate, "'Dia' dd 'de' MMMM", {
            locale: ptBR
        });

    }, [selectedDate]);

    const selectedWeekDayAsText = useMemo(() => {
        return format(selectedDate, 'cccc', {
            locale: ptBR
        });

    }, [selectedDate]);

    const morningApppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() < 12;
        });
    }, [appointments]);

    const afternoonApppointments = useMemo(() => {
        return appointments.filter(appointment => {
            return parseISO(appointment.date).getHours() >= 12;
        });
    }, [appointments]);

    const nextAppointment = useMemo(() => {
        const dateNow = new Date();

        return appointments.find(appointment =>
            isAfter(parseISO(appointment.date), dateNow)
        );

    }, [selectedDate, appointments]);

    return (
        <Container>
            <Header>
                <HeaderContent>
                    <img src={logoImg} alt="GoBarber" />

                    <Profile>
                        <img src={user.avatar_url} alt={user.name} />

                        <div>
                            <span>Bem-vindo,</span>
                            <Link to="/profile">
                                <strong>{user.name}</strong>
                            </Link>
                        </div>
                    </Profile>

                    <button type="button" onClick={signOut}>
                        <FiPower />
                    </button>
                </HeaderContent>
            </Header>

            <Content>
                <Schedule>
                    <h1>Horários agendados</h1>
                    <p>
                        {isToday(selectedDate) && <span>Hoje</span>}
                        <span>{selectedDateAsText}</span>
                        <span>{selectedWeekDayAsText}</span>
                    </p>


                    {isToday(selectedDate) && nextAppointment &&
                        <NextAppintment>
                            <strong>Agendamento a seguir</strong>
                            <div>
                                <img src={nextAppointment.user.avatar_url || penguinturtle} alt={nextAppointment.user.name} />
                                <strong>{nextAppointment.user.name}</strong>
                                <span>
                                    <FiClock />
                                    {nextAppointment.hourFormatted}
                                </span>

                            </div>
                        </NextAppintment>
                    }

                    <Section>
                        <strong>Manhã</strong>

                        {morningApppointments.length === 0 && (
                            <p>Nenhum agendamento neste período</p>
                        )}

                        {morningApppointments.map(appointment =>
                            (
                                <Appointment key={appointment.id}>
                                    <span>
                                        <FiClock />
                                        {appointment.hourFormatted}
                                    </span>

                                    <div>
                                        <img src={appointment.user.avatar_url || penguinturtle} alt={appointment.user.name} />
                                        <strong>{appointment.user.name}</strong>
                                    </div>
                                </Appointment>
                            )
                        )}
                    </Section>

                    <Section>
                        <strong>Tarde</strong>

                        {afternoonApppointments.length === 0 && (
                            <p>Nenhum agendamento neste período</p>
                        )}

                        {afternoonApppointments.map(appointment =>
                            (
                                <Appointment key={appointment.id}>
                                    <span>
                                        <FiClock />
                                        {appointment.hourFormatted}
                                    </span>

                                    <div>
                                        <img src={appointment.user.avatar_url || penguinturtle} alt={appointment.user.name} />
                                        <strong>{appointment.user.name}</strong>
                                    </div>
                                </Appointment>
                            )
                        )}
                    </Section>
                </Schedule>

                <Calendar>
                    <DayPicker
                        weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
                        fromMonth={new Date()}
                        disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
                        modifiers={{
                            available: { daysOfWeek: [1, 2, 3, 4, 5] }
                        }}
                        selectedDays={selectedDate}
                        onDayClick={handleDateChange}
                        onMonthChange={handleMonthChange}
                        months={[
                            'Janeiro',
                            'Fevereiro',
                            'Março',
                            'Abril',
                            'Maio',
                            'Junho',
                            'Julho',
                            'Agosto',
                            'Setembro',
                            'Outubro',
                            'Novembro',
                            'Dezembro'
                        ]}

                    />

                </Calendar>

            </Content>
        </Container>
    );
};

export default Dashboard;
