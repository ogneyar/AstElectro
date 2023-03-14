
export default function getPack(width, height, length) {
    
    if (!width || !height || !length) return {pack: 0}

    let max = width
    let mid = length
    let min = height

    if (mid > max) {
        if (min > mid) {
            min = width
            mid = length // остаётся прежним
            max = height
        }else if (min > max) {
            mid = width
            min = length
            max = height
        }else {
            mid = width
            max = length
            min = height
        }
    }else if (min > max) {
        min = width
        max = length
        mid = height 
    }else if (min > mid) {
        max = width
        min = length
        mid = height 
    }

    let pack    // 10 - Коробка "S" - 260 × 170 × 80, 
                // 20 - Коробка "M" - 300 × 200 × 150, 
                // 30 - Коробка "L" -  400 × 270 × 180, 
                // 40 - Коробка "XL" - 530 × 360 × 220
 
    if (max <= 260 && mid <= 170 && min <= 80) pack = 10
    else if (max <= 300 && mid <= 200 && min <= 150) pack = 20
    else if (max <= 400 && mid <= 270 && min <= 180) pack = 30
    else if (max <= 530 && mid <= 360 && min <= 220) pack = 40

    if (!pack) pack = 0    

    return {
        pack
    }
}
