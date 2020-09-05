import axios from 'axios';

/**
 * iOS com Emulador: localhost
 * iOS com físico: IP da máquina
 * Android com Emulador: localhost (adb reverse tcp:333 tcp:3333)
 * Android com Emulador: 10.0.2.2 (Android Studio)
 * Android com Emulador: 10.0.3.3 (Genymotion)
 * Android com físico: IP da máquina
 */
const api = axios.create({
    baseURL: 'http://10.0.2.2:3333'
});

export default api;