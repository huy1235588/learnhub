import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { siFacebook, siInstagram, siX, siYoutube } from 'simple-icons';

export function Footer() {
    const companyLinks = [
        { name: 'Về chúng tôi', href: '/about', description: 'Câu chuyện của chúng tôi' },
        { name: 'Tuyển dụng', href: '/careers', description: 'Cơ hội nghề nghiệp', badge: 'Đang tuyển' },
        { name: 'Báo chí', href: '/press', description: 'Tin tức & báo chí' },
        { name: 'Blog', href: '/blog', description: 'Bài viết hữu ích' },
    ];

    const supportLinks = [
        { name: 'Trung tâm hỗ trợ', href: '/support', description: '24/7 hỗ trợ' },
        { name: 'Liên hệ', href: '/contact', description: 'Liên hệ với chúng tôi' },
        { name: 'FAQ', href: '/faq', description: 'Câu hỏi thường gặp' },
        { name: 'Hướng dẫn', href: '/guide', description: 'Hướng dẫn sử dụng' },
    ];

    const categoryLinks = [
        { name: 'Lập trình', href: '/categories/programming', count: '150+' },
        { name: 'Thiết kế', href: '/categories/design', count: '80+' },
        { name: 'Kinh doanh', href: '/categories/business', count: '60+' },
        { name: 'Ngôn ngữ', href: '/categories/language', count: '40+' },
        { name: 'Marketing', href: '/categories/marketing', count: '50+' },
        { name: 'Nhiếp ảnh', href: '/categories/photography', count: '30+' },
    ];

    const legalLinks = [
        { name: 'Điều khoản sử dụng', href: '/terms' },
        { name: 'Chính sách bảo mật', href: '/privacy' },
        { name: 'Chính sách cookie', href: '/cookies' },
        { name: 'Chính sách hoàn tiền', href: '/refund' },
    ];

    const socialLinks = [
        { name: 'Facebook', icon: siFacebook, href: 'https://facebook.com', color: 'hover:text-blue-400' },
        { name: 'X', icon: siX, href: 'https://x.com', color: 'hover:text-gray-300' },
        { name: 'Instagram', icon: siInstagram, href: 'https://www.instagram.com/', color: 'hover:text-pink-400' },
        { name: 'YouTube', icon: siYoutube, href: 'https://youtube.com', color: 'hover:text-red-400' },
    ];

    const contactInfo = [
        { icon: Phone, text: '+84 123 456 789', href: 'tel:+84123456789' },
        { icon: Mail, text: 'support@learnhub.vn', href: 'mailto:support@learnhub.vn' },
        { icon: MapPin, text: 'TP. Hồ Chí Minh, Việt Nam', href: '#' },
    ];

    return (
        <footer className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent'></div>
            <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent'></div>

            {/* Main Footer Content */}
            <div className='relative container mx-auto px-8 py-16'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12'>
                    {/* Brand & Contact */}
                    <div className='lg:col-span-2'>
                        <div className='mb-8'>
                            <h2 className='flex items-center text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent'>
                                <div className='relative overflow-hidden rounded-lg'>
                                    <Image
                                        src='/logo-mini.png'
                                        alt='Logo'
                                        width={50}
                                        height={50}
                                        className='transition-transform duration-300 group-hover:scale-110'
                                    />
                                </div>
                                LearnHub
                            </h2>
                            <p className='text-gray-400 mb-6 leading-relaxed'>
                                Nền tảng học trực tuyến hàng đầu Việt Nam với hơn 1000+ khóa học chất lượng cao từ các chuyên gia
                                trong ngành.
                            </p>

                            <div className='space-y-4'>
                                {contactInfo.map((info, index) => (
                                    <Link
                                        key={index}
                                        href={info.href}
                                        className='flex items-center gap-3 text-gray-400 hover:text-white transition-colors group'
                                    >
                                        <div className='p-2 bg-gray-800 rounded-lg group-hover:bg-emerald-600/20 transition-colors'>
                                            <info.icon className='h-4 w-4' />
                                        </div>
                                        <span>{info.text}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className='font-semibold text-lg mb-6 text-white'>Công ty</h4>
                        <ul className='space-y-4'>
                            {companyLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='group flex items-start gap-2 text-gray-400 hover:text-white transition-colors'
                                    >
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium'>{link.name}</span>
                                                {link.badge && (
                                                    <Badge
                                                        variant='secondary'
                                                        className='text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                                    >
                                                        {link.badge}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className='text-sm text-gray-500 mt-1'>{link.description}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className='font-semibold text-lg mb-6 text-white'>Hỗ trợ</h4>
                        <ul className='space-y-4'>
                            {supportLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='group flex items-start gap-2 text-gray-400 hover:text-white transition-colors'
                                    >
                                        <div>
                                            <span className='font-medium'>{link.name}</span>
                                            <p className='text-sm text-gray-500 mt-1'>{link.description}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className='font-semibold text-lg mb-6 text-white'>Danh mục</h4>
                        <ul className='space-y-4'>
                            {categoryLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className='group flex items-start gap-3 text-gray-400 hover:text-white transition-colors'
                                    >
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium'>{link.name}</span>
                                                <Badge variant='outline' className='text-xs border-gray-600 text-gray-400'>
                                                    {link.count}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className='relative border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm'>
                <div className='container mx-auto px-8 py-8'>
                    <div className='flex flex-col gap-6'>
                        {/* Legal Links & Social Links */}
                        <div className='flex flex-col lg:flex-row justify-between items-center gap-6'>
                            {/* Legal Links */}
                            <div className='flex flex-wrap justify-center gap-6'>
                                {legalLinks.map((link, index) => (
                                    <div key={link.name} className='flex items-center gap-6'>
                                        <Link
                                            href={link.href}
                                            className='text-gray-400 hover:text-white text-sm transition-colors'
                                        >
                                            {link.name}
                                        </Link>
                                        {index < legalLinks.length - 1 && (
                                            <Separator orientation='vertical' className='h-4 bg-gray-700' />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className='flex items-center gap-4'>
                                <span className='text-gray-400 text-sm hidden sm:block'>Theo dõi chúng tôi:</span>
                                <div className='flex gap-3'>
                                    {socialLinks.map((social) => (
                                        <Link
                                            key={social.name}
                                            href={social.href}
                                            className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110 hover:bg-gray-700`}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                        >
                                            <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                                                <path d={social.icon.path} />
                                            </svg>
                                            <span className='sr-only'>{social.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className='flex items-center justify-center gap-2 text-gray-400 text-sm'>
                            <span>© 2025 LearnHub. Made with</span>
                            <Heart className='h-4 w-4 text-red-400' />
                            <span>in Vietnam</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
