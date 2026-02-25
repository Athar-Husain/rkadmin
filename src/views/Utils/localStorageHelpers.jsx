// src/components/utils/localStorageHelpers.js

export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.warn('localStorage setItem error:', error);
    }
};

export const getItem = (key, defaultValue = null) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.warn('localStorage getItem error:', error);
        return defaultValue;
    }
};

export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn('localStorage removeItem error:', error);
    }
};
