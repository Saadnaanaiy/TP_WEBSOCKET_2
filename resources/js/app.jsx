import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import Echo from 'laravel-echo';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
window.io = io;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';


window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001',
})



createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
