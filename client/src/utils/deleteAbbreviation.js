
export default function deleteAbbreviation(string){

    return string
        .replace("-","")
        .replace("mlk","") // Milwaukee
        .replace("rgk","") // RGK
        .replace("hqv","") // Husqvarna
        .replace("kvt","") // KVT
        .replace("ged","") // Gedore
        .replace("tmk","") // TMK
        .replace("erb","") // Euroboor
        .replace("esa","") // 
        .replace("aeg","") // 
        .replace("adv","") // Advanta-M
		.replace("LT","")  // LeidTogi
		.replace("lt","")  // LeidTogi
		.replace("tor","") // Tor
		.replace("krs","") // Krause
		.replace("kdr","") // Kedr
		.replace("bcn","") // Bycon
		.replace("gfs","") // Gefest
        .trim()
}