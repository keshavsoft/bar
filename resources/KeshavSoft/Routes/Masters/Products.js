let CommonDataPk = 1008;
let CommonDataPath = "KeshavSoft/KData/JSON/1008/Data/Masters/Items.json";
let CommonDataFolderPath = "KeshavSoft/KData/JSON/1008/Data";
let CommonDataAdminPath = "KeshavSoft/KData/JSON/Login";

class CommonFuncs {
    static ShowLog = true;

    static Api = {
        Masters: {
            Products: {
                PullData: async () => {
                    try {
                        let LocalFolderName = this.Api.Masters.Products.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Masters.Products.JsonConfig.FileName;
                        let LocalItemName = this.Api.Masters.Products.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        return await data;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                FPushData: async ({ inDataToInsert }) => {
                    try {
                        let LocalFolderName = this.Api.Masters.Products.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Masters.Products.JsonConfig.FileName;
                        let LocalItemName = this.Api.Masters.Products.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];
                        let LocalNewPk = GeneratePk({ inDataWithKey: LocalDataWithItemName });
                        LocalDataWithItemName[LocalNewPk] = inDataToInsert;

                        let data1 = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));

                        return await data1;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                UpdateData: async ({ inDataToUpdate }) => {
                    try {
                        let LocalFolderName = this.Api.Masters.Products.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Masters.Products.JsonConfig.FileName;
                        let LocalItemName = this.Api.Masters.Products.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];
                        let LocalUpdatedData = {};

                        LocalUpdatedData = {};
                        LocalUpdatedData[LocalItemName] = { ...LocalDataWithItemName, ...inDataToUpdate };

                        let LocalToUpdateData = { ...LocalDataAsJson, ...LocalUpdatedData };
                        //LocalDataWithItemName[LocalNewPk] = inDataToInsert;
                        console.log("LocalDataWithItemName : ", LocalDataAsJson, LocalToUpdateData);
                        let data1 = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalToUpdateData));

                        return await data1;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                JsonConfig: {
                    FolderName: "Masters",
                    FileName: "Items.json",
                    ItemName: "Products"
                }
            },
            Members: {
                PullData: async () => {
                    try {
                        let LocalFolderName = this.Api.Masters.Members.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Masters.Members.JsonConfig.FileName;
                        let LocalItemName = this.Api.Masters.Members.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        return await data;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                FPushData: async ({ inDataToInsert }) => {
                    try {
                        let LocalFolderName = this.Api.Masters.Members.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Masters.Members.JsonConfig.FileName;
                        let LocalItemName = this.Api.Masters.Members.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];
                        let LocalNewPk = GeneratePk({ inDataWithKey: LocalDataWithItemName });
                        LocalDataWithItemName[LocalNewPk] = inDataToInsert;

                        let data1 = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));

                        return await data1;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                JsonConfig: {
                    FolderName: "Masters",
                    FileName: "Members.json",
                    ItemName: "Members"
                }
            }
        },
        Transactions: {
            Sales: {
                FPullData: async () => {
                    try {
                        let LocalFolderName = this.Api.Transactions.Sales.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Sales.JsonConfig.FileName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        return await data;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                FPushData: async ({ inDataToInsert }) => {
                    try {
                        let LocalReturnObject;
                        let LocalFolderName = this.Api.Transactions.Sales.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Sales.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Sales.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];
                        let LocalNewPk = GeneratePk({ inDataWithKey: LocalDataWithItemName });

                        inDataToInsert.PK = LocalNewPk;
                        LocalDataWithItemName[LocalNewPk] = inDataToInsert;

                        LocalReturnObject = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));
                        LocalReturnObject.KResult = inDataToInsert;

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                PushDataWithDayNumber: async ({ inDataToInsert }) => {
                    try {
                        let LocalReturnObject;
                        //let LocalNewDataToInsert = this.Api.Transactions.Sales.CommonFuncs.GenerateBillNumber.ForDaySeries({ inDataWithItemName, inDate });
                        let LocalFolderName = this.Api.Transactions.Sales.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Sales.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Sales.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];

                        let LocalNewPk = GeneratePk({ inDataWithKey: LocalDataWithItemName });

                        let LocalDayNumber = this.Api.Transactions.Sales.CommonFuncs.GenerateBillNumber.ForDaySeries({ inDataWithItemName: LocalDataWithItemName, inDate: inDataToInsert.Date });

                        if (LocalDayNumber > 0) {
                            inDataToInsert.DayNumber = LocalDayNumber
                        };

                        inDataToInsert.PK = LocalNewPk;
                        LocalDataWithItemName[LocalNewPk] = inDataToInsert;

                        LocalReturnObject = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));
                        LocalReturnObject.KResult = inDataToInsert;

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                Update: async ({ inDataToUpdate, inPk }) => {
                    try {
                        let LocalReturnObject;
                        let LocalDataToUpdate;
                        let LocalFolderName = this.Api.Transactions.Sales.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Sales.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Sales.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];

                        LocalDataToUpdate = { ...LocalDataWithItemName[inPk], ...inDataToUpdate };

                        LocalDataWithItemName[inPk] = LocalDataToUpdate;

                        LocalReturnObject = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                MaxDate: async () => {
                    try {
                        let LocalFolderName = this.Api.Transactions.Sales.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Sales.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Sales.JsonConfig.ItemName;
                        let LocalDateArray;
                        let LocalMaxDate;
                        let LocalReturnData;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        LocalDateArray = Object.values(JSON.parse(data)[LocalItemName]).map(element => {
                            return new Date(element.Date);
                        });

                        if (LocalDateArray.length > 0) {
                            LocalMaxDate = new Date(Math.max.apply(null, LocalDateArray));
                            LocalReturnData = this.DateFuncs.yyyyMMdd({ inDate: LocalMaxDate })
                        } else {
                            LocalReturnData = undefined;
                        }

                        return await LocalReturnData;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                CommonFuncs: {
                    GenerateBillNumber: {
                        ForDaySeries: ({ inDataWithItemName, inDate }) => {
                            let LocalReturnNumer;
                            let LocalFilteredData = Object.values(inDataWithItemName).filter(element => {
                                return element.Date === inDate;
                            });
                            let LocalDayNumberArray;

                            if (LocalFilteredData.length === 0) {
                                LocalReturnNumer = 1;
                            } else {
                                LocalDayNumberArray = LocalFilteredData.map(element => "DayNumber" in element ? element.DayNumber : 0);

                                LocalReturnNumer = Math.max(...LocalDayNumberArray) + 1
                            }

                            return LocalReturnNumer;
                        }
                    }
                },
                JsonConfig: {
                    FolderName: "Transactions",
                    FileName: "Sales.json",
                    ItemName: "Sales"
                }
            },
            SalesItems: {
                Delete: async ({ inRowPk }) => {
                    try {
                        let LocalReturnObject;
                        let LocalFolderName = this.Api.Transactions.SalesItems.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.SalesItems.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.SalesItems.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];

                        delete LocalDataWithItemName[inRowPk];

                        LocalReturnObject = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                PullData: async () => {
                    try {
                        let LocalFolderName = this.Api.Transactions.SalesItems.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.SalesItems.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.SalesItems.JsonConfig.ItemName;
                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        return await JSON.parse(data)[LocalItemName];
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                FPushData: async ({ inDataToInsert }) => {
                    try {
                        let LocalReturnObject;
                        let LocalObjectToInsert = {};

                        let LocalFolderName = this.Api.Transactions.SalesItems.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.SalesItems.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Sales.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];

                        let LocalNewPk = GeneratePk({ inDataWithKey: LocalDataWithItemName });
                        LocalObjectToInsert[LocalNewPk] = inDataToInsert;
                        LocalDataWithItemName = { ...LocalDataWithItemName, ...LocalObjectToInsert };

                        LocalDataAsJson[LocalItemName] = LocalDataWithItemName;
                        LocalReturnObject = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));
                        LocalReturnObject.KResult = LocalObjectToInsert;

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                JsonConfig: {
                    FolderName: "Transactions",
                    FileName: "SalesItems.json",
                    ItemName: "Sales"
                }
            },
            Inwards: {
                PullData: async () => {
                    try {
                        let LocalFolderName = this.Api.Transactions.Inwards.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Inwards.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Inwards.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        return await data;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                PushData: async ({ inDataToInsert }) => {
                    try {
                        let LocalReturnObject;
                        let LocalFolderName = this.Api.Transactions.Inwards.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Inwards.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Inwards.JsonConfig.ItemName;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalDataAsJson = JSON.parse(LocalData);
                        let LocalDataWithItemName = LocalDataAsJson[LocalItemName];
                        let LocalNewPk = GeneratePk({ inDataWithKey: LocalDataWithItemName });

                        inDataToInsert.PK = LocalNewPk;
                        LocalDataWithItemName[LocalNewPk] = inDataToInsert;

                        LocalReturnObject = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalDataAsJson));
                        LocalReturnObject.KResult = inDataToInsert;

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                UpdateData: async ({ inDataToUpdate }) => {
                    try {
                        let LocalFolderName = this.Api.Transactions.Inwards.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Inwards.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Inwards.JsonConfig.ItemName;

                        return await this.CommonFuncs.Update({
                            inFolderName: LocalFolderName,
                            inFileName: LocalFileName, inItemName: LocalItemName,
                            inDataToUpdate
                        });
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                MaxDate: async () => {
                    try {
                        let LocalFolderName = this.Api.Transactions.Sales.JsonConfig.FolderName;
                        let LocalFileName = this.Api.Transactions.Sales.JsonConfig.FileName;
                        let LocalItemName = this.Api.Transactions.Sales.JsonConfig.ItemName;
                        let LocalDateArray;
                        let LocalMaxDate;
                        let LocalReturnData;

                        let LocalDataPath = `${CommonDataFolderPath}/${LocalFolderName}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        LocalDateArray = Object.values(JSON.parse(data)[LocalItemName]).map(element => {
                            return new Date(element.Date);
                        });

                        if (LocalDateArray.length > 0) {
                            LocalMaxDate = new Date(Math.max.apply(null, LocalDateArray));
                            LocalReturnData = this.DateFuncs.yyyyMMdd({ inDate: LocalMaxDate })
                        } else {
                            LocalReturnData = undefined;
                        }

                        return await LocalReturnData;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                JsonConfig: {
                    FolderName: "Transactions",
                    FileName: "Inwards.json",
                    ItemName: "Inwards"
                }
            },
        },
        Admin: {
            Users: {
                Validate: async ({ inUserName, inPassWord }) => {
                    try {
                        let LocalReturnObject = { KTF: false, KResult: {} };
                        let LocalFilterArray;
                        let LocalFileName = this.Api.Admin.Users.JsonConfig.FileName;

                        let LocalDataPath = `${CommonDataAdminPath}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        LocalFilterArray = Object.values(JSON.parse(data).data).filter(element => {
                            return (element.UserName === inUserName && element.PassWord === inPassWord);

                        });

                        if (LocalFilterArray.length > 0) {
                            LocalReturnObject.KTF = true;
                            LocalReturnObject.KResult = { inUserName, inPassWord };
                        }

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                PasswordFunc: async ({ inUserName, inPassWord }) => {
                    try {
                        let LocalReturnObject = { KTF: false, KResult: [] };
                        let LocalFilterArray;
                        let LocalFileName = this.Api.Admin.Users.JsonConfig.FileName;

                        let LocalDataPath = `${CommonDataAdminPath}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);

                        LocalFilterArray = Object.values(JSON.parse(data).data).filter(element => {
                            return (element.UserName === inUserName && element.PassWord === inPassWord);

                        });

                        if (LocalFilterArray.length > 0) {
                            LocalReturnObject.KTF = true;
                            LocalReturnObject.KResult = LocalFilterArray[0];
                        };

                        return await LocalReturnObject;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                ChangePasswordFunc: async ({ inUserName, inPassWordToUpdate }) => {
                    try {
                        let LocalFileName = this.Api.Admin.Users.JsonConfig.FileName;
                        let LocalDataPath = `${CommonDataAdminPath}/${LocalFileName}`;

                        let data = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
                        let LocalNewData = JSON.parse(data);

                        LocalNewData.data[CommonDataPk].PassWord = inPassWordToUpdate;
                        let data1 = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`,JSON.stringify(LocalNewData));

                        return await data1;
                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                JsonConfig: {
                    FileName: "UserData.json"
                }
            }
        }
    }

    static Html = {
        Common: {
            DataList: {
                Products: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Common/DataList/products.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                Members: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Common/DataList/Members.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                }

            }
        },
        Masters: {
            Products: {
                CreateNew: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Masters/Products/CreateNew.html");
                        return await data;

                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                ShowAll: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Masters/Products/ShowAll.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                }
            },
            Members: {
                CreateNew: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Masters/Members/CreateNew.html");
                        return await data;

                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                },
                ShowAll: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Masters/Members/ShowAll.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                }
            }
        },
        Transactions: {
            Sales: {
                FirstRow: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Sales/FirstRow.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowAll: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Sales/BillsShowAll.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowFuncs: {
                    SingleEntry: async () => {
                        try {
                            let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Sales/FirstRowSaved.html");
                            return await data;

                        } catch (error) {
                            console.log("error : ", error);
                        };
                    }
                },
                FirstRowSaved: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Sales/FirstRowSaved.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                }
            },
            Inwards: {
                CreateNew: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Inwards/CreateNew.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowAll: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Inwards/ShowAll.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowFuncs: {
                    SingleEntry: async () => {
                        try {
                            let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Sales/FirstRowSaved.html");
                            return await data;

                        } catch (error) {
                            console.log("error : ", error);
                        };
                    }
                },
                FirstRowSaved: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Transactions/Sales/FirstRowSaved.html");
                        return await data;

                    } catch (error) {
                        console.log("error : ", error);
                    };
                }

            }
        },
        SweetAlert2: {
            Transactions: {
                Sales:
                {
                    FirstRow: async () => {
                        try {
                            let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/SweetAlert2/Transactions/Sales/FirstRow.html");
                            return await data;

                        } catch (error) {
                            console.log("error : ", error);
                        };
                    }
                }
            }
        },
        Reports: {
            Stock: {
                Period: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Stock/Period.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                }
            },
            Daily: {
                ShowBills: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Daily/ShowBills.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowDates: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Daily/ShowDates.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowDatesForMonthly: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Daily/ShowDatesForMonthly.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowBillsMultiColumns: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Daily/ShowBillsMultiColumns.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                },
                ShowFooter: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Daily/InCard/InFooter.html");

                        return await data;
                    } catch (error) {
                        console.log("error : ", error);
                    };
                }
            },
            Monthly: {
                InCard: {
                    InBody: async () => {
                        try {
                            let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Monthly/InCard/InBody.html");

                            return await data;
                        } catch (error) {
                            console.log("error : ", error);
                        };
                    },
                    InFooter: async () => {
                        try {
                            let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Reports/Monthly/InCard/InFooter.html");

                            return await data;
                        } catch (error) {
                            console.log("error : ", error);
                        };
                    }
                }
            }
        },
        Admin: {
            Password: {
                AlterFunc: async () => {
                    try {
                        let data = await Neutralino.filesystem.readFile("KeshavSoft/Html/Admin/Password/Alter.html");
                        return await data;

                    } catch (error) {
                        if (this.ShowLog) {
                            console.log("error : ", error);
                        };
                    };
                }
            }
        }
    }

    static DateFuncs = {
        ddMMyyyy: ({ inDate }) => {
            let date = new Date(inDate);

            let dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
            let MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
            let yyyy = date.getFullYear();

            return `${dd}-${MM}-${yyyy}`;
        },
        yyyyMMdd: ({ inDate }) => {
            let date = new Date(inDate);

            let dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
            let MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
            let yyyy = date.getFullYear();

            return `${yyyy}-${MM}-${dd}`;
        }
    }

    static CommonFuncs = {
        Update: async ({ inFolderName, inFileName, inItemName, inDataToUpdate }) => {
            let LocalDataPath = `${CommonDataFolderPath}/${inFolderName}/${inFileName}`;
            let LocalDataToUpdate = {};

            let LocalData = await Neutralino.filesystem.readFile(`./${LocalDataPath}`);
            let LocalDataAsJson = JSON.parse(LocalData);
            let LocalDataWithItemName = LocalDataAsJson[inItemName];
            let LocalUpdatedData = {};

            Object.entries(inDataToUpdate).forEach(
                ([key, value]) => {
                    if (key in LocalDataWithItemName) {
                        LocalDataToUpdate[key] = { ...LocalDataWithItemName[key], ...value };
                    };
                }
            );

            LocalUpdatedData = {};
            LocalUpdatedData[inItemName] = { ...LocalDataWithItemName, ...LocalDataToUpdate };

            let LocalToUpdateData = { ...LocalDataAsJson, ...LocalUpdatedData };

            let data1 = await Neutralino.filesystem.writeFile(`./${LocalDataPath}`, JSON.stringify(LocalToUpdateData));

            return await data1;
        }
    }
};

const toNumbers = arr => arr.map(Number);

let GeneratePk = ({ inDataWithKey }) => {
    let LocalNewPk = 1;
    let LocalPkArray = toNumbers(Object.keys(inDataWithKey));

    if (LocalPkArray.length > 0) {
        LocalNewPk = Math.max(...LocalPkArray) + 1;
    };

    return LocalNewPk;
};

