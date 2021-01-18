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

export function getRelativeRegion(width, height, padding=0, offset={}) {
    let top = padding + (offset.top || 0)
    let left = padding + (offset.left || 0)
    width = width - left - padding - (offset.right || 0)
    height = height - top - padding - (offset.bottom || 0)
    return {
        top,
        left,
        width,
        height,
        right: left + width,
        bottom: height + top
    }
}

export function absoluteCoord([x, y], {top, left}) {
    return [x + left, y + top]
}

export function regionFrom(region, offset={}) {
    let {left, top, width, height, right, bottom} = region
    top += offset.top || 0
    left += offset.left || 0
    width = offset.width || 0
    height = offset.height || 0
    return {
        top,
        left,
        width,
        height,
        right: left + width,
        bottom: top + height
    }
}