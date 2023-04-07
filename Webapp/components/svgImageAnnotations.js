import localStyle from './svgImageAnnotations.module.scss';
import { useRef, useState } from 'react';

export default function SvgImageAnnotations(props) {

    const removeClickedRectangle = (event) => {
        const clickedRect = event.target;
        console.log(clickedRect.getAttribute('data-raw'));
        const currentRects = props.highlightedRectangles;
        const newRects = currentRects.filter(rect => JSON.stringify(rect) !== clickedRect.getAttribute('data-raw'));
        props.setHighlightedRectangles(newRects);
    };

    const removeClickedPoint = (event) => {
        const clickedPoint = event.target;
        console.log(clickedPoint.getAttribute('data-raw'));
        const currentPoints = props.selectedPoints;
        const newPoints = currentPoints.filter(point => JSON.stringify(point) !== clickedPoint.getAttribute('data-raw'));
        props.setSelectedPoints(newPoints);
    };

    return (
        <div id='svgImageAnnotationsOuterWrapper' className={localStyle.outerWrapper}>
            <svg
                id='imageManipulatorSVGWrapper'
                className={localStyle.SVGWrapper}
                width={props.dimensions.width}
                height={props.dimensions.height}
            >
                {props.selectedPoints.map((point, index) => {
                    return (
                        <circle
                            key={index}
                            className={localStyle.point}
                            onClick={removeClickedPoint}
                            data-raw={JSON.stringify(point)}
                            cx={point.x * (props.imageDimensions.width * props.imageScale) + props.imagePosition.x + 'px'}
                            cy={point.y * (props.imageDimensions.height * props.imageScale) + props.imagePosition.y + 'px'}
                            r={4}
                            stroke='white'
                            strokeWidth='2'
                            fill='green'
                        />
                    );
                })}
                {props.highlightedRectangles.map((rectangle, index) => {
                    return (
                        <polygon
                            key={index}
                            data-raw={JSON.stringify(rectangle)}
                            className={localStyle.highlightedRectangle}
                            onClick={removeClickedRectangle}
                            points={
                                rectangle.map(
                                    point => {
                                        return ([
                                            point.x * (props.imageDimensions.width * props.imageScale) + props.imagePosition.x,
                                            point.y * (props.imageDimensions.height * props.imageScale) + props.imagePosition.y
                                        ].join(','));
                                    }
                                ).join(' ')
                            }
                        />
                    )
                })}
            </svg>
        </div>
    );
}