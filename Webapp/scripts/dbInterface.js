
const serverURL = "http://192.168.1.137:8080"
// const serverURL = "http://137.112.207.134:8080"

export default class Database {


    static async makeUserIfNotExists(uid, username) {
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
            formData.append("firstName", "tmp");
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
        }
    }

    static async uploadFile(file, uid, name = "") {
        const formData = new FormData();
        const fileName = name ? name : file.name;
        formData.append("file", file);
        formData.append("uid", uid);
        formData.append("name", fileName);
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


    static async uploadFiles(files, uid) {
        const filesToUpload = files.length;
        let filesUploaded = 0;
        let promises = [];
        for (let i = 0; i < filesToUpload; i++) {
            promises.push(Database.uploadFile(files[i], uid));
        }
        return promises[0]; // Make this have better partial failure handling
    }

    static async updateFile(formData) {
        console.log(`${serverURL}/update/${formData._id}/${formData.title}/${formData.desc}/["tag1", "tag2"]`);
        let promise = undefined;
        try {
            promise = fetch(`${serverURL}/update/${formData._id}/${formData.title}/${formData.desc}/${formData.tags}`, {
                method: 'PUT',
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
            promise = fetch(serverURL + `/get_fileID/${objectID}`, {
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
            console.log(`${serverURL}/getFileByObjectID/${docID}`);
            promise = fetch(`${serverURL}/getFileByObjectID/${docID}`, {
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
            promise = fetch(`${serverURL}/delete/${objectID}`, {
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

    static testConnection() {
        fetch(serverURL + '/getgarbage')
            .then(response => response.json()).then(data => {
                console.log(data);
            });
    }
}