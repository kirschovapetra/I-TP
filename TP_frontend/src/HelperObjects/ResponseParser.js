import Vue from 'vue';

const helperFunctions = {

    firstElementByTitle(array, title) {
        const filteredElement = array.filter((element) => {
            return element.title == title;
        });

        return filteredElement[0];
    },
    getValueFromDataField(array, title) {
        const filteredElement = array.filter((element) => {
            return element.name == title;
        });

        return filteredElement[0].value;
    },
    hasThisTask(array, title) {
        const filteredTask = array.filter((task) => {
            return task.title == title;
        });

        return filteredTask[0] === undefined ? false : true;
    },
    stringIdByTitle(array, title) {
        const filteredInfoTask = array.filter((task) => {
            return task.title == title;
        });

        return filteredInfoTask[0].stringId;
    },
    getKontaktObject(dataResponse) {
        const kontaktDataGroup = this.firstElementByTitle(dataResponse, 'Kontakt');
        const dataFields = kontaktDataGroup.fields._embedded.localisedTextFields;

        return {
            first_name: dataFields[0].value,
            last_name: dataFields[1].value,
            phone_number: dataFields[2].value,
            email: dataFields[3].value,
            password: dataFields[4].value
        }
    },
    getFirmaObject(dataResponse) {

        const infoDataGroup = dataResponse[0].fields._embedded.localisedTextFields;

        return {
            email: infoDataGroup[1].value,
            password: infoDataGroup[2].value
        }
    },

    /******************************* (Petra) *********************************/

    async GetPicture(token, taskId) {
        const headers = { "X-Auth-Token": token };
        const response = await fetch(
            `https://engine.interes.group/api/task/${taskId}/file/picture`,
            { headers }
        );
        const blobResponse = await response.blob();
        return URL.createObjectURL(blobResponse);
    },


    async getProductsFromEnumMap(token, dataGroups) {
        var enum_map =
            dataGroups[0].fields._embedded.localisedEnumerationMapFields[0].options;

        // Case-ids vsetkych produktov
        var productIds = Object.keys(enum_map).filter((key) => {
            return key.length > 0;
        });

        var products = []

        for (var id in productIds) {
            var tasks = await Vue.prototype.GetTasksByCaseId(
                token,
                productIds[id]
            );
            var productTasks = tasks.data._embedded
                ? tasks.data._embedded.tasks
                : [];

            var productEdit = productTasks.filter((task) => {
                let taskTitle = task.title.toLowerCase();
                return taskTitle.includes("upravenie")
                    || taskTitle.includes("update")
                    || taskTitle.includes("edit");
            })[0];

            if (!productEdit) {
                console.log("nenasiel sa edit task produktu");
                continue;
            }

            var productData = await Vue.prototype.GetDataByTask(
                token,
                productEdit.stringId
            );


            var usefulDataGroups = productData.data._embedded.dataGroups.filter(
                (group) => {
                    return group.fields._embedded != null;
                }
            );

            products.push(
                await this.parseProductData(
                    id,
                    token,
                    productIds[id],
                    usefulDataGroups[0],
                    productEdit.stringId,
                    ''
                )
            );

        }

        return products;
    },

    async getBranchesFromEnumMap(token, dataGroups) {

        var branchList = []
        var enum_map =
            dataGroups[0].fields._embedded.localisedEnumerationMapFields[0].options;

        // Case-ids vsetkych pobociek
        var branchIds = Object.keys(enum_map).filter((key) => {
            return key.length > 0;
        });

        for (var id in branchIds) {
            var tasks = await Vue.prototype.GetTasksByCaseId(token, branchIds[id]);
            var branchTasks = tasks.data._embedded
                ? tasks.data._embedded.tasks
                : [];
            var branchEdit = branchTasks.filter((task) => {
                return task.title.includes("Editovať");
            })[0];

            if (!branchEdit) {
                console.log("nenasiel sa edit task pobocky");
                continue;
            }

            var branchData = await Vue.prototype.GetDataByTask(
                token,
                branchEdit.stringId
            );

            var usefulDataGroups = branchData.data._embedded.dataGroups.filter(
                (group) => {
                    return group.fields._embedded != null;
                }
            );

            branchList.push(
                this.parseBranchData(
                    id,
                    usefulDataGroups,
                    branchEdit.stringId,
                    ''
                )
            );
        }
        return branchList
    },

    async getCompanyData(token, caseId) {
        var companyData = { address: {}, company: {}, caseId: caseId };

        var tasks = await Vue.prototype.GetTasksByCaseId(token, caseId);

        if (!tasks || !tasks.data._embedded) return null;

        var companyDetailTask = tasks.data._embedded.tasks.filter((task) => {
            return task.title.includes("Upraviť informácie");
        })[0];

        if (!companyDetailTask) return null;

        var taskData = await Vue.prototype.GetDataByTask(token, companyDetailTask.stringId);

        var companyDataGroups = taskData.data._embedded.dataGroups;

        companyData.company = await this.parseCompanyInfo(
            token, companyDetailTask.stringId,
            companyDataGroups[0].fields._embedded
        );

        companyData.address = this.parseAddress(
            companyDataGroups[1].fields._embedded.localisedTextFields
        );

        return companyData;
    },

    async parseContact(token, contactObject) {
        var textFields = contactObject._embedded.localisedTextFields
        var fileFields = contactObject._embedded.localisedFields
        var taskId = textFields[0].stringId.split("-")[0]
        return {
            taskId: taskId,
            first_name: textFields[0].value ? textFields[0].value : "",
            last_name: textFields[1].value ? textFields[1].value : "",
            phone_number: textFields[2].value ? textFields[2].value : "",
            email: textFields[3].value ? textFields[3].value : "",
            picture: (fileFields && fileFields[0].value) ? await this.GetPicture(token, taskId) : "https://via.placeholder.com/250"
        };
    },
    parseAddress(addressObject) {
        return {
            taskId: addressObject[0].stringId.split("-")[0],
            street_name: addressObject[0].value ? addressObject[0].value : "",
            street_number: addressObject[1].value ? addressObject[1].value : "",
            city: addressObject[2].value ? addressObject[2].value : "",
            postal_code: addressObject[3].value ? addressObject[3].value : "",
        };
    },
    parseBranch(branchObject) {

        return {
            name: branchObject[0].value ? branchObject[0].value : "",
            email: branchObject[1].value ? branchObject[1].value : "",
            phone_number: branchObject[2].value ? branchObject[2].value : "",
            opening_hours: branchObject[3].value ? branchObject[3].value : "",
            taskId: "",
        };
    },
    async parseProduct(token, taskId, enumFields, fileField, numberFields, textFields) {

        return {
            category_type: enumFields[0].value ? enumFields[0].value : "",
            order_status: enumFields[1].value ? enumFields[1].value : "",
            prod_code: textFields[0].value ? textFields[0].value : "",
            prod_name: textFields[1].value ? textFields[1].value : "",
            parameters: textFields[2].value ? textFields[2].value : "",
            description: textFields[3].value ? textFields[3].value : "",
            price_dph: numberFields[0].value ? numberFields[0].value : 0,
            price_no_dph: numberFields[1].value ? numberFields[1].value : 0,
            warranty: numberFields[2].value ? numberFields[2].value : 0,
            quantity: numberFields[3].value ? numberFields[3].value : 0,
            picture: (fileField && fileField.value) ? await this.GetPicture(token, taskId) : "https://via.placeholder.com/250"
        };
    },
    async parseOrderHistory(id, token, title, dataGroups) {
        /*
        [0] - stav
        [1] - kontakt
        [2] - adresa
        [3] - suma poloziek
        [4...n] - produkty
        */

        var delivery_date = "";

        var status = dataGroups[0].fields._embedded.localisedTextFields[0].value;

        var contact = await this.parseContact(
            token,
            dataGroups[1].fields
        );

        var address = this.parseAddress(
            dataGroups[2].fields._embedded.localisedTextFields
        );
        var price = dataGroups[3].fields._embedded.localisedNumberFields[0].value;

        var orderJson = {
            id: id,
            title: title,
            status: status,
            price: parseFloat(price),
            delivery_date: delivery_date,
            delivery_address: address,
            billing_address: address,
            contact: contact,
            items: [],
        };

        for (var i = 4; i < dataGroups.length; i++) {
            var name = dataGroups[i].fields._embedded.localisedTextFields[0].value;
            var prodNumberFields =
                dataGroups[i].fields._embedded.localisedNumberFields;

            orderJson.items.push({
                name: name,
                amount: parseInt(prodNumberFields[0].value),
                price: parseFloat(prodNumberFields[1].value),
            });
        }
        return orderJson;
    },
    parseCourierRequest(requestObject, title, approveTaskId, rejectTaskId) {
        var enumFields = requestObject.localisedEnumerationFields;
        var contactFields = requestObject.localisedTextFields;

        return {
            title: title,
            approveTaskId: approveTaskId,
            rejectTaskId: rejectTaskId,
            first_name: contactFields[0].value,
            last_name: contactFields[1].value,
            email: contactFields[2].value,
            phone_number: contactFields[3].value,
            status: enumFields[0].value,
        };
    },
    parseCompanyRequest(requestObject, title, approveTaskId, rejectTaskId) {
        var enumFields = requestObject.localisedEnumerationFields;
        var boolFields = requestObject.localisedBooleanFields;
        var companyDataFields = requestObject.localisedTextFields;

        var status = boolFields[0].value
            ? "Schválená"
            : approveTaskId == ""
                ? "Zamietnutá"
                : "Čaká na schválenie";

        return {
            title: title,
            approveTaskId: approveTaskId,
            rejectTaskId: rejectTaskId,
            company_type: enumFields[0].value,
            company_name: companyDataFields[0].value,
            ico: companyDataFields[1].value,
            dic: companyDataFields[2].value,
            ic_dph: companyDataFields[3].value,
            status: status,
        }

    },
    async parseCompanyInfo(token, taskId, companyInfoObject) {

        var enumFields = companyInfoObject.localisedEnumerationFields;
        var textFields = companyInfoObject.localisedTextFields;
        var fileFields = companyInfoObject.localisedFields;

        return {
            company_type: enumFields[0].value,
            company_name: textFields[0].value,
            ico: textFields[1].value,
            dic: textFields[2].value,
            ic_dph: textFields[3].value,
            picture: (fileFields && fileFields[0].value) ? await this.GetPicture(token, taskId) : "https://via.placeholder.com/250"
        };
    },
    parseBranchData(id, dataGroups, editTaskId, deleteTaskId) {
        /*
        [0] - info o pobocke
        [1] - adresa
        */
        var branch = this.parseBranch(
            dataGroups[0].fields._embedded.localisedTextFields
        );
        var address = this.parseAddress(
            dataGroups[1].fields._embedded.localisedTextFields
        );
        return {
            id: id,
            editTaskId: editTaskId,
            deleteTaskId: deleteTaskId,
            branch: branch,
            address: address,
        };
    },
    async parseProductData(id, token, caseId, dataGroup, editTaskId, deleteTaskId) {

        var enumFields = dataGroup.fields._embedded.localisedEnumerationFields;
        var fileFields = dataGroup.fields._embedded.localisedFields ? dataGroup.fields._embedded.localisedFields : [];
        var numberFields = dataGroup.fields._embedded.localisedNumberFields;
        var textFields = dataGroup.fields._embedded.localisedTextFields;

        var product = await this.parseProduct(
            token, editTaskId,
            enumFields,
            fileFields[0],
            numberFields,
            textFields
        );
        return {
            id: id,
            caseId: caseId,
            editTaskId: editTaskId,
            deleteTaskId: deleteTaskId,
            ...product,
        };
    },

    /************************ Nicolasko ***********************************/
    getLastVersion(allProcesses, filterTitle) {

        const filteredProcesses = allProcesses.filter((_process) => {
            return _process.identifier === filterTitle;
        });

        return filteredProcesses[filteredProcesses.length - 1].stringId
    },
    formatNoTaskRefForm(form) {
        const keys = Object.keys(form)

        let returnObject = {};
        for (let i = 0; i < keys.length; i++) {
            returnObject[keys[i]] = {
                type: "text",
                value: form[keys[i]],
            }
        }

        return returnObject;
    },
    formatTaskRefForm(form, taskRef) {
        const keys = Object.keys(form)

        let returnObject = {};
        for (let i = 0; i < keys.length; i++) {
            returnObject[taskRef + '-' + keys[i]] = {
                type: "text",
                value: form[keys[i]],
            }
        }

        return returnObject;
    },
    formatClientDataPayload(form, asignTask) {
        const adressTaskRef = asignTask.data.changedFields.address_taskRef.value[0];
        const contactTaskRef = asignTask.data.changedFields.contact_taskRef.value[0];

        return {
            address: this.formatTaskRefForm(form.address, adressTaskRef),
            contact: this.formatTaskRefForm(form.contact, contactTaskRef)
        }
    }
}

export default helperFunctions;