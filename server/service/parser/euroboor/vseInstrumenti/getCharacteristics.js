
const parseHtml = require('../../../html/parseHtml')


async function getCharacteristics(html) {
    
    let text = ""
    let response

    html = parseHtml(html, {
        entry: `<div class="features spoiler">`,
        start: `<ul`,
        end: `</ul>`,
        inclusive: false
    }).replace(/;/g, ".")//.trim()

    let yes = true
    do {
        try {
            response = parseHtml(html, {
                entry: `<li`,
                start: `>`,
                end: `</li>`,
                inclusive: false,
                return: true
            })//.trim()
            html = response.rest
            //
            response = parseHtml(response.search, {
                entry: `itemprop="name"`,
                start: `>`,
                end: `</`,
                inclusive: false,
                return: true
            })
            if (text) text += ";"
            text += response.search.trim()
            //
            response = parseHtml(response.rest, {
                entry: `itemprop="value"`,
                start: `>`,
                end: `</`,
                inclusive: false,
                return: true
            })
            
            if (text) text += ";"
            text += response.search.trim()

        }catch(e) {
            yes = false
        }
    }while(yes)

    
    return text
}

module.exports = getCharacteristics


{/* search
<div class="features spoiler"> 
    <span id="tab1" class="sticky-anchor" style="top: -124px;">
    </span>  
    <h3 class="heading -medium"> Технические характеристики  сверлильного станка EUROBOOR ECO.30S+  </h3> 
    <ul class="dotted-list">  
        <li class="item" itemprop="additionalProperty" itemscope="" itemtype="https://schema.org/PropertyValue"> 
            <div class="option"> 
                <div class="title"> 
                    <span class="text" itemprop="name"> Материал обработки </span>  
                </div> 
            </div>  
            <div class="value"> 
                <a class="link" itemprop="value" title="металл" href="https://rostov.vseinstrumenti.ru/stanki/sverlilnye/po-metallu/" onclick="dataLayer.push({'event': 'tx_to_tag'});"> металл </a> 
            </div>  
        </li>  
        <li class="item" itemprop="additionalProperty" itemscope="" itemtype="https://schema.org/PropertyValue"> 
            <div class="option"> 
                <div class="title"> 
                    <span class="text" itemprop="name"> Напряжение, В </span>  
                    <div class="tooltip">
                        <div class="toggle"> 
                            <svg class="icon -x-small -primary-gray" data-characteristics-id=""> 
                                <use xlink:href="#icon-new-info"></use> 
                            </svg> 
                        </div> 
                        <div class="window -right -top"> 
                            <div class="content -small -html"> 
                                <p>Напряжение – характеристика электрической сети, к которой будет подключаться сверлильный станок.</p>
                                <p>220В – однофазная бытовая сеть, от которой работают все устройства и приборы в обычных домах и квартирах, в бытовых условиях.</p>
                                <p>380В – трехфазная промышленная сеть, использующаяся на крупных производствах, фабриках, заводах для подключения высокомощной техники.</p>
                                <p>Важно помнить, что рассчитанный на сеть 380 В агрегат не сможет работать от 220 В, и наоборот.</p> 
                            </div> 
                        </div> 
                    </div>  
                </div> 
            </div>  
            <div class="value"> 
                <a class="link" itemprop="value" title="220" href="https://rostov.vseinstrumenti.ru/stanki/sverlilnye/220-v/" onclick="dataLayer.push({'event': 'tx_to_tag'});"> 220 </a> 
            </div>  
        </li>    

        ......

    </ul>   
    <a href="#" class="spoiler-toggle icon-link" data-behavior="toggle-spoiler"> 
        <span class="label -show" onclick="dataLayer.push({'showMoreInfo_block':'more_characteristics','event':'showMoreInfo'});"> Показать все </span> 
        <span class="label -hide">Скрыть</span> 
        <svg class="icon -small -dusty-gray"> 
            <use xlink:href="#icon-new-arrow-down"></use>
        </svg> 
    </a>  
</div>
*/}

// result
// Материал обработки;металл;Напряжение, В;220;Число скоростей;1;Размер основания, мм;160х80;Подсветка рабочей зоны;нет;Регулировка оборотов;нет;Реверс;нет;Частота вращения шпинделя, об/мин;775;Вес нетто, кг;8,5;Габариты без упаковки, мм;275х190х293;Мощность (Вт);950;Max диаметр получаемого отверстия, мм;30;Наличие лазера;нет;Система подачи СОЖ;есть;Число оборотов, об/мин;775;Max глубина сверления, мм;75;Прижимная сила, Н;12000;Размер магнита, мм;160х80х37;Рабочий ход, мм;90;Встроенный бачок для СОЖ;да;Max диаметр корончатого сверла, мм;30;Max диаметр спирального сверла, мм;13;Крепление хвостовика оснастки;Weldon 19;Тип оснастки;спиральное/корончатое сверло
// 