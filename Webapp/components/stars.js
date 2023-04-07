import starStyles from './stars.module.scss';

export default function Stars(props) {

    let blur = 3;

    if (props.blur !== undefined) {
        blur = props.blur + 1;
    }

    return (
        <div id="starsWrapper" className={starStyles.starsWrapper}>
            {[1, 2, 3].map((i) => {
                const styleName = `stars${i}_b${blur}`;
                return (
                    <div
                        key={i}
                        id={`stars${i}`}
                        className={`${starStyles[styleName]}`}
                    >
                    </div>
                );
            })}
        </div>
    );
}