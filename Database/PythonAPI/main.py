from fastapi import FastAPI, Form, File
from fastapi.middleware.cors import CORSMiddleware
from dbUtils import Server
from typing import Annotated, List, Dict
import uvicorn

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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

@app.post("/addDocumentView/{docid}")
async def userExists(docid: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC AddDocumentView @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)

@app.get("/GetDocumentViews/{docid}")
async def getDocumentViews(docid: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetDocumentViews @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result[0], [0])
        return result
    
@app.get("/GetDocumentLikes/{docid}")
async def getDocumentLikes(docid: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetDocumentLikes @docID={docid}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result[0], [0])
        return result

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


@app.post("/uploadFile")
async def uploadFile(
    file: Annotated[bytes, File()],
    uid: Annotated[str, Form(...)],
    name: Annotated[str, Form(...)],
):
    print(name)
    print(uid)
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = "EXEC AddDocumentFromUser @DocumentData= ?, @Username= ?"
    params = (Server.convertToBinaryData(file), uid)

    success, results = Nexus.execute(query, binParams=params, username="consaljj")
    # success, results = Nexus.execute("SELECT * FROM dbo.Document", username="consaljj")
    if success:
        print(results)

    # addTmpUser(uid)


@app.put("/updateFile")
async def updateFile():
    return {"message": "Update File Not Implemented"}


@app.get("/getFileIDsByUser/{UID}")
async def getFileIDsByUser(UID: str):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    # query = f"EXEC GetUserFileIDS @Username ={UID}"
    query = f"SELECT * FROM UserOwns WHERE UserOwns.UserName = '{UID}'"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)
        return {"exists": result}
    else:
        return False


@app.get("/getFilesBySearch")
async def getFilesBySearch():
    return {"message": "Get Files By Search Not Implemented"}


@app.get("/getFileByObjectID/{DocID}")
async def getFileByObjectID(DocID: int):
    Nexus = Server("titan.csse.rose-hulman.edu", "Nexus")
    Nexus.disconnect()

    query = f"EXEC GetFileByID @docID ={DocID}"
    success, result = Nexus.execute(query, username="consaljj")
    if success:
        print(result)
        return {"exists": result}
    else:
        return False


@app.get("/getFileRefByObjectID")
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
