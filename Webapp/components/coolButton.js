import coolButtonStyles from './coolButton.module.scss';
import cx from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

export default function CoolButton(props) {
    const ref = useRef(null);
    let spamPreventionTimer = null;

    const [height, setHeight] = useState(0);
    const TIMER_TIMEOUT = 100;

    const updateDimensions = () => {
        if (ref.current) {
            setHeight(ref.current.offsetHeight);
        }
    }

    useLayoutEffect(() => {
        window.addEventListener('resize', () => {
            clearInterval(spamPreventionTimer);
            spamPreventionTimer = setTimeout(updateDimensions, TIMER_TIMEOUT);
        });
        updateDimensions();
    }, []);

    return (
        <div
            ref={ref}
            onClick={props.callback}
            className={
                cx(coolButtonStyles.button, props.className, {
                    [coolButtonStyles.translate]: props.move,
                })
            }
            id={props.id}
        >
            {props.content}
        </div>
    );
}