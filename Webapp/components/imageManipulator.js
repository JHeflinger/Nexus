import imageManipulatorStyles from './imageManipulator.module.scss';
import SvgImageAnnotations from './svgImageAnnotations';
import { useRef, useState, useEffect } from 'react';
import { testReturnImage } from './openCVprocessing';

export default function ImageManipulator(props) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [imageDimensions, _setImageDimensions] = useState({ width: 0, height: 0 });
    const [pagePosition, _setPagePosition] = useState({ x: 0, y: 0 });
    const [imagePosition, _setImagePosition] = useState({ x: 0, y: 0 });
    const [imageScale, _setImageScale] = useState(1);
    const [imageCenterPos, _setImageCenterPos] = useState({ x: 0, y: 0 });
    const [initialScale, _setInitialScale] = useState(1);
    const [lastTouchPos, _setLastTouchPos] = useState({ x: 0, y: 0 });

    const lastTouchPosRef = useRef(lastTouchPos);
    const setLastTouchPos = data => {
        lastTouchPosRef.current = data;
        _setLastTouchPos(data);
    }

    const initialScaleRef = useRef(initialScale);
    const setInitialScale = data => {
        initialScaleRef.current = data
        _setInitialScale(data)
    }

    const imageCenterPosRef = useRef(imageCenterPos);
    const setImageCenterPos = data => {
        imageCenterPosRef.current = data;
        _setImageCenterPos(data);
    }

    const ZOOM_FACTOR = 0.0025;

    const imageDimensionsRef = useRef(imageDimensions);
    const setImageDimensions = data => {
        imageDimensionsRef.current = data;
        _setImageDimensions(data);
        console.log(`Setting image dimensions to ${data.width}x${data.height}`);
    };

    const imageScaleRef = useRef(imageScale);
    const setImageScale = data => {
        imageScaleRef.current = data;
        _setImageScale(data);
    };

    const imagePosRef = useRef(imagePosition);
    const setImagePosition = data => {
        imagePosRef.current.x = data.x;
        imagePosRef.current.y = data.y;
        _setImagePosition(data);
    };

    const pagePositionRef = useRef(pagePosition);
    const setPagePosition = data => {
        pagePositionRef.current.x = data.x;
        pagePositionRef.current.y = data.y;
        _setPagePosition(data);
    };

    let imageElement = null;
    const imageRef = useRef(imageElement);
    const setImageElement = element => {
        imageRef.current = element;
        imageElement = element;
    };

    if (typeof window !== 'undefined') {
        print = console.log.bind(document);
        imageElement = document.getElementById("scannerImageElementForCV");
    }

    const zoomSenseRef = useRef(props.zoomSense);

    const drawImage = () => {
        const canvas = document.getElementById('imageManipulatorCanvas');
        const ctx = canvas.getContext('2d');

        setImageCenterPos({
            x: imagePosRef.current.x + imageScaleRef.current * imageDimensionsRef.current.width / 2,
            y: imagePosRef.current.y + imageScaleRef.current * imageDimensionsRef.current.height / 2
        })

        const image = imageRef.current;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, imagePosRef.current.x, imagePosRef.current.y, imageDimensionsRef.current.width * imageScaleRef.current, imageDimensionsRef.current.height * imageScaleRef.current);
    };

    const handlePanMouse = (event) => {
        if (imageRef.current) {
            if (event.buttons === 1) {
                // console.log(event);
                setImagePosition({
                    x: imagePosRef.current.x + event.movementX,
                    y: imagePosRef.current.y + event.movementY
                });
                drawImage();
            }
        }
        event.preventDefault();
        event.stopPropagation();
    };

    const handlePanTouch = (event) => {
        if (imageRef.current) {
            const touchPoint = event.touches[0];
            if (lastTouchPosRef.current.x && lastTouchPosRef.current.y) {

                setImagePosition({
                    x: imagePosRef.current.x + touchPoint.clientX - lastTouchPosRef.current.x,
                    y: imagePosRef.current.y + touchPoint.clientY - lastTouchPosRef.current.y
                });
                drawImage();
            }
            setLastTouchPos({ x: touchPoint.clientX, y: touchPoint.clientY });
        }
        // event.preventDefault();
        event.stopPropagation();
    };

    const touchEnd = (event) => {
        // console.log('Touch end');
        setLastTouchPos({ x: undefined, y: undefined });
    }

    const translateMousePosition = (x, y) => {
        return (
            [x - pagePositionRef.current.x,
            y - pagePositionRef.current.y]
        )
    };

    const isOverImage = event => {
        const [localX, localY] = translateMousePosition(event.clientX, event.clientY);
        return (
            localX > imagePosRef.current.x &&
            localX < imagePosRef.current.x + imageDimensionsRef.current.width * imageScaleRef.current &&
            localY > imagePosRef.current.y &&
            localY < imagePosRef.current.y + imageDimensionsRef.current.height * imageScaleRef.current
        );
    }

    const handleWheel = (event) => {

        if (event.shiftKey) { //Scroll Horizontally
            setImagePosition({
                x: imagePosRef.current.x + event.deltaY,
                y: imagePosRef.current.y
            });
        } else if (event.ctrlKey) { //Scroll Vertically
            setImagePosition({
                x: imagePosRef.current.x,
                y: imagePosRef.current.y + event.deltaY
            });
        } else { //Zoom
            const [localX, localY] = translateMousePosition(event.clientX, event.clientY);

            if (isOverImage(event)) {

                const scaleFactor = event.deltaY * ZOOM_FACTOR * 0.01 * zoomSenseRef.current;
                const tmpNewScale = scaleFactor + imageScaleRef.current;

                const localScale = (tmpNewScale / imageScaleRef.current) - 1;

                const imRefMouseX = localX - imagePosRef.current.x;
                const imRefMouseY = localY - imagePosRef.current.y;

                // console.log(event.deltaY)

                if (event.deltaY - Math.round(event.deltaY) !== 0 || Math.abs(event.deltaY) < 50) {
                    console.log('trackpad');
                } else {
                    console.log('mouse');
                }

                const deltaX = imRefMouseX * (localScale);
                const deltaY = imRefMouseY * (localScale);

                const tmpNewX = imagePosRef.current.x - deltaX;
                const tmpNewY = imagePosRef.current.y - deltaY;

                if (tmpNewScale > 0.05 && tmpNewScale < 20) {
                    setImageScale(tmpNewScale);
                    setImagePosition({
                        x: tmpNewX,
                        y: tmpNewY
                    });
                }
            }
        }
        if (imageRef.current) {
            drawImage();
        }
    };

    const resetPosScale = event => {
        setImagePosition({
            x: 0,
            y: 0
        });
        setImageScale(initialScaleRef.current);
        drawImage();
        removeDefaultCallback(event);
    };

    const removeDefaultCallback = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };


    const handleRightClick = (event) => {
        if (isOverImage(event)) {
            const [localX, localY] = translateMousePosition(event.clientX, event.clientY);
            const imRefMouseX = (localX - imagePosRef.current.x);
            const imRefMouseY = (localY - imagePosRef.current.y);

            const imRefMouseXNorm = (imRefMouseX) / (imageDimensionsRef.current.width * imageScaleRef.current);
            const imRefMouseYNorm = (imRefMouseY) / (imageDimensionsRef.current.height * imageScaleRef.current);

            const currentSelectedPoints = props.selectedPoints;
            currentSelectedPoints.push({
                x: imRefMouseXNorm,
                y: imRefMouseYNorm
            });
            if (currentSelectedPoints.length === 4) {
                const newHighlightedRectangles = props.highlightedRectangles;
                newHighlightedRectangles.push(currentSelectedPoints);
                props.setHighlightedRectangles(newHighlightedRectangles);
                props.setSelectedPoints([]);
                console.log("image eleme");
                console.log(imageElement);
                testReturnImage(imageElement, "imageBufferCanvas", currentSelectedPoints, 1);
                const imageDataURL = imageBufferCanvas.toDataURL('image/jpeg', 0.75);
                props.setScannedImages([...props.scannedImages, imageDataURL]);

                //for testing download generated image
                // const link = document.createElement('a');
                // link.download = 'image.jpg';
                // link.href = imageDataURL;
                // link.click();
                // link.remove();


            } else {
                props.setSelectedPoints(currentSelectedPoints);
            }
            drawImage();
        }

        removeDefaultCallback(event);
    };

    const ref = useRef(null);
    let spamPreventionTimer = null;
    const TIMER_TIMEOUT = 100;

    const updateDimensions = () => {
        if (imageRef.current !== null) {
            console.log("attempting to reload image");
            drawImage();
            setTimeout(drawImage, 100);
        }

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

        }
        props.setForceReload(1 - props.forceReload);
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            clearInterval(spamPreventionTimer);
            spamPreventionTimer = setTimeout(updateDimensions, TIMER_TIMEOUT);
        });
        updateDimensions();
    }, []);

    useEffect(() => {
        if (props.image !== null) {
            // setImageElement(document.getElementById('imageManipulatorImage'));
            setImagePosition({ x: 0, y: 0 });
            const ctx = document.getElementById('imageManipulatorCanvas').getContext('2d');
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);
            const img = new Image();   // Create new img element
            img.src = URL.createObjectURL(props.image);
            img.onload = () => {
                setImageElement(img);
                const imScale = dimensions.height / img.height;
                setImageScale(imScale);
                setInitialScale(imScale);
                ctx.drawImage(img, 0, 0, imScale * img.naturalWidth, imScale * img.naturalHeight);
                setImageDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight
                });

                setImageCenterPos({
                    x: imScale * img.naturalWidth / 2,
                    y: imScale * img.naturalHeight / 2
                })

                console.log(`Image Dimensions: ${img.naturalWidth} x ${img.naturalHeight}`);
            }
            // document.getElementById('imageManipulatorImage').style.transform = `translate(${imagePosRef.current.x}px, ${imagePosRef.current.y}px) scale(${imageScaleRef.current})`;


            // imageElement.style.height = dimensions.height + 1 + 'px';
            // imageElement.style.width = 'auto';
            // const transformX = (dimensions.width - ((dimensions.height/imageDimensions.height)*imageDimensions.width)) / 2;
            // image.style.transform = `translate(${-transformX}px,${0}px)`;

            // const boundingRect = imageElement.getBoundingClientRect();

            // setImageDimensions({
            //     height: boundingRect.height,
            //     width: boundingRect.width
            // });
        }
    }, [props.image]);

    useEffect(() => {
        zoomSenseRef.current = props.zoomSense;
    }, [props.zoomSense]);

    if (typeof window !== 'undefined') {

        props.router.beforePopState(({ url, as, options }) => {
            window.removeEventListener('resize', updateDimensions);
            props.router.push(url, as, options);
        });
    }

    return (
        <div
            ref={ref}
            id='imageManipulatorOuterWrapper'
            className={imageManipulatorStyles.outerWrapper}
            onMouseMove={handlePanMouse}
            onTouchMove={handlePanTouch}
            onTouchEnd={touchEnd}
            onWheel={handleWheel}
            onContextMenu={handleRightClick}
            onDoubleClick={resetPosScale}
        >
            <canvas id='imageBufferCanvas' style={{ display: 'none' }}></canvas>
            {props.image === null ? `No Image Uploaded` : ''}
            <div id='imageManipulatorImgWrapper' className='imgWrapper'>
                <canvas
                    id='imageManipulatorCanvas'
                    className={imageManipulatorStyles.image}
                    width={dimensions.width}
                    height={dimensions.height}
                >
                </canvas>
            </div>
            <SvgImageAnnotations
                dimensions={dimensions}
                imageDimensions={imageDimensions}
                imagePosition={imagePosition}
                imageCenterPos={imageCenterPos}
                imageScale={imageScale}
                selectedPoints={props.selectedPoints}
                setSelectedPoints={props.setSelectedPoints}
                highlightedRectangles={props.highlightedRectangles}
                setHighlightedRectangles={props.setHighlightedRectangles}
            />
        </div>
    )
}