
import React, { useEffect, useContext, useState } from 'react'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { fetchOneProduct, fetchOneProductOnUrl } from '../../../http/productAPI'
import Container from '../../../components/myBootstrap/container/Container'
import { authRoutes, publicRoutes } from '../../../utils/routes'

import { Context } from '../../..'
import './Aside.css'
import { fetchAllCategories } from '../../../http/categoryAPI'


const Aside = observer(() => {

    const { categoryStore, brandStore, breadStore, productStore } = useContext(Context)

    const history = useHistory()
    
    useParams() // это не баг, а фича - которая уже не пашет :'(

    // хлебные крошки
    const [ breadCrumbsState, setBreadCrumbsState ] = useState([])
    let breadCrumbs = [] 

    const [ categories, setCategories ] = useState(categoryStore.categories)


    function recursiveFunction(path) {
        if (path === "") {
            setBreadCrumbsState([])
            breadStore.setCrumbs([])
        }else if (categories?.length > 0) {
            categories.forEach(i => {
                if (i?.url === path) {
                    breadCrumbs = [ {name: i?.name, url: i.url}, ...breadCrumbs ]
                    setBreadCrumbsState([...breadCrumbs])
                    breadStore.setCrumbs([...breadCrumbs])
                    if (i?.sub_category_id !== 0) {
                        categories.forEach(j => {
                            if (i.sub_category_id === j?.id) {
                                recursiveFunction(j?.url)
                            }
                        })
                    }
                }
            })
        }
    }


    useEffect(() => {
        if ( ! categories.length && history.location.pathname !== "/" ) {
            fetchAllCategories().then(data => {
                setCategories(data)
            })
        }
    },[ categories.length, history.location.pathname ])

    useEffect(() => {
        // eslint-disable-next-line
        breadCrumbs = []

        let path = history.location.pathname.replace("/","") 

        let number = path.indexOf(`/`)

        if (number === -1) {
            let yes = false

            authRoutes.forEach(i => {
                let pathAuth = i.path.replace("/","")
                let numberAuth = pathAuth.indexOf(`/`)
                if (numberAuth !== -1) pathAuth = pathAuth.substring(0, numberAuth)
                if (pathAuth === path) yes = true
            })
            publicRoutes.forEach(i => {
                let pathPublic = i.path.replace("/","")
                let numberPublic = pathPublic.indexOf(`/`)
                if (numberPublic !== -1) pathPublic = pathPublic.substring(0, numberPublic)
                if (pathPublic === path) yes = true
            })
            brandStore.brands.forEach(i => {
                let pathBrand = i.name.toLowerCase()
                let numberBrand = pathBrand.indexOf(`/`)
                if (numberBrand !== -1) pathBrand = pathBrand.substring(0, numberBrand)
                if (pathBrand === path) yes = true
            })
            if (yes) {
                setBreadCrumbsState([])
                breadStore.setCrumbs([])
            }else {
                recursiveFunction(path)
            }
        }else {
            let string = path.substring(0, number)

            if (string === "product") { // "/product/32704"
                let id = Number(path.substring(number + 1, path.length))

                if (categories?.length > 0) {
                    fetchOneProduct(id).then(data => {
                        categories.forEach(cat => {
                            if (cat?.id === data?.categoryId) {
                                recursiveFunction(cat?.url)
                            }
                        })
                    })
                }

            }else if (brandStore.selectedBrand?.name !== undefined && string === brandStore.selectedBrand?.name.toLowerCase()) { // "/aeg/akkumulyator-l1240r-pro-li-ion-12-v-4-a-ch-aeg_aeg4932430166"
                let url = path.substring(number + 1, path.length)

                if (categories.length > 0) {
                    fetchOneProductOnUrl(url).then(data => {
                        categories.forEach(cat => {
                            if (cat?.id === data?.categoryId) {
                                recursiveFunction(cat?.url)
                            }
                        })
                    })
                }

            }else if (string === "confirmation") {

            }else {
                
            }
        }

    },[ /*categoryStore?.selectedCategory,*/ history.location.pathname, brandStore?.selectedBrand, categories ])
    
   
    const onClickAsideDiv = () => {
        let path = history.location.pathname.replace("/","") 
        if (path === "") {
            setBreadCrumbsState([])
            breadStore.setCrumbs([])
        }else {
            breadCrumbs = []
            recursiveFunction(path)
        }
        productStore.setPage(1)
    }


    return (
        <Container className="Aside">
            <div className="AsideDiv" onClick={onClickAsideDiv}>
                {breadCrumbsState && 
                Array.isArray(breadCrumbsState) && 
                breadCrumbsState.map(i => {
                    return (
                        <div key={i.url+i.name} className="AsideDivNavLink">
                            <NavLink to={"/" + i.url} style={{color:"white"}}>
                                {i.name}
                            </NavLink>
                        </div>
                    )
                })
                } 
            </div>
        </Container>
    )
})

export default Aside 
