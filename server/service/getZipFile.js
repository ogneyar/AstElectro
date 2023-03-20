//
const zl = require("zip-lib");

module.exports = function (file, zip) {

    zl.archiveFile(file, zip)
        .then(() => {
            console.log("done")
        }, function (err) {
            console.log(err)
        }   
    )

    return true

}
