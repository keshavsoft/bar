class jFCommonFuncsClass {
    static ApiFuncs = {
        Masters: {
            Products: {
                PullData: async () => {
                    let LocalData = await CommonFuncs.Api.Masters.Products.PullData();

                    let LocalDataAsJson = JSON.parse(LocalData);
                    return await LocalDataAsJson.Products;
                },
                PushData: async ({ inDataToInsert }) => {
                    let LocalData = await CommonFuncs.Api.Masters.Products.FPushData({ inDataToInsert });

                    return await LocalData.success;
                },
                UpdateData: async ({ inDataToUpdate }) => {
                    let LocalData = await CommonFuncs.Api.Masters.Products.UpdateData({ inDataToUpdate });

                    return await LocalData.success;
                }
            },
            Members: {
                PullData: async () => {
                    let LocalData = await CommonFuncs.Api.Masters.Members.PullData();

                    let LocalDataAsJson = JSON.parse(LocalData);
                    return await LocalDataAsJson.Members;
                },
                PushData: async ({ inDataToInsert }) => {
                    let LocalData = await CommonFuncs.Api.Masters.Members.FPushData({ inDataToInsert });

                    return await LocalData.success;
                }
            }
        },
        Transactions: {
            Sales: {
                PullData: async () => {
                    let LocalData = await CommonFuncs.Api.Transactions.Sales.FPullData();

                    let LocalDataAsJson = JSON.parse(LocalData);
                    let LocalDataArray = Object.values(LocalDataAsJson.Sales);
                    return LocalDataAsJson.Sales;
                },
                PushData: async ({ inDataToInsert }) => {
                    let jVarLocalFromPrepareObject = await CommonFuncs.Api.Transactions.Sales.FPushData({
                        inDataToInsert
                    });

                    return await jVarLocalFromPrepareObject;
                },
                PushDataWithDayNumber: async ({ inDataToInsert }) => {
                    let jVarLocalFromPrepareObject = await CommonFuncs.Api.Transactions.Sales.PushDataWithDayNumber({
                        inDataToInsert
                    });

                    return await jVarLocalFromPrepareObject;
                },
                PullDataWithDayNumber: async () => {
                    let LocalData = await CommonFuncs.Api.Transactions.Sales.FPullData();
                    let LocalSalesItemData = await CommonFuncs.Api.Transactions.SalesItems.PullData();
                    let LocalDataAsJson = JSON.parse(LocalData);
                    let LocalFilterArray;

                    Object.entries(LocalSalesItemData).forEach(
                        ([key, value]) => {
                            value.Amount = value.Qty * value.Price;
                        }
                    );

                    let jVarLocalSalesItemGroupByFk = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                        inDataToSort: Object.values(LocalSalesItemData),
                        inGroupByColumn: "FK",
                        inColumnsToGroupByAsInt: ["Qty", "Amount"]
                    });

                    Object.entries(LocalDataAsJson.Sales).forEach(
                        ([key, value]) => {

                            LocalFilterArray = jVarLocalSalesItemGroupByFk.find(element => {
                                return element.FK === parseInt(key);
                            });

                            if (LocalFilterArray) {
                                value.Qty = LocalFilterArray.Qty;
                                value.Amount = LocalFilterArray.Amount;
                            }
                        }
                    );

                    return LocalDataAsJson.Sales;
                },
                ShowByPk: async ({ inPk }) => {
                    let jVarLocalSalesData = await this.ApiFuncs.Transactions.Sales.PullData();
                    let jVarLocalSalesItemsData;
                    let jVarLocalReturnObject = { InvGrid: {} };
                    let jVarLocalReturnObjectWithFooter;
                    let jVarLocalObject = {};

                    if (inPk in jVarLocalSalesData) {
                        jVarLocalSalesItemsData = await this.ApiFuncs.Transactions.SalesItems.PullData();
                        jVarLocalReturnObject.Head = jVarLocalSalesData[inPk];
                        Object.entries(jVarLocalSalesItemsData).forEach(
                            ([key, value]) => {
                                if (value.FK === inPk) {
                                    jVarLocalObject = {};
                                    value.Amount = value.Price * value.Qty;
                                    jVarLocalObject[key] = value;
                                    jVarLocalReturnObject.InvGrid = { ...jVarLocalReturnObject.InvGrid, ...jVarLocalObject };
                                }
                            }
                        );

                        jVarLocalReturnObjectWithFooter = this.ApiFuncs.Transactions.Sales.CommonFuncs.CalculateFooter({ inObject: jVarLocalReturnObject });
                    };

                    return await jVarLocalReturnObjectWithFooter;
                },
                InvGrid: {
                    Delete: {
                        BeforePrint: async ({ inRowPk }) => {
                            let jVarLocalFromDelete = await CommonFuncs.Api.Transactions.SalesItems.Delete({ inRowPk });
                            return await jVarLocalFromDelete;
                        }
                    }
                },
                Update: async ({ inDataToUpdate, inPk }) => {
                    let jVarLocalFromPrepareObject = await CommonFuncs.Api.Transactions.Sales.Update({
                        inDataToUpdate,
                        inPk
                    });

                    return await jVarLocalFromPrepareObject;
                },
                MaxDate: async () => {
                    let LocalData = await CommonFuncs.Api.Transactions.Sales.MaxDate();

                    return await LocalData;
                },
                CommonFuncs: {
                    CalculateFooter: ({ inObject }) => {
                        let jVarLocalReturnObject = JSON.parse(JSON.stringify(inObject));
                        let jVarLocalTotalAmount = Object.values(inObject.InvGrid).map(LoopItem => LoopItem.Amount).reduce((a, b) => a + b, 0);
                        let jVarLocalTotalQty = Object.values(inObject.InvGrid).map(LoopItem => LoopItem.Qty).reduce((a, b) => a + b, 0);

                        jVarLocalReturnObject.InvGridFooter = {
                            TotalAmount: jVarLocalTotalAmount,
                            TotalQty: jVarLocalTotalQty
                        };

                        return jVarLocalReturnObject;
                    }
                }
            },
            SalesItems: {
                PullData: async () => {
                    let LocalData = await CommonFuncs.Api.Transactions.SalesItems.PullData();

                    // let LocalDataAsJson = JSON.parse(LocalData);
                    //let LocalDataArray = Object.values(LocalDataAsJson.Sales);
                    return LocalData;
                },
                PushData: async ({ inDataToInsert }) => {
                    let jVarLocalFromPrepareObject = await CommonFuncs.Api.Transactions.SalesItems.FPushData({
                        inDataToInsert
                    });

                    return await jVarLocalFromPrepareObject;
                },
            },
            Inwards: {
                Data: {
                    Update: async ({ inDataToUpdate }) => {
                        let jVarLocalFromPrepareObject = await CommonFuncs.Api.Transactions.Inwards.UpdateData({
                            inDataToUpdate
                        });

                        return await jVarLocalFromPrepareObject;
                    },
                },
                PullData: async () => {
                    let LocalData = await CommonFuncs.Api.Transactions.Inwards.PullData();

                    let LocalDataAsJson = JSON.parse(LocalData);
                    return LocalDataAsJson.Inwards;
                },
                PushData: async ({ inDataToInsert }) => {
                    let jVarLocalFromPrepareObject = await CommonFuncs.Api.Transactions.Inwards.PushData({
                        inDataToInsert
                    });

                    return await jVarLocalFromPrepareObject;
                },
                ShowByPk: async ({ inPk }) => {
                    let jVarLocalSalesData = await this.ApiFuncs.Transactions.Sales.PullData();
                    let jVarLocalSalesItemsData;
                    let jVarLocalReturnObject = { InvGrid: {} };
                    let jVarLocalItemName = "Sales";
                    let jVarLocalObject = {};

                    if (inPk in jVarLocalSalesData) {

                        jVarLocalSalesItemsData = await this.ApiFuncs.Transactions.SalesItems.PullData();
                        jVarLocalReturnObject.Head = jVarLocalSalesData[inPk];
                        Object.entries(jVarLocalSalesItemsData).forEach(
                            ([key, value]) => {
                                if (value.FK === inPk) {
                                    jVarLocalObject = {};
                                    jVarLocalObject[key] = value;
                                    jVarLocalReturnObject.InvGrid = { ...jVarLocalReturnObject.InvGrid, ...jVarLocalObject };
                                }
                            }
                        );
                    };

                    return await jVarLocalReturnObject;
                },
                InvGrid: {
                    Delete: {
                        BeforePrint: ({ inRowPk }) => {
                            CommonFuncs.Api.Transactions.SalesItems.Delete({ inRowPk });
                        }
                    }
                },
                MaxDate: async () => {
                    let LocalData = await CommonFuncs.Api.Transactions.Sales.MaxDate();

                    return await LocalData;
                },
                ForReports: async () => {
                    let jVarLocalInwards = await this.ApiFuncs.Transactions.Inwards.PullData();

                    let jVarLocalInwardsWithColumnsNeeded = Object.values(jVarLocalInwards).map(element => {
                        return {
                            ProductName: element.ProductName,
                            Qty: element.Qty
                        }
                    });

                    return await jVarLocalInwardsWithColumnsNeeded;
                },
                ForReportsWithDateFilters: async ({ inFromDate, inToDate }) => {
                    let jVarLocalInwards = await this.ApiFuncs.Transactions.Inwards.PullData();

                    let jVarLocalInwardsFiltered = Object.values(jVarLocalInwards).filter(element => {
                        return (new Date(element.Date).getTime() >= new Date(inFromDate).getTime()) && (new Date(element.Date).getTime() <= new Date(inToDate).getTime());
                    });

                    let jVarLocalInwardsWithColumnsNeeded = jVarLocalInwardsFiltered.map(element => {
                        return {
                            ProductName: element.ProductName,
                            Qty: element.Qty
                        }
                    });

                    return await jVarLocalInwardsWithColumnsNeeded;
                },
                ForReportsWithOpening: async ({ inDate }) => {
                    let jVarLocalInwards = await this.ApiFuncs.Transactions.Inwards.PullData();

                    let jVarLocalInwardsFiltered = Object.values(jVarLocalInwards).filter(element => {
                        return (new Date(element.Date).getTime() < new Date(inDate).getTime());
                    });

                    let jVarLocalInwardsWithColumnsNeeded = jVarLocalInwardsFiltered.map(element => {
                        return {
                            ProductName: element.ProductName,
                            Qty: element.Qty
                        }
                    });

                    return await jVarLocalInwardsWithColumnsNeeded;
                }
            },
            CommonFuncs: {
                FirstRow: async ({ inItemName, inPrice, inQty }) => {
                    let LocalDataFromSalesItems;
                    let jVarLocalReturnObject = { KTF: false, KResult: "" };
                    let jVarLocalFromHtmlForSinleShow;

                    let LocalDataFromSales = await this.ApiFuncs.Transactions.Sales.PushDataWithDayNumber({
                        inDataToInsert: {
                            Date: this.DateFuncs.yyyyMMdd({ inDate: new Date() })
                        }
                    });

                    if (LocalDataFromSales.success) {
                        LocalDataFromSalesItems = await this.ApiFuncs.Transactions.SalesItems.PushData({
                            inDataToInsert: {
                                FK: LocalDataFromSales.KResult.PK,
                                ProductName: inItemName,
                                Price: inPrice, Qty: inQty
                            }
                        });
                        if (LocalDataFromSalesItems.success) {
                            jVarLocalFromHtmlForSinleShow = await this.HtmlFuns.Transactions.Sales.ShowFuncs.SingleEntry();

                            jVarLocalReturnObject.KTF = true;
                            jVarLocalReturnObject.KResult = {
                                PK: LocalDataFromSales.KResult.PK,
                                Head: LocalDataFromSales.KResult,
                                InvGrid: LocalDataFromSalesItems.KResult
                            };
                        };
                    };

                    return await jVarLocalReturnObject;
                },
                NextRowOnwards: async ({ inPk, inItemName, inPrice, inQty }) => {
                    let jVarLocalReturnObject = { KTF: false, KResult: "" };
                    let jVarLocalDataToInsert = {
                        FK: inPk,
                        ProductName: inItemName,
                        Price: inPrice, Qty: inQty
                    };

                    let LocalDataFromSalesItems = await this.ApiFuncs.Transactions.SalesItems.PushData({
                        inDataToInsert: {
                            FK: inPk,
                            ProductName: inItemName,
                            Price: inPrice, Qty: inQty
                        }
                    });

                    if (LocalDataFromSalesItems.success) {
                        jVarLocalReturnObject.KTF = true;
                        jVarLocalReturnObject.KResult = LocalDataFromSalesItems.KResult;
                    };

                    return await jVarLocalReturnObject;
                }
            },
            ClubbedDatas: {
                SalesAndSalesItems: async () => {
                    let jVarLocalSales = await this.ApiFuncs.Transactions.Sales.PullData();
                    let jVarLocalSalesItems = await this.ApiFuncs.Transactions.SalesItems.PullData();

                    let jVarLocalSalesItemsClubbed = Object.entries(jVarLocalSalesItems).map(
                        ([key, value]) => {
                            return { ...jVarLocalSales[value.FK], PK: key, ...value };
                        }
                    );

                    return await jVarLocalSalesItemsClubbed;
                },
                ForReportsWithDateFilters: async ({ inFromDate, inToDate }) => {
                    let jVarLocalData = await this.ApiFuncs.Transactions.ClubbedDatas.SalesAndSalesItems();

                    let jVarLocalInwardsFiltered = Object.values(jVarLocalData).filter(element => {
                        return (new Date(element.Date).getTime() >= new Date(inFromDate).getTime()) && (new Date(element.Date).getTime() <= new Date(inToDate).getTime());
                    });

                    return await jVarLocalInwardsFiltered;
                },
                ForReportsWithOpening: async ({ inDate }) => {
                    let jVarLocalData = await this.ApiFuncs.Transactions.ClubbedDatas.SalesAndSalesItems();

                    let jVarLocalInwardsFiltered = Object.values(jVarLocalData).filter(element => {
                        return (new Date(element.Date).getTime() < new Date(inDate).getTime());
                    });

                    return await jVarLocalInwardsFiltered;
                }
            },
            ForReports: {
                Opening: async ({ inFromDate }) => {
                    let jVarLocalSystemDate = this.DateFuncs.yyyyMMdd({ inDate: new Date() });

                    let jVarLocalProducts = await this.ApiFuncs.Masters.Products.PullData();

                    let jVarLocalInwardsWithColumnsNeeded = await this.ApiFuncs.Transactions.Inwards.ForReportsWithDateFilters({
                        inFromDate: jVarLocalSystemDate,
                        inToDate: jVarLocalSystemDate
                    });

                    let jVarLocalSalesItemsClubbed = await this.ApiFuncs.Transactions.ClubbedDatas.ForReportsWithDateFilters({
                        inFromDate: jVarLocalSystemDate,
                        inToDate: jVarLocalSystemDate
                    });

                    let jVarLocalSalesItemsFiltered = jVarLocalSalesItemsClubbed.map(
                        LoopItem => {
                            return {
                                ProductName: LoopItem.ProductName,
                                Qty: LoopItem.Qty
                            };
                        }
                    );

                    let jVarLocalInwardsGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                        inDataToSort: jVarLocalInwardsWithColumnsNeeded,
                        inGroupByColumn: "ProductName",
                        inColumnsToGroupByAsInt: ["Qty"]
                    });

                    let jVarLocalSalesGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                        inDataToSort: jVarLocalSalesItemsFiltered,
                        inGroupByColumn: "ProductName",
                        inColumnsToGroupByAsInt: ["Qty"]
                    });

                    let jVarLocalReportData = Object.values(jVarLocalProducts).map(LoopProduct => {
                        return this.JsFuncs.Reports.Stock.CommonFuncs.LoopFunc({
                            inLoopProduct: LoopProduct,
                            inInwardsGroupByProduct: jVarLocalInwardsGroupByProduct,
                            inSalesGroupByProduct: jVarLocalSalesGroupByProduct
                        });
                    });

                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Reports.Stock.Period();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalReportData);
                }
            }
        },
        Admin: {
            Password: {
                AlterFunc: async ({ inUserName, inPassWord }) => {
                    let LocalData = await CommonFuncs.Api.Admin.Users.PasswordFunc({ inUserName, inPassWord });

                    return await LocalData;
                },
                ChangeFunc: async ({ inUserName, inPassWordToUpdate }) => {
                    let LocalData = await CommonFuncs.Api.Admin.Users.ChangePasswordFunc({ inUserName, inPassWordToUpdate });

                    return await LocalData;
                }
            }
        }
    }

    static HtmlFuns = {
        Common: {
            DataList: {
                Products: async () => {
                    let jVarHtml = await CommonFuncs.Html.Common.DataList.Products();

                    return jVarHtml;
                },
                Members: async () => {
                    let jVarHtml = await CommonFuncs.Html.Common.DataList.Members();

                    return jVarHtml;
                }
            }
        },
        Masters: {
            Products: {
                CreateNew: async () => {
                    let jVarHtml = await CommonFuncs.Html.Masters.Products.CreateNew();

                    return jVarHtml;
                },
                ShowAll: async () => {
                    let jVarHtml = await CommonFuncs.Html.Masters.Products.ShowAll();

                    return jVarHtml;
                }
            },
            Members: {
                CreateNew: async () => {
                    let jVarHtml = await CommonFuncs.Html.Masters.Members.CreateNew();

                    return jVarHtml;
                },
                ShowAll: async () => {
                    let jVarHtml = await CommonFuncs.Html.Masters.Members.ShowAll();

                    return jVarHtml;
                }
            }
        },
        Transactions: {
            Sales: {
                CreateNew: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Sales.CreateNew();
                    document.getElementById("KCont1").innerHTML = jVarHtml;
                },
                ShowAll: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Sales.ShowAll();
                    //document.getElementById("KCont1").innerHTML = jVarHtml;
                    return jVarHtml;
                },
                FirstRow: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Sales.FirstRow();

                    return jVarHtml;
                },
                FirstRowSaved: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Sales.FirstRowSaved();
                    return jVarHtml;
                },
                ShowFuncs: {
                    SingleEntry: async () => {
                        let jVarHtml = await CommonFuncs.Html.Transactions.Sales.ShowFuncs.SingleEntry();
                        //document.getElementById("KCont1").innerHTML = jVarHtml;
                        return jVarHtml;
                    }
                }
            },
            Inwards: {
                CreateNew: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Inwards.CreateNew();
                    return jVarHtml;
                },
                ShowAll: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Inwards.ShowAll();
                    return jVarHtml;
                },
                FirstRow: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Sales.FirstRow();

                    return jVarHtml;
                },
                FirstRowSaved: async () => {
                    let jVarHtml = await CommonFuncs.Html.Transactions.Sales.FirstRowSaved();
                    //document.getElementById("KCont1").innerHTML = jVarHtml;
                    return jVarHtml;
                },
                ShowFuncs: {
                    SingleEntry: async () => {
                        let jVarHtml = await CommonFuncs.Html.Transactions.Sales.ShowFuncs.SingleEntry();
                        //document.getElementById("KCont1").innerHTML = jVarHtml;
                        return jVarHtml;
                    }
                }
            }
        },
        SweetAlert2: {
            Transactions: {
                Sales: {
                    FirstRow: async () => {
                        try {
                            let data = await CommonFuncs.Html.SweetAlert2.Transactions.Sales.FirstRow();

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
                    let jVarHtml = await CommonFuncs.Html.Reports.Stock.Period();

                    return jVarHtml;
                }
            },
            Daily: {
                ShowBills: async () => {
                    let jVarHtml = await CommonFuncs.Html.Reports.Daily.ShowBills();

                    return jVarHtml;
                },
                ShowBillsMultiColumns: async () => {
                    let jVarHtml = await CommonFuncs.Html.Reports.Daily.ShowBillsMultiColumns();
                    return jVarHtml;
                },
                ShowFooter: async () => {
                    let jVarHtml = await CommonFuncs.Html.Reports.Daily.ShowFooter();
                    return jVarHtml;
                },
                ShowDates: async () => {
                    let jVarHtml = await CommonFuncs.Html.Reports.Daily.ShowDates();
                    return jVarHtml;
                },
                ShowDatesForMonthly: async () => {
                    let jVarHtml = await CommonFuncs.Html.Reports.Daily.ShowDatesForMonthly();
                    return jVarHtml;
                }
            },
            Monthly: {
                InCard: {
                    InBody: async () => {
                        let jVarHtml = await CommonFuncs.Html.Reports.Monthly.InCard.InBody();
                        return jVarHtml;
                    },
                    InFooter: async () => {
                        let jVarHtml = await CommonFuncs.Html.Reports.Monthly.InCard.InFooter();
                        return jVarHtml;
                    }
                }
            }
        },
        MainMenuFuncs: {
            RemoveInfoInAllLi: () => {
                let jVarLocalHtmlKSHtmlUl = document.getElementById("KSHtmlUl");
                let jVarLocalAllAnchors = jVarLocalHtmlKSHtmlUl.querySelectorAll("a");

                jVarLocalAllAnchors.forEach((LoopElement) => {
                    if (LoopElement.classList.contains("text-info")) {
                        LoopElement.classList.remove("text-info");
                        LoopElement.classList.add("text-white");
                    };
                });
            },
            SetFocustToActiveAnchor: ({ inCurrentTarget }) => {
                if (inCurrentTarget.classList.contains("text-white")) {
                    inCurrentTarget.classList.remove("text-white");
                    inCurrentTarget.classList.add("text-info");
                };
            }
        },
        Admin: {
            Password: {
                AlterFunc: async () => {
                    let jVarHtml = await CommonFuncs.Html.Admin.Password.AlterFunc();

                    return jVarHtml;
                }
            }
        }
    }

    static JsFuncs = {
        Admin: {
            CheckFunc: async () => {
                Swal.fire({
                    title: 'Login Form',
                    html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
                    <input type="password" id="password" class="swal2-input" placeholder="Password">`,
                    confirmButtonText: 'Sign in',
                    focusConfirm: false,
                    preConfirm: () => {
                        const login = Swal.getPopup().querySelector('#login').value
                        const password = Swal.getPopup().querySelector('#password').value
                        if (!login || !password) {
                            Swal.showValidationMessage(`Please enter login and password`)
                        }
                        return { login: login, password: password }
                    }
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        let jVarLocalUserName = result.value.login;
                        let jVarLocalPassWord = result.value.password;

                        return await CommonFuncs.Api.Admin.Users.Validate({ inUserName: jVarLocalUserName, inPassWord: jVarLocalPassWord });
                    };
                });
            },
            Bs5: {
                LoginFuncs: {
                    CheckLogin: {
                        StartFunc: async () => {
                            let jVarLocalFromClientSide = this.JsFuncs.Admin.Bs5.LoginFuncs.CheckLogin.ValidateValuesClientSide();

                            let jVarLocalUserNameId = document.getElementById('KUserNameInput');
                            let jVarLocalPassWordId = document.getElementById('KPasswordInput');
                            let jVarLocalUserNameRow = document.getElementById("UserNameRow");
                            let jVarLocalUserNameRowInvalidFeedBack;

                            let jVarLocalUserName = jVarLocalUserNameId.value;
                            let jVarLocalPassWord = jVarLocalPassWordId.value;
                            let jVarLocalFromValidate;
                            let jVarLocalReturnObject = {
                                KTF: false,
                                KTFForValidation: true,
                                KResult: {}
                            };

                            if (jVarLocalUserName === "") {
                                jVarLocalUserNameId.classList.add("is-invalid");
                                jVarLocalReturnObject.KTFForValidation = false;
                            } else {
                                if (jVarLocalUserNameId.classList.contains("is-invalid")) {
                                    jVarLocalUserNameId.classList.remove("is-invalid");
                                    jVarLocalUserNameId.classList.add("is-valid");
                                };
                            };

                            if (jVarLocalReturnObject.KTFForValidation) {
                                if (jVarLocalPassWord === "") {
                                    document.getElementById("KPasswordInput").classList.add("is-invalid");
                                    jVarLocalReturnObject.KTFForValidation = false;
                                };
                            };

                            if (jVarLocalReturnObject.KTFForValidation) {
                                jVarLocalFromValidate = await CommonFuncs.Api.Admin.Users.Validate({ inUserName: jVarLocalUserName, inPassWord: jVarLocalPassWord });

                                if (jVarLocalFromValidate.KTF) {
                                    jVarLocalReturnObject.KTF = true;
                                    jVarLocalReturnObject.KResult = jVarLocalFromValidate.KResult;
                                } else {
                                    jVarLocalUserNameRowInvalidFeedBack = jVarLocalUserNameRow.querySelector(".invalid-feedback");
                                    jVarLocalUserNameRowInvalidFeedBack.innerHTML = "User Name is not valid!";
                                    jVarLocalUserNameId.classList.add("is-invalid");
                                    jVarLocalPassWordId.classList.add("is-invalid");
                                };
                            };

                            return await jVarLocalReturnObject;
                        },
                        ValidateValuesClientSide: async () => {
                            let jVarLocalUserNameId = document.getElementById('KUserNameInput');
                            let jVarLocalPassWordId = document.getElementById('KPasswordInput');

                            let jVarLocalUserName = jVarLocalUserNameId.value;
                            let jVarLocalPassWord = jVarLocalPassWordId.value;
                            let jVarLocalReturnKTF = true;

                            if (jVarLocalUserName === "") {
                                jVarLocalUserNameId.classList.add("is-invalid");
                                jVarLocalReturnKTF = false;
                                jVarLocalUserNameId.focus();
                            } else {
                                if (jVarLocalUserNameId.classList.contains("is-invalid")) {
                                    jVarLocalUserNameId.classList.remove("is-invalid");
                                    jVarLocalUserNameId.classList.add("is-valid");
                                };
                            };

                            if (jVarLocalReturnKTF) {
                                if (jVarLocalPassWord === "") {
                                    document.getElementById("KPasswordInput").classList.add("is-invalid");
                                    jVarLocalReturnKTF = false;
                                };
                            };

                            return jVarLocalReturnKTF;
                        },
                        ValidateValuesWithData: async () => {
                            let jVarLocalUserNameId = document.getElementById('KUserNameInput');
                            let jVarLocalPassWordId = document.getElementById('KPasswordInput');
                            let jVarLocalUserNameRow = document.getElementById("UserNameRow");
                            let jVarLocalUserNameRowInvalidFeedBack;

                            let jVarLocalUserName = jVarLocalUserNameId.value;
                            let jVarLocalPassWord = jVarLocalPassWordId.value;
                            let jVarLocalFromValidate = await CommonFuncs.Api.Admin.Users.Validate({ inUserName: jVarLocalUserName, inPassWord: jVarLocalPassWord });
                            let jVarLocalReturnObject = {
                                KTF: false,
                            };

                            if (jVarLocalFromValidate.KTF) {
                                jVarLocalReturnObject.KTF = true;
                            } else {
                                jVarLocalUserNameRowInvalidFeedBack = jVarLocalUserNameRow.querySelector(".invalid-feedback");
                                jVarLocalUserNameRowInvalidFeedBack.innerHTML = "User Name is not valid!";
                                jVarLocalUserNameId.classList.add("is-invalid");
                                jVarLocalPassWordId.classList.add("is-invalid");
                            };

                            return await jVarLocalReturnObject;
                        }
                    },
                    SubmitButton: {
                        ClickFunc: async (inEvent) => {
                            let jVarLocalCurrentTarget = inEvent.currentTarget;
                            let jVarLocalTargetFunc = jVarLocalCurrentTarget.dataset.targetfunc;
                            let jVarLocalFromCheckLogin = await this.JsFuncs.Admin.Bs5.LoginFuncs.CheckLogin.StartFunc();

                            if (jVarLocalFromCheckLogin.KTF) {
                                var myModalEl = document.getElementById('LoginModalId');

                                var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance

                                modal.hide();
                                await this.JsFuncs.Admin.Bs5.LoginFuncs.SubmitButton.CommonFuncs.SwitchFunc({
                                    inTargetFunc: jVarLocalTargetFunc,
                                    inUserName: jVarLocalFromCheckLogin.KResult.inUserName,
                                    inPassWord: jVarLocalFromCheckLogin.KResult.inPassWord
                                });
                            };
                        },
                        CommonFuncs: {
                            SwitchFunc: async ({ inTargetFunc, inUserName, inPassWord }) => {
                                switch (inTargetFunc) {
                                    case "Products":
                                        await this.JsFuncs.Masters.Products.ShowAllFromData();
                                        break;
                                    case "Inwards":
                                        await this.JsFuncs.Transactions.Inwards.ShowAllOnly();
                                        break;
                                    case "Members":
                                        await this.JsFuncs.Masters.Members.ShowAllData();

                                        break;
                                    case "Admin":
                                        await this.JsFuncs.Admin.Password.ChangeFunc({ inUserName, inPassWord });

                                        break;

                                    default:
                                        break;
                                };
                            }
                        }
                    }
                }
            },
            Password: {
                ClientSide: {
                    ShowPassWord: () => {
                        let jVarLocalPassWord = document.getElementById("PassWord");
                        let jVarLocalUpdateButtonId = document.getElementById("UpdateButtonId");

                        jVarLocalPassWord.setAttribute("type", "text");
                        jVarLocalUpdateButtonId.classList.remove("d-none");
                    },
                    ChangePassWord: async () => {
                        let jVarLocalUserName = document.getElementById("UserName");
                        let jVarLocalPassWord = document.getElementById("PassWord");
                        let jVarLocalShowSuccessId = document.getElementById("ShowSuccessId");
                        let jVarLocalFromData = await this.ApiFuncs.Admin.Password.ChangeFunc({
                            inUserName: jVarLocalUserName.value,
                            inPassWordToUpdate: jVarLocalPassWord.value
                        });

                        if (jVarLocalFromData.success) {
                            jVarLocalShowSuccessId.classList.remove("d-none");
                        };
                    },
                },
                ShowFunc: (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;
                    this.JsFuncs.CommonFuncs.NavItemFocus(jVarLocalCurrentTarget);
                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Admin";

                    myModal.show();
                },
                ChangeFunc: async ({ inUserName, inPassWord }) => {
                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Admin.Password.AlterFunc();
                    let jVarLocalData = await jFCommonFuncsClass.ApiFuncs.Admin.Password.AlterFunc({ inUserName, inPassWord });
                    let jVarLocalHtmlInput;

                    if (jVarLocalData.KTF) {

                        document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalData.KResult);

                        //document.getElementById("KCont1").innerHTML = jVarLocalRawTemplate;
                        jVarLocalHtmlInput = document.querySelector("input");

                        jVarLocalHtmlInput.focus();

                    };

                }
            }
        },
        Reports: {
            Stock: {
                NewWindow: () => {
                    Neutralino.window.create('/Bar/Html/Landing1.html', {
                        icon: '/resources/icons/aboutIcon.png',
                        enableInspector: false,
                        width: 500,
                        height: 300,
                        maximizable: false,
                        exitProcessOnClose: true,
                        processArgs: '--window-id=W_ABOUT'
                    });
                },
                Period: async () => {
                    let jVarLocalProducts = await this.ApiFuncs.Masters.Products.PullData();
                    let jVarLocalInwards = await this.ApiFuncs.Transactions.Inwards.PullData();
                    let jVarLocalSales = await this.ApiFuncs.Transactions.Sales.PullData();
                    let jVarLocalSalesItems = await this.ApiFuncs.Transactions.SalesItems.PullData();
                    let jVarLocalLoopInwardsFilter;
                    let jVarLocalLoopSalesFilter;
                    let jVarLocalInwardsQty;
                    let jVarLocalSalesQty;

                    let jVarLocalSalesItemsClubbed = Object.entries(jVarLocalSalesItems).map(
                        ([key, value]) => {
                            return { ...jVarLocalSales[value.FK], PK: key, ...value };
                        }
                    );

                    let jVarLocalSalesItemsFiltered = jVarLocalSalesItemsClubbed.map(
                        LoopItem => {
                            return {
                                ProductName: LoopItem.ProductName,
                                Qty: LoopItem.Qty
                            };
                        }
                    );

                    let jVarLocalInwardsWithColumnsNeeded = Object.values(jVarLocalInwards).map(element => {
                        return {
                            ProductName: element.ProductName,
                            Qty: element.Qty
                        }
                    });

                    let jVarLocalInwardsGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                        inDataToSort: jVarLocalInwardsWithColumnsNeeded,
                        inGroupByColumn: "ProductName",
                        inColumnsToGroupByAsInt: ["Qty"]
                    });

                    let jVarLocalSalesGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                        inDataToSort: jVarLocalSalesItemsFiltered,
                        inGroupByColumn: "ProductName",
                        inColumnsToGroupByAsInt: ["Qty"]
                    });

                    let jVarLocalReportData = Object.values(jVarLocalProducts).map(LoopProduct => {
                        return this.JsFuncs.Reports.Stock.CommonFuncs.LoopFunc({
                            inLoopProduct: LoopProduct,
                            inInwardsGroupByProduct: jVarLocalInwardsGroupByProduct,
                            inSalesGroupByProduct: jVarLocalSalesGroupByProduct
                        });
                    });

                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Reports.Stock.Period();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalReportData);
                },
                PeriodWithPresentDate: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget: jVarLocalCurrentTarget });

                    let jVarLocalSystemDate = this.DateFuncs.yyyyMMdd({ inDate: new Date() });

                    let jVarLocalReportData = await this.JsFuncs.Reports.Stock.CommonFuncs.WithPeriod({ inFromDate: jVarLocalSystemDate, inToDate: jVarLocalSystemDate });

                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Reports.Stock.Period();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalReportData);
                    this.JsFuncs.Reports.Stock.CommonFuncs.ShowDates();
                },
                PeriodSelection: async () => {
                    let jVarLocalFromDate = document.getElementById("FromDate");
                    let jVarLocalToDate = document.getElementById("ToDate");

                    let jVarLocalReportData = await this.JsFuncs.Reports.Stock.CommonFuncs.WithPeriod({
                        inFromDate: jVarLocalFromDate.value,
                        inToDate: jVarLocalToDate.value
                    });

                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Reports.Stock.Period();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalReportData);
                    this.JsFuncs.Reports.Stock.CommonFuncs.ShowDates();
                },
                CommonFuncs: {
                    WithPeriod: async ({ inFromDate, inToDate }) => {
                        let jVarLocalOpenings = await this.JsFuncs.Reports.Stock.CommonFuncs.ForOpening({ inDate: inFromDate });

                        let jVarLocalProducts = await this.ApiFuncs.Masters.Products.PullData();

                        let jVarLocalInwardsWithColumnsNeeded = await this.ApiFuncs.Transactions.Inwards.ForReportsWithDateFilters({
                            inFromDate,
                            inToDate
                        });

                        let jVarLocalSalesItemsClubbed = await this.ApiFuncs.Transactions.ClubbedDatas.ForReportsWithDateFilters({
                            inFromDate,
                            inToDate
                        });

                        let jVarLocalSalesItemsFiltered = jVarLocalSalesItemsClubbed.map(
                            LoopItem => {
                                return {
                                    ProductName: LoopItem.ProductName,
                                    Qty: LoopItem.Qty
                                };
                            }
                        );

                        let jVarLocalInwardsGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                            inDataToSort: jVarLocalInwardsWithColumnsNeeded,
                            inGroupByColumn: "ProductName",
                            inColumnsToGroupByAsInt: ["Qty"]
                        });

                        let jVarLocalSalesGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                            inDataToSort: jVarLocalSalesItemsFiltered,
                            inGroupByColumn: "ProductName",
                            inColumnsToGroupByAsInt: ["Qty"]
                        });

                        let jVarLocalReportData = Object.values(jVarLocalProducts).map(LoopProduct => {
                            return this.JsFuncs.Reports.Stock.CommonFuncs.LoopFunc({
                                inLoopProduct: LoopProduct,
                                inInwardsGroupByProduct: jVarLocalInwardsGroupByProduct,
                                inSalesGroupByProduct: jVarLocalSalesGroupByProduct,
                                inOpenings: jVarLocalOpenings
                            });
                        });

                        return await jVarLocalReportData;
                    },
                    ForOpening: async ({ inDate }) => {
                        let jVarLocalProducts = await this.ApiFuncs.Masters.Products.PullData();

                        let jVarLocalInwardsWithColumnsNeeded = await this.ApiFuncs.Transactions.Inwards.ForReportsWithOpening({
                            inDate
                        });

                        let jVarLocalSalesItemsClubbed = await this.ApiFuncs.Transactions.ClubbedDatas.ForReportsWithOpening({
                            inDate
                        });

                        let jVarLocalSalesItemsFiltered = jVarLocalSalesItemsClubbed.map(
                            LoopItem => {
                                return {
                                    ProductName: LoopItem.ProductName,
                                    Qty: LoopItem.Qty
                                };
                            }
                        );

                        let jVarLocalInwardsGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                            inDataToSort: jVarLocalInwardsWithColumnsNeeded,
                            inGroupByColumn: "ProductName",
                            inColumnsToGroupByAsInt: ["Qty"]
                        });

                        let jVarLocalSalesGroupByProduct = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                            inDataToSort: jVarLocalSalesItemsFiltered,
                            inGroupByColumn: "ProductName",
                            inColumnsToGroupByAsInt: ["Qty"]
                        });
                        let jVarLocalReportData = Object.values(jVarLocalProducts).map(LoopProduct => {
                            return this.JsFuncs.Reports.Stock.CommonFuncs.LoopFuncForOpening({
                                inLoopProduct: LoopProduct,
                                inInwardsGroupByProduct: jVarLocalInwardsGroupByProduct,
                                inSalesGroupByProduct: jVarLocalSalesGroupByProduct
                            });
                        });

                        return await jVarLocalReportData;
                    },
                    ShowDates: () => {
                        let jVarLocalSystemDate = this.DateFuncs.yyyyMMdd({ inDate: new Date() });

                        let jVarLocalFromDate = document.getElementById("FromDate");
                        let jVarLocalToDate = document.getElementById("ToDate");

                        jVarLocalFromDate.value = jVarLocalSystemDate;
                        jVarLocalToDate.value = jVarLocalSystemDate;
                    },
                    LoopFunc: ({ inLoopProduct, inInwardsGroupByProduct, inSalesGroupByProduct, inOpenings }) => {
                        let jVarLocalInwardsQty = 0;
                        let jVarLocalSalesQty = 0;
                        let jVarLocalOpening = 0;

                        let jVarLocalLoopInwardsFilter = inInwardsGroupByProduct.find(element => {
                            return element.ProductName === inLoopProduct.ProductName;
                        });

                        let jVarLocalLoopSalesFilter = inSalesGroupByProduct.find(element => {
                            return element.ProductName === inLoopProduct.ProductName;
                        });

                        let jVarLocalLoopOpeningFilter = inOpenings.find(element => {
                            return element.ProductName === inLoopProduct.ProductName;
                        });

                        if (jVarLocalLoopInwardsFilter !== undefined) {
                            jVarLocalInwardsQty = jVarLocalLoopInwardsFilter.Qty
                        };

                        if (jVarLocalLoopSalesFilter !== undefined) {
                            jVarLocalSalesQty = jVarLocalLoopSalesFilter.Qty
                        };

                        if (jVarLocalLoopOpeningFilter !== undefined) {
                            jVarLocalOpening = jVarLocalLoopOpeningFilter.Opening
                        };

                        return {
                            ProductName: inLoopProduct.ProductName,
                            Opening: jVarLocalOpening,
                            Inwards: jVarLocalInwardsQty,
                            Sales: jVarLocalSalesQty,
                            Balance: jVarLocalOpening + jVarLocalInwardsQty - jVarLocalSalesQty
                        }
                    },
                    LoopFuncForOpening: ({ inLoopProduct, inInwardsGroupByProduct, inSalesGroupByProduct }) => {
                        let jVarLocalInwardsQty = 0;
                        let jVarLocalSalesQty = 0;

                        let jVarLocalLoopInwardsFilter = inInwardsGroupByProduct.find(element => {
                            return element.ProductName === inLoopProduct.ProductName;
                        });

                        let jVarLocalLoopSalesFilter = inSalesGroupByProduct.find(element => {
                            return element.ProductName === inLoopProduct.ProductName;
                        });

                        if (jVarLocalLoopInwardsFilter !== undefined) {
                            jVarLocalInwardsQty = jVarLocalLoopInwardsFilter.Qty
                        };

                        if (jVarLocalLoopSalesFilter !== undefined) {
                            jVarLocalSalesQty = jVarLocalLoopSalesFilter.Qty
                        };

                        return {
                            ProductName: inLoopProduct.ProductName,
                            Price: inLoopProduct.Price,
                            Opening: jVarLocalInwardsQty - jVarLocalSalesQty
                        }
                    }
                }
            },
            Daily: {
                ShowBills: async () => {
                    let jVarLocalDataFromServer;

                    let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Daily.ShowBills();
                    jVarLocalDataFromServer = await this.ApiFuncs.Transactions.Sales.PullDataWithDayNumber();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer)
                },
                ShowDates: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget: jVarLocalCurrentTarget });

                    let jVarLocalFromDate = this.DateFuncs.PresentDateInyyyyMMdd()
                    let jVarLocalToDate = this.DateFuncs.PresentDateInyyyyMMdd();
                    let jVarLocalToData = {
                        FromDate: jVarLocalFromDate,
                        ToDate: jVarLocalToDate,
                        FromDateForPrint: this.DateFuncs.PresentDateInddMMyyyy(),
                        ToDateForPrint: this.DateFuncs.PresentDateInddMMyyyy(),
                    };

                    let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Daily.ShowDates();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalToData)
                },
                ShowMonths: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget: jVarLocalCurrentTarget });

                    let jVarLocalFromDate = this.DateFuncs.PresentDateInyyyyMMdd()
                    let jVarLocalToDate = this.DateFuncs.PresentDateInyyyyMMdd();

                    let jVarLocalDataToHandlebars = {
                        FromDate: jVarLocalFromDate,
                        ToDate: jVarLocalToDate,
                        FromDateForPrint: this.DateFuncs.PresentDateInddMMyyyy(),
                        ToDateForPrint: this.DateFuncs.PresentDateInddMMyyyy(),
                    };

                    let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Daily.ShowDates();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataToHandlebars);
                },
                ShowBillsMultiColumns: async () => {
                    let jVarLocalDataFromServer;

                    let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Daily.ShowBillsMultiColumns();
                    jVarLocalDataFromServer = await this.ApiFuncs.Transactions.Sales.PullDataWithDayNumber();
                    jVarGlobalPresentViewData = jVarLocalDataFromServer;
                    Handlebars.registerPartial("Hbs1", "<h1>");

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer)
                },
                ShowBillsWithDateFilters: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;
                    let jVarLocalFromDate = document.getElementById("FromDate");
                    let jVarLocalToDate = document.getElementById("ToDate");

                    let jVarLocalFromDateValue = jVarLocalFromDate.value;
                    let jVarLocalToDateValue = jVarLocalToDate.value;

                    let jVarLocalDataFromServer;
                    jVarLocalDataFromServer = await this.ApiFuncs.Transactions.Sales.PullDataWithDayNumber();

                    let jVarLocalDataFiltered = Object.values(jVarLocalDataFromServer).filter(element => {
                        return (new Date(element.Date).getTime() >= new Date(jVarLocalFromDateValue).getTime()) && (new Date(element.Date).getTime() <= new Date(jVarLocalToDateValue).getTime());
                    });

                    let jVarLocalDataToShow = this.JsFuncs.Reports.Daily.CommonFuncs.PrepareData.ForFooter({
                        inDataToShow: jVarLocalDataFiltered
                    });

                    await this.JsFuncs.Reports.Daily.CommonFuncs.InCard.InCardBody({
                        inCurrentTarget: jVarLocalCurrentTarget,
                        inDataToShow: jVarLocalDataToShow
                    });
                },
                CommonFuncs: {
                    InCard: {
                        InCardBody: async ({ inDataToShow, inCurrentTarget }) => {
                            let jVarClosestCard = inCurrentTarget.closest(".card");
                            let jVarCardBody = jVarClosestCard.querySelector(".card-body");
                            let jVarCardFooter = jVarClosestCard.querySelector(".card-footer");

                            let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Daily.ShowBillsMultiColumns();
                            let jVarLocalRawTemplateForFooter = await this.HtmlFuns.Reports.Daily.ShowFooter();

                            jVarCardBody.innerHTML = Handlebars.compile(jVarLocalRawTemplate)(inDataToShow);
                            jVarCardFooter.innerHTML = Handlebars.compile(jVarLocalRawTemplateForFooter)(inDataToShow)
                        }
                    },
                    PrepareData: {
                        ForFooter: ({ inDataToShow }) => {
                            let jVarLocalAmountKey = "Amount";
                            let jVarLocalQtyKey = "Qty";

                            let jVarLocalReturnObject = {};
                            jVarLocalReturnObject.BodyData = inDataToShow;

                            let jVarLocalAmountArray = inDataToShow.map(element => {
                                if (jVarLocalAmountKey in element) {
                                    return parseFloat(element[jVarLocalAmountKey]);
                                } else {
                                    return 0;
                                };
                            });

                            let jVarLocalTotalAmount = jVarLocalAmountArray.reduce(function (a, b) { return a + b; }, 0);

                            let jVarLocalPcsArray = inDataToShow.map(element => {
                                if (jVarLocalQtyKey in element) {
                                    return parseFloat(element[jVarLocalQtyKey]);
                                } else {
                                    return 0;
                                };
                            });

                            let jVarLocalTotalPcs = jVarLocalPcsArray.reduce(function (a, b) { return a + b; }, 0);

                            jVarLocalReturnObject.FooterData = {
                                TotalBills: inDataToShow.length,
                                TotalQty: jVarLocalTotalPcs,
                                TotalAmount: jVarLocalTotalAmount,
                            };

                            return jVarLocalReturnObject;
                        }
                    }
                }

            },
            WithBalance: async () => {
                let jVarLocalPresentDate = new Date();
                jVarLocalPresentDate.setDate(jVarLocalPresentDate.getDate() + 2);
                let jVarLocalSystemDate = this.DateFuncs.yyyyMMdd({ inDate: jVarLocalPresentDate });
                return await this.JsFuncs.Reports.Stock.CommonFuncs.ForOpening({ inDate: jVarLocalSystemDate });
            },
            Monthly: {
                ShowDatesForFilters: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget: jVarLocalCurrentTarget });

                    let jVarLocalFromDate = this.DateFuncs.PresentDateInyyyyMMdd()
                    let jVarLocalToDate = this.DateFuncs.PresentDateInyyyyMMdd();

                    let jVarLocalDataToHandlebars = {
                        FromDate: jVarLocalFromDate,
                        ToDate: jVarLocalToDate,
                        FromDateForPrint: this.DateFuncs.PresentDateInddMMyyyy(),
                        ToDateForPrint: this.DateFuncs.PresentDateInddMMyyyy(),
                    };

                    let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Daily.ShowDatesForMonthly();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataToHandlebars);
                },
                GenerateReport: {
                    StartFunc: async (inEvent) => {
                        let jVarLocalCurrentTarget = inEvent.currentTarget;

                        let jVarLocalDataToShow = await this.JsFuncs.Reports.Monthly.GenerateReport.PullData.StartFunc();
                        let jVarLocalDateTransformed = JSON.parse(JSON.stringify(jVarLocalDataToShow));

                        jVarLocalDateTransformed.BodyData = jVarLocalDateTransformed.BodyData.map(element => {
                            if ("Date" in element) {
                                element.Date = jFCommonFuncsClass.DateFuncs.ddMMyyyy({ inDate: element.Date });
                            };

                            return element;
                        });

                        await this.JsFuncs.Reports.Monthly.GenerateReport.ShowInHtml.InCard.InCardBody({
                            inCurrentTarget: jVarLocalCurrentTarget,
                            inDataToShow: jVarLocalDateTransformed
                        });
                    },
                    PullData: {
                        StartFunc: async () => {
                            let jVarLocalDataFromServer = await this.ApiFuncs.Transactions.Sales.PullDataWithDayNumber();

                            let jVarLocalGroupedData = this.JsFuncs.GeneralFuncs.ForManipulation.SingleColumnAndMultipleDataRetruned({
                                inDataToSort: Object.values(jVarLocalDataFromServer),
                                inGroupByColumn: "Date",
                                inColumnsToGroupByAsInt: ["Amount"]
                            });

                            let jVarLocalDataFiltered = await this.JsFuncs.Reports.Monthly.GenerateReport.PullData.CommonFuncs.FilterFunc({ inData: jVarLocalGroupedData });
                            let jVarLocalDataToShow = this.JsFuncs.Reports.Daily.CommonFuncs.PrepareData.ForFooter({
                                inDataToShow: jVarLocalDataFiltered
                            });
                            return jVarLocalDataToShow;
                        },
                        CommonFuncs: {
                            FilterFunc: async ({ inData }) => {
                                let jVarLocalFromDate = document.getElementById("FromDate");
                                let jVarLocalToDate = document.getElementById("ToDate");

                                let jVarLocalFromDateValue = jVarLocalFromDate.value;
                                let jVarLocalToDateValue = jVarLocalToDate.value;

                                let jVarLocalDataFiltered = inData.filter(element => {
                                    return (new Date(element.Date).getTime() >= new Date(jVarLocalFromDateValue).getTime()) && (new Date(element.Date).getTime() <= new Date(jVarLocalToDateValue).getTime());
                                });

                                return jVarLocalDataFiltered;
                            }
                        }
                    },
                    ShowInHtml: {
                        InCard: {
                            InCardBody: async ({ inDataToShow, inCurrentTarget }) => {
                                let jVarClosestCard = inCurrentTarget.closest(".card");
                                let jVarCardBody = jVarClosestCard.querySelector(".card-body");
                                let jVarCardFooter = jVarClosestCard.querySelector(".card-footer");

                                let jVarLocalRawTemplate = await this.HtmlFuns.Reports.Monthly.InCard.InBody();
                                let jVarLocalRawTemplateForFooter = await this.HtmlFuns.Reports.Monthly.InCard.InFooter();

                                jVarCardBody.innerHTML = Handlebars.compile(jVarLocalRawTemplate)(inDataToShow);
                                jVarCardFooter.innerHTML = Handlebars.compile(jVarLocalRawTemplateForFooter)(inDataToShow)
                            }
                        }
                    }
                }
            }
        },
        Common: {
            DataList: {
                Products: {
                    FillDataList: async () => {
                        let jVarLocalDataFromServer = JSON.parse(localStorage.getItem("Masters-Products"));
                        let jVarLocalRawTemplate = await this.HtmlFuns.Common.DataList.Products();
                        let jVarLocalMastersProductsId = document.getElementById("Masters-Products");
                        let jVarLocalParent;

                        if (jVarLocalMastersProductsId === null) {
                            var elem = document.createElement('div');

                            elem.innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer);

                            document.body.appendChild(elem);
                        } else {
                            jVarLocalParent = jVarLocalMastersProductsId.parentElement;
                            jVarLocalParent.innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer);
                        };
                    }
                },
                Members: {
                    FillDataList: async () => {
                        let jVarLocalDataFromServer = JSON.parse(localStorage.getItem("Masters-Members"));
                        let jVarLocalRawTemplate = await this.HtmlFuns.Common.DataList.Members();
                        let jVarLocalMastersMembersId = document.getElementById("Masters-Members");
                        let jVarLocalParent;

                        if (jVarLocalMastersMembersId === null) {
                            var elem = document.createElement('div');

                            elem.innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer);

                            document.body.appendChild(elem);
                        } else {
                            jVarLocalParent = jVarLocalMastersProductsId.parentElement;
                            jVarLocalMastersMembersId.innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer);
                        }

                    }
                }
            },
            ToLocalStorage: async () => {
                let jVarLocalDataFromServer;

                jVarLocalDataFromServer = await jFCommonFuncsClass.ApiFuncs.Masters.Products.PullData();

                localStorage.setItem("Masters-Products", JSON.stringify(jVarLocalDataFromServer));

                jVarLocalDataFromServer = await jFCommonFuncsClass.ApiFuncs.Masters.Members.PullData();

                localStorage.setItem("Masters-Members", JSON.stringify(jVarLocalDataFromServer));
            },
        },
        Masters: {
            Products: {
                ShowAllFromData: async () => {
                    let jVarLocalDataFromServer = await jFCommonFuncsClass.ApiFuncs.Masters.Products.PullData();
                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Masters.Products.ShowAll();
                    let jVarLocalHtmlInput;

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer)
                    jVarLocalHtmlInput = document.querySelector("input");

                    jVarLocalHtmlInput.focus();
                },
                ShowAll: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;
                    this.JsFuncs.CommonFuncs.NavItemFocus(jVarLocalCurrentTarget);
                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Products";

                    myModal.show();
                },
                ProductsShowAll: async (inCurrentTarget) => {
                    this.JsFuncs.CommonFuncs.NavItemFocus(inCurrentTarget);
                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Products";

                    myModal.show();
                },
                CreateNew: async () => {
                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Masters.Products.CreateNew();
                    let jVarLocalHtmlInput;

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)({});
                    jVarLocalHtmlInput = document.querySelector("input");

                    jVarLocalHtmlInput.focus();
                },
                Insert: async () => {
                    let jVarLocalKTFoot = document.getElementById("KTFoot");
                    let jVarLocalTFootFirstInput = jVarLocalKTFoot.querySelector("input");

                    jVarLocalKTFoot.style.display = "";
                    jVarLocalTFootFirstInput.focus();
                },
                Save: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;
                    let jVarLocalFromPrepareObject = await jCommonFormFuncsClass.Save();

                    if (jVarLocalFromPrepareObject.KTF) {
                        let LocalData = await this.ApiFuncs.Masters.Products.PushData({ inDataToInsert: jVarLocalFromPrepareObject.KResult });

                        if (LocalData) {
                            await this.JsFuncs.Masters.Products.ProductsShowAll(jVarLocalCurrentTarget);
                            await jFCommonFuncsClass.JsFuncs.Common.ToLocalStorage();
                            await jFCommonFuncsClass.JsFuncs.Common.DataList.Products.FillDataList();
                            //    await jFCommonFuncsClass.JsFuncs.Common.DataList.Members.FillDataList();
                        };
                    };
                },
                Table: {
                    TableBody: {
                        Row: {
                            Edit: (inEvent) => {
                                let jVarLocalCurrentTarget = inEvent.currentTarget;
                                let jVarLocalClosestTr = jVarLocalCurrentTarget.closest("tr");

                                this.JsFuncs.Masters.Products.Table.TableBody.Row.CommonFuncs.Edit.ChangeRowToEditable({ inClosestTr: jVarLocalClosestTr });
                                this.JsFuncs.Masters.Products.Table.TableBody.Row.CommonFuncs.Edit.UpdateButtonVisible({ inClosestTr: jVarLocalClosestTr });
                                this.JsFuncs.Masters.Products.Table.TableBody.Row.CommonFuncs.Edit.FirstControlFocus({ inClosestTr: jVarLocalClosestTr });
                                jVarLocalCurrentTarget.style.display = "none";
                            },
                            Update: async (inEvent, inRowPk) => {
                                let jVarLocalCurrentTarget = inEvent.currentTarget;
                                let jVarLocalClosestTr = jVarLocalCurrentTarget.closest("tr");
                                let jVarLocalRowElements = jVarLocalClosestTr.querySelectorAll("input");
                                let jVarLocalFromPrepareObjectFromRow = jCommonFormFuncsClass.PrepareObjectFromRow({ inJVarLocalRowElements: jVarLocalRowElements });
                                let jVarLocalDataToUpdate = {};

                                if (jVarLocalFromPrepareObjectFromRow.KTF) {
                                    jVarLocalDataToUpdate[inRowPk] = jVarLocalFromPrepareObjectFromRow.KResult;
                                    let LocalData = await this.ApiFuncs.Masters.Products.UpdateData({ inDataToUpdate: jVarLocalDataToUpdate });

                                    if (LocalData) {
                                        jFCommonFuncsClass.JsFuncs.Masters.Products.ProductsShowAll(jVarLocalCurrentTarget);
                                    };
                                };
                            },
                            CommonFuncs: {
                                Edit: {
                                    ChangeRowToEditable: ({ inClosestTr }) => {
                                        let jVarLocalEditableTds = inClosestTr.querySelectorAll("[data-editable=true]")
                                        let jVarLocalContentInsideTd;
                                        let jVarLocalName;
                                        jVarLocalEditableTds.forEach((spanElement) => {
                                            jVarLocalContentInsideTd = spanElement.innerHTML.trim();
                                            jVarLocalName = spanElement.dataset.name;

                                            spanElement.innerHTML = `<input name="${jVarLocalName}" class="form-control fs-1" autocomplete="off" value='${jVarLocalContentInsideTd}'>`;
                                        });
                                    },
                                    FirstControlFocus: ({ inClosestTr }) => {
                                        let jVarLocalinput = inClosestTr.querySelector("input");
                                        jVarLocalinput.focus();
                                    },
                                    UpdateButtonVisible: ({ inClosestTr }) => {
                                        let jVarLocalUpdateTds = inClosestTr.querySelectorAll("[data-updatebutton=true]")

                                        jVarLocalUpdateTds.forEach((spanElement) => {
                                            spanElement.style.display = "";
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            },
            Members: {
                ShowAll: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    this.JsFuncs.CommonFuncs.NavItemFocus(jVarLocalCurrentTarget);
                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Members";

                    myModal.show();
                },
                MembersShowAll: async (inCurrentTarget) => {
                  
                    this.JsFuncs.CommonFuncs.NavItemFocus(inCurrentTarget);
                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Members";

                    myModal.show();
                },
                ShowAllData: async () => {
                    let jVarLocalDataFromServer = await jFCommonFuncsClass.ApiFuncs.Masters.Members.PullData();
                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Masters.Members.ShowAll();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer)
                },
                CreateNew: async () => {
                    let jVarLocalRawTemplate = await jFCommonFuncsClass.HtmlFuns.Masters.Members.CreateNew();
                    let jVarLocalHtmlInput;

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)({});
                    jVarLocalHtmlInput = document.querySelector("input");

                    jVarLocalHtmlInput.focus();
                },
                Save: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    let jVarLocalFromPrepareObject = await jCommonFormFuncsClass.Save();

                    if (jVarLocalFromPrepareObject.KTF) {
                        let LocalData = await this.ApiFuncs.Masters.Members.PushData({ inDataToInsert: jVarLocalFromPrepareObject.KResult });

                        if (LocalData) {
                            await this.JsFuncs.Masters.Members.MembersShowAll(jVarLocalCurrentTarget);
                        };
                    };
                }
            }
        },
        Transactions: {
            Sales: {
                CreateNew: async (inHeadPk) => {
                    if (inHeadPk > 0) {
                        Swal.fire({
                            title: 'Member Name',
                            html: `<input type="text" id="Member" class="swal2-input" placeholder="Member" list="Masters-Members">`,
                            confirmButtonText: 'Save and Print',
                            focusConfirm: false,
                            preConfirm: () => {
                                const Member = Swal.getPopup().querySelector('#Member').value

                                return { Member: Member }
                            }
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                if (result.value.Member.length > 0) {
                                    let jVarLocalMember = result.value.Member;
                                    let jVarLocalDataToUpdate = {
                                        Member: jVarLocalMember
                                    };

                                    let jVarLocalFromMember = await this.ApiFuncs.Transactions.Sales.Update({
                                        inDataToUpdate: jVarLocalDataToUpdate, inPk: inHeadPk
                                    });

                                    if (jVarLocalFromMember.success) {
                                        BillPrintCommonFuncs.PrintOriginalBillWithDuplicate(inHeadPk);

                                        jFCommonFuncsClass.JsFuncs.Transactions.Sales.FirstRow();
                                    };
                                };
                            };
                        });
                    };
                },
                ShowAll: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;
                    let jVarLocalHtmlInput;

                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget: jVarLocalCurrentTarget });

                    let jVarLocalDataFromServer;
                    let jVarLocalRawTemplate = await this.HtmlFuns.Transactions.Sales.ShowAll();
                    jVarLocalDataFromServer = await this.ApiFuncs.Transactions.Sales.PullData();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer)

                    jVarLocalHtmlInput = document.querySelector("input");

                    jVarLocalHtmlInput.focus();
                },
                FirstRow: async () => {
                    let jVarLocalDataFromServer = await this.JsFuncs.Reports.WithBalance();
                    let jVarLocalRawTemplate = await this.HtmlFuns.Transactions.Sales.FirstRow();

                    //PresentDateInddMMyyyy
                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer);
                    document.getElementById("ShowBillId").innerHTML = `<p class="fs-1">${this.DateFuncs.PresentDateInddMMyyyy()}</p>`;
                    this.JsFuncs.CommonFuncs.DefaultFocus();
                },
                Save: async () => {
                    let jVarLocalFromPrepareObject = await jCommonFormFuncsClass.Save();

                    if (jVarLocalFromPrepareObject.KTF) {
                        let LocalData = await CommonFuncs.Api.Transactions.Sales.FPushData({ inDataToInsert: jVarLocalFromPrepareObject.KResult });

                        if (LocalData.success) {
                            await this.JsFuncs.Transactions.Sales.ShowAll();
                        };
                        //return await LocalData.success;
                    };
                },
                SaveFuncs: {
                    StartFunc: async (inItemName, inPrice) => {
                        let jVarLocalPopUpTemplate = await this.HtmlFuns.SweetAlert2.Transactions.Sales.FirstRow();
                        let jVarLocalPopUpHtml = Handlebars.compile(jVarLocalPopUpTemplate)({ inItemName, inPrice, inQty: 1 });

                        await Swal.fire({
                            title: 'Enter Item Details',
                            html: jVarLocalPopUpHtml,
                            inputAttributes: {
                                autocapitalize: 'off'
                            },
                            showCancelButton: true,
                            confirmButtonText: 'Insert',
                            showLoaderOnConfirm: true,
                            didOpen: () => {
                                Swal.getHtmlContainer().querySelector('#Qty').focus()
                            },
                            preConfirm: async (login) => {
                                const jVarLocalQty = Swal.getPopup().querySelector('#Qty').value

                                return { Qty: parseInt(jVarLocalQty) };
                            },
                            allowOutsideClick: () => !Swal.isLoading(),
                            backdrop: true
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                await this.JsFuncs.Transactions.Sales.SaveFuncs.PostSweetAlert({ inItemName, inPrice, inQty: result.value.Qty });
                            };
                        })
                    },
                    PostSweetAlert: async ({ inItemName, inPrice, inQty }) => {
                        let jVarLocalFromMaxDate = await this.ApiFuncs.Transactions.Sales.MaxDate();
                        let jVarLocalPresentPkHtml = document.getElementById("PkId");
                        let jVarLocalPresentPk;
                        let jVarLocalTemplate;
                        let jVarLocalDataToShow;
                        let jVarLocalDateDiff;
                        let jVarLocalSystemDate = this.DateFuncs.yyyyMMdd({ inDate: new Date() });

                        if (jVarLocalSystemDate >= jVarLocalFromMaxDate || jVarLocalFromMaxDate === undefined) {
                            if (jVarLocalPresentPkHtml === null) {
                                let LocalReturnFromFirstRow = await this.ApiFuncs.Transactions.CommonFuncs.FirstRow({ inItemName, inPrice, inQty });

                                if (LocalReturnFromFirstRow.KTF) {
                                    jVarLocalPresentPk = LocalReturnFromFirstRow.KResult.PK;
                                };
                            } else {
                                jVarLocalPresentPk = parseInt(jVarLocalPresentPkHtml.innerText);

                                let LocalReturnFromNextRowOnwards = await this.ApiFuncs.Transactions.CommonFuncs.NextRowOnwards({
                                    inPk: jVarLocalPresentPk,
                                    inItemName, inPrice,
                                    inQty
                                });
                            };

                            if (jVarLocalPresentPk > 0) {
                                jVarLocalTemplate = await this.HtmlFuns.Transactions.Sales.FirstRowSaved();
                                jVarLocalDataToShow = await this.ApiFuncs.Transactions.Sales.ShowByPk({ inPk: jVarLocalPresentPk });

                                document.getElementById("ShowBillId").innerHTML = Handlebars.compile(jVarLocalTemplate)(jVarLocalDataToShow);
                            };
                        } else {
                            jVarLocalDateDiff = (new Date(jVarLocalSystemDate) - new Date(jVarLocalFromMaxDate)) / (1000 * 60 * 60 * 24);

                            swal.fire(`Change system Date to ${jVarLocalFromMaxDate}`);
                        };
                    },
                    ShowBillOnScreen: async ({ inPresentPk }) => {
                        if (inPresentPk > 0) {
                            let jVarLocalTemplate = await this.HtmlFuns.Transactions.Sales.FirstRowSaved();
                            let jVarLocalDataToShow = await this.ApiFuncs.Transactions.Sales.ShowByPk({ inPk: inPresentPk });

                            document.getElementById("ShowBillId").innerHTML = Handlebars.compile(jVarLocalTemplate)(jVarLocalDataToShow);
                        };
                    },
                    InputKeyPress: async (inEvent) => {
                        if (inEvent.keyCode === 13) {
                            swal.clickConfirm();
                        };
                    }
                },
                ShowByPk: async ({ inPk }) => {
                    let jVarLocalReturnObject = await this.ApiFuncs.Transactions.Sales.ShowByPk({ inPk });
                    //= await this.ApiFuncs.Transactions.SalesItems.PullData();
                    let jVarLocalFromHtmlForSinleShow = await this.HtmlFuns.Transactions.Sales.ShowFuncs.SingleEntry();


                    document.getElementById("ShowBillId").innerHTML = Handlebars.compile(jVarLocalFromHtmlForSinleShow)(jVarLocalReturnObject);
                },
                InvGrid: {
                    Delete: {
                        BeforePrint: async (inRowPk) => {
                            Swal.fire({
                                title: 'Do you want to Delete?',
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: 'Continue',
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    //    Swal.fire('Deleted!', '', 'success');

                                    this.ApiFuncs.Transactions.Sales.InvGrid.Delete.BeforePrint({ inRowPk }).then(PromiseData => {
                                        let jVarLocalPresentPkHtml = document.getElementById("PkId");
                                        let jVarLocalPresentPk = parseInt(jVarLocalPresentPkHtml.innerText);

                                        if (PromiseData.success) {
                                            this.JsFuncs.Transactions.Sales.SaveFuncs.ShowBillOnScreen({ inPresentPk: jVarLocalPresentPk }).then(PromiseDataFromBillOnScreen => {

                                            });
                                        };
                                    });
                                };
                            })
                        }
                    }
                }
            },
            Inwards: {
                CreateNew: async () => {
                    Swal.fire({
                        title: 'Login Form',
                        html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
                        <input type="password" id="password" class="swal2-input" placeholder="Password">`,
                        confirmButtonText: 'Sign in',
                        focusConfirm: false,
                        preConfirm: () => {
                            const login = Swal.getPopup().querySelector('#login').value
                            const password = Swal.getPopup().querySelector('#password').value
                            if (!login || !password) {
                                Swal.showValidationMessage(`Please enter login and password`)
                            }
                            return { login: login, password: password }
                        }
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            let jVarLocalFromValidate;
                            let jVarLocalUserName = result.value.login;
                            let jVarLocalPassWord = result.value.password;

                            jVarLocalFromValidate = await CommonFuncs.Api.Admin.Users.Validate({ inUserName: jVarLocalUserName, inPassWord: jVarLocalPassWord });

                            if (jVarLocalFromValidate.KTF) {

                                let jVarLocalRawTemplate = await this.HtmlFuns.Transactions.Inwards.CreateNew();

                                document.getElementById("KCont1").innerHTML = jVarLocalRawTemplate;
//                                 jVarLocalHtmlInput = document.querySelector("input");
// console.log("jVarLocalHtmlInput  : ",jVarLocalHtmlInput);
//                                 jVarLocalHtmlInput.focus();
                            };
                        };
                    });
                },
                ShowAll: async (inEvent) => {
                    let jVarLocalCurrentTarget = inEvent.currentTarget;

                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget: jVarLocalCurrentTarget });

                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Inwards";

                    myModal.show();
                },
                InwardsShowAll: async (inCurrentTarget) => {
                    this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                    this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget });

                    let jVarLocalId = "LoginModalId";
                    var myModal = new bootstrap.Modal(document.getElementById(jVarLocalId), { keyboard: true, focus: true });

                    var jVarLocalLoginModalSubmit = document.getElementById("LoginModalSubmit");
                    jVarLocalLoginModalSubmit.dataset.targetfunc = "Inwards";

                    myModal.show();
                },
                ShowAllOnly: async () => {
                    let jVarLocalDataFromServer = await this.ApiFuncs.Transactions.Inwards.PullData();
                    let jVarLocalRawTemplate = await this.HtmlFuns.Transactions.Inwards.ShowAll();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer)
                },
                FirstRow: async () => {
                    let jVarLocalDataFromServer = await this.ApiFuncs.Masters.Products.PullData();
                    let jVarLocalRawTemplate = await this.HtmlFuns.Transactions.Sales.FirstRow();

                    document.getElementById("KCont1").innerHTML = Handlebars.compile(jVarLocalRawTemplate)(jVarLocalDataFromServer);
                    this.JsFuncs.CommonFuncs.DefaultFocus();
                },
                Save: async (inEvent) => {
                    let jVarLocalCurrentTarget=inEvent.currentTarget;
                    let jVarLocalFromPrepareObject = await jCommonFormFuncsClass.Save();

                    if (jVarLocalFromPrepareObject.KTF) {
                        let LocalData = await CommonFuncs.Api.Transactions.Inwards.PushData({ inDataToInsert: jVarLocalFromPrepareObject.KResult });

                        if (LocalData.success) {
                            await this.JsFuncs.Transactions.Inwards.InwardsShowAll(jVarLocalCurrentTarget);
                        };
                        //return await LocalData.success;
                    };
                },
                SaveFuncs: {
                    StartFunc: async (inItemName, inPrice) => {
                        let jVarLocalPopUpTemplate = await this.HtmlFuns.SweetAlert2.Transactions.Sales.FirstRow();
                        let jVarLocalPopUpHtml = Handlebars.compile(jVarLocalPopUpTemplate)({ inItemName, inPrice, inQty: 1 });

                        await Swal.fire({
                            title: 'Submit your Github username',
                            html: jVarLocalPopUpHtml,
                            inputAttributes: {
                                autocapitalize: 'off'
                            },
                            showCancelButton: true,
                            confirmButtonText: 'Insert',
                            showLoaderOnConfirm: true,
                            didOpen: () => {
                                Swal.getHtmlContainer().querySelector('#Qty').focus()
                            },
                            preConfirm: async (login) => {
                                const jVarLocalQty = Swal.getPopup().querySelector('#Qty').value

                                return { Qty: jVarLocalQty };
                            },
                            allowOutsideClick: () => !Swal.isLoading(),
                            backdrop: true
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                await this.JsFuncs.Transactions.Sales.SaveFuncs.PostSweetAlert({ inItemName, inPrice, inQty: result.value.Qty });
                            };
                        })
                    },
                    PostSweetAlert: async ({ inItemName, inPrice, inQty }) => {
                        let jVarLocalFromMaxDate = await this.ApiFuncs.Transactions.Sales.MaxDate();
                        let jVarLocalPresentPkHtml = document.getElementById("PkId");
                        let jVarLocalPresentPk;
                        let jVarLocalTemplate;
                        let jVarLocalDataToShow;
                        let jVarLocalSystemDate = this.DateFuncs.yyyyMMdd({ inDate: new Date() });
                        let jVarLocalDateDiff;

                        if (jVarLocalSystemDate >= jVarLocalFromMaxDate || jVarLocalFromMaxDate === undefined) {
                            if (jVarLocalPresentPkHtml === null) {
                                let LocalReturnFromFirstRow = await this.ApiFuncs.Transactions.CommonFuncs.FirstRow({ inItemName, inPrice, inQty });

                                if (LocalReturnFromFirstRow.KTF) {
                                    jVarLocalPresentPk = LocalReturnFromFirstRow.KResult.PK;
                                };
                            } else {
                                jVarLocalPresentPk = parseInt(jVarLocalPresentPkHtml.innerText);

                                let LocalReturnFromNextRowOnwards = await this.ApiFuncs.Transactions.CommonFuncs.NextRowOnwards({
                                    inPk: jVarLocalPresentPk,
                                    inItemName, inPrice,
                                    inQty
                                });
                            };

                            if (jVarLocalPresentPk > 0) {
                                jVarLocalTemplate = await this.HtmlFuns.Transactions.Sales.FirstRowSaved();
                                jVarLocalDataToShow = await this.ApiFuncs.Transactions.Sales.ShowByPk({ inPk: jVarLocalPresentPk });

                                document.getElementById("ShowBillId").innerHTML = Handlebars.compile(jVarLocalTemplate)(jVarLocalDataToShow);
                            };
                        } else {
                            jVarLocalDateDiff = (new Date(jVarLocalSystemDate) - new Date(jVarLocalFromMaxDate)) / (1000 * 60 * 60 * 24);

                            swal.fire(`Change system Date to ${jVarLocalFromMaxDate}`);
                        };
                    },
                    InputKeyPress: async (inEvent) => {
                        if (inEvent.keyCode) {
                            swal.clickConfirm();
                        };
                    }
                },
                ShowByPk: async ({ inPk }) => {
                    let jVarLocalReturnObject = await this.ApiFuncs.Transactions.Sales.ShowByPk({ inPk });
                    //= await this.ApiFuncs.Transactions.SalesItems.PullData();
                    let jVarLocalFromHtmlForSinleShow = await this.HtmlFuns.Transactions.Sales.ShowFuncs.SingleEntry();


                    document.getElementById("ShowBillId").innerHTML = Handlebars.compile(jVarLocalFromHtmlForSinleShow)(jVarLocalReturnObject);
                },
                InvGrid: {
                    Delete: {
                        BeforePrint: (inRowPk) => {
                            this.ApiFuncs.Transactions.Sales.InvGrid.Delete.BeforePrint({ inRowPk });

                        }
                    }
                },
                Table: {
                    TableBody: {
                        Row: {
                            Update: async (inEvent, inRowPk) => {
                                let jVarLocalCurrentTarget = inEvent.currentTarget;
                                let jVarLocalClosestTr = jVarLocalCurrentTarget.closest("tr");
                                let jVarLocalRowElements = jVarLocalClosestTr.querySelectorAll("input");
                                let jVarLocalFromPrepareObjectFromRow = jCommonFormFuncsClass.PrepareObjectFromRow({ inJVarLocalRowElements: jVarLocalRowElements });
                                let jVarLocalDataToUpdate = {};

                                if (jVarLocalFromPrepareObjectFromRow.KTF) {
                                    jVarLocalDataToUpdate[inRowPk] = jVarLocalFromPrepareObjectFromRow.KResult;

                                    let LocalData = await this.ApiFuncs.Transactions.Inwards.Data.Update({ inDataToUpdate: jVarLocalDataToUpdate });

                                    if (LocalData) {
                                        this.JsFuncs.Transactions.Inwards.ShowAllOnly();
                                    };
                                };
                            }
                        }
                    }
                }
            }
        },
        CommonFuncs: {
            DefaultFocus: () => {
                let jVarLocalHtmlInput = document.querySelector("input");

                jVarLocalHtmlInput.focus();
            },
            NavItemFocus: (inCurrentTarget) => {
                this.HtmlFuns.MainMenuFuncs.RemoveInfoInAllLi();
                this.HtmlFuns.MainMenuFuncs.SetFocustToActiveAnchor({ inCurrentTarget });
            },
            Table: {
                Body: {
                    Row: {
                        Edit: {
                            StartFunc: (inEvent) => {
                                let jVarLocalCurrentTarget = inEvent.currentTarget;
                                let jVarLocalClosestTr = jVarLocalCurrentTarget.closest("tr");

                                this.JsFuncs.CommonFuncs.Table.Body.Row.Edit.ChangeRowToEditable({ inClosestTr: jVarLocalClosestTr });
                                this.JsFuncs.CommonFuncs.Table.Body.Row.Edit.UpdateButtonVisible({ inClosestTr: jVarLocalClosestTr });
                                this.JsFuncs.CommonFuncs.Table.Body.Row.Edit.FirstControlFocus({ inClosestTr: jVarLocalClosestTr });

                                //this.JsFuncs.Masters.Products.Table.TableBody.Row.CommonFuncs.Edit.UpdateButtonVisible({ inClosestTr: jVarLocalClosestTr });
                                //this.JsFuncs.Masters.Products.Table.TableBody.Row.CommonFuncs.Edit.FirstControlFocus({ inClosestTr: jVarLocalClosestTr });
                                jVarLocalCurrentTarget.style.display = "none";
                            },
                            ChangeRowToEditable: ({ inClosestTr }) => {
                                let jVarLocalEditableTds = inClosestTr.querySelectorAll("[data-editable=true]")
                                let jVarLocalContentInsideTd;
                                let jVarLocalName;
                                jVarLocalEditableTds.forEach((spanElement) => {
                                    jVarLocalContentInsideTd = spanElement.innerHTML.trim();
                                    jVarLocalName = spanElement.dataset.name;

                                    spanElement.innerHTML = `<input name="${jVarLocalName}" class="form-control fs-1" autocomplete="off" value='${jVarLocalContentInsideTd}'>`;
                                });
                            },
                            FirstControlFocus: ({ inClosestTr }) => {
                                let jVarLocalinput = inClosestTr.querySelector("input");
                                let jVarLocalTotalLength = jVarLocalinput.value.length;
                                jVarLocalinput.setSelectionRange(jVarLocalTotalLength, jVarLocalTotalLength);
                                jVarLocalinput.focus();
                            },
                            UpdateButtonVisible: ({ inClosestTr }) => {
                                let jVarLocalUpdateTds = inClosestTr.querySelectorAll("[data-updatebutton=true]")

                                jVarLocalUpdateTds.forEach((spanElement) => {
                                    spanElement.style.display = "";
                                });
                            }
                        }
                    }
                }

            }
        },
        HandlebarsFuncs: {
            HelperFuns: {
                ForSno: () => {
                    Handlebars.registerHelper('ForSNo', function (item) {
                        return item + 1;
                    });
                },
                ForAmount: () => {
                    Handlebars.registerHelper('ForAmount', function (inQty, inPrice) {
                        return parseFloat(inQty) * parseFloat(inPrice);
                    });
                },
                ShowInIndianDateFormat: () => {
                    Handlebars.registerHelper('ShowInIndianDateFormat', function (value, options) {
                        //return this.JsFuncs.GeneralFuncs.addThousand(parseFloat(value).toFixed(2), 2);
                        let decimalpoints = 2;
                        var input = value;
                        var output = value;
                        var zerovalue = "0";

                        if (parseFloat(input)) {
                            input = new String(input); // so you can perform string operations

                            if (input.indexOf(".") === -1) {
                                //if no decimal is present in input

                                output = IndianFormat(input.trim());

                                if (decimalpoints > 0) {
                                    //if decimalpoints are needed then add that many zeros with . to the output
                                    output += "." + zerovalue.repeat(decimalpoints);
                                }
                            }
                            else {
                                var parts = input.split("."); // remove the decimal part
                                //convert the integer to thousands value
                                parts[0] = IndianFormat(parts[0]);
                                //now check for the decimal portion length
                                if (parts[1].trim().length < decimalpoints) {
                                    //if decimal portion length is less then needed of decimalpoints
                                    //then insert the last need zeros as below
                                    parts[1] = parts[1].trim() + zerovalue.repeat(decimalpoints - parts[1].trim().length);
                                }
                                else {
                                    //if decimal portion needed is less then available
                                    //then trim the content needed
                                    parts[1] = parts[1].substring(0, decimalpoints);
                                }
                                //now join then split parts
                                output = parts.join(".");
                            }

                        }
                        return output;
                    });
                }
            },
            StartFunc: () => {
                this.JsFuncs.HandlebarsFuncs.HelperFuns.ForSno();
                this.JsFuncs.HandlebarsFuncs.HelperFuns.ForAmount();
                this.JsFuncs.HandlebarsFuncs.HelperFuns.ShowInIndianDateFormat();
            }
        },
        GeneralFuncs: {
            addThousand: (input, decimalpoints) => {
                var output = input;
                var zerovalue = "0";

                if (parseFloat(input)) {
                    input = new String(input); // so you can perform string operations

                    if (input.indexOf(".") === -1) {
                        //if no decimal is present in input

                        output = IndianFormat(input.trim());

                        if (decimalpoints > 0) {
                            //if decimalpoints are needed then add that many zeros with . to the output
                            output += "." + zerovalue.repeat(decimalpoints);
                        }
                    }
                    else {
                        var parts = input.split("."); // remove the decimal part
                        //convert the integer to thousands value
                        parts[0] = IndianFormat(parts[0]);
                        //now check for the decimal portion length
                        if (parts[1].trim().length < decimalpoints) {
                            //if decimal portion length is less then needed of decimalpoints
                            //then insert the last need zeros as below
                            parts[1] = parts[1].trim() + zerovalue.repeat(decimalpoints - parts[1].trim().length);
                        }
                        else {
                            //if decimal portion needed is less then available
                            //then trim the content needed
                            parts[1] = parts[1].substring(0, decimalpoints);
                        }
                        //now join then split parts
                        output = parts.join(".");
                    }

                }
                return output;
            },
            ForManipulation: {
                groupArrayOfObjects: ({ list, key }) => {
                    return list.reduce(function (rv, x) {
                        (rv[x[key]] = rv[x[key]] || []).push(x);
                        return rv;
                    }, {});
                },
                SingleColumnAndMultipleDataRetruned: ({ inDataToSort, inGroupByColumn, inColumnsDataFreezed = [], inColumnsToGroupByAsInt = [], inColumnsToGroupByAsFloat = [] }) => {
                    var result = [];
                    inDataToSort.reduce(function (res, value) {
                        if (!res[value[inGroupByColumn]]) {
                            res[value[inGroupByColumn]] = {};

                            Object.entries(value).forEach(
                                ([Loopkey, LoopValue]) => {
                                    if (Loopkey === inGroupByColumn) {
                                        res[value[inGroupByColumn]][inGroupByColumn] = LoopValue;
                                    } else {
                                        res[value[inGroupByColumn]][Loopkey] = 0;
                                    };
                                }
                            );

                            result.push(res[value[inGroupByColumn]])
                        };
                        Object.entries(value).forEach(
                            ([Loopkey, LoopValue]) => {
                                if (Loopkey !== inGroupByColumn) {
                                    if (inColumnsDataFreezed.includes(Loopkey)) {
                                        res[value[inGroupByColumn]][Loopkey] = LoopValue;
                                    } else {
                                        if (inColumnsToGroupByAsInt.includes(Loopkey)) {
                                            res[value[inGroupByColumn]][Loopkey] += parseInt(LoopValue);;
                                        } else {
                                            if (inColumnsToGroupByAsFloat.includes(Loopkey)) {
                                                res[value[inGroupByColumn]][Loopkey] += parseFloat(LoopValue);;
                                            }
                                        }
                                    }
                                };
                            }
                        );

                        return res;
                    }, {});
                    return result;
                }
            }
        },
        SweetAlert2: {
            Login: {
                Admin: {
                    Validate: async () => {
                        Swal.fire({
                            title: 'Login Form',
                            html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
                            <input type="password" id="password" class="swal2-input" placeholder="Password">`,
                            confirmButtonText: 'Sign in',
                            focusConfirm: false,
                            preConfirm: () => {
                                const login = Swal.getPopup().querySelector('#login').value
                                const password = Swal.getPopup().querySelector('#password').value
                                if (!login || !password) {
                                    Swal.showValidationMessage(`Please enter login and password`)
                                }
                                return { login: login, password: password }
                            }
                        }).then(async (result) => {
                            if (result.isConfirmed) {

                                let jVarLocalUserName = result.value.login;
                                let jVarLocalPassWord = result.value.password;

                                return await CommonFuncs.Api.Admin.Users.Validate({ inUserName: jVarLocalUserName, inPassWord: jVarLocalPassWord });

                            };
                        });
                    }
                }
            }
        },
        NeutralinoFuncs: {
            QuitFunc: async () => {
                await Neutralino.app.exit();
            }
        },
        BackUp: {
            StartFunc: async () => {
                this.JsFuncs.BackUp.CommonFuncs.GenerateZip().then(ResolveData => {
                    this.JsFuncs.BackUp.CommonFuncs.OpenInExplorer().then(ResolveData => {
                        //console.log("-----ResolveData--------", ResolveData);

                    }).catch(RejectData => {
                        console.log("-------------", RejectData);
                    });
                }).catch(RejectData => {
                    console.log("-------------", RejectData);
                });
            },
            CommonFuncs: {
                GenerateZip: () => {
                    return new Promise((resolve, reject) => {
                        // console.log("this is Generate Zip");
                        let jVarLocalReturnObject = {
                            KTF: false
                        };

                        //let jVarLocalCommand = 'powershell.exe -command  ".\\Backup.ps1"';
                        let jVarLocalCommand = 'powershell.exe -command "Compress-Archive -Force -Path .\\KeshavSoft\\KData\\JSON\\1008 -DestinationPath .\\Backup\\Data.zip"';

                        //Compress-Archive -Force -Path .\k1 -DestinationPath .\Data.zip

                        Neutralino.os.execCommand(jVarLocalCommand).then(PromiseDataFromOs => {
                            if (PromiseDataFromOs.exitCode === 0) {
                                resolve();
                            } else {
                                reject();
                            }
                        });

                        //return await jVarLocalReturnObject;
                    });
                },
                OpenInExplorer: () => {
                    return new Promise((resolve, reject) => {
                        let jVarLocalCommand = 'start .\\Backup';

                        Neutralino.os.execCommand(jVarLocalCommand).then(PromiseDataFromOs => {
                            if (PromiseDataFromOs.exitCode === 0) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    });
                }
            }
        }
    }

    static DateFuncs = {
        PresentDateInddMMyyyy: () => {
            let date = new Date();

            let dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
            let MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
            let yyyy = date.getFullYear();

            return `${dd}-${MM}-${yyyy}`;
        },
        PresentDateInyyyyMMdd: () => {
            let date = new Date();

            let dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
            let MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
            let yyyy = date.getFullYear();

            return `${yyyy}-${MM}-${dd}`;
        },
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

    static SearchFuncs = {
        jFTableSearch: (inEvent) => {
            let jVarLocalCurrentTarget = inEvent.currentTarget;
            let jVarLocalClosestCard = jVarLocalCurrentTarget.closest(".card");
            let jVarLocalTableBodyId = jVarLocalClosestCard.querySelector(".card-body table tbody");

            var filter = jVarLocalCurrentTarget.value;

            this.SearchFuncs.CommonFuncs.jFTableSearch({
                inTableBodyId: jVarLocalTableBodyId, infilter: filter
            });

            if (inEvent.code === "Enter") {
                let jVarLocalFirstRow = jVarLocalTableBodyId.querySelector("tr:not([class='d-none'])");

                this.SearchFuncs.CommonFuncs.jFTableSearchEnter({ inTableBodyFirstRow: jVarLocalFirstRow });
            };
        },
        jFTableSearchOnly: (inEvent) => {
            let jVarLocalCurrentTarget = inEvent.currentTarget;
            let jVarLocalClosestCard = jVarLocalCurrentTarget.closest(".card");
            let jVarLocalTableBodyId = jVarLocalClosestCard.querySelector(".card-body table tbody");

            var filter = jVarLocalCurrentTarget.value;

            this.SearchFuncs.CommonFuncs.jFTableSearch({
                inTableBodyId: jVarLocalTableBodyId, infilter: filter
            });
        },
        CommonFuncs: {
            jFTableSearchEnter: ({ inTableBodyFirstRow }) => {
                let jVarLocalItemName = inTableBodyFirstRow.cells[0].innerHTML.trim();
                let jVarLocalPrice = parseInt(inTableBodyFirstRow.cells[1].innerHTML.trim());

                jFCommonFuncsClass.JsFuncs.Transactions.Sales.SaveFuncs.StartFunc(jVarLocalItemName, jVarLocalPrice);
            },
            jFTableSearch: ({ inTableBodyId, infilter }) => {
                let jVarLocalTableBodyId = inTableBodyId;

                var filter = infilter;

                for (var i = 0, row; row = jVarLocalTableBodyId.rows[i]; i++) {
                    jVarLocalTableBodyId.rows[i].classList.add("d-none");

                    for (var j = 0, col; col = row.cells[j]; j++) {
                        if (col.innerHTML.includes(filter)) {

                            jVarLocalTableBodyId.rows[i].classList.remove("d-none");

                            break;
                        };
                    }
                };
            }
        }
    }
};

class jCommonFormFuncsClass {
    static Save = async () => {
        let jVarLocalReturnObject = { KTF: false, KResult: "" };
        let jVarLocalFetchPostData
        const jVarLocalForm1 = document.getElementById("kform1");

        if (jVarLocalForm1.checkValidity()) {
            jVarLocalFetchPostData = serializeObject(jVarLocalForm1);
            jVarLocalReturnObject.KResult = jVarLocalFetchPostData;
            jVarLocalReturnObject.KTF = true;
            return await jVarLocalReturnObject;
        } else {
            jVarLocalForm1.classList.add('was-validated');
            jVarLocalForm1.querySelector('input:invalid').focus();
            return false;
        };
    }

    static PrepareObjectFromRow = ({ inJVarLocalRowElements }) => {
        let jVarLocalFetchBodydata = {};
        let jVarLocalReturnObject = { KTF: false, KResult: "" };

        inJVarLocalRowElements.forEach((LoopElement) => {
            if (LoopElement.hasAttribute("checked")) {
                jVarLocalFetchBodydata[LoopElement.name] = LoopElement.checked;
            } else {
                jVarLocalFetchBodydata[LoopElement.name] = LoopElement.value;
            };
            jVarLocalReturnObject.KResult = jVarLocalFetchBodydata;
            jVarLocalReturnObject.KTF = true;
        });

        return jVarLocalReturnObject;

        //return jVarLocalFetchBodydata;
    }
};

let kCheckLogin = async () => {
    let jVarLocalUserName = document.getElementById('KUserNameInput').value;
    let jVarLocalPassWord = document.getElementById('KPasswordInput').value;

    jVarLocalFromValidate = await CommonFuncs.Api.Admin.Users.Validate({ inUserName: jVarLocalUserName, inPassWord: jVarLocalPassWord });

    if (jVarLocalFromValidate.KTF) {
        return await jVarLocalFromValidate;
    };
};

let IndianFormat = (x) => {
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);

    if (otherNumbers !== '')
        lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    return res;
}

Neutralino.init();