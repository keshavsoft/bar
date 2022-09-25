// let exec = require("child_process");
// const fs = require('fs');

//let CommonpackagePath = JSON.parse(fs.readFileSync(`${__dirname}/package.json`));

let GetPrintersWithNames = async () => {
    let LocalExecOutput = exec.execSync("wmic printer get ShareName");
    let LocalPrinterNamesArray = LocalExecOutput.toString().split("\r\r\n");
    LocalPrinterNamesArray = LocalPrinterNamesArray.map(LoopItem => LoopItem.trim());
    LocalUniqueArray = [...new Set(LocalPrinterNamesArray)];
    LocalUniqueArray.shift();

    return LocalUniqueArray;
};

let GetPrinterName = () => {
    let LocalFirmDetailsData = fs.readFileSync(`${CommonpackagePath.KeshavSoft.DataPath}\\FirmDetails.json`)
    let LocalFirmDetailsJson = JSON.parse(LocalFirmDetailsData.toString());

    return LocalFirmDetailsJson.Config.PrinterSharedName;
};

let SetPrinterName = ({ inPrinterName }) => {
    let LocalFirmDetailsData = fs.readFileSync(`${CommonpackagePath.KeshavSoft.DataPath}\\FirmDetails.json`)
    let LocalFirmDetailsJson = JSON.parse(LocalFirmDetailsData.toString());
    LocalFirmDetailsJson.Config.PrinterSharedName = inPrinterName;
    
    return fs.writeFileSync(`${CommonpackagePath.KeshavSoft.DataPath}\\FirmDetails.json`, JSON.stringify(LocalFirmDetailsJson));
};



