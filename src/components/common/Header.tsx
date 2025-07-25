'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';
import { Bell, Heart, Menu, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const { cartCount } = useCart();

    // Get currnet pathname
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // Check if header should be transparent
    const isTransparent = !isHomePage || isScrolled;

    // Navigation items
    const navigation = [
        { name: 'Khóa học', href: '/' },
        { name: 'Giáo viên', href: '/' },
        { name: 'Cộng đồng', href: '/' },
        { name: 'Về chúng tôi', href: '/' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 z-50 w-full transition-all duration-300',
                isTransparent ? 'bg-white/90 backdrop-blur-sm shadow-md text-gray-800' : 'bg-transparent text-white'
            )}
        >
            <div className='container mx-auto px-4'>
                <div className='flex h-16 items-center justify-between'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center space-x-2 group'>
                        <div className='relative overflow-hidden rounded-lg'>
                            <Image
                                src='/logo.png'
                                alt='Logo'
                                width={80}
                                height={80}
                                className='transition-transform duration-300 group-hover:scale-110'
                            />
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden md:flex flex-1 items-center space-x-1'>
                        {navigation.map((item) => (
                            <div key={item.name} className='relative'>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'flex items-center space-x-1 px-4 py-2 font-medium transition-all duration-200 rounded-lg group',
                                        isTransparent
                                            ? 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-100'
                                            : 'text-white hover:text-white/80 hover:bg-white/20'
                                    )}
                                >
                                    <span>{item.name}</span>
                                </Link>
                                {/* Hover underline effect */}
                                <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300' />
                            </div>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className='flex items-center space-x-2'>
                        {/* Notifications */}
                        <Button
                            variant='ghost'
                            size='sm'
                            className='hidden sm:flex hover:bg-emerald-50 hover:text-emerald-600 relative'
                        >
                            <Bell className='h-5 w-5' />
                            <span className='absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse'>
                                3
                            </span>
                        </Button>

                        {/* Favorites */}
                        <Button
                            variant='ghost'
                            size='sm'
                            className='hidden sm:flex hover:bg-emerald-50 hover:text-emerald-600'
                            onClick={() => {
                                router.push('/favorite');
                            }}
                        >
                            <Heart className='h-5 w-5' />
                        </Button>

                        {/* Cart */}
                        <Button
                            variant='ghost'
                            size='sm'
                            className='hidden sm:flex hover:bg-emerald-50 hover:text-emerald-600 relative'
                        >
                            <ShoppingCart className='h-5 w-5' />
                            <Badge className='absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center'>
                                {cartCount}
                            </Badge>
                        </Button>

                        {/* Auth Buttons - Desktop (for non-logged in users) */}
                        <div className='hidden sm:flex items-center space-x-2'>
                            <Button variant='ghost' size='sm' className='hover:bg-emerald-50 hover:text-emerald-600'>
                                Đăng nhập
                            </Button>
                            <Button
                                size='sm'
                                className='bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                            >
                                Đăng ký
                            </Button>
                        </div>

                        {/* Mobile Menu */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    className='md:hidden hover:bg-emerald-50 hover:text-emerald-600'
                                >
                                    <Menu className='h-5 w-5' />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='right' className='w-[300px] sm:w-[400px] p-0'>
                                <div className='flex flex-col h-full'>
                                    {/* Mobile Menu Content */}
                                    <div className='flex-1 overflow-y-auto'>
                                        <div className='p-6 space-y-6'>
                                            {/* Navigation Links */}
                                            <div className='space-y-1'>
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className='flex items-center justify-between p-3 text-gray-900 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg font-medium transition-all duration-200 group'
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        <span>{item.name}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <Separator />

                                            {/* Quick Actions */}
                                            <div className='space-y-1'>
                                                <Button
                                                    variant='ghost'
                                                    className='w-full justify-start p-3 h-auto hover:bg-emerald-50 hover:text-emerald-600'
                                                >
                                                    <Bell className='h-5 w-5 mr-3' />
                                                    <span>Thông báo</span>
                                                    <Badge className='ml-auto bg-red-500 text-white'>3</Badge>
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    className='w-full justify-start p-3 h-auto hover:bg-emerald-50 hover:text-emerald-600'
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        router.push('/favorite');
                                                    }}
                                                >
                                                    <Heart className='h-5 w-5 mr-3' />
                                                    <span>Yêu thích</span>
                                                </Button>
                                                <Button
                                                    variant='ghost'
                                                    className='w-full justify-start p-3 h-auto hover:bg-emerald-50 hover:text-emerald-600'
                                                >
                                                    <ShoppingCart className='h-5 w-5 mr-3' />
                                                    <span>Giỏ hàng</span>
                                                    <Badge className='ml-auto bg-emerald-500 text-white'>2</Badge>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mobile Menu Footer */}
                                    <div className='p-6 border-t bg-gray-50'>
                                        <div className='space-y-3'>
                                            <Button
                                                variant='outline'
                                                className='w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white'
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <User className='h-4 w-4 mr-2' />
                                                Đăng nhập
                                            </Button>
                                            <Button
                                                className='w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Đăng ký ngay
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
