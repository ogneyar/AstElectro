{

// ----------------------------------------------------------------------------
// items
	
// http://localhost:5000/api/parser/nzeta?method=items&artikul=zeta10710

[{
	"id":"10393",
	"name":"Т  2,5-4-2,6 (уп.100/1500/9000 шт) ЗЭТАРУС",
	"guid":"4fd738b2-9bbf-11db-acf6-001485e6b57c",
	"parentguid":"119b2774-9fb2-11db-acf6-001485e6b57c",
	"artikul":"zeta10710",
	"category":"Z (Заказ под заказ)",
	"TNVED":"8535900008",
	"sertRequired":"1",
	"volumeNumerator":"0.403",
	"volumeDenominator":"1000000.000",
	"weightNumerator":"0.003",
	"weightDenominator":"1.000",
	"edIzm":"шт",
	"volumeEdIzm":"кг",
	"inPrice":"1",
	"barcode":""
}]


// ----------------------------------------------------------------------------
// structure

// s_id = guid из метода "items"
// http://localhost:5000/api/parser/nzeta?method=structure&s_id=4fd738b2-9bbf-11db-acf6-001485e6b57c

[{
	"id":"5277",
	"s_id":"4fd738b2-9bbf-11db-acf6-001485e6b57c",
	"p_id":"109",
	"name":"Т  2,5-4-2,6 (уп.100/1500/9000 шт) ЗЭТАРУС",
	"site":"2"
}]


// ----------------------------------------------------------------------------
// properties_group

// cat_id = parentguid из метода "items"
// http://localhost:5000/api/parser/nzeta?method=properties_group&cat_id=119b2774-9fb2-11db-acf6-001485e6b57c

[{
	"id":"13",
	"parent":"0",
	"nas":"0",
	"cat_id":`[
		"a805e685-1aaf-11df-911a-001a9238f1db",
		"119b2774-9fb2-11db-acf6-001485e6b57c",
		"0023ea0c-5433-11e8-827f-001e67657cbf",
		"119b2766-9fb2-11db-acf6-001485e6b57c",
		"58d94c4b-39bb-11eb-ba8c-ac1f6b74a363"
	]`,
	"name":"Наконечники и гильзы под опрессовку"
}]


// ----------------------------------------------------------------------------
// properties

// g_id = id из "properties_group", но site = 1 !!!!!
// http://localhost:5000/api/parser/nzeta?method=properties&g_id=13&site=1&limit=2

[
	{"id":"22","act":"1","g_id":"[\"1\",\"2\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\"]","name":"Вид изделия","type":"2","p_type":"5","mask":"0","site":"1","code":"VID_IZDELIYA_1","sort":"0"},
	{"id":"47","act":"1","g_id":"[\"1\",\"2\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"13\"]","name":"Код ОКП","type":"2","p_type":"5","mask":"0","site":"1","code":"KOD_OKP","sort":"6"}
]



// ----------------------------------------------------------------------------
// properties_values для type = 2 (списочный тип свойств)

// p_id = id из "properties"
// http://localhost:5000/api/parser/nzeta?method=properties_values&site=2&item_id&p_id=22&limit=2

[
	{"id":"83","p_id":"22","parents":"0","val":"Наконечник болтовой\r"},
	{"id":"134","p_id":"22","parents":"0","val":"Наконечник под пайку лужёный\r"},
	{"id":"135","p_id":"22","parents":"0","val":""},
	{"id":"136","p_id":"22","parents":"0","val":"Наконечник медный лужёный\r"},
	{"id":"137","p_id":"22","parents":"0","val":"Наконечник медный\r"}
]

// ----------------------------------------------------------------------------
// properties_items

// что за item_id????
// что за p_id????
// http://localhost:5000/api/parser/nzeta?method=properties_items&site=2&item_id&p_id=137

[
	{"id":"83241","item_id":"886ab620-4e14-11e1-b92b-984be16c89d8","p_id":"137","val":"0eDlf3elgdE","val1":"","val2":""},
	{"id":"102549","item_id":"29471720-7ee7-11e6-81f7-001e67657cbf","p_id":"137","val":"2d-f-ZvDf78","val1":"","val2":""}
]

// ----------------------------------------------------------------------------
// items_description

// как мне найти описание для "id":"5277"??????
// http://localhost:5000/api/parser/nzeta?method=items_description&d_id=5277

[{}]


// ----------------------------------------------------------------------------
// structure

// http://localhost:5000/api/parser/nzeta?method=structure&s_id=109

[
	{"id":"5263", "s_id":"109","p_id":"103","name":"Т (медные)","site":"2"},
	{"id":"5471", "s_id":"109","p_id":"102","name":"Концевые","site":"2"},
	{"id":"5640", "s_id":"109","p_id":"101","name":"Муфты 3,4,5 ПСТ-1","site":"2"},
	{"id":"5779", "s_id":"109","p_id":"106","name":"Муфты 1 ПКВТ-10","site":"2"},
	{"id":"10265","s_id":"109","p_id":"103","name":"Держатель шин заземления К188У2","site":"2"}
]

// ----------------------------------------------------------------------------
// structure_description

// d_id = id из метода "structure"
// http://localhost:5000/api/parser/nzeta?method=structure_description&d_id=5263

[{
	"id":"152",
	"d_id":"5263",
	"descr":
		`<ul class="features">\r\n\t
			<li>Соответствуют требованиям ГОСТ 7386-80</li>\r\n\t
			<li>Изготовлены из меди М2</li>\r\n
		</ul>\r\n
		<p class="bodytext">\r\n 
			<b>Наконечники кабельные медные Т</b> используются для оконцевания проводов и кабелей с медными жилами сечением от 4 до 240 мм² и применяются для кабелей напряжением до 35 кВ. Наконечники закрепляются на жилах опрессовкой.\r\n
		</p>\r\n
		<p class="bodytext">\r\n\t 
			Наконечники Т изготавливаются из медной трубы марки М2. Наконечник одевается на жилу кабеля и опрессовывается гидравлическим или ручным прессом. Такой метод жестко скрепляет наконечник и жилу кабеля, обеспечивая надежный контакт.\r\n
		</p>\r\n
		<p>\r\n\t
			<img width="100%" src="https://nzeta.ru/upload/medialibrary/0d7/0d7ac5533768b04967414a15255f7685.jpg">\r\n
		</p>`
}]



}





























/*

[{"id":"5263","s_id":"109","p_id":"103","name":"Т (медные)","site":"2"}]

[{"id":"10246","s_id":"103","p_id":"101","name":"Медные наконечники и гильзы","site":"2"}]

[{"id":"5201","s_id":"101","p_id":"0","name":"Наконечники, гильзы и соединители","site":"2"}]

*/

