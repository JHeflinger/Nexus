import json
from fastapi import FastAPI, Form, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.param_functions import Depends
from pydantic import BaseModel
from dbUtils import Server
from typing import Annotated, List, Dict, Any
from datetime import datetime
import uvicorn

import logging
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)


@app.get("/")
async def root():
    return {"message": "Nexus SQL API Root"}


@app.post("/likeDocument")
async def likeDocument(
    uid: Annotated[str, Form(...)],
    docid: Annotated[int, Form(...)]
):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    print(f"User {uid} likes document {docid}")

    query = f"EXEC AddUserLike @Username={uid}, @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)


@app.post("/unlikeDocument")
async def unlikeDocument(
    uid: Annotated[str, Form(...)],
    docid: Annotated[int, Form(...)]
):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    print(f"User {uid} no longer likes document {docid}")

    query = f"EXEC DeleteUserLike @Username={uid}, @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)


@app.post("/addDocumentView/{username}/{docid}")
async def userExists(docid: int, username: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC AddUserViewed @Username={username}, @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)

@app.post("/toggleUserLike/{username}/{docid}")
async def toggleUserLike(docid: int, username: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC ToggleUserLike @Username={username}, @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)

@app.get("/getDoesUserLike/{username}/{docid}")
async def getDoesUserLike(docid: int, username: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetDoesUserLike @Username={username}, @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    return result[0][0]

@app.get("/GetDocumentViews/{docid}")
async def getDocumentViews(docid: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetDocumentViews @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print("document views: " + str(result[0][0]))
        return result[0][0]

@app.get("/getUserAccountLikes/{uid}")
async def getUserAccountLikes(uid: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetUserAccountLikes @Username={uid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print("user account likes: " + str(result[0][0]))
        return result[0][0]
    
@app.get("/getUserAccountViews/{uid}")
async def getUserAccountViews(uid: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetUserAccountViews @Username={uid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print("user account views: " + str(result[0][0]))
        return result[0][0]

@app.get("/GetDocumentLikes/{docid}")
async def getDocumentLikes(docid: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetDocumentLikes @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print("document likes: " + str(result[0][0]))
        return result[0][0]


def addTmpUser(uid: str) -> None:
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC AddUser @username={uid}, @firstname={uid}, @middlename=bob, @lastname=bob, @password=bob"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)


@app.post("/addUser")
async def addUser(
    uid: Annotated[str, Form(...)],
    userName: Annotated[str, Form(...)],
    firstName: Annotated[str, Form(...)],
    middleName: Annotated[str, Form(...)],
    lastName: Annotated[str, Form(...)],
):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    print(f"Adding User: {uid} {userName} {firstName} {middleName} {lastName}")

    query = f"EXEC AddUser @username={uid}, @firstname={firstName}, @middlename={middleName}, @lastname={lastName}, @password=bob"
    success, result = Nexus.execute(query, username="consaljj")
    return {"success": success}


@app.get("/userExists/{FBToken}")
async def userExists(FBToken: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC UserExists @FirebaseToken={FBToken}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result[0], [0])
        return {"exists": result[0][0]}
    else:
        return False


# class UploadDocument(BaseModel):
#     uid: str
#     DocumentData: bytes
#     DocumentName: str
#     Description: str
#     LastModified: str
#     DateOfCreation: str
#     Annotations: Dict[str, str]

class DocAnnotations(BaseModel):
    Annotations: Dict[str, str] #TODO: make this a list of annotations when they are implemented


@app.post("/uploadFile")
async def uploadFile(
    # form_data: UploadDocument = Depends()
    DocumentData: Annotated[bytes, File()],
    uid: Annotated[str, Form(...)],
    DocumentName: Annotated[str, Form(...)],
    Description: Annotated[str, Form(...)],
    LastModified: Annotated[str, Form(...)],
    DateOfCreation: Annotated[str, Form(...)],
    Annotations: Annotated[str, Form(...)]
):
    # uid = form_data.uid
    # DocumentData = form_data.DocumentData
    # DocumentName = form_data.DocumentName
    # Description = form_data.Description
    # LastModified = form_data.LastModified
    # DateOfCreation = form_data.DateOfCreation
    # Annotations = form_data.Annotations

    print(uid)
    print(DocumentName)
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()
    
    # Annotations = {"test": "test"}
    # Annotations = json.loads(Annotations)

    #Convert Annotations to bytes
    Annotations = Server.convertToBinaryData(bytes(Annotations, "utf-8"))

    LastModifiedDate = datetime.strptime(LastModified, "%Y-%m-%dT%H:%M:%S.%fZ")
    DateOfCreationDate = datetime.strptime(DateOfCreation, "%Y-%m-%dT%H:%M:%S.%fZ")

    query = '''EXEC AddDocumentFromUser
                @UID = ?,
                @DocumentData = ?,
                @DocumentName = ?,
                @Desc = ?,
                @LastModified = ?,
                @DateOfCreation = ?,
                @Annotations = ?
            '''
    params = (uid, Server.convertToBinaryData(DocumentData), DocumentName, Description, LastModifiedDate, DateOfCreationDate, Annotations)

    success, results = Nexus.execute(query, binParams=params, username="consaljj")
    # success, results = Nexus.execute("SELECT * FROM dbo.Document", username="consaljj")
    if success:
        print(results)

    # addTmpUser(uid)


@app.put("/updateFile")
async def updateFile():
    return {"message": "Update File Not Implemented"}


class UserFile(BaseModel):
    fileID: int
    fileName: str


class UserFiles(BaseModel):
    docs: List[UserFile]


@app.get("/getFileIDsByUser/{UID}", response_model=UserFiles)
async def getFileIDsByUser(UID: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    # query = f"EXEC GetUserFileIDS @Username ={UID}"
    # query = f"SELECT * FROM UserOwns WHERE UserOwns.UserName = '{UID}'"
    query = "EXEC GetUserFileIDS @Username = ?"
    params = (UID)
    success, result = Nexus.execute(query, binParams=params,  username="consaljj")
    print(result)
    result = [list(x) for x in result]
    if success:
        print(result)

        return {
            "docs":
                [
                    {
                        "fileID": x[0],
                        "fileName": x[1]
                    }
                    for x in result
                ]
        }
    else:
        return False

@app.get("/getFilesBySearch/{uid}/{sortBy}/{descending}")
async def getFilesBySearch(uid: str, sortBy: str, descending: bool):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = "EXEC GetAvailableDocumentsFromUser @Username = ?, @OrderBy = ?, @DecendingOrder = ?"
    params = (uid, sortBy, descending)
    success, result = Nexus.execute(query, binParams=params,  username="consaljj")
    print(result)
    result = [list(x) for x in result]
    if success:
        print(result)

        return {
            "docs":
                [
                    {
                        "fileID": x[0],
                        "fileName": x[1],
                        "description": x[2],
                    }
                    for x in result
                ]
        }
    else:
        return False


@app.get(
    "/getFileByObjectID/{DocID}",
    responses={

        200: {
            "content": {"application/pdf": {}},
        }

    },
    response_class=Response
)
async def getFileByObjectID(DocID: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetFileByID @docID={DocID}"
    print(f"Getting File with id={DocID}")
    success, result = Nexus.execute(query, username="consaljj")
    print("Success: ", success)
    #result = [x[0] for x in result]
    print("Result: ", len(result))
    if success:
        # print(result)
        return Response(content=result[0][1], media_type="application/pdf")
    else:
        return False


@app.get("/getFileRefByObjectID/{DocID}")
async def getFileRefByObjectID():
    return {"message": "Get File Ref By Object ID Not Implemented"}


@app.delete("/getFileByFileID")
async def deleteFileByObjectID():
    return {"message": "Delete File By Object ID Not Implemented"}

if __name__ == "__main__":
    # Run server and accept network connections
    uvicorn.run("main:app",
                host="0.0.0.0",
                port=8080,
                log_level="info",
                reload=True
                )
