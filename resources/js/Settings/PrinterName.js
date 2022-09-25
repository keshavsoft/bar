let jFGetPrintersWithNamesFromNwJs = () => {
    let jVarLocalReturnArray = [];
    var win = nw.Window.get();
    console.log(win);
    win.getPrinters(data => {
        jVarLocalReturnArray.push(data);
        //console.log(data);
    });

    return jVarLocalReturnArray;
};

let jFGetPrinters = async () => {
    let LocalPrinterNamesArray = await GetPrintersWithNames();
    jFPrepareDataList({ inDataArray: LocalPrinterNamesArray });

    //console.log("LocalPrinterNamesArray : ", LocalPrinterNamesArray);
};

let jFGetPrinterName = () => {
    let LocalPrinterName = GetPrinterName();
    //jFPrepareDataList({ inDataArray: LocalPrinterNamesArray });
    document.getElementById("PrinterNameId").value = LocalPrinterName;
    //console.log("LocalPrinterNamesArray : ", LocalPrinterNamesArray);
};

let jFSetPrinterName = () => {
    let LocalPrinterName = document.getElementById("PrinterNameId").value;
    SetPrinterName({ inPrinterName: LocalPrinterName });
    //jFPrepareDataList({ inDataArray: LocalPrinterNamesArray });

    //console.log("LocalPrinterNamesArray : ", LocalPrinterNamesArray);
};

let jFPrepareDataList = ({ inDataArray }) => {
    let jVarLocaldataListPrinters = document.getElementById("dataListPrinters");
    let jVarLocalOption;

    inDataArray.forEach(element => {
        jVarLocalOption = document.createElement("option");
        jVarLocalOption.setAttribute("value", element);
        console.log("jVarLocalOption : ", jVarLocalOption);
        jVarLocaldataListPrinters.appendChild(jVarLocalOption);
    });
};

//jFGetPrinters();
//jFGetPrinterName();
