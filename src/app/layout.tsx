import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import { ClientProviders } from '@/providers/ClientProviders';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'LearnHub - Sàn Giáo Dục Thương Mại Điện Tử',
    description:
        'Nền tảng học tập trực tuyến với các khóa học chất lượng cao, giáo viên chuyên nghiệp và cộng đồng học tập sôi nổi.',
    keywords: 'học trực tuyến, khóa học online, giáo dục, giáo viên, học tập, cộng đồng học tập',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className='min-h-screen flex flex-col bg-gray-50'>
                    <Header />
                    <ClientProviders>
                        <main>{children}</main>
                    </ClientProviders>
                    <Footer />
                </div>
                <Toaster />
            </body>
        </html>
    );
}
