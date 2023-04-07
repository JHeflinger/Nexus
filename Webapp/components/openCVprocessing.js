import cv2 from "@techstark/opencv-js";

const stretchImage = (image) => {
    const min = image.min();
    const max = image.max();
    const scale = 255 / (max - min);
    const offset = -min * scale;
    return image.convertTo(image, cv2.CV_8U, scale, offset);
};

const orderPoints = (points) => {
    const rect = new Array(4).fill(0).map(() => new Array(2).fill(0));
    const s = points.map(point => point[0] + point[1]);
    const diff = points.map(point => point[1] - point[0]);
    console.log(s);

    rect[0] = points[s.indexOf(Math.min(...s))];
    rect[2] = points[s.indexOf(Math.max(...s))];
    rect[1] = points[diff.indexOf(Math.min(...diff))];
    rect[3] = points[diff.indexOf(Math.max(...diff))];

    const widthA = Math.sqrt(Math.pow(rect[2][0] - rect[3][0], 2) + Math.pow(rect[2][1] - rect[3][1], 2));
    const widthB = Math.sqrt(Math.pow(rect[1][0] - rect[0][0], 2) + Math.pow(rect[1][1] - rect[0][1], 2));
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.sqrt(Math.pow(rect[1][0] - rect[2][0], 2) + Math.pow(rect[1][1] - rect[2][1], 2));
    const heightB = Math.sqrt(Math.pow(rect[0][0] - rect[3][0], 2) + Math.pow(rect[0][1] - rect[3][1], 2));
    const maxHeight = Math.max(heightA, heightB);

    if (maxWidth < maxHeight) {
        return rect;
    }
    return [
        rect[1],
        rect[2],
        rect[3],
        rect[0]
    ];


};

const perspectiveTransform = (image, points) => {
    const [tl, tr, br, bl] = points;

    const widthA = Math.sqrt(Math.pow(br[0] - bl[0], 2) + Math.pow(br[1] - bl[1], 2));
    const widthB = Math.sqrt(Math.pow(tr[0] - tl[0], 2) + Math.pow(tr[1] - tl[1], 2));
    const maxWidth = Math.max(widthA, widthB);

    const heightA = Math.sqrt(Math.pow(tr[0] - br[0], 2) + Math.pow(tr[1] - br[1], 2));
    const heightB = Math.sqrt(Math.pow(tl[0] - bl[0], 2) + Math.pow(tl[1] - bl[1], 2));
    const maxHeight = Math.max(heightA, heightB);

    const dst = [
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]
    ];

    const flattenedPoints = [].concat(...points);
    const flattenedDST = [].concat(...dst);

    const pointsMat = cv2.matFromArray(4, 1, cv2.CV_32FC2, flattenedPoints);
    const dstMat = cv2.matFromArray(4, 1, cv2.CV_32FC2, flattenedDST);

    const M = cv2.getPerspectiveTransform(pointsMat, dstMat);
    const warped = new cv2.Mat();
    cv2.warpPerspective(image, warped, M, new cv2.Size(maxWidth, maxHeight));
    return warped;
};

const handleImagePreview = (image, ref, event, points) => {

};

const testReturnImage = (image, canvasId, points, scale) => {
    const img = cv2.imread(image);
    // const newImg = new cv2.Mat();
    // cv2.cvtColor(img, newImg, cv2.COLOR_BGR2GRAY);

    const imNativeWidth = img.cols;
    const imNativeHeight = img.rows;
    const docWidth = document.body.clientWidth;

    // console.log(JSON.stringify(points));
    const rect = points.map((point) => {
        return ([point.x * imNativeWidth, point.y * imNativeHeight]);
    });

    // const newImg = perspectiveTransform(img, orderPoints(rect));
    const newImg = perspectiveTransform(img, rect);

    const newImNativeWidth = newImg.cols;
    const newImNativeHeight = newImg.rows;

    // console.log(`Image width: ${imNativeWidth}, height: ${imNativeHeight}, docWidth: ${docWidth}`);

    const targetWidth = docWidth * scale;//0.18;
    const scaleFactor = targetWidth / newImNativeWidth;
    const targetHeight = newImNativeHeight * scaleFactor;

    // console.log(`Target width: ${targetWidth}, Target height: ${targetHeight}, Scale factor: ${scaleFactor}`);

    const dsize = new cv2.Size(targetWidth, targetHeight);
    const scaledImage = new cv2.Mat();
    cv2.resize(newImg, scaledImage, dsize, 0, 0, cv2.INTER_AREA);

    const index = 0;

    // console.log(`Image element: [${id}]`);

    cv2.imshow(canvasId, scaledImage);
    // console.log('displayed image');
    img.delete();
    newImg.delete();
};

export { testReturnImage, orderPoints };