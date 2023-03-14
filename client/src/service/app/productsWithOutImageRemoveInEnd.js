
// добавление товаров без изображений в конец списка
export default function productsWithOutImageRemoveInEnd(data) {

    let withImage = data.filter(i => i.img[0].big !== undefined)
    let withOutImage = data.filter(i => i.img[0].big === undefined)

    return [ ...withImage, ...withOutImage ]

}