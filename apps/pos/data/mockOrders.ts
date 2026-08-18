export interface MockOrder {
    id: number;
    orderer: string;
    price: number;
    date: Date;
    storeName: string;
    productName: string;
    status: 'completed' | 'pending' | 'cancelled';
}

export const mockOrders: MockOrder[] = [
    {
        id: 1,
        orderer: '신이현',
        price: 15000,
        date: new Date('2024-01-15T14:30:00'),
        storeName: '스타벅스 강남점',
        productName: '아메리카노 외 2건',
        status: 'completed',
    },
    {
        id: 2,
        orderer: '한유찬',
        price: 25000,
        date: new Date('2024-01-15T15:45:00'),
        storeName: '스타벅스 홍대점',
        productName: '카페라떼 외 3건',
        status: 'completed',
    },
    {
        id: 3,
        orderer: '조성주',
        price: 18000,
        date: new Date('2024-01-15T16:20:00'),
        storeName: '스타벅스 신촌점',
        productName: '바닐라라떼 외 1건',
        status: 'pending',
    },
    {
        id: 4,
        orderer: '신이현',
        price: 32000,
        date: new Date('2024-01-15T17:10:00'),
        storeName: '스타벅스 강남점',
        productName: '카푸치노 외 4건',
        status: 'completed',
    },
    {
        id: 5,
        orderer: '최동욱',
        price: 12000,
        date: new Date('2024-01-15T18:30:00'),
        storeName: '스타벅스 홍대점',
        productName: '아메리카노 1건',
        status: 'cancelled',
    },
];

// ID로 주문 찾기 함수
export const findOrderById = (id: number): MockOrder | undefined => {
    return mockOrders.find((order) => order.id === id);
};
