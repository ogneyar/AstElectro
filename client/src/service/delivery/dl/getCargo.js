

export default function getCargo(cart) {

    let quantity = 0, length = 0, width = 0, height =0, totalVolume = 0, totalWeight = 0

    cart.forEach(i => {
        quantity += Number(i.value)
        if (Number(i?.size?.length) > length) length = Number(i?.size?.length)
        if (Number(i?.size?.width) > width) width = Number(i?.size?.width)
        if (Number(i?.size?.height) > height) height = Number(i?.size?.height)
        if (Number(i?.size?.length) > length) length = Number(i?.size?.length)
        totalVolume += Number(i?.size?.volume) * Number(i.value)
        totalWeight += Number(i?.size?.weight) * Number(i.value)
    })

    let cargo = {
        quantity,
        length: length / 1000,
        width: width / 1000,
        height: height / 1000,
        totalVolume,
        totalWeight
    }

    return cargo
}