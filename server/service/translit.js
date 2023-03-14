
function translit(word){ 
	var converter = {
		'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
		'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
		'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
		'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
		'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
		'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
		'э': 'e',    'ю': 'yu',   'я': 'ya'
	};
 
	word = word.toLowerCase();
  
	var answer = '';
	for (var i = 0; i < word.length; ++i ) {
		if (converter[word[i]] === undefined){
			answer += word[i];
		} else {
			answer += converter[word[i]];
		}
	}
  
	answer = answer.replace(/[^-0-9a-z]/g, '-');
	answer = answer.replace(/[-]+/g, '-');
	// eslint-disable-next-line
	answer = answer.replace(/^\-|-$/g, ''); 
	return answer;
    
}

module.exports = translit