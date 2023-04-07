import Head from 'next/head';
import Link from 'next/link';
import Stars from '../components/stars';
import Dropdown from '../components/dropdown';
import { useEffect, useState, useRef } from 'react';
import documentStyles from './document.module.scss'
import { Lato } from '@next/font/google';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import { faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Database from '../scripts/dbInterface';
import { pdfjs, Document, Page, PDFViewer, PDFDownloadLink } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;



const lato = Lato({
    weight: ['100', '300', '400', '900'],
    subsets: ['latin-ext'],
    display: 'swap',
});

export default function Home() {
    const siteTitle = "DOCUMENT";
    const tagData = [];

    const [fileData, _setFileData] = useState("");
    const fileDataRef = useRef(fileData);
    const setFileData = data => {
        fileDataRef.current = data;
        _setFileData(data);
    };

    const [fileID, _setFileID] = useState("");
    const fileIDRef = useRef(fileID);
    const setFileID = data => {
        fileIDRef.current = data;
        _setFileID(data);
    };

    const [numberOfPages, _setNumberOfPages] = useState(0);
    const numberOfPagesRef = useRef(numberOfPages);
    const setNumberOfPages = data => {
        numberOfPagesRef.current = data;
        _setNumberOfPages(data);
    };

    const [fileName, _setFileName] = useState("");
    const fileNameRef = useRef(fileName);
    const setFileName = data => {
        fileNameRef.current = data;
        _setFileName(data);
    };



    const fillPage = (docID) => {
        Database.getFileRefByObjectID(docID).then((response) => {
            response.json().then((data) => {
                setFileID(data._id);
                if (data.metadata.title) {
                    document.getElementById("titleInput").value = data.metadata.title;
                    setFileName(data.metadata.title);
                }
                if (data.metadata.desc) document.getElementById("descInput").value = data.metadata.desc;
                if (data.metadata.likes) {
                    document.getElementById("likesCount").innerHTML = data.metadata.likes;
                } else {
                    document.getElementById("likesCount").innerHTML = 0;
                }
                if (data.metadata.views) {
                    document.getElementById("viewsCount").innerHTML = data.metadata.views;
                } else {
                    document.getElementById("viewsCount").innerHTML = 0;
                }
                if (data.metadata.tags) {
                    data.metadata.tags.forEach(tag => {
                        tagData.push(tag);
                    });
                    let container = document.getElementById("tags");
                    const children = tagData.map((val) => (
                        <span onClick={() => deleteTag({ val })} className={documentStyles.tag}><span className={lato.className}>X</span>{val}</span>
                    ));
                    ReactDOM.render(children, container);
                }
            });
        });
    }

    const addTag = () => {
        tagData.push(document.getElementById("tagInput").value);
        document.getElementById("tagInput").value = "";
        let container = document.getElementById("tags");
        const children = tagData.map((val) => (
            <span onClick={() => deleteTag({ val })} className={documentStyles.tag}><span className={lato.className}>X</span>{val}</span>
        ));
        ReactDOM.render(children, container);
    }

    useEffect(() => {
        document.getElementById("tagInput").addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                tagData.push(document.getElementById("tagInput").value);
                document.getElementById("tagInput").value = "";
                let container = document.getElementById("tags");
                const children = tagData.map((val) => (
                    <span onClick={() => deleteTag({ val })} className={documentStyles.tag}><span className={lato.className}>X</span>{val}</span>
                ));
                ReactDOM.render(children, container);
            }
        });

        const urlParams = new URLSearchParams(window.location.search);
        const docID = urlParams.get('fileID');
        setFileID(docID);
        fillPage(docID);
    }, []);


    useEffect(() => {
        Database.getFileByObjectID(fileID).then((data) => {
            data.blob().then((text) => {
                text = URL.createObjectURL(text);
                setFileData(text);
            });
        });
    }, [fileID]);

    const deleteTag = (tag) => {
        tagData.splice(tagData.indexOf(tag.val), 1);
        const children = tagData.map((val) => (
            <span onClick={() => deleteTag({ val })} className={documentStyles.tag}><span className={lato.className}>X</span>{val}</span>
        ));
        ReactDOM.render(children, document.getElementById("tags"));
    }

    const deleteDoc = () => {
        let url = new URLSearchParams(window.location.search);
        let newid = url.get('fileID');
        console.log("truing to delete");
        fetch(`http://192.168.68.128:8080/api/delete/${newid}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        });
        history.back();
    }

    const cancelClick = () => {
        history.back();
    }

    const updateDoc = () => {
        let tagList = [];
        let tags = document.getElementById("tags").children;
        for (var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            tagList.push(tag.innerHTML.split(">")[2]);
        }

        console.log(fileIDRef.current);
        let metaTitle = document.getElementById("titleInput").value == "" ? "__xXNULLXx__" : document.getElementById("titleInput").value;
        let metaDesc = document.getElementById("descInput").value == "" ? "__xXNULLXx__" : document.getElementById("descInput").value;
        let metaTags = "";
        for (let i = 0; i < tagList.length; i++) {
            metaTags += `${tagList[i]},`;
        }
        if (metaTags == "") {
            metaTags = "__xXNULLXx__";
            console.log("tagdata gone");
            console.log(tagList);
        } else {
            metaTags = metaTags.substring(0, metaTags.length - 1);
        }
        const formData = {
            _id: fileIDRef.current,
            tags: metaTags,
            title: metaTitle,
            desc: metaDesc
        };
        Database.updateFile(formData).then((response) => {
            console.log(response.status);
        });
    }

    console.log(`fileData: ${fileDataRef.current}`);
    console.log(fileDataRef.current);

    const onDocumentLoadSuccess = (pdf) => {
        console.log('Set number of pages to', pdf.numPages);
        setNumberOfPages(pdf.numPages);

    }

    const downloadDoc = () => {
        ///download document with correct name
        let link = document.createElement('a');
        link.href = fileDataRef.current;
        let docName = document.getElementById("titleInput").value;
        if (!docName.endsWith(".pdf")) {
            docName += ".pdf";
        }
        link.download = docName;
        link.click();

    }


    return (
        <>
            <Head>
                <title>{siteTitle}</title>
                <Link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,200,300,400,500,600,700"></Link>
                <Link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"></Link>
                <Link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></Link>
                <Link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"></Link>
            </Head>
            <Stars />
            <div id="likes" className={documentStyles.likes}><div><FontAwesomeIcon icon={faHeart} /></div><span id="likesCount">999</span></div>
            <div id="views" className={documentStyles.views}><div><FontAwesomeIcon icon={faEye} /></div><span id="viewsCount">999</span></div>
            <div className='outer'>
                <div className={cx('inner', documentStyles.container)}>
                    <div className={documentStyles.docViewer}>

                        {/* <Document file={fileData}>
                            <Page
                                pageNumber={1}
                                width={200}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        </Document> */}
                        {/* <PDFViewer> */}
                        <Document file={fileData} onLoadSuccess={onDocumentLoadSuccess}>
                            {
                                Array.from(Array(numberOfPages).keys()).map((pageNumber) => {
                                    return (
                                        <>
                                            <Page
                                                pageNumber={pageNumber + 1}
                                                height={710}
                                                renderAnnotationLayer={false}
                                                renderTextLayer={false}
                                            />
                                            <hr></hr>
                                        </>
                                    )
                                }
                                )

                            }
                        </Document>
                        {/* </PDFViewer> */}


                    </div>
                    <div className={documentStyles.docEditor}>
                        <label for="titleInput" className={documentStyles.titleHeader}>TITLE</label>
                        <input id="titleInput" className={documentStyles.titleInput} type="text"></input>
                        <hr></hr>
                        <div className={documentStyles.header}>DESCRIPTION</div>
                        <textarea id="descInput" className={documentStyles.descInput}></textarea>
                        <hr></hr>
                        <div className={documentStyles.header}>TAGS</div>
                        <input className={documentStyles.tagInput} id="tagInput" type="text"></input><div onClick={addTag} className={documentStyles.addTagBtn}>ADD TAG +</div>
                        <div id="tags" className={documentStyles.tags}></div>
                        <br></br>
                        <hr></hr>
                        <div className={documentStyles.buttonBar}>
                            <div onClick={deleteDoc} className={documentStyles.deleteBtn}>DELETE</div>
                            <div onClick={downloadDoc} className={documentStyles.downloadBtn}>DOWNLOAD</div>
                            <div onClick={cancelClick} className={documentStyles.cancelBtn}>BACK</div>
                            <div onClick={updateDoc} className={documentStyles.updateBtn}>UPDATE</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}