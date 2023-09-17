
import React, { useEffect, useContext, useState } from 'react'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { fetchOneProduct, fetchOneProductOnUrl } from '../../../http/productAPI'
import { fetchAllCategories } from '../../../http/categoryAPI'
import Container from '../../../components/myBootstrap/container/Container'
import { authRoutes, publicRoutes } from '../../../utils/routes'

import { Context } from '../../..'
import './Aside.css'


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
                    breadCrumbs = [ {name: i?.name, url: i.url, category: i}, ...breadCrumbs ]
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

        if (path.length > 0) {
            if (path[path.length-1] === "/") {
                path = path.substring(0, path.length-1)
            }
        }

        let number = path.indexOf(`/`)

        if (number === -1) {
            let yes = false

            let name = ""

            authRoutes.forEach(i => {
                let pathAuth = i.path.replace("/","")
                let numberAuth = pathAuth.indexOf(`/`)
                if (numberAuth !== -1) pathAuth = pathAuth.substring(0, numberAuth)
                if (pathAuth === path) {
                    yes = true
                    name = i.name
                }
            })
            publicRoutes.forEach(i => {
                let pathPublic = i.path.replace("/","")
                let numberPublic = pathPublic.indexOf(`/`)
                if (numberPublic !== -1) pathPublic = pathPublic.substring(0, numberPublic)
                if (pathPublic === path) {
                    yes = true
                    name = i.name
                }
            })
            brandStore.brands.forEach(i => {
                let pathBrand = i.name.toLowerCase()
                let numberBrand = pathBrand.indexOf(`/`)
                if (numberBrand !== -1) pathBrand = pathBrand.substring(0, numberBrand)
                if (pathBrand === path) {
                    yes = true
                    name = i.name
                }
            })
            if (yes) {
                if (path !== "" && path !== "shop") {
                    breadCrumbs = [ {name}, ...breadCrumbs ]
                    setBreadCrumbsState([...breadCrumbs])
                    breadStore.setCrumbs([...breadCrumbs])
                }else {
                    setBreadCrumbsState([])
                    breadStore.setCrumbs([])
                }
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
                                breadCrumbs = [ {name: "article"}, ...breadCrumbs ]
                                setBreadCrumbsState([...breadCrumbs])
                                breadStore.setCrumbs([...breadCrumbs])
                                // console.log("cat: ",cat)
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
            if (path.length > 0) {
                if (path[path.length-1] === "/") {
                    path = path.substring(0, path.length-1)
                }
            }
            breadCrumbs = []
            recursiveFunction(path)
        }
        // productStore.setPage(1)
    }

    const onClickAsideDivNavLink = (category) => {
        categoryStore.setSelectedCategory(category)             
        categoryStore.setCategories(categoryStore.categories.map(i => {
            if (i.id === category.id) return { ...i, open: true }
            if (i.sub_category_id === category.sub_category_id) return { ...i, open: false }
            if (i.sub_category_id === category.id) return { ...i, open: false }
            return i
        }))
    }


    return (
        <Container className="Aside">
            <div className="AsideDiv" onClick={onClickAsideDiv}>
                {breadCrumbsState && 
                Array.isArray(breadCrumbsState) && 
                breadCrumbsState[0] !== undefined && 
                <>
                <div className="AsideDivNavLink">
                    {/* // SEOшники попросили добавить ; #рукалицо */}
                    <a href={"/"} style={{color:"#4cb311"}}>
                    {/* <NavLink to={"/"} style={{color:"#4cb311"}}> */}
                        Главная
                    {/* </NavLink> */}
                    </a>
                </div>
                {breadCrumbsState.map((i, idx) => {
                    if (i.name === "article") return
                    if (idx === (breadCrumbsState.length-1)) {
                        return (
                            <div key={i.url+i.name} className="AsideDivNavLink">
                                <div style={{color:"grey"}}>
                                    {i.name}
                                </div>
                            </div>
                        )
                    }
                    return (
                        <div key={i.url+i.name} className="AsideDivNavLink" onClick={()=>onClickAsideDivNavLink(i.category)}>
                            {/* // SEOшники попросили добавить ; #рукалицо */}
                            <a href={"/" + i.url + "/"} style={{color:"#4cb311"}}>
                            {/* <NavLink to={"/" + i.url + "/"} style={{color:"#4cb311"}}> */}
                                {i.name}
                            {/* </NavLink> */}
                            </a>
                        </div>
                    )
                })}
                </>
                } 
            </div>
        </Container>
    )
})

export default Aside 
