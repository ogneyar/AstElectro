const translit = require("../../translit")


module.exports = function getUrl(id, title = null) { 

    if ( ! id ) return "prochee"

    let url = null

    switch(id) {
        // Электроинструмент
        case 257: url = "otreznye-mashiny"; break
        case 4: url = "akkumulyatornyy-instrument_dreli"; break
        case 5: case 496: case 557: case 598: case 599: case 600: case 601: url = "shurupoverty"; break
        case 6: url = "otvertki"; break
        case 8: url = "gaykoverty"; break
        case 9: url = "pnevmoinstrument_gaykoverty"; break
        case 10: case 493: url = "setevoy-instrument_gaykoverty"; break
        case 12: url = "cirkulyarnye-pily"; break
        case 13: case 14: case 15: case 16: case 17: case 576: url = "setevoy-instrument_cirkulyarnye-pily"; break
        case 18: url = "dreli"; break
        case 20: url = "lobziki"; break
        case 21: case 22: case 562: url = "setevoy-instrument_lobziki"; break
        case 23: url = "ruchnoy-instrument_nozhnicy"; break
        case 25: url = "setevoy-instrument_otboynye-molotki"; break
        case 26: case 27: url = "setevoy-instrument_perforatory"; break
        case 28: url = "setevoy-instrument_rubanki"; break
        case 29: url = "setevoy-instrument_sabelnye-pily"; break
        case 31: url = "dreli"; break
        case 32: url = "setevoy-instrument_shurupoverty"; break
        case 536: url = "setevoy-instrument_miksery"; break
        case 537: case 558: url = "dreli"; break
        case 33: url = "setevoy-instrument_feny"; break
        case 580: case 581: case 582: url = "frezery"; break
        case 36: url = "setevoy-instrument_pryamoshlifovalnye-mashiny"; break
        case 37: url = "setevoy-instrument_ugloshlifovalnye-mashiny"; break
        case 38: url = "setevoy-instrument_pryamoshlifovalnye-mashiny"; break
        case 39: url = "setevoy-instrument_pryamoshlifovalnye-mashiny"; break
        case 40: url = "setevoy-instrument_polirovalnye-mashiny"; break
        case 41: case 42: case 43: case 572: case 577: url = "setevoy-instrument_pryamoshlifovalnye-mashiny"; break
        case 484: url = "kraskopulty"; break
        case 554: url = "setevoy-instrument_drugoe"; break
        case 591: url = "setevoy-instrument_zaklepochniki"; break
        case 592: url = "setevoy-instrument_steplery"; break
        case 594: case 595: url = "setevoy-instrument_kleevye-pistolety"; break
        case 596: url = "setevoy-instrument_drugoe"; break
        // Измерительная техника
        case 53: url = "drugaya-izmeritelnaya-tehnika"; break
        case 54: url = "rotacionnye-urovni"; break
        case 55: url = "uglomery-i-uklonomery"; break
        // Малая строительная техника
        case 494: url = "motopompy"; break
        case 495: url = "motopompy"; break
        case 485: url = "benzoinstrument_otreznye-mashiny"; break
        case 486: url = "setevoy-instrument_otreznye-mashiny"; break
        case 66: url = "stenoreznye-mashiny"; break
        // Пневмоинструмент
        case 68: url = "pnevmoinstrument_dreli"; break
        case 69: url = "pnevmoinstrument_zaklepochniki"; break
        case 71: url = "gvozdezabivateli-steplery"; break
        case 73: url = "pnevmoinstrument_pryamoshlifovalnye-mashiny"; break
        case 74: url = "pnevmoinstrument_otboynye-molotki"; break
        case 76: url = "gvozdezabivateli-steplery"; break
        case 77: url = "pnevmoinstrument_kraskopulty"; break
        case 78: url = "gvozdezabivateli-steplery"; break
        case 79: url = "pnevmoinstrument_shurupoverty"; break
        case 555: url = "pnevmoinstrument_gaykoverty"; break
        // Расходные материалы и оснастка
        case 742: url = "dlya-neylerov-i-steplerov"; break
        case 744: url = "dlya-pnevmokraskopultov"; break
        case 745: url = "dlya-pnevmokraskopultov"; break
        case 749: url = "prochaya-osnastka"; break
        case 767: url = "rashodnye-materialy"; break
        case 771: url = "prochie-aksessuary"; break
        case 772: url = "rashodnye-materialy"; break
        case 773: url = "rashodnye-materialy"; break
        case 136: url = "sredstva-zaschity"; break
        case 759: url = "patrony-i-klyuchi"; break
        case 760: url = "patrony-i-klyuchi"; break
        case 501: url = "akkumulyatory"; break
        case 590: url = "akkumulyatory"; break
        case 766: url = "akkumulyatory"; break
        case 638: url = "universalnye-zapasnye-chasti"; break
        case 667: url = "universalnye-zapasnye-chasti"; break
        case 556: url = "dlya-nasosov-i-nasosnyh-stanciy"; break
        case 602: url = "dlya-nasosov-i-nasosnyh-stanciy"; break
        case 618: url = "diski"; break
        case 111: url = "diski"; break
        case 622: url = "chashki"; break
        case 606: url = "chashki"; break
        case 628: url = "dlya-bolgarok-ushm_schetki"; break
        case 120: url = "dlya-bolgarok-ushm_schetki"; break
        // Для электроинструмента{669}
        case 611: url = "dlya-renovatorov-mfi"; break
        case 612: url = "dlya-renovatorov-mfi"; break
        case 613: url = "dlya-renovatorov-mfi"; break
        case 615: url = "dlya-ekscentrikovyh"; break
        case 616: url = "dlya-ekscentrikovyh"; break
        case 118: url = "shlifovalnye-krugi"; break
        case 664: url = "dlya-rubankov"; break
        case 665: url = "dlya-rubankov"; break
        case 670: url = "dlya-kraskopultov"; break
        case 671: url = "dlya-kraskopultov"; break
        case 662: url = "rashodnye-materialy-i-prinadlezhnosti_cirkulyarnye-pily"; break
        case 663: url = "dlya-diskovyh-pil"; break
        case 635: url = "koronki"; break
        case 100: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 101: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 102: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 586: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 637: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 646: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 647: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 648: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 649: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 650: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 788: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 652: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 653: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 654: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 655: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 657: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 658: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 123: url = "koronki"; break
        case 641: url = "koronki-i-pilnye-vency"; break
        case 642: url = "koronki-i-pilnye-vency"; break
        case 643: url = "koronki-i-pilnye-vency"; break
        case 639: url = "dlya-shurupovertov-i-dreley_patrony-i-klyuchi"; break
        case 640: url = "dlya-shurupovertov-i-dreley_patrony-i-klyuchi"; break
        case 129: url = "po-betonu"; break
        case 630: url = "po-betonu"; break
        case 130: url = "po-drevesine"; break
        case 631: url = "po-drevesine"; break
        case 131: url = "po-metallu"; break
        case 632: url = "po-metallu"; break
        case 132: url = "universalnye"; break
        case 634: url = "universalnye"; break
        case 633: url = "po-steklu-i-keramike"; break
        case 550: url = "akkumulyatory"; break
        case 636: url = "dlya-shurupovertov-i-dreley_schetki"; break
        case 892: url = "dlya-shurupovertov-i-dreley_stoyki"; break
        case 751: url = "rashodnye-materialy-i-prinadlezhnosti_cirkulyarnye-pily"; break
        case 752: url = "dlya-torcovochnyh-pil"; break
        // Для садовой техники{672}
        case 676: case 677: url = "kolesa-i-gruntozacepy"; break
        case 685: url = "oborudovanie-dlya-uborki-snega"; break
        case 705: case 706: url = "filtry-i-korpusy-k-filtram"; break
        // Для малой строительной техники{718}
        case 691: case 692: url = "dlya-motopomp"; break
        case 734: case 735: url = "dlya-zatirochnyh-i-shlifovalnyh-mashin"; break
        case 732: url = "dlya-dreley-almaznogo-bureniya_prochaya-osnastka"; break
        case 722: url = "dlya-benzorezov-i-shvonarezchikov_prochaya-osnastka"; break
        case 728: case 729: url = "dlya-glubinnyh-vibratorov"; break        
        // Ручной инструмент{138}
        case 832: case 833: case 834: case 835: case 836: url = "nozhovki"; break
        case 166: url = "ruchnoy-instrument_nozhnicy"; break
        case 827: case 828: case 829: case 830: case 831: url = "nozhi-i-multituly"; break
        case 813: case 814: case 815: case 816: case 817: case 818: url = "ruchnoy-instrument_razmetochnyy-instrument"; break
        case 795: case 796: url = "zaklepochniki-i-steplery"; break
        case 185: case 154: case 791: case 792: case 793: case 794: case 852: url = "dlya-shlifovaniya"; break
        case 802: url = "izmeritelnyy-instrument_mikrometry"; break
        case 797: case 798: case 799: url = "izolyacionnye-lenty"; break
        case 148: url = "klyuchi_nabory"; break
        case 149: url = "rozhkovye"; break
        case 150: url = "torcevye"; break
        case 765: url = "ruchnoy-instrument_torcevye-golovki"; break
        case 152: url = "trubnye"; break
        case 841: url = "kombinirovannye"; break
        case 842: url = "nakidnye"; break
        case 843: url = "razvodnye"; break
        case 844: url = "klyuchi_universalnye"; break
        case 804: case 805: case 806: case 807: url = "molotki"; break
        case 822: case 823: url = "fonari-i-osveschenie"; break
        case 157: case 158: case 159: case 160: case 161: case 162: case 808: url = "ruchnoy-instrument_otvertki"; break
        case 168: url = "ruchnoy-instrument_rubanki"; break
        case 809: case 810: case 811: case 812: url = "plitkorezy-i-steklorezy"; break
        case 839: url = "stameski"; break
        case 820: case 821: url = "udliniteli-i-vilki-silovye"; break
        case 179: url = "nabory-instrumentov"; break
        case 181: case 182: case 183: case 184: case 186: case 187: case 188: case 189: case 190: url = "sharnirno-gubcevyy-instrument"; break
        case 824: case 825: case 826: url = "yaschiki-i-keysy"; break        
        // Садовая техника{187}
        case 880: case 881: case 882: url = "snegouborschiki"; break
        case 190: case 191: case 192: url = "benzopily"; break
        case 194: case 195: case 539: case 588: url = "gazonogosilki"; break
        case 883: case 884: case 885: case 886: case 887: url = "kustorezy"; break
        case 785: case 786: case 787: url = "kultivatory"; break
        // насосы
        case 214: case 215: url = "poverhnostnye"; break
        case 217: case 218: case 219: case 220: url = "pogruzhnye"; break
        case 563: url = "vibracionnye"; break
        case 564: url = "drenazhnye"; break
        case 565: url = "samovsasyvayuschie"; break
        case 566: url = "skvazhinnye"; break
        case 567: url = "cirkulyacionnye"; break
        case 223: url = "opryskivateli-i-raspyliteli"; break
        // садовый инвентарь
        case 225: url = "grabli"; break
        case 889: case 890: case 891: url = "tachki-i-kolesa"; break
        case 660: url = "sadovyy-inventar_schetki"; break
        case 231: case 232: case 587: url = "trimmery"; break
        case 894: case 895: url = "elektropily"; break
        case 904: case 905: url = "skarifikatory-i-aeratory"; break
        // оборудование для полива
        case 859: case 860: url = "nasadki-dlya-poliva"; break
        case 862: case 863: case 864: case 865: case 866: case 867: url = "oborudovanie-dlya-poliva_fitingi"; break        
        // Силовая техника{234}
        case 238: url = "svarochnye"; break
        case 541: url = "gazovye"; break
        // Станки{252}
        case 253: url = "zatochnye"; break
        case 254: url = "stanki_lentochnye-pily"; break
        case 255: url = "metalloobrabatyvayuschie"; break
        case 256: url = "mnogofunkcionalnye"; break
        case 259: url = "sverlilnye"; break
        case 260: url = "stanki_torcovochnye-pily"; break
        case 261: url = "plitkorezy"; break
        case 503: url = "shlifovalnye"; break
        case 603: url = "frezernye"; break        
        // Уборка и клининг{262}
        case 263: url = "pylesosy"; break
        case 264: url = "vozduhoduvki"; break
        case 266: url = "promyshlennye-pylesosy"; break        
        case 548: url = "proizvodstvennaya-mebel_telezhki"; break
        
        // Уцененные товары{267}
        case 273: case 274: url = "izmeritelnyy-instrument"; break
        case 277: url = "stroitelnoe-oborudovanie_drugoe"; break
        case 278: url = "vibroreyki"; break
        case 279: url = "vibroplity"; break
        case 280: url = "zatirochnye-mashiny"; break
        case 283: url = "gvozdezabivateli-steplery"; break
        case 284: case 286: url = "pnevmoinstrument_drugoe"; break
        case 285: url = "pnevmoinstrument_otboynye-molotki"; break
        case 287: url = "raznye"; break
        case 288: url = "pnevmoinstrument_kraskopulty"; break
        case 290: url = "rashodnye-materialy-i-prinadlezhnosti_drugoe"; break
        case 295: url = "dlya-benzorezov-i-shvonarezchikov_prochaya-osnastka"; break
        case 298: url = "rezhuschie-diski-i-nozhi"; break
        case 299: url = "dlya-gazonokosilok-i-trimmerov_drugoe"; break
        case 301: case 302: case 303: case 307: case 312: url = "rashodnye-materialy-i-prinadlezhnosti_drugoe"; break
        case 305: url = "dlya-motoblokov-i-motokultivatorov_dvigateli"; break
        case 309: case 310: case 311: url = "dlya-perforatorov-i-otboynyh-molotkov"; break
        case 314: url = "zatochnye-komplekty-i-napilniki"; break
        case 316: url = "raznoe"; break
        case 320: case 321: case 322: case 323: case 324: case 325: case 326: case 327: case 328: case 329: url = "dlya-shlifovalnyh-mashin_raznoe"; break
        case 331: case 332: case 333: case 334: case 335: case 336: case 337: case 338: case 339: case 340: case 341: url = "dlya-shurupovertov-i-dreley_raznoe"; break
        case 343: url = "dlya-neylerov-i-steplerov"; break
        case 344: url = "masla-smazki-avtohimiya-aksessuary_raznoe"; break
        case 345: url = "sredstva-zaschity"; break
        case 346: url = "rashodnye-materialy-i-prinadlezhnosti_drugoe"; break

        // Уцененные товары - Ручной инструмент{347}
        case 348: url = "dlya-shlifovaniya"; break
        case 350: url = "izmeritelnyy-instrument_raznoe"; break
        case 351: url = "ruchnoy-instrument_razmetochnyy-instrument"; break
        case 355: url = "ruchnoy-instrument_drugoe"; break
        case 357: url = "klyuchi_nabory"; break
        case 358: case 361: url = "klyuchi_raznye"; break
        case 359: url = "torcevye"; break
        case 362: url = "molotki"; break
        case 364: url = "fonari-i-osveschenie"; break
        case 366: case 367: case 368: case 369: case 370: case 371: url = "ruchnoy-instrument_otvertki"; break
        case 373: case 374: case 375: case 376: url = "rezhuschiy-instrument"; break
        case 377: url = "ruchnoy-instrument_rubanki"; break
        case 379: url = "zaklepochniki-i-steplery"; break
        case 380: url = "montirovki-i-gvozdodery"; break
        case 382: case 383: url = "ruchnoy-instrument_drugoe"; break
        case 384: url = "plitkorezy-i-steklorezy"; break
        case 387: url = "udliniteli-i-vilki-silovye"; break
        case 388: url = "nabory-instrumentov"; break
        case 390: case 391: case 392: case 393: url = "sharnirno-gubcevyy-instrument"; break
        case 394: url = "ruchnoy-instrument_drugoe"; break
        case 395: url = "yaschiki-i-keysy"; break

        // Уцененные товары - Садовая техника{396}
        case 397: url = "moyki-vysokogo-davleniya"; break
        case 398: url = "sadovyy-instrument_drugoe"; break
        case 400: case 401: url = "gazonogosilki"; break
        case 406: url = "sekatory-i-suchkorezy"; break
        case 407: url = "sadovyy-instrument_drugoe"; break
        case 409: url = "kustorezy"; break
        case 410: url = "lestnicy_raznye"; break
        case 413: url = "kultivatory"; break
        case 414: case 415: case 419: url = "nasosy_raznye"; break
        case 417: url = "drenazhnye"; break
        case 418: url = "samovsasyvayuschie"; break
        case 420: url = "cirkulyacionnye"; break
        case 421: case 428: case 543: url = "sadovyy-instrument_drugoe"; break
        case 424: case 425: url = "trimmery"; break
        
        // Уцененные товары - Силовая техника{429}
        case 876: case 877: case 878: case 879: url = "vozduhonagrevateli"; break
        case 434: url = "svarochnye"; break
        case 437: case 438: url = "svarochnoe-oborudovanie_raznoe"; break
        case 441: url = "svarochnye-transformatory"; break
        
        // Уцененные товары - Станки{443}
        case 447: case 448: url = "stanki_raznye"; break
        case 449: url = "stanki_torcovochnye-pily"; break
        
        // Уцененные товары - Электроинструмент{452}
        case 453: url = "setevoy-instrument_cirkulyarnye-pily"; break
        case 455: case 456: case 457: url = "dreli"; break
        case 458: url = "setevoy-instrument_lobziki"; break
        case 459: url = "setevoy-instrument_nozhnicy"; break
        case 461: case 462: case 463: url = "setevoy-instrument_perforatory"; break
        case 464: url = "setevoy-instrument_drugoe"; break
        case 465: url = "setevoy-instrument_rubanki"; break
        case 466: url = "setevoy-instrument_sabelnye-pily"; break
        case 467: case 470: case 472: case 473: case 476: url = "setevoy-instrument_drugoe"; break
        case 471: url = "setevoy-instrument_ugloshlifovalnye-mashiny"; break
        case 474: url = "setevoy-instrument_polirovalnye-mashiny"; break
        case 475: url = "setevoy-instrument_pryamoshlifovalnye-mashiny"; break
        case 478: case 479: case 480: case 481: case 482: case 483: case 661: url = "setevoy-instrument_drugoe"; break

        
        default: break
    }

    if ( ! url && title ) url = translit(title)

    return url

}