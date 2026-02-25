
// Helper function to convert English numbers to Persian
export const toPersianNumber = (num: number | string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    const numStr = num.toString()
    return numStr.replace(/\d/g, (digit) => persianDigits[parseInt(digit)])
}

// Helper function to format number and remove unnecessary decimals
export const formatNumber = (num: number | string): string => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num

    // Check if the number is a whole number
    if (numValue % 1 === 0) {
        return toPersianNumber(Math.floor(numValue))
    }

    // Otherwise, show with decimals but remove trailing zeros
    return toPersianNumber(numValue.toFixed(2).replace(/\.?0+$/, ''))
}

export const truncatedDisplayNumber = (value: number) => {
  const truncated = Math.trunc(value * 100) / 100;
  return Number(truncated.toFixed(2)).toString();
};