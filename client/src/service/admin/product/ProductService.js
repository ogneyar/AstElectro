import React, { useContext, useState, useEffect } from 'react'
import { Button, Form, Dropdown, Image } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'

import { createProduct, fetchAllProducts, updateAllProduct, deleteProduct } from '../../../http/productAPI'
// import { mlkGetAll } from '../../../http/parser/milwaukeeAPI'
import { Context } from '../../..'

import Size from './Size'
import Price from './Price'
import Description from './Description'
import Characteristics from './Characteristics'
import Equipment from './Equipment'

import './ProductService.css'
import Loading from '../../../components/Loading'


const ProductService = observer((props) => {
    
    const { productStore, categoryStore, brandStore } = useContext(Context)

    const [loading, setLoading] = useState(false)

    const action = props?.action // add ,edit or del
    
    const [article, setArticle] = useState(props?.article || "")
    const [name, setName] = useState(props?.name || '')
    const [price, setPrice] = useState(props?.price || "")

    const [file, setFile] = useState(null)

    const [image1, setImage1] = useState(null)
    const [image2, setImage2] = useState(null)
    const [image3, setImage3] = useState(null)
    const [image4, setImage4] = useState(null)
    
    const [have, setHave] = useState(props?.have ? props?.have : 1)
    const [promo, setPromo] = useState(props?.promo || "")
    const [country, setCountry] = useState(props?.country || "Китай")
    
    const [size, setSize] = useState({weight: "", volume: "", width: "", height: "", length: ""})

    const [description, setDescription] = useState(props?.description || "")
    const [characteristics, setCharacteristics] = useState(props?.characteristics || "")
    const [equipment, setEquipment] = useState(props?.equipment || "")

    const [fileReader, setFileReader] = useState(null)
    const [fileReader2, setFileReader2] = useState(null)
    const [fileReader3, setFileReader3] = useState(null)
    const [fileReader4, setFileReader4] = useState(null)

	const [request, setRequest] = useState(props?.request ? 1 : 0)
	
    
    useEffect(() => {
    },[])

    useEffect(() => {
        if (categoryStore.allCategories.length) {
            categoryStore.setCategories(categoryStore.allCategories)
        }
    // eslint-disable-next-line
    },[categoryStore.allCategories])
    

    useEffect(() => {
        if (Array.isArray(props.info) && props.info[0]?.title !== undefined) {
            props.info.forEach(i => {
                if (i.title === "characteristics" || i.title === "Характеристики") setCharacteristics(i.body)
                if (i.title === "description" || i.title === "Описание") setDescription(i.body)
                if (i.title === "equipment" || i.title === "Комплектация") setEquipment(i.body)
            })
        }
    },[props?.info])

    useEffect(() => {
        if (props.size?.weight || props.size?.volume || props.size?.width || props.size?.height || props.size?.length) setSize(props?.size)
    },[props?.size])
    
    useEffect(() => {
        let arrayImages = []
        if (props?.images && typeof(props?.images) === "string") {
            arrayImages = JSON.parse(props?.images)
        }else if (Array.isArray(props?.images)) {
            arrayImages = props?.images
        }
        arrayImages.forEach((i, index) => {
            switch(index) {
                case 0:
                    setFileReader(props?.url + i.small)
                break;
                case 1:
                    setFileReader2(props?.url + i.small)
                break;
                case 2:
                    setFileReader3(props?.url + i.small)
                break;
                case 3:
                    setFileReader4(props?.url + i.small)
                break;
                default:
                break;
            }            
        })
    // eslint-disable-next-line
    },[props?.images])


    const selectFile = e => {
        let lengthArrayFiles
        if (e.target.files.length > 4) lengthArrayFiles = 4
        else lengthArrayFiles = e.target.files.length
        
        for(let i = 0; i < lengthArrayFiles; i++) {
            let reader = new FileReader()
            reader.onload = function(e) {
                switch(i) {
                    case 0:
                        setFileReader(e.target.result)
                    break;
                    case 1:
                        setFileReader2(e.target.result)
                    break;
                    case 2:
                        setFileReader3(e.target.result)
                    break;
                    case 3:
                        setFileReader4(e.target.result)
                    break;
                    default:
                    break;
                }
            }
            reader.readAsDataURL(e.target.files[i])
            
            switch(i) {
                case 0:
                    setImage1(e.target.files[i])
                break;
                case 1:
                    setImage2(e.target.files[i])
                break;
                case 2:
                    setImage3(e.target.files[i])
                break;
                case 3:
                    setImage4(e.target.files[i])
                break;
                default:
                break;
            }
        }
        setFile(e.target.files[0])
    }

    const addProduct = async () => {
        if (categoryStore.selectedCategory?.name && brandStore.selectedBrand?.name && article && name) {
            if (! file) {
                let addedWithoutPhoto = window.confirm("Добавлять товар без фото?")
                if ( ! addedWithoutPhoto ) return
            }
            let no = true
            productStore.allProducts.forEach(i => {
                if (i.article === article) no = false
            })
            if (no) { // если нет такого артикула в БД
                let error = false
                setLoading(true)
                const formData = await getFormData()
                try{
                    await createProduct(formData).then(
                        () => props?.back(),
                        err => {
                            error = true
                            alert(err.message)
                        }
                    )
                    if (!error) {
                        fetchAllProducts().then(data => productStore.setAllProducts(data))
                        categoryStore.setSelectedCategory({})
                    }
                    setLoading(false)
                }catch(e) {
                    setLoading(false)
                }
            }else alert("Такой артикул в базе данных уже есть.")
        }else alert("Надо выбрать категорию, бренд, фото, ввести артикул, имя, цену и характеристики.")
    }

    const editProduct = async (id) => {
        setLoading(true)
        const formData = await getFormData()
        await updateAllProduct(id, formData).then(() => props?.back())

        fetchAllProducts().then(data => productStore.setAllProducts(data))
        categoryStore.setSelectedCategory({})
        setLoading(false)
    }

    const delProduct = async (id) => {
        await deleteProduct(id).then(() => props?.back())

        fetchAllProducts().then(data => productStore.setAllProducts(data))
        categoryStore.setSelectedCategory({})
    }

    const getFormData = async () => {
        const formData = new FormData()
        formData.append('name', name.trim())

        formData.append('img', file)

        formData.append('image1', image1)
        formData.append('image2', image2)
        formData.append('image3', image3)
        formData.append('image4', image4)

        formData.append('have', have)
        formData.append('article', article.trim())
        formData.append('promo', promo.trim())
        formData.append('country', country.trim())
        formData.append('brandId', brandStore.selectedBrand.id)
        formData.append('categoryId', categoryStore.selectedCategory.id)

        formData.append('size', JSON.stringify(size))
        formData.append('price', `${price}`)
		formData.append('request', request)
        let array = []
        if (description) array.push({title:"description",body:description})
        if (characteristics) array.push({title:"characteristics",body:characteristics})
        if (equipment) array.push({title:"equipment",body:equipment})
        formData.append('info', JSON.stringify(array))

        return formData
    }

    const reItemCategory = (sub = 0, offset = "") => { // рекурсивная функция, для получения списка категорий
        return categoryStore.categories.map(i => {

            if (i.sub_category_id === sub && i.id !== 1) // i.id = 1 - это отдельная категория АКЦИИ
                return (
                    <div key={i.id}>
                        <Dropdown.Item 
                            onClick={() =>  categoryStore.setSelectedCategory(i)} 
                            disabled={i.is_product ? false : true} 
                            
                        >
                            {offset + i.name}
                        </Dropdown.Item>
                        {reItemCategory(i.id, offset + "-- ")}
                    </div>
                )
            else return null
        })
    }

    if (loading) return <Loading />

    if (action === "del") {
        return (
            <div
                className="inputBox d-flex flex-column"
            >
                <label>Вы уверены в том что хотите удалить {name}?</label>
                <div>
                    <Button className="mr-2" variant="outline-danger" onClick={() => delProduct(props?.id)}>Да</Button>
                    <Button className="mr-2" variant="outline-success" onClick={props?.back}>Нет</Button>
                </div>
            </div>
        )
    }
    
    return (
        <div  className="mb-2">
            <div className="inputBox d-flex flex-wrap">
                <div className=''>
                    <label>Категория:</label>
                    <Dropdown >
                        <Dropdown.Toggle>{categoryStore.selectedCategory.name || "Выберите категорию"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {categoryStore.categories !== undefined 
                            ? reItemCategory()
                            : null}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='ml-2'>
                    <label>Бренд:</label>
                    <Dropdown >
                        <Dropdown.Toggle>{brandStore.selectedBrand.name || "Выберите бренд"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {brandStore.brands.map((br, index) => 
                                <Dropdown.Item 
                                    onClick={() => brandStore.setSelectedBrand(br)} 
                                    key={br.name}
                                    active={br.id === brandStore.selectedBrand.id}
                                >
                                    {br.name}
                                </Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
            <div className="inputBox">
                <label>Артикул инструмента:</label>
                <Form.Control 
                    value={article}
                    onChange={e => setArticle(e.target.value)}
                    className=''
                    placeholder={'Введите артикул инструмента'}
                />
            </div>
            <div className="inputBox">
                <label>Название инструмента: (модель)</label>
                <Form.Control 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className=''
                    placeholder={'Введите название инструмента'}
                />
            </div>
            
            
            <div className="inputBox">
                <label>В наличие: </label>
                <Dropdown className=''>
                    <Dropdown.Toggle>{have ? "Есть" : "Нет"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item 
                            onClick={() => setHave(1)} 
                            active={have}
                            key={"1z"}
                        >
                            Есть
                        </Dropdown.Item>
                        <Dropdown.Item 
                            onClick={() => setHave(0)} 
                            active={!have}
                            key={"2z"}
                        >
                            Нет
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            
            
            <div className="inputBox">
                <label>Акционное предложение:</label>
                <Form.Control 
                    value={promo}
                    onChange={e => setPromo(e.target.value)}
                    className=''
                    placeholder={'Введите акционное предложение'}
                />
            </div>
            <div className="inputBox">
                <label>Страна производителя:</label>
                <Form.Control 
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className=''
                    placeholder={'Введите страну производителя'}
                />
            </div>

            {/* {brand?.selectedBrand?.name.toLowerCase() !== "milwaukee" 
            ? */}
            <div className="inputBox fileBox">
                <div>
                    <label>Изображение инструмента:&nbsp;</label>
                    <label>(не более четырёх)</label>
                    <br />
                    {/* {fileVisible 
                    ? */}
                        <Form.Control 
                            className=''
                            type="file"
                            // disabled
                            onChange={selectFile}
                            multiple 
                            accept="image/*,image/jpeg"
                        />
                    {/* :
                        <Button variant="outline-primary" onClick={() => setFileVisible(true)}>
                            {action === "edit" && "Заменить фото"}
                            {action === "add" && "Добавить самостоятельно"}
                        </Button>
                    } */}
                </div>
                
                <div className="fileBoxImages">
                    <div className="fileBoxImagesReader">
                        {fileReader 
                        ? <Image src={fileReader}  className="fileBoxImagesReader_Image" /> 
                        : null}
                    </div>
                    <div className="fileBoxImagesReader">
                        {fileReader2 
                        ? <Image src={fileReader2}  className="fileBoxImagesReader_Image" /> 
                        : null}
                    </div>
                    <div className="fileBoxImagesReader">
                        {fileReader3 
                        ? <Image src={fileReader3}  className="fileBoxImagesReader_Image" /> 
                        : null}
                    </div>
                    <div className="fileBoxImagesReader">
                        {fileReader4 
                        ? <Image src={fileReader4} className="fileBoxImagesReader_Image" /> 
                        : null}
                    </div>
                </div>
                
            </div>
            {/* : null} */}
            

            <div className="inputBox">
                <Price // цена
                    price={price}
                    setPrice={setPrice} 
                    action={action}
                />
            </div>			
			
            <div className="inputBox">
                <label>Цена по запросу: </label>
                <Dropdown className=''>
                    <Dropdown.Toggle>{request ? "Да" : "Нет"}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item 
                            onClick={() => setRequest(1)} 
                            active={request}
                            key={"1zZ"}
                        >
                            Да
                        </Dropdown.Item>
                        <Dropdown.Item 
                            onClick={() => setRequest(0)} 
                            active={!request}
                            key={"2zZ"}
                        >
                            Нет
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
			
            <div className="inputBox">
                <Size // габариты
                    size={size}
                    setSize={setSize} 
                    action={action}
                />
            </div>
            <div className="inputBox">
                <Description // описание
                    description={description}
                    setDescription={setDescription} 
                    action={action}
                />
            </div>
            <div className="inputBox">
                <Characteristics // характеристики
                    characteristics={characteristics} 
                    setCharacteristics={setCharacteristics}
                    action={action}
                />
            </div>
            <div className="inputBox">
                <Equipment // комплектация
                    equipment={equipment} 
                    setEquipment={setEquipment}
                    action={action}
                />
            </div>

            <hr />

            <div className='d-flex justify-content-end mb-4'>
                {action === "add" 
                ?
                    <Button variant="outline-success" onClick={addProduct}>Добавить продукцию</Button>
                :
                    <Button variant="outline-success" onClick={() => editProduct(props?.id)}>Изменить продукцию</Button>
                }
            </div>
            
            <hr />

        </div>
    );
})

export default ProductService;
