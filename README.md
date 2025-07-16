# LearnHub - Nền tảng học trực tuyến

LearnHub là một nền tảng giáo dục trực tuyến hiện đại được xây dựng với Next.js 15, React 19, và Tailwind CSS v4. Dự án tập trung vào việc cung cấp trải nghiệm người dùng tốt nhất với giao diện thân thiện và tính năng phong phú.

## Tính năng chính

- **Tìm kiếm và lọc khóa học**: Hỗ trợ tìm kiếm theo từ khóa và lọc theo giá
- **Gợi ý thông minh**: API đề xuất khóa học dựa trên lịch sử xem và yêu thích
- **Quản lý yêu thích**: Đánh dấu và theo dõi các khóa học ưa thích
- **Responsive**: Thiết kế tương thích đa thiết bị

## Công nghệ sử dụng

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI/Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: Zustand, React hooks
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Cài đặt

1. Clone dự án:
```bash
git clone https://github.com/huy1235588/learnhub.git
cd learnhub
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy môi trường development:
```bash
npm run dev
```

Dự án sẽ chạy tại `http://localhost:3000`

## Scripts

- `npm run dev` - Chạy development server với Turbopack
- `npm run build` - Build dự án cho production
- `npm run start` - Chạy phiên bản production
- `npm run lint:fix` - Kiểm tra và sửa lỗi ESLint
- `npm run format` - Format code với Prettier

## Cấu trúc thư mục

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API Routes
│   └── ...
├── components/       # React Components
│   ├── common/      # Common components
│   ├── features/    # Feature components
│   ├── product/     # Product related
│   └── ui/          # UI components
├── contexts/        # React Contexts
├── hooks/           # Custom hooks
├── lib/            # Utilities
├── services/       # API Services
└── types/          # TypeScript types
```
