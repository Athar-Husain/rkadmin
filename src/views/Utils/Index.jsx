// src/Utils/Index.jsx

export const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
};

export const capitalize = (text) => text?.charAt(0).toUpperCase() + text?.slice(1);


export const CHAT_BUBBLE_RADIUS = 12;
