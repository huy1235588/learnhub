import { mockProducts } from './mock-data';

export const productKeywords: Record<string, string[]> = {
    'absolute beginner': ['25'],
    'academic english': ['1', '8', '29'],
    'accent reduction': ['3'],
    advanced: ['20'],
    'advanced conversation': ['11'],
    'applied grammar': ['22'],
    awl: ['29'],
    'band 8': ['1'],
    'business english': ['2', '19', '23', '28'],
    'business english communication': ['2', '12', '19', '23', '30'],
    'business skills': ['30'],
    'business writing': ['12'],
    'c1 advanced': ['27'],
    'c2 proficiency': ['10'],
    cae: ['27'],
    'cambridge exam': ['10', '27'],
    career: ['5', '26'],
    'common mistakes': ['15'],
    communication: ['5'],
    'connected speech': ['20'],
    contracts: ['21'],
    conversation: ['7', '16', '25'],
    'corporate communication': ['2'],
    cpe: ['1', '4', '8', '10', '13', '17', '18', '24', '27'],
    'daily english': ['7'],
    debate: ['11'],
    developer: ['9'],
    'email etiquette': ['12'],
    'english basics': ['6', '25'],
    'english grammar': ['6', '15', '22', '29'],
    'english pronunciation': ['3', '20'],
    entrepreneurship: ['19'],
    'error correction': ['15'],
    'essay writing': ['13'],
    'exam prep': ['1', '4', '8', '17', '18', '27'],
    foundation: ['6'],
    'general english conversation': ['7', '11', '16', '25'],
    grammar: ['6', '15'],
    healthcare: ['14'],
    ielts: ['1', '4', '8', '10', '13', '17', '18', '24', '27'],
    'ielts life skills': ['24'],
    intonation: ['20'],
    it: ['9'],
    'job interview': ['5', '26'],
    'job interview english communication': ['5', '26'],
    law: ['21'],
    leadership: ['26'],
    'legal english': ['21'],
    listening: ['4', '17', '24'],
    management: ['26'],
    marketing: ['28'],
    mastery: ['10'],
    'medical english': ['14'],
    networking: ['30'],
    pitching: ['19'],
    presentation: ['2'],
    'presentation skills': ['23'],
    professional: ['14'],
    'professional english': ['9', '14', '21', '28'],
    pronunciation: ['3', '20'],
    'public speaking': ['11', '23'],
    reading: ['4'],
    reporting: ['12'],
    sales: ['28'],
    'small talk': ['30'],
    speaking: ['3', '7', '18', '22', '24'],
    startup: ['19'],
    'survival english': ['16'],
    tech: ['9'],
    'tiếng anh': [
        '1',
        '2',
        '3',
        '5',
        '6',
        '7',
        '8',
        '9',
        '11',
        '12',
        '14',
        '15',
        '16',
        '19',
        '20',
        '21',
        '22',
        '23',
        '25',
        '26',
        '28',
        '29',
        '30',
    ],
    toefl: ['1', '4', '8', '10', '13', '17', '18', '24', '27'],
    toeic: ['1', '4', '8', '10', '13', '17', '18', '24', '27'],
    'travel english': ['16'],
    ukvi: ['24'],
    vocabulary: ['29'],
    writing: ['13', '22'],
    'writing task 2': ['13'],
};

export const getBotResponse = (userInput: string) => {
    const lowerCaseInput = userInput.toLowerCase();
    const matchedProductIds = new Set<string>();

    for (const keyword in productKeywords) {
        if (lowerCaseInput.includes(keyword)) {
            productKeywords[keyword].forEach((id) => matchedProductIds.add(id));
        }
    }

    if (matchedProductIds.size > 0) {
        const suggestedProducts = mockProducts.filter((p) => matchedProductIds.has(p.id));
        return {
            text: 'Dựa trên yêu cầu của bạn, tôi đã tìm thấy các khóa học sau:',
            products: suggestedProducts,
        };
    }

    return {
        text: 'Xin lỗi, tôi chưa tìm thấy khóa học phù hợp. Bạn có thể thử các từ khóa như "tiếng anh", "react", hoặc "thiết kế" không?',
        products: [],
    };
};
