import React,
{
    createContext,
    useCallback,
    useState,
    useContext,
    useEffect
} from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';

interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface AuthContextType {
    user: User;
    signIn(credentials: SignInCredentials): Promise<void>;
    signOut(): void;
    loading: boolean;
    updateUser(user: User): Promise<void>;
}

interface AuthState {
    user: User;
    token: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>({} as AuthState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData(): Promise<void> {
            const token = await AsyncStorage.getItem('@GoBarber:token');
            const user = await AsyncStorage.getItem('@GoBarber:user');

            if (token && user) {
                api.defaults.headers.authorization = `Bearer ${token}`;
                setData({ token: token, user: JSON.parse(user) });
            }

            setLoading(false);
        }

        loadStorageData();
    }, []);

    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('sessions', {
            email,
            password
        });

        const { token, user } = response.data;

        await AsyncStorage.setItem('@GoBarber:token', token);
        await AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user });
    }, []);

    const signOut = useCallback(async () => {
        await AsyncStorage.removeItem('@GoBarber:user');
        await AsyncStorage.removeItem('@GoBarber:token');

        setData({} as AuthState);
    }, []);

    const updateUser = useCallback(async (user: User) => {
        AsyncStorage.setItem('@GoBarber:user', JSON.stringify(user));

        setData({
            token: data.token,
            user,
        });
    }, [setData, data.token]);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }

    return context;
}

export { AuthProvider, useAuth };
