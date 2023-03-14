
function mixPromo(data) {

    let startOne = Math.floor( 0 + Math.random() * (2 + 1 - 0) )
    let start = startOne
    
    for (let i = 0; i < data.length; i++) {
        if (data[i].promo && data[i].brandId !== 2) { // - husqvarna
            let promo = typeof(data[i].promo) === "string" ? JSON.parse(data[i].promo) : data[i].promo
            if (typeof(promo) === "object" && promo.old_price !== undefined) {
                if (startOne === 0 || (startOne) % 3 === 0) { // если он первый в столбце
                    [data[i], data[startOne + 1]] = [data[startOne + 1], data[i]]
                }else {
                    [data[i], data[startOne - 1]] = [data[startOne - 1], data[i]]
                }
                if ((startOne+1) % 3 === 0) // если он третий (последний) в столбце
                    startOne += 1
                else 
                    startOne += 4
            }else {
                [data[i], data[start]] = [data[start], data[i]]
                if ((start+1) % 3 === 0) // если он третий (последний) в столбце
                    start += 1
                else 
                    start += 4
            }
        }
    }

    return data

}

module.exports = mixPromo