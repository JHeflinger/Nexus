import localStyle from './displayPreviews.module.scss';
import { testReturnImage } from './openCVprocessing'
import { useRef } from "react";

export default function DisplayPreviews(props) {
    let print = null;
    let scannedImages = props.scannedImages;
    let imageElement = null;
    // const imgTransferRef = createRef();

    if (typeof window !== 'undefined') {
        print = console.log.bind(document);
        imageElement = document.getElementById("scannerImageElementForCV");
    }


    const clickImages = () => {
        const numberOfImages = props.highlightedRectangles.length;
        for (let i = 0; i < numberOfImages; i++) {
            const id = `displayPreviewsScannedPageImage${i}`;
            const imgElement = document.getElementById(id);
            imgElement.click();
        }
    };

    // setTimeout(clickImages, 10);
    // setTimeout(clickImages, 100);

    return (
        <div
            className={localStyle.scannedPagesWrapper}
            id='displayPreviewsScannedPagesWrapper'
            // style={{overflow: 'auto'}}
            key={props.scannedImages.length}
        >
            <div className={localStyle.scannedPages} id='displayPreviewsScannedPages'>
                {
                    typeof window === 'undefined' ? "" :
                        props.scannedImages.map((points, index) => {
                            return (
                                <div className={localStyle.scannedPage} id={`displayPreviewsScannedPage${index}`} key={index * 100}>
                                    <img
                                        src={props.scannedImages[index]}
                                        className={localStyle.scannedPageImage}
                                        key={index}
                                    // ref={localRef}
                                    ></img>
                                </div>
                            )
                        })
                }
            </div>
        </div>
    );
}