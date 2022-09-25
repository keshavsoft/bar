class BillPrintCommonFuncs {
    static ShowLog = true;
    static CharsPerLine = 42;

    static PrintToPrinter = async () => {
        Neutralino.os.execCommand('billprint.bat').then(PromiseDataFromOs => {
            console.log(PromiseDataFromOs);
        });
    };

    static InvGrid = {
        jFLocalItemHeading: async () => {
            let jVarLocalReturnArray = [];
            let LocalCharsPerLine = this.CharsPerLine;

            jVarLocalReturnArray.push("-".repeat(LocalCharsPerLine));
            jVarLocalReturnArray.push("#".padEnd(3) + "Product".padEnd(22) + "Qty  Rate".padStart(6) + "Amount".padStart(8));
            jVarLocalReturnArray.push("-".repeat(LocalCharsPerLine));

            return jVarLocalReturnArray;
        },
        LoopItemsArray: async ({ inItemArray }) => {
            let jVarLocalStringNeeded;
            let jVarLocalReturnArray = [];
            let jVarLocalAmountArray;
            let jVarLocalTotalAmount;
            let jVarLocalPcsArray;
            let jVarLocalTotalPcs;
            let jVarLocalProductKey = "ProductName";
            let jVarLocalPriceKey = "Price";
            let jVarLocalQtyKey = "Qty";

            inItemArray.forEach((jVarLoopItem, LoopIndex) => {
                jVarLocalStringNeeded = "";

                jVarLocalStringNeeded += `${jVarLoopItem.ProductName.padStart(25)}`;

                jVarLocalStringNeeded = "";

                jVarLocalStringNeeded += LocalFuncCheckDataTypePadEnd({
                    inData: LoopIndex + 1,
                    inPadLength: 3
                });

                jVarLocalStringNeeded += LocalFuncCheckDataTypePadEnd({
                    inData: jVarLoopItem[jVarLocalProductKey],
                    inPadLength: 24
                });

                jVarLocalStringNeeded += LocalFuncCheckDataTypePadEnd({
                    inData: jVarLoopItem[jVarLocalQtyKey],
                    inPadLength: 5
                });

                jVarLocalStringNeeded += LocalFuncCheckDataTypePadEnd({
                    inData: jVarLoopItem[jVarLocalPriceKey],
                    inPadLength: 3
                });

                jVarLocalStringNeeded += LocalFuncCheckDataTypePadStart({
                    inData: jVarLoopItem[jVarLocalPriceKey] * jVarLoopItem[jVarLocalQtyKey],
                    inPadLength: 7
                });

                jVarLocalReturnArray.push(jVarLocalStringNeeded);
            });

            jVarLocalAmountArray = inItemArray.map(element => {
                return parseFloat(element[jVarLocalPriceKey] * element[jVarLocalQtyKey]);
            });

            jVarLocalTotalAmount = jVarLocalAmountArray.reduce(function (a, b) { return a + b; }, 0);
            jVarLocalPcsArray = inItemArray.map(element => {
                return parseFloat(element[jVarLocalQtyKey]);
            });
            jVarLocalTotalPcs = jVarLocalPcsArray.reduce(function (a, b) { return a + b; }, 0);

            jVarLocalReturnArray.push("=".repeat(42));
            jVarLocalReturnArray.push("Totals".padEnd(21) + `${jVarLocalTotalAmount.toString().padStart(21)}`);
            jVarLocalReturnArray.push("=".repeat(42));

            return jVarLocalReturnArray;
        }
    }

    static ShowEstimation = async () => {
        let jVarLocalFilePath = `./Bill.txt`;
        //let LocalEstimationData = fs.readFileSync(`${__dirname}\\e1.txt`, "utf8");
        let LocalEstimationData = await Neutralino.filesystem.readFile(jVarLocalFilePath);

        return LocalEstimationData;
    };

    static jFHeadDetails = async ({ inHeadData }) => {
        const { DayNumber, Date, Member } = inHeadData;
        let jVarLocalReturnArray = [];
        let LocalCharsPerLine = this.CharsPerLine;

        jVarLocalReturnArray.push("-".repeat(LocalCharsPerLine));
        jVarLocalReturnArray.push(`No.: ${DayNumber}${" ".repeat(20)}Date: ${Date}`);
        jVarLocalReturnArray.push((`Member: ${Member}`).padEnd(LocalCharsPerLine));

        return jVarLocalReturnArray;
    };

    static ForReprint = {
        FirmHeading: async () => {
            let LocalFirmDetails = await BillPrintCommonFuncs.FirmDetailsFuncs.jFGetFirmDetails();
            let jVarLocalReturnArray = [];

            jVarLocalReturnArray.push(LocalFirmDetails.FirmName);
            jVarLocalReturnArray.push(LocalFirmDetails.Address);
            jVarLocalReturnArray.push(LocalFirmDetails.City);
            jVarLocalReturnArray.push("----------Duplicate----------");

            return jVarLocalReturnArray;
        },
        jFHeadDetails: async ({ inHeadData }) => {
            const { PK, Date, Member } = inHeadData;
            let jVarLocalReturnArray = [];
            let LocalCharsPerLine = this.CharsPerLine;

            jVarLocalReturnArray.push("-".repeat(LocalCharsPerLine));
            jVarLocalReturnArray.push(`No.: ${PK}${" ".repeat(18)}Date: ${Date}`);
            jVarLocalReturnArray.push((`Member: ${Member}`).padEnd(LocalCharsPerLine));

            return jVarLocalReturnArray;
        }
    };

    static PrepareTextFileFromArray = async ({ inDataArray, inCharactersPerLine }) => {
        if (inCharactersPerLine > 0 && inCharactersPerLine <= 50) {
            let LocalEstimationFileData = "";

            inDataArray.forEach(element => {
                LocalEstimationFileData += element.padStart(element.length + (inCharactersPerLine - (2 * Math.round(element.length / 2))) / 2, " ") + "\n";
            });

            let responseWriteFile = await Neutralino.filesystem.writeFile(
                './Bill.txt', LocalEstimationFileData
            );

            return responseWriteFile;
        } else {
            return "Invalid inCharactersPerLine";
        }
    };

    static CutterInsert = async () => {
        let jVarLocalReturnArray = [];
        jVarLocalReturnArray.push("");
        jVarLocalReturnArray.push("");
        jVarLocalReturnArray.push("");
        jVarLocalReturnArray.push("");
        jVarLocalReturnArray.push(String.fromCharCode(27) + "@" + String.fromCharCode(29) + "V1");
        jVarLocalReturnArray.push("");

        return jVarLocalReturnArray;
    };

    static jFPreparePrintFile = async (inPk) => {
        try {
            let jVarLocalReturnArray = await LocalFirmHeading();
            let jVarLocalEstimationData;
            let LocalSalesData = await CommonFuncs.Api.Transactions.Sales.FPullData();
            let LocalSalesItemsData = await CommonFuncs.Api.Transactions.SalesItems.PullData();
            let LocalSalesItemsDataNeeded = Object.values(LocalSalesItemsData).filter(element => {
                return element.FK === inPk;
            });

            let LocalSalesDataAsJson = JSON.parse(LocalSalesData);
            let LocalDataNeeded = LocalSalesDataAsJson.Sales[inPk];
            //return LocalDataAsJson.Sales;
            jVarLocalReturnArray.push(... await this.jFHeadDetails({ inHeadData: LocalDataNeeded }));
            jVarLocalReturnArray.push(... await this.InvGrid.jFLocalItemHeading());
            //            console.log("LocalDataNeeded : ", LocalDataNeeded);
            jVarLocalReturnArray.push(... await this.InvGrid.LoopItemsArray({ inItemArray: LocalSalesItemsDataNeeded }));

            // jVarLocalReturnArray.push(... await TermsInsert());

            jVarLocalReturnArray.push(... await this.CutterInsert());
            console.log("jVarLocalReturnArray : ", jVarLocalReturnArray);

            await this.PrepareTextFileFromArray({ inDataArray: jVarLocalReturnArray, inCharactersPerLine: 42 });

            jVarLocalEstimationData = await this.ShowEstimation();

            document.getElementById("EstimationParagraph").innerText = jVarLocalEstimationData.replace(/(?:\r\n)/g, "\n");
            await this.PrintToPrinter();
        } catch (error) {
            if (this.ShowLog) {
                console.log("error  : ", error);
            };
        };
    };

    static PrintOriginalBill = async (inPk) => {
        try {
            let jVarLocalReturnArray = await LocalFirmHeading();
            let LocalSalesData = await CommonFuncs.Api.Transactions.Sales.FPullData();
            let LocalSalesItemsData = await CommonFuncs.Api.Transactions.SalesItems.PullData();
            let LocalSalesItemsDataNeeded = Object.values(LocalSalesItemsData).filter(element => {
                return element.FK === inPk;
            });

            let LocalSalesDataAsJson = JSON.parse(LocalSalesData);
            let LocalDataNeeded = LocalSalesDataAsJson.Sales[inPk];
            jVarLocalReturnArray.push(... await this.jFHeadDetails({ inHeadData: LocalDataNeeded }));
            jVarLocalReturnArray.push(... await this.InvGrid.jFLocalItemHeading());
            jVarLocalReturnArray.push(... await this.InvGrid.LoopItemsArray({ inItemArray: LocalSalesItemsDataNeeded }));

            // jVarLocalReturnArray.push(... await TermsInsert());

            jVarLocalReturnArray.push(... await this.CutterInsert());

            await this.PrepareTextFileFromArray({ inDataArray: jVarLocalReturnArray, inCharactersPerLine: 42 });
            await this.PrintToPrinter();

        } catch (error) {
            if (this.ShowLog) {
                console.log("error  : ", error);
            };
        };
    };

    static PrintOriginalBillWithDuplicate = async (inPk) => {
        try {
            let jVarLocalReturnArray = await LocalFirmHeading();
            let LocalSalesData = await CommonFuncs.Api.Transactions.Sales.FPullData();
            let LocalSalesItemsData = await CommonFuncs.Api.Transactions.SalesItems.PullData();
            let LocalSalesItemsDataNeeded = Object.values(LocalSalesItemsData).filter(element => {
                return element.FK === inPk;
            });

            let LocalSalesDataAsJson = JSON.parse(LocalSalesData);
            let LocalDataNeeded = LocalSalesDataAsJson.Sales[inPk];
            LocalDataNeeded = this.PrintDataFuncs.DateChange({ inHeadData: LocalDataNeeded });

            //orignial bill
            jVarLocalReturnArray.push(... await this.jFHeadDetails({ inHeadData: LocalDataNeeded }));
            jVarLocalReturnArray.push(... await this.InvGrid.jFLocalItemHeading());
            jVarLocalReturnArray.push(... await this.InvGrid.LoopItemsArray({ inItemArray: LocalSalesItemsDataNeeded }));
            jVarLocalReturnArray.push(... await this.CutterInsert());

            jVarLocalReturnArray.push(...await this.ForReprint.FirmHeading());
            //duplicate bill
            jVarLocalReturnArray.push(... await this.jFHeadDetails({ inHeadData: LocalDataNeeded }));
            jVarLocalReturnArray.push(... await this.InvGrid.jFLocalItemHeading());
            jVarLocalReturnArray.push(... await this.InvGrid.LoopItemsArray({ inItemArray: LocalSalesItemsDataNeeded }));
            jVarLocalReturnArray.push(... await this.CutterInsert());

            await this.PrepareTextFileFromArray({ inDataArray: jVarLocalReturnArray, inCharactersPerLine: 42 });

            await this.PrintToPrinter();
        } catch (error) {
            if (this.ShowLog) {
                console.log("error  : ", error);
            };
        };
    };

    static ShowEstimationOnScreen = async () => {
        let jVarLocalEstimationData;
        let jVarLocalEstimationParagraph = document.getElementById("EstimationParagraph");

        jVarLocalEstimationData = await this.ShowEstimation();

        if (jVarLocalEstimationParagraph !== null) {
            jVarLocalEstimationParagraph.innerText = jVarLocalEstimationData.replace(/(?:\r\n)/g, "\n");
        };

    };

    static PrintDataFuncs = {
        DateChange: ({ inHeadData }) => {
            let jVarLocalReturnData = JSON.parse(JSON.stringify(inHeadData));

            if ("Date" in jVarLocalReturnData) {
                jVarLocalReturnData.Date = jFCommonFuncsClass.DateFuncs.ddMMyyyy({ inDate: jVarLocalReturnData.Date });
            };
            console.log("jVarLocalReturnData : ", jVarLocalReturnData);
            return jVarLocalReturnData;
        }
    };

    static RePrint = async (inPk) => {
        try {
            let jVarLocalReturnArray = await this.ForReprint.FirmHeading();

            let LocalSalesData = await CommonFuncs.Api.Transactions.Sales.FPullData();
            let LocalSalesItemsData = await CommonFuncs.Api.Transactions.SalesItems.PullData();
            let LocalSalesItemsDataNeeded = Object.values(LocalSalesItemsData).filter(element => {
                return element.FK === inPk;
            });

            let LocalSalesDataAsJson = JSON.parse(LocalSalesData);
            let LocalDataNeeded = LocalSalesDataAsJson.Sales[inPk];
            LocalDataNeeded = this.PrintDataFuncs.DateChange({ inHeadData: LocalDataNeeded });

            jVarLocalReturnArray.push(... await this.jFHeadDetails({ inHeadData: LocalDataNeeded }));
            jVarLocalReturnArray.push(... await this.InvGrid.jFLocalItemHeading());
            jVarLocalReturnArray.push(... await this.InvGrid.LoopItemsArray({ inItemArray: LocalSalesItemsDataNeeded }));
            jVarLocalReturnArray.push(... await this.CutterInsert());

            await this.PrepareTextFileFromArray({ inDataArray: jVarLocalReturnArray, inCharactersPerLine: 42 });
            await this.ShowEstimationOnScreen();

            await this.PrintToPrinter();
        } catch (error) {
            if (this.ShowLog) {
                console.log("error  : ", error);
            };
        };
    };

    static FirmDetailsFuncs = {
        jFGetFirmDetails: async () => {
            let jVarLocalReturnData;
            let jVarLocalFilePath = `./${NL_ApplicationPath}/Kprivate/DataPath.json`;

            try {
                let data = await Neutralino.filesystem.readFile(jVarLocalFilePath);

                jVarLocalReturnData = JSON.parse(data).FirmDetails;
            } catch (error) {
                if (this.ShowLog) {
                    console.log("jFGetFirmDetails error :", error);
                };
            };

            return await jVarLocalReturnData;
        }
    };
};

