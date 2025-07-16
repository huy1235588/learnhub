import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react'; // Icon từ lucide-react đã có trong shadcn

export function PromoBanner() {
    return (
        <section className='bg-muted/50 rounded-lg px-8 py-4'>
            <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-8'>
                {/* Text Content */}
                <div className='text-center md:text-left'>
                    <div className='flex items-center justify-center md:justify-start gap-3'>
                        <Megaphone className='h-6 w-6 text-primary' />
                        <h3 className='text-2xl font-bold tracking-tight'>Trở thành Giảng viên trên LearnHub</h3>
                    </div>
                    <p className='mt-2 text-muted-foreground max-w-xl'>
                        Chia sẻ kiến thức của bạn với hàng triệu học viên và tạo ra nguồn thu nhập thụ động. Bắt đầu ngay hôm nay!
                    </p>
                </div>

                {/* Action Button */}
                <div className='flex-shrink-0'>
                    <Button size='lg'>Đăng ký dạy học</Button>
                </div>
            </div>
        </section>
    );
}
