import pageannotationStyles from "./pageannotation.module.scss"
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page, PDFViewer, PDFDownloadLink } from "react-pdf";


export default function PageAnnotation(props) {


    const [dimensions, _setDimensions] = useState({ width: 0, height: 0 });
    const dimensionsRef = useRef(dimensions);
    const setDimensions = data => {
        dimensionsRef.current.width = data.width;
        dimensionsRef.current.height = data.height;
        _setDimensions(data);
    };

    const [pagePosition, _setPagePosition] = useState({ x: 0, y: 0 });
    const pagePositionRef = useRef(pagePosition);
    const setPagePosition = data => {
        pagePositionRef.current.x = data.x;
        pagePositionRef.current.y = data.y;
        _setPagePosition(data);
    };
    const canvasRef = useRef(null);
    const ref = useRef(null);
    let spamPreventionTimer = null;
    const TIMER_TIMEOUT = 100;

    const updateDimensions = () => {
        if (ref.current) {
            const boundingRect = ref.current.getBoundingClientRect();
            const percentPXHeight = boundingRect.height / 95;
            setPagePosition({
                x: boundingRect.x,
                y: boundingRect.top,//+ (percentPXHeight * 5),
            });
            setDimensions({
                height: ref.current.offsetHeight,
                width: ref.current.offsetWidth
            });
            console.log('PageAnnotation dimensions: ', dimensionsRef.current);
        }

        if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = dimensionsRef.current.width;
            canvas.height = dimensionsRef.current.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.font = '30px Arial';
            ctx.fillText(`Page ${props.pageNumber}`, 10, 50);
        }
        // props.setForceReload(1 - props.forceReload);
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            clearInterval(spamPreventionTimer);
            spamPreventionTimer = setTimeout(updateDimensions, TIMER_TIMEOUT);
        });
        updateDimensions();
    }, []);


    return (
        <div
            ref={ref}
            id="pageAnnotationOuterWrapper"
            key={props.pageNumber}
        >
            <canvas
                ref={canvasRef}
                id="pageAnnotationCanvas"
                className={pageannotationStyles.pageAnnotationCanvas}
            ></canvas>
            <Page
                pageNumber={props.pageNumber}
                height={dimensions.height}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                key={props.pageNumber}
            />
        </div>
    );
}