// hooks/use-chat-store.ts
import { getBotResponse } from '@/data/mock-ai';
import { Product } from '@/types/product';
import { create } from 'zustand';

export type Message = {
    id: number;
    sender: 'user' | 'bot';
    text: string;
    products?: Product[];
};

type ChatState = {
    isOpen: boolean;
    messages: Message[];
    toggleChat: () => void;
    addMessage: (text: string) => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
    isOpen: false,
    messages: [
        {
            id: 1,
            sender: 'bot',
            text: 'Xin chào! Tôi có thể giúp gì cho bạn trong việc tìm kiếm khóa học?',
        },
    ],
    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
    addMessage: (text: string) => {
        // Add user message
        const userMessage: Message = {
            id: get().messages.length + 1,
            sender: 'user',
            text,
        };
        set((state) => ({ messages: [...state.messages, userMessage] }));

        // Get and add bot response
        const botResponse = getBotResponse(text);
        const botMessage: Message = {
            id: get().messages.length + 2,
            sender: 'bot',
            text: botResponse.text,
            products: botResponse.products,
        };

        // Simulate bot thinking time
        setTimeout(() => {
            set((state) => ({ messages: [...state.messages, botMessage] }));
        }, 500);
    },
}));
