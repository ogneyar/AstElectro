
// getChapters
const getChapters = (props) => {
    return (
<>
    <span className="pt-3 pb-3">Выберите подраздел</span>
    <div 
        className="ParserPage_box_div"
        onClick={() => {}}
    >
        <span onClick={() => props.setChapter("gpo")}>
            <input name="chapter" type="radio" value="gpo" checked={props.chapter==="gpo"} />
            <span>ГПО</span>
        </span>
        <span onClick={() => props.setChapter("kolesa")}>
            <input name="chapter" type="radio" value="kolesa" checked={props.chapter==="kolesa"} />
            <span>Колёса</span>
        </span>
        <span onClick={() => props.setChapter("sklad")}>
            <input name="chapter" type="radio" value="sklad" checked={props.chapter==="sklad"} />
            <span>Склад</span>
        </span>
        <span onClick={() => props.setChapter("stroyka")}>
            <input name="chapter" type="radio" value="stroyka" checked={props.chapter==="stroyka"} />
            <span>Стройка</span>
        </span>
    </div> 
    <hr />
</>
    )
}


export default getChapters