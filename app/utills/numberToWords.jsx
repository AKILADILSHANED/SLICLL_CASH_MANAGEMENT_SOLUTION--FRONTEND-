export default function numberToWords(num) {
    if (num === 0) return 'Zero';
    if (!num) return '';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    function convertHundreds(n) {
        if (n === 0) return '';
        let result = '';

        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred ';
            n %= 100;
        }

        if (n >= 20) {
            result += tens[Math.floor(n / 10)] + ' ';
            n %= 10;
        }

        if (n > 0) {
            result += ones[n] + ' ';
        }

        return result.trim();
    }

    if (num < 0) {
        return 'Negative ' + numberToWords(Math.abs(num));
    }

    let result = '';
    let scaleIndex = 0;

    while (num > 0) {
        const chunk = num % 1000;
        if (chunk !== 0) {
            let chunkWords = convertHundreds(chunk);
            if (scaleIndex > 0) {
                chunkWords += ' ' + scales[scaleIndex];
            }
            result = chunkWords + ' ' + result;
        }
        num = Math.floor(num / 1000);
        scaleIndex++;
    }

    return result.trim();
}

export function amountToWords(amount) {
    if (!amount && amount !== 0) return '';
    
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(num)) return '';
    
    // Split into rupees and cents
    const rupees = Math.floor(num);
    const cents = Math.round((num - rupees) * 100);
    
    let words = 'Sri Lanka Rupees ' + numberToWords(rupees);
    
    if (cents > 0) {
        words += ' and ' + numberToWords(cents) + ' Cents';
    }
    
    return words + ' only.';
}