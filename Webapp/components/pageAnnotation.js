import pageannotationStyles from "./pageannotation.module.scss"
import cx from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page, PDFViewer, PDFDownloadLink } from "react-pdf";


export default function PageAnnotation(props) {
    return (
        <>
            <Page
                pageNumber={props.pageNumber}
                height={710}
                renderAnnotationLayer={false}
                renderTextLayer={false}
            />
        </>
    );
}