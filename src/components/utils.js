export function measureText(text, fontsize=10) {
    text = String(text)
    text = text.split('')
    let width = 0
    text.forEach(item => {
        if (/[a-zA-Z]/.test(item)) {
            width += 7
        } else if (/0-9/.test(item)) {
            width += 5.5
        } else if (/\./.test(item)) {
            width += 2.7
        } else if (/-/.test(item)) {
            width += 3.25
        } else if (/[\u4e00-\u9fa5]/.test(item)) {
            width += 10
        } else if (/\(|\)/.test(item)) {
            width += 3.73;
        } else if (/\s/.test(item)) {
            width += 2.5;
        } else if (/%/.test(item)) {
            width += 8;
        } else {
            width += 10;
        }
    })
    return width * fontsize / 10;
}