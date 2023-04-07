import dropdownStyles from './dropdown.module.scss';
import cx from 'classnames';
import { useLayoutEffect, useRef, useState } from 'react';

export default function Dropdown(props) {
    /* Props:
    - props.items -> map of itemLabel: callback function
    - props.direction -> 'up' or 'down'
    - additional CSS classes to apply to menu??
        - props.buttonClass
        - props.menuClass
        - props.itemClass

    */

    const [menuOpen, _setMenuOpen] = useState(false);
    const menuOpenRef = useRef(menuOpen);
    const setMenuOpen = data => {
        menuOpenRef.current = data;
        _setMenuOpen(data);
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpenRef.current);
    };

    let keyNum = 0;
    return (
        <div className={dropdownStyles.menuWrapper}>
            <ul className={dropdownStyles.openMenu}>
                {Object.entries(props.items).map(([itemLabel, [icon, callback]]) => {
                    itemLabel++;
                    keyNum++;
                    return (
                        <li
                            key={keyNum}
                            className={cx(menuOpen ? dropdownStyles.menuItemOpen : dropdownStyles.menuItemClosed, props.itemClass)}
                            onClick={callback}
                        >
                            {icon}
                        </li>
                    );
                })}
            </ul>
            <div
                className={cx(dropdownStyles.toggleButton, props.className)}
                onClick={toggleMenu}
            >
                <div id='hbar1' className={cx(dropdownStyles.hbar1, menuOpen ? dropdownStyles.hbar1Closed : dropdownStyles.hbar1Open)}></div>
                <div id='hbar2' className={cx(dropdownStyles.hbar2, menuOpen ? dropdownStyles.hbar2Closed : dropdownStyles.hbar2Open)}></div>
                <div id='hbar3' className={cx(dropdownStyles.hbar3, menuOpen ? dropdownStyles.hbar3Closed : dropdownStyles.hbar3Open)}></div>
            </div>

        </div>
    );
}