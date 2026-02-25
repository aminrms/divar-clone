import { getLocalStorage } from "./storage";

export const getCurrencyUnit = () => {
    const currentUnit = getLocalStorage('currencyUnit');

    return currentUnit || "ریال";
}

export function formatAmount(amount?: number | string | null, currencySymbol: string = 'ریال', hideUnit?: boolean): string {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
        return `0 ${currencySymbol}`;
    }
    const currentUnit = getLocalStorage('currencyUnit');
    if (typeof currentUnit === 'string' && currentUnit) {
        currencySymbol = currentUnit;
    }

    // Format number in Persian locale without currency
    const formattedNumber = new Intl.NumberFormat('fa-IR', {
        minimumFractionDigits: 0, // or 2 if you need decimals
        maximumFractionDigits: 0
    }).format(Number(amount));

    // Put number first, then currency
    return `${formattedNumber} ${!hideUnit  ? currencySymbol:""}`;
}


export function calculateTaxPrice(price: number, tax: number) {
    return (price * tax) / 100;
}

export function calculateDiscountedPrice(price: number, discount: number) {
    return price - (price * discount) / 100;
}