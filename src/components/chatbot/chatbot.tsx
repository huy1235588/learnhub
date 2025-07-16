'use client';

import { ProductSuggestionCard } from '@/components/chatbot/productSuggestionCard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message, useChatStore } from '@/hooks/useChatStore';
import { cn } from '@/lib/utils';
import { Bot, Maximize2, MessageCircle, Minimize2, SendHorizonal, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Chatbot = () => {
    const { isOpen, messages, addMessage, toggleChat } = useChatStore();
    const [input, setInput] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Tự động cuộn xuống tin nhắn mới nhất với animation mượt
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    // Focus input khi mở chat
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, isMinimized]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        addMessage(input);
        setInput('');

        // Hiệu ứng typing
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1500);
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <>
            {/* Cửa sổ Chat Pop-up với responsive design */}
            {isOpen && (
                <div
                    className={cn(
                        'fixed bottom-4 right-4 z-50 flex flex-col rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out',
                        'sm:bottom-6 sm:right-6',
                        isMinimized ? 'h-16 w-80' : 'h-[90vh] w-[90vw] sm:h-[95vh] sm:w-96 md:w-[420px]'
                    )}
                >
                    {/* Header với gradient background */}
                    <div className='flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-t-2xl'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <div className='absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 animate-pulse'></div>
                                <Avatar className='relative h-8 w-8 ring-2 ring-primary/20'>
                                    <AvatarFallback className='bg-primary/10'>
                                        <Bot size={18} className='text-primary' />
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div>
                                <h3 className='text-lg font-bold bg-primary bg-clip-text text-transparent'>AI Tư vấn Khóa học</h3>
                                {!isMinimized && <p className='text-xs text-muted-foreground'>Luôn sẵn sàng hỗ trợ bạn</p>}
                            </div>
                        </div>

                        <div className='flex items-center gap-1'>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={handleMinimize}
                                className='h-8 w-8 hover:bg-primary/10 rounded-full transition-colors'
                            >
                                {isMinimized ? <Maximize2 className='h-4 w-4' /> : <Minimize2 className='h-4 w-4' />}
                            </Button>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={toggleChat}
                                className='h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors'
                            >
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>

                    {/* Khu vực hiển thị tin nhắn - chỉ hiện khi không minimize */}
                    {!isMinimized && (
                        <>
                            <div
                                ref={messagesContainerRef}
                                className='flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40'
                            >
                                {messages.length === 0 && (
                                    <div className='flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50'>
                                        <MessageCircle className='h-12 w-12 text-muted-foreground' />
                                        <div>
                                            <p className='text-sm font-medium'>Chào mừng bạn!</p>
                                            <p className='text-xs text-muted-foreground'>Hãy hỏi tôi về khóa học bạn quan tâm</p>
                                        </div>
                                    </div>
                                )}

                                {messages.map((message: Message, index: number) => (
                                    <div
                                        key={message.id}
                                        className={cn(
                                            'flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300',
                                            message.sender === 'user' ? 'justify-end' : '',
                                            index === messages.length - 1 && 'animate-in fade-in duration-500'
                                        )}
                                    >
                                        {message.sender === 'bot' && (
                                            <Avatar className='h-8 w-8 flex-shrink-0 ring-2 ring-primary/10'>
                                                <AvatarFallback className='bg-primary/10'>
                                                    <Bot size={16} className='text-primary' />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div
                                            className={cn(
                                                'flex flex-col gap-3 max-w-[80%] sm:max-w-[75%]',
                                                message.sender === 'user' ? 'items-end' : 'items-start'
                                            )}
                                        >
                                            {/* Bong bóng chat với hiệu ứng đẹp */}
                                            {message.text && (
                                                <div
                                                    className={cn(
                                                        'relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md',
                                                        message.sender === 'user'
                                                            ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-sm'
                                                            : 'bg-gradient-to-r from-muted to-muted/80 border border-border/50 rounded-bl-sm'
                                                    )}
                                                >
                                                    <p className='text-sm leading-relaxed'>{message.text}</p>
                                                    {/* Tail cho speech bubble */}
                                                    {message.sender === 'user' && (
                                                        <div className='absolute -bottom-1 right-2 w-3 h-3 bg-primary transform rotate-45'></div>
                                                    )}
                                                    {message.sender === 'bot' && (
                                                        <div className='absolute -bottom-1 left-2 w-3 h-3 bg-muted border-l border-b border-border/50 transform rotate-45'></div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Danh sách gợi ý sản phẩm với spacing tốt hơn */}
                                            {message.products && message.products.length > 0 && (
                                                <div className='flex flex-col gap-3 w-full max-w-xs animate-in slide-in-from-left-2 duration-500'>
                                                    {message.products.slice(0, 2).map((product, idx) => (
                                                        <div
                                                            key={product.id}
                                                            className='animate-in fade-in-50 slide-in-from-bottom-2 duration-300'
                                                            style={{ animationDelay: `${idx * 150}ms` }}
                                                        >
                                                            <ProductSuggestionCard product={product} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {message.sender === 'user' && (
                                            <Avatar className='h-8 w-8 flex-shrink-0 ring-2 ring-secondary/10'>
                                                <AvatarFallback className='bg-secondary/10'>
                                                    <User size={16} className='text-secondary' />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className='flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300'>
                                        <Avatar className='h-8 w-8 flex-shrink-0 ring-2 ring-primary/10'>
                                            <AvatarFallback className='bg-primary/10'>
                                                <Bot size={16} className='text-primary' />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='bg-muted rounded-2xl rounded-bl-sm px-4 py-3 border border-border/50'>
                                            <div className='flex space-x-1'>
                                                <div className='w-2 h-2 bg-primary/60 rounded-full animate-bounce'></div>
                                                <div
                                                    className='w-2 h-2 bg-primary/60 rounded-full animate-bounce'
                                                    style={{ animationDelay: '0.1s' }}
                                                ></div>
                                                <div
                                                    className='w-2 h-2 bg-primary/60 rounded-full animate-bounce'
                                                    style={{ animationDelay: '0.2s' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Form nhập tin nhắn với thiết kế hiện đại */}
                            <form
                                onSubmit={handleSubmit}
                                className='flex items-center gap-3 border-t border-border/50 p-4 bg-gradient-to-r from-background/50 to-background/80 backdrop-blur-sm rounded-b-2xl'
                            >
                                <div className='flex-1 relative'>
                                    <Input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder='Hỏi về khóa học bạn muốn...'
                                        className='pr-12 rounded-full border-2 border-border/50 focus:border-primary/50 bg-background/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30'
                                    />
                                    <Button
                                        type='submit'
                                        size='icon'
                                        disabled={!input.trim()}
                                        className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        <SendHorizonal className='h-4 w-4' />
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Button Bật/Tắt Chat với hiệu ứng đẹp */}
            <Button
                onClick={toggleChat}
                className={cn(
                    'fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary',
                    'sm:bottom-6 sm:right-6 sm:h-16 sm:w-16',
                    isOpen ? 'opacity-0 pointer-events-none scale-0' : 'opacity-100 pointer-events-auto scale-100'
                )}
                size='icon'
            >
                <div className='relative'>
                    <div className='absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-75 animate-pulse'></div>
                    <Bot className='relative h-6 w-6 sm:h-7 sm:w-7' />
                </div>
            </Button>
        </>
    );
};