let LocalFuncCheckDataTypePadEnd = ({ inData, inPadLength }) => {
    let jVarLocalStringNeeded = "";

    if (typeof inData === "number") {
        jVarLocalStringNeeded = `${inData.toString().padEnd(inPadLength)}`;
    } else {
        jVarLocalStringNeeded = `${inData.padEnd(inPadLength)}`;
    };

    return jVarLocalStringNeeded;
};

let LocalFuncCheckDataTypePadStart = ({ inData, inPadLength }) => {
    let jVarLocalStringNeeded = "";

    if (typeof inData === "number") {
        jVarLocalStringNeeded = `${inData.toString().padStart(inPadLength)}`;
    } else {
        jVarLocalStringNeeded = `${inData.padStart(inPadLength)}`;
    };

    return jVarLocalStringNeeded;
};

let TermsInsert = async () => {
    let jVarLocalReturnArray = [];
    jVarLocalReturnArray.push("Terms & Conditions:".padEnd(42));
    jVarLocalReturnArray.push("1.Goods once sold will not be taken back".padEnd(42));
    jVarLocalReturnArray.push("  or exchanged.".padEnd(42));
    jVarLocalReturnArray.push("2.E & O.E".padEnd(42));
    jVarLocalReturnArray.push("3.No guarantee for colours on Jari.".padEnd(42));
    jVarLocalReturnArray.push("");
    jVarLocalReturnArray.push("");
    jVarLocalReturnArray.push("");
    jVarLocalReturnArray.push("");

    return jVarLocalReturnArray;
};

let LocalFirmHeading = async () => {
    let LocalFirmDetails = await BillPrintCommonFuncs.FirmDetailsFuncs.jFGetFirmDetails();
    let jVarLocalReturnArray = [];

    //  jVarLocalReturnArray.push(`${String.fromCharCode(27)}E${LocalFirmDetails.FirmName}${String.fromCharCode(27)}F`);
    jVarLocalReturnArray.push(`${String.fromCharCode(27)}E1${LocalFirmDetails.FirmName}`);
    jVarLocalReturnArray.push(LocalFirmDetails.Address);
    jVarLocalReturnArray.push(LocalFirmDetails.City);

    return jVarLocalReturnArray;
};
