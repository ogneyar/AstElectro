

// сначала получим список товаров
let url = "http://localhost:5000/api/parser/nzeta?method=items"


// потом поиск по артикулу
let article = "zeta10710"
url = "https://nzeta.ru/catalog/?q=" + article

/*
<tr itemprop="itemListElement" itemscope="" itemtype="http://schema.org/Product">
    <td class="text-center left-text">
        <a 
            href="/catalog/nakonechniki-gilzy-i-soediniteli/mednye-tm-l-jg-gm-l-/tm-mednyy-/nakonechnik-mednyy-t-2-5-4-2-6-zetarus/" 
            target="_blank"
        >Наконечник медный Т   2,5-4-2,6 ЗЭТАРУС</a>
*/

// достаём ссылку
url = "/catalog/nakonechniki-gilzy-i-soediniteli/mednye-tm-l-jg-gm-l-/tm-mednyy-/nakonechnik-mednyy-t-2-5-4-2-6-zetarus/"

// потом переход по ссылке
url = "https://nzeta.ru" + url

// работа с категориями

/*
<ul class="breadcrumb" id="navigation" itemscope="" itemtype="http://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_0">
        <a href="/" title="" itemprop="item">
            <span itemprop="name"><i class="fa fa-home"></i></span>
        </a>
        <meta itemprop="position" content="1">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_1">
        <a href="/catalog/" title="Каталог" itemprop="item">
            <span itemprop="name">Каталог</span>
        </a>
        <meta itemprop="position" content="2">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_2">
        <a href="/catalog/nakonechniki-gilzy-i-soediniteli/" title="Наконечники, гильзы и соединители" itemprop="item">
            <span itemprop="name">Наконечники, гильзы и соединители</span>
        </a>
        <meta itemprop="position" content="3">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_3">
        <a href="/catalog/nakonechniki-gilzy-i-soediniteli/mednye-tm-l-jg-gm-l-/" title="Медные наконечники и гильзы" itemprop="item">
            <span itemprop="name">Медные наконечники и гильзы</span>
        </a>
        <meta itemprop="position" content="4">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_4">
        <a href="/catalog/nakonechniki-gilzy-i-soediniteli/mednye-tm-l-jg-gm-l-/tm-mednyy-/" title="Т (медные)" itemprop="item">
            <span itemprop="name">Т (медные)</span>
        </a>
        <meta itemprop="position" content="5">
    </li>
    <li itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" id="bx_breadcrumb_5" class="active">
        <span itemprop="item"><span itemprop="name">Наконечник медный Т   2,5-4-2,6 ЗЭТАРУС под опрессовку</span></span>
        <meta itemprop="position" content="6">
    </li>
</ul>
*/









// работа с товарами 

/*
<div class="page-top-main">
                    <h1 id="pagetitle">Наконечник медный Т   2,5-4-2,6 ЗЭТАРУС под опрессовку</h1>
                </div>
*/

// достаём наименование
let name = "Наконечник медный Т   2,5-4-2,6 ЗЭТАРУС под опрессовку".trim()

