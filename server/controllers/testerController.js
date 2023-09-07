
const path = require('path')
const fs = require('fs')
const axios = require('axios')
const http = require('http')
const https = require('https')

const { Product, Brand, Category, ProductSize, ProductInfo, CategoryInfo } = require('../models/models')
const siteMap = require('../service/tester/siteMap')
const parseHtml = require('../service/html/parseHtml')
const sendMessage = require('../service/telegram/sendMessage')


class TesterController {
    
    async setFeed(req, res, next) {
        try {
            let products = await Product.findAll()
            const brands = await Brand.findAll()
            const categories = await Category.findAll()
            
            products = products.filter(i => {
                let img                    
                try {
                    img = JSON.parse(i.img)
                }catch(e) {}
                if (img && Array.isArray(img) && img[0].big !== undefined) { 
                    if ( ! i.request && i.price > 0 ) return true 
                }
                // если нет изображений
                // если "цена по запросу" или нет цены
                // тогда убираем из списка
                return false                
            })

            let formatDate = new Date().toISOString()
            // formatDate = formatDate.substring(0, formatDate.indexOf("."))
            formatDate = formatDate.substring(0, formatDate.lastIndexOf(":")) + "+00:00"
            // <name>${i.name.include(/"/g,"&quot;").include(/&/g,"&amp;").include(/>/g,"&gt;").include(/</g,"&lt;").include(/'/g,"&apos;")}</name>

            const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<yml_catalog date="${formatDate}">
    <shop>
        <name>ЛЕИДТОГИ</name>
        <company>ООО &quot;ЛЕИДТОГИ&quot;</company>
        <url>https://leidtogi.ru</url>
        <currencies>
            <currency id="RUR" rate="1"/>
        </currencies>
        <categories>${categories.map(i => {
            if (i.sub_category_id === 0) {
            return (`
            <category id="${i.id}">${i.name}</category>`)
            }
            return (`
            <category id="${i.id}" parentId="${i.sub_category_id}">${i.name}</category>`)
        }).join("")}
        </categories>
        <offers>${products.map(i => {
            let brandName = brands
                .filter(j => j.id === i.brandId)
                .map(k => k.name.toLowerCase())
                .join("")
            let name = i.name
                .replace(/&/g,"&amp;")
                .replace(/"/g,"&quot;")
                .replace(/>/g,"&gt;")
                .replace(/</g,"&lt;")
                .replace(/'/g,"&apos;")
            return (`
            <offer id="${i.article}" available="${i.have === 1 ? "true" : "false"}">
                <name>${name}</name>
                <url>https://leidtogi.ru/${brandName}/${i.url}</url>
                <picture>https://server.leidtogi.ru/${JSON.parse(i.img)[0].big}</picture>
                <price>${i.price}</price>
                <currencyId>RUB</currencyId>
                <categoryId>${i.categoryId}</categoryId>
                <pickup>true</pickup>
                <delivery>true</delivery>
                <manufacturer_warranty>true</manufacturer_warranty>
                <country_of_origin>${i.country || "Китай"}</country_of_origin>
            </offer>`)
        }).join("")}
        </offers>
    </shop>
</yml_catalog>`

            fs.writeFileSync(path.resolve(__dirname, '..', 'static', 'feed', 'yml.xml'), xml)

            return res.json(true)
        }catch(e) {
            return  res.json({ error: `Ошибка метода setFeed! (${e})` })
        }
    }


    async setSitemap(req, res, next) {
        try {
            let args
            if (req.query && req.query.routes !== undefined) args = req.query
            else args = req.body
            
            await siteMap(args)

            return res.json(true)
        }catch(e) {
            return next(res.json({ error: `Ошибка метода setSitemap! (${e})` }))
        }
    }

        
    
    async bigDescription(req, res, next) {

// необходимо в db.js установить logging: false

        let product = await Product.findAll({
            where: {
                brandId: 13
            }
        })
        let quantity = 0
        product.forEach(async i => {
            let info = await ProductInfo.findOne({
                where: {
                    productId: i.id,
                    title: "description"
                }
            })
            if (info.body.length === 4096) {
                console.log(info.body.replace(/&lt;/g,"<").replace(/&gt;/g,">")) 
                console.log("quantity", ++quantity) 
                console.log(i.id) 
            }
        })
        if (!quantity) console.log("quantity", quantity) 

        // return res.json("смотри в консоль")
        return res.send(`
            <body 
                style="
                    width:100%;
                    hight:100%;
                    background:black;
                    color:white;"
            >
                <p style="color:white;">Смотри в консоль</p>
            </body>
        `)
    }


    async bigDescriptionEdit(req, res, next) {
        const {id} = req.params
        
        let product = await Product.findOne({ where: { id } })
        
        let info = await ProductInfo.findOne({
            where: {
                productId: product.id,
                title: "description"
            }
        })

        if (info.body.length === 4096) console.log(info.body.replace(/&lt;/g,"<").replace(/&gt;/g,">")) 
        else console.log(undefined) 

        let body

// для внесения изменений разкомментируй одну из них

        // body = "<h4>Тележки самоходные с платформой для оператора</h4><p>Значительно увеличивают скорость обработки грузов и существенно снижают нагрузку на ператора, благодаря возможности передвижения последнего вместе с тележкой на специальной удобной платформе.</p><p>Комфорт и практичность – незаменимые свойства, оторое предлагает этот вид оборудования. Позволяет оператору работать долгое время без перерыва, справляясь с большим объёмом работ.</p><p>Высокий объём ккумулятора обеспечивает до 4 часов беспрерывной работы.</p><p>В зависимости от модели и модификации снабжены информативным дисплеем, бесщёточным двигателем, нопкой аварийной остановки, различными режимами скорости передвижения.</p><p>Длина вил составляет, в зависимости от модификации, 1150, 1600 или 2000 мм.</><p>Грузоподъёмность представлена вариантами в 2000, 2500 и 3000 кг!</p><h4>Основные преимущества</h4><p> – маневренность;</p><p> – высокоёмкий аккумулятор;</><p> – легкость обслуживания;</p><p> – широкий выбор моделей и модификаций;</p><p> – удобная тележка для оператора;</p><p> – продуманная сбалансированная конструкция;</p><p> – износостойкость;</p><p> – производительность;</p>"

        // body = "<h4>Тележки гидравлические для бездорожья</h4><p>Нередко приходится работать в условиях бездорожья, и тогда обычная гидравлическая тележка, при всех ё преимуществах, уже не может справиться с поставленной задачей. Тогда на помощь приходят специализированные тележки для бездорожья!</p><h4>Конструкция</4><p>Конструкция этих тележек создана таким образом, чтобы минимизировать факторы неровностей поверхности, за счёт чего передвижение становится максимально лавным и требует меньших усилий, защищает от пробуксовок.</p><h4>Мощные пневматические колёса</h4><p>Мощные пневматические колёса большого диаметра существенно блегают проезд по неровностям, а оптимально подобранные габариты помогают проходить большинство ворот, створок и иных препятствий.</p><p>Такое оборудование ожет пригодиться на предприятиях, где материалы и смеси хранятся на открытых или закрытых площадках с естественным полом, без заливки, в логистических центрах ли складах открытого типа.</p>"

        // body = "<h4>Тележки складские гидравлические оцинкованные</h4><p>Эта категория оборудования – отличное решение не только для стандартных складских работ, но и ля эксплуатации в особых условиях: при отрицательных температурах, в агрессивных условиях, таких как высокая влажность, соприкосновение со щелочами, кислотами и ругими химикатами.</p><h4>Основные преимущества оборудования</h4><table><tbody><tr><td>Лёгкость обслуживания</td><td>Компактность</td><td>Разборный гидроузел</d></tr><tr><td>Цинковое покрытие</td><td>Износостойкость</td><td>Полиуретановые колёса</td></tr></tbody></table>"

        // body = "<h4>Штабелеры-бочкоконтователи с электроподъемом</h4><p>Такие штабелёры активно используется на складах и производствах для подъема, перемещения, табелирования, переворота и опорожнения бочек. Ведь последние являются довольно нестандартным грузом, требующим особых условий перемещения. Различные сыпучие, идкие и пастообразные вещества требуют специального оборудования.</p><p>ГИДРАВЛИЧЕСКАЯ СИСТЕМА С ЭЛЕКТРОПРИВОДОМ</p><p>Подъём груза осуществляется идравлической системой с электроприводом. Штабелёры оборудованы мощными электромоторами, которые помогают быстро и без излишних усилий со стороны оператора правляться со своей задачей. А это существенно уменьшает время обработки грузов.</p><p>АККУМУЛЯТОР</p><p>Аккумулятор высокой ёмкости обеспечивает длительный ериод работы. А при необходимости, его легко подзарядить.</p><p>ЗАКРЕПЛЕНИЕ БОЧЕК</p><p>Закрепление бочек производится крюком за кант бочки. При этом бочка адежно фиксируется сверху и снизу, что исключает её срыв. Для вращения, как правило, используется надежный и простой червячный редуктор. Бочка может вращаться а 360 градусов, если этому не препятствует её размер.</p><p>УВЕЛИЧЕННЫЕ КОЛЕСА</p><p>Большинство моделей снабжены увеличенными колёсами, которые позволяют без руда преодолевать небольшие препятствия на пути движения. Сами колёса сделаны, как правило, из полиуретана. Они не боятся грязи, острых предметов, устойчивы к имикатам и ударным нагрузкам, к тому же – очень долговечны.</p>"

        // body = "<h4>Тележки для перевозки газовых баллонов.</h4><p>Тележки для газовых баллонов – незаменимое оборудование, которое, к тому же, соответствует всем еобходимым стандартам безопасности для перевозки газовых баллонов.</p><p>Активно применяются в сфере строительства и промышленности. Тележки снабжены парой рочных резиновых пневматических колёс, которые не только обеспечивают высокую проходимость, но помогают добиться плавность движения.</p><p>Максимальная рузоподъёмность оборудования достигает 435 кг! В зависимости от модификации, возможна одновременная транспортировка как для одного, так и двух баллонов.</><h4>Основные преимущества оборудования</h4><p> – компактность;</p><p> – маневренность;</p><p> – соответствие стандартам безопасности;</p><p> – колёса овышенной проходимости;</p><p> – плавность хода;</p><p> – удобство эксплуатации;</p><p> – износостойкость;</p><p> – качественная покраска, защищающая от коррозии</p>"

        // body = "<h4>Гайковерты пневматические</h4><p>Гайковерт – инструмент, значительно ускоряющий любой процесс сборки или демонтажа каких-либо конструкций. Там, где сть необходимость прибегнуть к гаечному ключу, гайковерт решить любую задачу за несколько секунд.</p><p>Наш интернет-магазин предлагает широчайший ассортимент кладской и промышленной техники, и предлагает купить пневматические гайковерты от производителя по самой доступной цене. На нашем сайте вы легко можете выбрать се, что вам необходимо для монтажных и демонтажных работ. У нас представлены только самые новейшие разработки складской сферы. Кроме того, любой пневматический айковерт, который вы можете купить оптом или в розницу у нас, проходит проверку качества, имеет все сертификаты и гарантию производителя.</p><p>Гайковерты, редставленные на страницах нашего каталога, обладают исключительными характеристиками. Помимо доступной цены, гайковерты отличаются следующими качествами:</><ol><li>высокая скорость работы;</li><li>только проверенные производители с положительными отзывами наших клиентов;</li><li>доступная цена на оборудование.</i></ol><h4>Как выбрать идеальный гайковерт</h4><p>Спешим вас удивить: любой представленный в нашем интернет-магазине пневматический гайковерт подходит под это писание. Однако, чтобы выбрать гайковерт, необходимо определиться со значением следующих параметров:</p><ul><li>размер гаек, с которыми предстоит работа;</i><li>скорость вращения ротора;</li><li>возможность регулировки силы затяжки гаек;</li><li>совместимость с компрессором.</li></ul><p>Пополняя ассортимент айковертов, мы обращали внимание не только на качественные характеристики. Представленные пневматические гайковерты удобно держать в руке: эргономичность и лавные формы сделают любую работу инструментом приятным времяпрепровождением. Доступная цена на гайковерты станет еще одним приятным бонусом в пользу выбора борудования.</p><p>Не можете определиться среди такого обилия моделей? Позвоните нам, и смело задавайте любые вопросы! Наши опытные специалисты расскажут об тличиях моделей, и помогут подобрать инструмент, который станет идеальным решением именно в вашей ситуации.</p>"

        // body = "<p>Гидравлический домкрат способен поднимать десятки и сотни тонн груза. Основное применение домкратов – это, конечно, автосервисы и владельцы автомобилей. Однако, довольно часто применяют домкраты и в строительной, промышленной сферах – везде, где есть потребность поднимать грузы на определенную высоту.</p><p>Наш интернет-магазин представляет вашему вниманию большой выбор гидравлических домкратов, самым востребованным среди которых являются бутылочные. Такое оборудование может применяться как в быту, так и в промышленной сфере – и все это благодаря характеристикам домкратов. У нас вы можете купить бутылочные домкраты по доступной цене с доставкой в любой город России.</p><p>Свое название бутылочный домкрат получил благодаря своей форме. Вертикально ориентированный, он имеет невероятно плавный ход и является незаменимым помощником на СТО и в гаражах автолюбителей. С помощью бутылочного домкрата вы в считанные минуты без особого физического напряжения поднимите громоздкий груз на высоту. </p><h4>Почему стоит купить именно бутылочный домкрат</h4><p>Бутылочный гидравлический домкрат среди других видов подъемного оборудования выгодно выделяют 3 особенности:</p> <ol> <li>компактность в сложенном состоянии;</li> <li>высокая грузоподъемность;</li> <li>доступная цена. </li> </ol> <p>Конструкция домкрата спроектирована таким образом, что он не выходит из строя даже при незначительном превышении допустимой нагрузки. Применяемые для производства материалы и детали делают его износостойким и долговечным подъемным оборудованием.</p> <p>Гидравлический бутылочный домкрат не требует специальных условий для хранения и использования, за исключением необходимости держать его все время исключительно в вертикальном состоянии. Простое и интуитивно понятное устройство позволит быстро с ним сладить даже тем, кто впервые видит перед собой домкрат. </p> <p>Однако, стоит отметить, что бутылочный винтовой домкрат может не подойти для автомобилей с небольшим клиренсом. При выборе домкрата обращайте внимание на его высоту. А вот обладатели внедорожников и газелей с удовольствием отметят все перечисленные выше преимущества домкрата. В гараже на ровной поверхности гидравлическому бутылочному домкрату нет равных. </p><h4>Как выбрать бутылочный домкрат</h4><p>Выбирая гидравлический домкрат под свои задачи, рекомендуется обращать внимание на технические характеристики оборудования, среди которых наибольшее значение имеют:</p><ul> <li>грузоподъемность: у нас представлены модели как для бытового, так и промышленного использования, способные поднимать от 2-х до 100 тонн груза;</li> <li>ход штока: чем больше этот показатель, тем быстрее груз поднимается на нужную высоту;</li> <li> высота подъема и подхвата;</li> <li> диаметр площадки.</li> </ul> <p>В нашем интернет-магазине вы найдете только самые ходовые и востребованные модели, у которых все эти показатели идеально сочетаются между собой, что позволяет надолго зафиксировать груз на необходимой высоте. Домкраты имеют удобную опорную площадку, на которой груз держится устойчиво, и нагрузка на подъемник распределяется равномерно.</p>"
        
        // body = "<h4>Тележки гидравлические с электропередвижением</h4><p>Тележка гидравлическая с электропередвижением – изделие, которое предназначено для транспортировки груза, упакованного на поддоны.</p><p>Главное его отличие от простой гидравлической тележки - это электрический привод, который работает в горизонтальной плоскости.</p><p>Подъём груза здесь осуществляется с помощью гидравлики, а вот передвигается она от электричества.</p><p>В зависимости от модели обладают минимальным радиусом поворота, удобной заменой колеса, бесступенчатым контролем скорости, плавающим балансировочным колесом, встроенным зарядным устройством и бесщёточным двигателем.</p><p>Длина вил составляет 1150 мм, а грузоподъёмность, как правило, представлена вариантами в 1000, 1500, 1800 и 2000 кг!</p><h4>Основные преимущества</h4><p> + маневренность</p><p> + ёмкий аккумулятор</p><p> + широкий выбор моделей и модификаций</p><p> + продуманная сбалансированная конструкция</p><p> + износостойкость</p><p> + производительность</p>"
        
        // body = "<p>Консольный кран явно отличается от привычных подъемников. Дело в уникальной технологической особенности: кран имеет всего одну опору, которую можно повернуть в нужную сторону, если это необходимо.</p><p>Наш интернет-магазин представляет вам широкий выбор грузоподъемного оборудования по привлекательным ценам, предназначенного для перемещения габаритных грузов как в вертикальной, так и в горизонтальной плоскости в помещениях или на открытом воздухе. У нас вы можете купить консольные краны, которые способны решить массу задач по перемещению грузов в пределах участка. Наше оборудование отлично справится с задачами по подъему грузов в самых разных сферах деятельности:</p><ul><li>На стройке;</li><li>При проведении ремонтных работ;</li><li>На складе;</li><li>В логистике;</li><li>В промышленности и др.</li></ul><h4>Конструкция консольного крана</h4><p>Кран данного вида состоит из следующих комплектующих:</p><ul><li>Ферма &ndash; вертикальная колонна;</li><li>Консоль &ndash; горизонтальная балка;</li><li>Каретка с механизмом для захвата груза (крюком);</li><li>Дополнительное оборудование.</li></ul><p>В производстве подъемников используются исключительно высокопрочные сплавы, что позволяет задействовать кран на полную мощность. Он готов к долговременным предельным нагрузкам, компактен и функционален. На всю продукцию есть сертификаты качества, действует гарантия производителя.</p><p>Управление консольным краном происходит с помощью пульта. Никакой физической нагрузки для оператора: производительность цеха, склада или строительной площадки увеличится в разы.</p><h4>Виды консольных кранов</h4><p>Краны бывают двух основных типов:</p><ul><li>Стационарные;</li><li>Передвижные.</li></ul><p>Первые закрепляют на рабочем месте и не передвигают; разбирают такие краны очень редко. В этом случае груз может перемещаться только в одной плоскости. Стационарные краны пользуются популярностью на складах и в цехах &ndash; там, где перемещение грузов происходит постоянно.</p><p>Второй вид консольных кранов способен еще и перемещать грузы по всей площадке, а не только в пределах консоли. Такое решение ощутимо расширяет возможности работы с грузами.</p><p>Также консольные краны делятся по типу привода:</p><ul><li>Ручной;</li><li>Механический.</li></ul><p>В каждом случае кран имеет свои преимущества, которые могут стать решающими в выборе подъемной техники. На механический кран добавляют устройства, значительно упрощающие работу с грузом. Привод в этом случае может быть как гидравлическим, так и электрическим.</p>"
        
        // body = "<h4>Тележки для транспортировки бочек</h4><p>Чтобы максимально оптимизировать жизненный цикл любого складского помещения, необходимо наличие специального оборудования. Использование вспомогательной техники не только поможет ускорить все процессы, но и положительно скажется на здоровье ваших сотрудников. Все, что раньше нужно было поднимать и нести самостоятельно, а то и с применением двух-трех работников, теперь сделает за вас мобильная и универсальная техника. К такой категории товаров относятся и тележки для транспортировки бочек.</p><h4>Тележки бочкокаты от производителя по доступным ценам и в наличии</h4><p>Производители постарались сделать все, чтобы ручная перевозка бочек проходила максимально легко для вашего персонала. Представленные тележки для транспортировки оборудованы третьим колесом, чтобы беспрепятственно лавировать среди паллетов на складе. Также некоторые модели оснащены механизмом, позволяющим без особых усилий высыпать или слить содержимое бочки прямо с тележки. Бочкокаты невероятно упрощают жизнь как владельцам складов, так и их персоналу. Мы также предлагаем самостоятельно скомпоновать такие тележки для ручной перевозки бочек, которые подойдут именно для вашего бизнеса. В карточке товара выбранной вами тележки для бочек вы увидите раздел «Подбор колес», где есть возможность подобрать колеса, которые превратит вашу тележку в инструмент, подходящий для решения именно ваших задач в ваших условиях работы.</p><h4>Виды тележек</h4><ol><li>Среди наших бочкокатов есть варианты с грузоподъёмностью до 450 кг, с 2 или 3 колёсами.</li><li> В зависимости от модели оборудование снабжено автоматическим фиксатор бочки и гидравлическим насосом для подъёма.</li><li>В зависимости от целей предусмотрены модели для простого перемещения бочек или же для снятия и постановки их на палеты.</li></ol>"

// для внесения изменений разкомментируй

        // await ProductInfo.update({ body }, {
        //     where: {
        //         id: info.id
        //     }
        // })

        // return res.json(info.body.replace(/&lt;/g,"<").replace(/&gt;/g,">"))
        return res.send(`
            <body 
                style="
                    width:100%;
                    hight:100%;
                    background:black;
                    color:white;"
            >
                ${info.body.replace(/&lt;/g,"<").replace(/&gt;/g,">")}
            </body>
        `)

    }

    
	// временный роут 
    // п.с. нет ничего более постоянного, чем временное...	
    async temp(req, res, next) {
        try {
            
            return res.json("temp")

        }catch(e) {
            return res.json({error:'Ошибка метода temp!'})
        }
    }
	

    //
    async editImages(req, res, next) {
        try {

            let info = await CategoryInfo.findAll()

            // info = info.filter(i => i.image)
            info = info.filter(i => i.id !== 1)

            // - убираю картинки из description
            info.map(async item => {
                if (item.description) {
                    let description = item.description
                    let response, yes = false
                    try {
                        while(1) {
                            response = parseHtml(description, {
                                start: "<img",
                                end: ">",
                                inclusive: true
                            })
                            description = description.replace(response, "")
                            // console.log("response: ", response)
                            yes = true
                        }
                    }catch(e) {}

                    if (yes) await CategoryInfo.update({ description }, {
                        where: { id: item.id }
                    })
                }
            })
            // return res.json("removing images from the description")

            // - убираю из image.path первый символ '/' и добавляю последний
            info.map(async item => {
                if (item.image) {
                    let image = JSON.parse(item.image)
                    let imagePath = image.path
                    if (imagePath[0] === "/") {
                        imagePath = imagePath.replace("/","")
                    }
                    if (imagePath[imagePath.length - 1] !== "/") {
                        imagePath = imagePath + "/"
                    }
                    image = {
                        ...image,
                        path: imagePath
                    }
                    image = JSON.stringify(image)
                    await CategoryInfo.update({ image }, {
                        where: { id: item.id }
                    })
                }
            })
            // return res.json("update path")
            
           
            // удаляю ничейные CategoryInfo
            info.forEach(async item => {
                let response = await Category.findOne({
                    where: {
                        categoryInfoId: item.id
                    }
                })
                if ( ! response ) {
                    await CategoryInfo.destroy({
                        where: { id: item.id }
                    })
                }
            })            
            // return res.json("delete null info")

            /* // вывод в консоль содержимого в папке
            fs.readdirSync(path.resolve(__dirname, '..', 'static', "nzeta/category/kabelnye-vvody-dlya-metallorukava-vk-m-mr")).forEach(file => {
                console.log(file);
            })
            return res.json("hell o")
            */

            // обновляю CategoryInfo, добавляю список файлов 
            info.forEach(async item => {
                if (item.image) {
                    let image = JSON.parse(item.image)
                    if (image.files[0] === undefined) {
                        let files = []
                        fs.readdirSync(path.resolve(__dirname, '..', 'static', image.path)).forEach(file => {
                            console.log(file)
                            files.push(file)
                        })
                        image = {
                            ...image,
                            files
                        }
                        image = JSON.stringify(image)
                        await CategoryInfo.update({ image }, {
                            where: { id: item.id }
                        })
                    }
                }
            })            
            // return res.json("added files in base")
            


            let array = []
            // return res.json(info.length)

            info = info.filter(item => {
                if ( ! item.image ) return true
                let response = JSON.parse(item.image)

                let yes = false
                let quantity = 0
                let deleteFilePath = ""
                let deleteFileName = ""
                if (response.files) response.files.forEach(file => {
                    
                    let url = process.env.URL + "/" + response.path + file

                    let image = path.resolve(__dirname, '..', 'static', response.path, file)
                    
                    if ( ! fs.existsSync(image) || fs.statSync(image).size === 0) {
                        array.push(url)
                        yes = true
                        quantity++
                        deleteFilePath = image
                        deleteFileName = file
                    }                    
                })
                // удаляю лишние, пустые файлы
                if (quantity === 1 && quantity < response.files.length) {
                    fs.unlinkSync(deleteFilePath)
                    let files = response.files.filter(i => i !== deleteFileName)
                    let image = {...response, files}
                    image = JSON.stringify(image)
                    CategoryInfo.update({ image }, {
                        where: { id: item.id }
                    })
                    yes = false
                }

                return yes
            })

            // return res.json(array)
            // return res.json(array.length)

            // return res.json(info)
            // return res.json(info.length)


            
            if (info) info.forEach(async item => {
                let _path
                if ( item.id === 56 ) {
                    _path = "nzeta/category/kabelnye-vvody-dlya-metallorukava-vk-m-mr/"
                }else if (item.image) {
                    let response = JSON.parse(item.image)
                    _path = response.path
                    if (response.files) response.files.forEach(file => {
                        let image = path.resolve(__dirname, '..', 'static', _path, file)
                        if (fs.existsSync(image)) fs.unlinkSync(image)
                    })
                    
                }
                    
                    let category = await Category.findOne({
                        where: {
                            categoryInfoId: item.id
                        }
                    })
                    let product = await Product.findOne({
                        where: {
                            categoryId: category.id
                        }
                    })
                    
                    let article = product.article
                    let method = "product/getProduct"

                    let query = article ? `?article=${article}` : ""
                
                    let { data } = await axios.get(process.env.NZETA_API_2_URL + method + query)
                    if ( ! data.error) {

                        let files = []
                        let images = data.result[0].IMAGES

                        images.forEach((url, idx) => {
                            
                            let name = idx + 1
                            let fileName = `${name}.jpg` // '1.jpg'
        
                            let image = fs.createWriteStream(path.resolve(__dirname, '..', 'static', _path, fileName))
        
                            let httpHost

                            if (url.includes("https://")) {
                                httpHost = https
                            }else {
                                httpHost = http
                            }

                            httpHost.get(url, (res) => {
                                res.pipe(image)
                            }).on('error', function(err) {
                                console.error(err)
                                // throw err
                            }) 
                            files.push(`${name}.jpg`)
                        })
                        
                        let image = { path: _path, files }
                        image =  JSON.stringify(image)
                        await CategoryInfo.update({ image }, {
                            where: { id: item.id }
                        })

                    }                

            })

            return res.json("editImages")

        }catch(e) {
            return res.json({error:'Ошибка метода editImages! ' + e})
        }
    }

    

    
    // CATALOG_MULT
    async addedMult(req, res, next) {
        try {
            
            let products = await Product.findAll()
            let { data } = await axios.get(process.env.NZETA_API_2_URL + "product/getProduct")

            if ( ! data.error) {

                products.forEach(async product => {
                    // let product = products[0]
                    // let product = await Product.findOne({ where: { article } })
                    let article = product.article // "zeta30506"
                    let filter = data.result.filter(item => item.PROPERTY_CML2_ARTICLE_VALUE === article)
                                    
                    let body
                    if (filter[0] !== undefined) {
                        body = filter[0].CATALOG_MULT
                    }else {
                        body = 1
                    }
                    console.error("article: ", article);
                    console.log("CATALOG_MULT: ", body);
                    let response = await ProductInfo.findOne({
                        where: {
                            title: "multiplier",
                            productId: product.id
                        }
                    })
                    if (!response) {
                        await ProductInfo.create({
                            title: "multiplier", 
                            body,
                            productId: product.id
                        })
                    }

                    // return res.json(filter)                    
                    
                })                  
            }

            return res.json("addedMult")

        }catch(e) {
            return res.json({error:'Ошибка метода addedMult!'})
        }
    }
	
    
    // обновление цен
    async updatePrices(req, res, next) {
        try {
            let { token } = req.query

            if (token !== process.env.TOKEN_UPDATES) {
                sendMessage("Ошибка обновления цен! Доступ закрыт.")
                return res.json("Доступ закрыт.")
            }
            
            let products = await Product.findAll()
            let { data } = await axios.get(process.env.NZETA_API_2_URL + "product/getProduct") 

            let response = true
            if ( ! data.error) {
                // response = []
                products.forEach(async product => {
                    // let product = products[0]
                    let article = product.article // "zeta30506"
                    let oldPrice = product.price
                    let filter = data.result.filter(item => item.PROPERTY_CML2_ARTICLE_VALUE === article)
                                    
                    let price
                    if (filter[0] !== undefined) {
                        price = filter[0].CATALOG_PRICE_OPT
                        // price = filter[0].CATALOG_PRICE_DILER

                        price = (price - (price/100*28)).toFixed(2)

                        // console.error("article: ", article)
                        // console.log("oldPrice: ", oldPrice)
                        // console.log("price: ", price)
                        
                        if (oldPrice !== price) {
                            // let update = await 
                            Product.update({price},{
                                where: { id: product.id }
                            })
                            // response.push({ article, oldPrice, price, update })
                        }else {                            
                            // response.push({ article, price })
                        }
                    }
                })            
            }else {
                // отправка в телеграм сообщения об ошибке
                sendMessage(`Ошибка обновления цен! Нет данных от ${process.env.NZETA_API_2_URL}.`)
                return res.json(false)
            }

            sendMessage(`Обновление цен прошло успешно!`)
            return res.json(response)

        }catch(e) {
            return res.json({error:'Ошибка метода updatePrices!'})
        }
    }


}

module.exports = new TesterController()