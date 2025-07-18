import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from "./containers/App";
import store, { persistor } from "./store";
import { ThemeProvider } from "./contexts/ThemeContext";
import './ultils/fontawesome';
import './index.css';

const root = createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </PersistGate>
    </Provider>
);