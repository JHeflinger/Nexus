
const serverURL = "http://localhost:8080"
// const serverURL = "http://137.112.207.134:8080"

export default class Database {


    static async makeUserIfNotExists(uid, username, email) {
        //Check if user exists
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/userExists/${uid}`, {
                method: 'GET',
            });
        }
        catch (error) {
            console.log(error);
        }
        const result = await promise;
        const data = await result.json();
        console.log("Data from userExists:");
        console.log(data);

        if (data.exists === false) {
            console.log("User does not exist, creating user...");
            promise = undefined;
            const formData = new FormData();
            formData.append("uid", uid);
            formData.append("userName", username);
            formData.append("firstName", email.replace(/\./g, ''));
            formData.append("middleName", "tmp");
            formData.append("lastName", "tmp");
            try {
                promise = fetch(serverURL + `/addUser/`, {
                    method: 'POST',
                    body: formData,
                });
                return await (await promise).json();
            }
            catch (error) {
                console.log(error);
                return false;
            }
        } else {
            return {"success": true}
        }
    }

    static async uploadFile(
        uid,
        file,
        name = "",
        description = "",
        lastModified = "",
        dateOfCreation = "",
        annotations = {},
        orgID = -1
    ) {
        const formData = new FormData();
        const fileName = name ? name : file.name;
        
        formData.append("DocumentData", file);
        formData.append("uid", uid);
        formData.append("DocumentName", fileName);
        formData.append("Description", description);
        formData.append("LastModified", lastModified);
        formData.append("DateOfCreation", dateOfCreation);
        formData.append("Annotations", JSON.stringify(annotations));
        formData.append("oid", orgID);

        let promise = undefined;
        try {
            promise = fetch(serverURL + '/uploadFile', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }


    static async uploadFiles(files, uid, oid) {
        const filesToUpload = files.length;
        let filesUploaded = 0;
        let promises = [];

        const currentISODate = new Date().toISOString();
        console.log(`Current ISO Date: ${currentISODate}`);

        for (let i = 0; i < filesToUpload; i++) {
            promises.push(Database.uploadFile(
                uid,
                files[i],
                files[i].name,
                "Add a description.",
                currentISODate,
                currentISODate,
                {tmp: "tmp"},
                oid));
        }
        return promises[0]; // TODO: Make this have better partial failure handling!!!!!
    }

    static async updateFile(formData) {
        console.log(formData);
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/updateDocument`, {
                method: 'PUT',
                body: formData,
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async updateFile(
        DocumentID = 0,
        DocumentName = "",
        Description = "",
        Annotations = {},
    ) {
        const formData = new FormData();
        formData.append("DocumentID", DocumentID);
        formData.append("DocumentName", DocumentName);
        formData.append("Description", Description);
        formData.append("Annotations", JSON.stringify(Annotations));

        let promise = undefined;
        try {
            promise = fetch(serverURL + '/updateDocument', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getFileIDsByUser(uid) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getFileIDsByUser/${uid}`, {
                method: 'GET',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getOrgIDsByUser(oid) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getFileIDsByOrg/${oid}`, {
                method: 'GET',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getAvailableFilesByUser(uid, sortBy, descending) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getFilesBySearch/${uid}/${sortBy}/${descending}`, {
                method: 'GET',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getFilesBySearch(params) {
        console.log("grabbing files with params:");
        console.log(params);
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/get_files/${params.uid}/${params.tags}/${params.title}/${params.desc}`, {
                method: 'GET',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getFileByObjectID(objectID) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getFileByObjectID/${objectID}`, {
                method: 'GET',
            });

        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getOrganizationsByUser(uid) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getOrganizationsByUser/${uid}`, {
                method: 'GET',
            });

        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async addNewOrg(uid) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/addNewOrganization/${uid}`, {
                method: 'POST',
            });
        } catch (error) {
            console.log(error);
        }
    }

    static async addNewOrg(email, orgID) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/addUserToOrg/${orgID}/${email.replace(/\./g, '')}`, {
                method: 'POST',
            });
        } catch (error) {
            console.log(error);
        }
    }

    static async addTag(docID, tag) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/addTag/${docID}/${tag}`, {
                method: 'POST',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getDocumentTags(docID) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getDocumentTags/${docID}`, {
                method: 'GET',
            });

        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getOrgFromID(orgID) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getOrgFromID/${orgID}`, {
                method: 'GET',
            });

        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getSimpleFileByObjectID(objectID) {
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/getSimpleFileByObjectID/${objectID}`, {
                method: 'GET',
            });

        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getFileRefByObjectID(objectID) {
        let promise = undefined;
        try {
            console.log(`${serverURL}/get_file_ref/${objectID}`);
            promise = fetch(`${serverURL}/get_file_ref/${objectID}`, {
                method: 'GET',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getFileContentByID(docID) {
        let promise = undefined;
        try {
            console.log(`${serverURL}/getFileRefByObjectID/${docID}`);
            promise = fetch(`${serverURL}/getFileRefByObjectID/${docID}`, {
                method: 'GET',
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async deleteFileByObjectID(objectID) {
        let promise = undefined;
        try {
            console.log("DELETING");
            promise = fetch(`${serverURL}/deleteFileByObjectID/${objectID}`, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json'
                }
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async likeFileWithUser(uid, docid) {
        let promise = undefined;
        const formData = new FormData();
        formData.append("uid", uid);
        formData.append("docid", docid);
        try {
            promise = fetch(serverURL + `/likeDocument/`, {
                method: 'POST',
                body: formData,
            });
            return await (await promise).json();
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async updateOrg(oid, name, description) {
        let promise = undefined;
        const formData = new FormData();
        formData.append("oid", oid);
        formData.append("name", name);
        formData.append("description", description);
        try {
            promise = fetch(serverURL + `/updateOrg/`, {
                method: 'PUT',
                body: formData,
            });
            return await (await promise).json();
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async unlikeFileWithUser(uid, docid) {
        let promise = undefined;
        const formData = new FormData();
        formData.append("uid", uid);
        formData.append("docid", docid);
        try {
            promise = fetch(serverURL + `/unlikeDocument/`, {
                method: 'POST',
                body: formData,
            });
            return await (await promise).json();
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    static async addDocumentView(uid, docid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/addDocumentView/${uid}/${docid}`, {
                method: 'POST'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getDoesUserLike(uid, docid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/getDoesUserLike/${uid}/${docid}`, {
                method: 'GET'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async toggleDocumentLike(uid, docid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/toggleUserLike/${uid}/${docid}`, {
                method: 'POST'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getDocumentViews(docid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/GetDocumentViews/${docid}`, {
                method: 'GET'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getUserAccountLikes(uid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/getUserAccountLikes/${uid}`, {
                method: 'GET'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getUserAccountViews(uid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/getUserAccountViews/${uid}`, {
                method: 'GET'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static async getDocumentLikes(docid) {
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/GetDocumentLikes/${docid}`, {
                method: 'GET'
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
    }

    static testConnection() {
        fetch(serverURL + '/getgarbage')
            .then(response => response.json()).then(data => {
                console.log(data);
            });
    }
}