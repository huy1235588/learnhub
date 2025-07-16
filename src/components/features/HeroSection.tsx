'use client';

import { Award, ChevronLeft, ChevronRight, Clock, Play, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

// Define the types for the slide data
const slides = [
    {
        id: 1,
        title: 'Khám Phá Hàng Ngàn Khóa Học',
        subtitle: 'Từ các chuyên gia hàng đầu trong mọi lĩnh vực',
        description: 'Học cùng với hơn 10 triệu học viên trên toàn thế giới',
        buttonText: 'Bắt đầu học ngay',
        secondaryButtonText: 'Xem demo',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop',
        stats: [
            { icon: Users, label: 'Học viên', value: '10M+' },
            { icon: Award, label: 'Chứng chỉ', value: '50K+' },
            { icon: Star, label: 'Đánh giá', value: '4.8/5' },
        ],
        gradient: 'from-blue-600 to-purple-600',
        accent: 'bg-blue-500',
    },
    {
        id: 2,
        title: 'Ưu Đãi Đặc Biệt Mùa Hè 2025',
        subtitle: 'Giảm giá tới 70% cho các khóa học HOT',
        description: 'Cơ hội vàng để nâng cao kỹ năng với chi phí tối ưu',
        buttonText: 'Xem ưu đãi',
        secondaryButtonText: 'Khóa học HOT',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1728398068094-d3d30740000f?q=80&w=2070&auto=format&fit=crop',
        stats: [
            { icon: Clock, label: 'Thời gian', value: '3 ngày' },
            { icon: Award, label: 'Giảm giá', value: '70%' },
            { icon: Users, label: 'Đã mua', value: '1.2K+' },
        ],
        gradient: 'from-orange-500 to-red-500',
        accent: 'bg-orange-500',
    },
    {
        id: 3,
        title: 'Học Ngoại Ngữ Cùng Người Bản Xứ',
        subtitle: 'Luyện tập kỹ năng giao tiếp thực tế',
        description: 'Kết nối với giáo viên bản xứ từ khắp nơi trên thế giới',
        buttonText: 'Tìm giáo viên',
        secondaryButtonText: 'Học thử miễn phí',
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
        stats: [
            { icon: Users, label: 'Giáo viên', value: '5K+' },
            { icon: Star, label: 'Ngôn ngữ', value: '25+' },
            { icon: Clock, label: 'Khung giờ', value: '24/7' },
        ],
        gradient: 'from-green-500 to-teal-500',
        accent: 'bg-green-500',
    },
];

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const currentSlideData = slides[currentSlide];

    const handlers = useSwipeable({
        onSwipedLeft: () => nextSlide(),
        onSwipedRight: () => prevSlide(),
        preventScrollOnSwipe: true, // prevent scrolling while swiping
        trackMouse: true, // allow mouse swipes
    });

    return (
        <div {...handlers} className='relative w-full h-screen min-h-[500px] max-h-[800px] sm:min-h-[600px] overflow-hidden'>
            {/* Background Image with Parallax Effect */}
            <div className='absolute inset-0'>
                <div
                    className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out transform scale-105'
                    style={{
                        backgroundImage: `url(${currentSlideData.imageUrl})`,
                        filter: 'brightness(0.3) sm:brightness(0.4)',
                    }}
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient} opacity-70 sm:opacity-65`} />

                {/* Pattern Overlay */}
                <div className='absolute inset-0 bg-black/30 sm:bg-black/20' />
            </div>

            {/* Main Content */}
            <div className='relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8'>
                <div className='max-w-7xl mx-auto w-full'>
                    {/* Content Grid - Stack on mobile, side by side on desktop */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full'>
                        {/* Left Content */}
                        <div className='text-white space-y-6 sm:space-y-8 text-center lg:text-left'>
                            {/* Main Title */}
                            <div className='space-y-3 sm:space-y-4'>
                                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight'>
                                    <span className='block'>{currentSlideData.title.split(' ').slice(0, 2).join(' ')}</span>
                                    <span className='block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400'>
                                        {currentSlideData.title.split(' ').slice(2).join(' ')}
                                    </span>
                                </h1>

                                <p className='text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200'>
                                    {currentSlideData.subtitle}
                                </p>

                                <p className='text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0'>
                                    {currentSlideData.description}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start'>
                                <button
                                    className={`${currentSlideData.accent} hover:opacity-90 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                                >
                                    {currentSlideData.buttonText}
                                </button>

                                <button className='group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 border border-white/30 hover:border-white/50'>
                                    <div className='flex items-center justify-center gap-2'>
                                        <Play className='w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform' />
                                        <span className='hidden sm:inline'>{currentSlideData.secondaryButtonText}</span>
                                        <span className='sm:hidden'>Demo</span>
                                    </div>
                                </button>
                            </div>

                            {/* Stats - Mobile optimized */}
                            <div className='flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 pt-2 sm:pt-4'>
                                {currentSlideData.stats.map((stat, index) => (
                                    <div key={index} className='flex items-center gap-2 text-white/90 min-w-0'>
                                        <div className='p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0'>
                                            <stat.icon className='w-4 h-4 sm:w-5 sm:h-5' />
                                        </div>
                                        <div className='min-w-0'>
                                            <div className='font-bold text-sm sm:text-base lg:text-lg'>{stat.value}</div>
                                            <div className='text-xs sm:text-sm text-gray-300 truncate'>{stat.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content - Interactive Elements (Hidden on mobile) */}
                        <div className='hidden lg:block'>
                            <div className='relative'>
                                {/* Floating Cards */}
                                <div className='space-y-4'>
                                    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'>
                                                <Award className='w-6 h-6 text-white' />
                                            </div>
                                            <div>
                                                <h3 className='text-white font-semibold'>Chứng chỉ quốc tế</h3>
                                                <p className='text-gray-300 text-sm'>Được công nhận toàn cầu</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 ml-8'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
                                                <Users className='w-6 h-6 text-white' />
                                            </div>
                                            <div>
                                                <h3 className='text-white font-semibold'>Học tập linh hoạt</h3>
                                                <p className='text-gray-300 text-sm'>Mọi lúc, mọi nơi</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300'>
                                        <div className='flex items-center gap-4'>
                                            <div className='w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center'>
                                                <Star className='w-6 h-6 text-white' />
                                            </div>
                                            <div>
                                                <h3 className='text-white font-semibold'>Hỗ trợ 24/7</h3>
                                                <p className='text-gray-300 text-sm'>Luôn sẵn sàng hỗ trợ</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Controls - Mobile optimized */}
            <div className='absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
                <div className='flex items-center gap-3 sm:gap-4'>
                    {/* Previous Button */}
                    <button
                        onClick={prevSlide}
                        className='p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group'
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform' />
                    </button>

                    {/* Dots Indicator */}
                    <div className='flex gap-2'>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/70'
                                }`}
                                onMouseEnter={() => setIsAutoPlaying(false)}
                                onMouseLeave={() => setIsAutoPlaying(true)}
                            />
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={nextSlide}
                        className='p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 group'
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform' />
                    </button>
                </div>
            </div>

            {/* Auto-play Indicator - Mobile optimized */}
            <div className='absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-20'>
                <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`p-2 sm:p-3 rounded-full transition-all duration-300 ${
                        isAutoPlaying
                            ? 'bg-green-500/20 border-green-500/50 text-green-400'
                            : 'bg-white/20 border-white/30 text-white'
                    } border backdrop-blur-sm hover:scale-110`}
                >
                    <Play className={`w-4 h-4 sm:w-5 sm:h-5 ${isAutoPlaying ? 'animate-pulse' : ''}`} />
                </button>
            </div>
        </div>
    );
}
