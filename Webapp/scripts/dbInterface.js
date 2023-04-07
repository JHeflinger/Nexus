
const serverURL = "http://137.112.198.113:8080/api"
// const serverURL = "http://192.168.68.128:8080/api"
// const serverURL = "http://137.112.136.162:8080/api"

export default class Database {

    static async uploadFiles(files, uid) {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));
        formData.append("uid", uid);
        let promise = undefined;
        try {
            promise = fetch(serverURL + '/upload', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.log(error);
        }
        return promise;
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
        console.log("inside getFilesByUser with uid: " + uid);
        // const formData = new FormData();
        // formData.append("uid", uid);
        let promise = undefined;
        try {
            promise = fetch(serverURL + `/get_files/${uid}/__xXNULLXx__/__xXNULLXx__/__xXNULLXx__/`, {
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