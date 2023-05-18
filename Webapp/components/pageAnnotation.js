import pageannotationStyles from "./pageannotation.module.scss"
import cx from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { pdfjs, Document, Page, PDFViewer, PDFDownloadLink } from "react-pdf";
import { redirect } from "next/dist/server/api-utils";


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
        if (props.referenceRef.current) {
            const boundingRect = props.referenceRef.current.getBoundingClientRect();
            const percentPXHeight = boundingRect.height / 95;
            setPagePosition({
                x: boundingRect.x,
                y: boundingRect.top,//+ (percentPXHeight * 5),
            });
            setDimensions({
                height: props.referenceRef.current.offsetHeight,
                width: props.referenceRef.current.offsetWidth
            });
            // console.log('PageAnnotation dimensions: ', dimensionsRef.current);
        }
        // props.setForceReload(1 - props.forceReload);
    }



    useEffect(() => {
        window.addEventListener('resize', () => {
            clearInterval(spamPreventionTimer);
            spamPreventionTimer = setTimeout(updateDimensions, TIMER_TIMEOUT);
        });
        updateDimensions();
        // const ctx = canvasRef.current.getContext('2d');
        // if (props.initialAnnotation) {
        //     console.log(object);("initial annotation found")
        //     console.log(props.initialAnnotation);
        //     ctx.putImageData(props.annotationData, 0, 0);
        // }
    }, []);

    const loadedPage = (stuff) => {
        console.log("LOADED PAGE");
        console.log(stuff.height);
        console.log("resizing canvas");
        if (canvasRef.current && ref.current) {
            const canvas = canvasRef.current;
            canvas.width = stuff.height;
            canvas.height = dimensionsRef.current.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            console.log(props.initialAnnotation);
            if (props.initialAnnotation) {
                console.log("initial annotation found")
                console.log(props.initialAnnotation);
                // const parsedData = JSON.parse(props.initialAnnotation);
                // console.log(parsedData);
                // console.log(props.initialAnnotation);
                const parsedData = props.initialAnnotation;
                //conver dict of points to array of points
                const dataRay = [];
                for (const key in parsedData.data) {
                        const element = parsedData["data"][key];
                        dataRay.push(element);
                }
                const newImageData = new ImageData(Uint8ClampedArray.from(dataRay), parsedData.width, parsedData.height);
                ctx.putImageData(newImageData, 0, 0);
                console.log("IMAGE DATA PUT");
            }   
        }
    }

    const pos = { x: 0, y: 0 };

    const setPos = (e) => {
        console.log(ref.current.getBoundingClientRect().x);
        const rect = ref.current.getBoundingClientRect();
        pos.x = e.clientX - rect.x;
        pos.y = e.clientY - rect.y;
    }

    const updateStoredAnnotations = (ctx) => {
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataToSave = {
            data: imageData.data,
            width: imageData.width,
            height: imageData.height,
        }
        const stringifiedData = JSON.stringify(dataToSave);

        console.log(dataToSave);
        props.updateAnnotation(props.pageNumber, stringifiedData);
    }


    const draw = (e) => {
        if (e.buttons !== 1) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
        ctx.moveTo(pos.x, pos.y);
        setPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

    }

    const update = (e) => {
        const ctx = canvasRef.current.getContext('2d');
        updateStoredAnnotations(ctx);
        console.log("UPDATING ANNOTATIONS");
    }


    return (
        <div
            id="pageAnnotationOuterWrapper"
            key={props.pageNumber}
            className={pageannotationStyles.wrapper}
            onMouseDown={setPos}
            onMouseMove={draw}
            ref={ref}
            onMouseEnter={setPos}
            onMouseUp={update}
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
                onLoadSuccess={loadedPage}
            />
        </div>
    );
}