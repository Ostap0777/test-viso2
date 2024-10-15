import React from 'react';
import styles from './button.module.scss';
import { ButtonProps } from '../../models/models';

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return (
		<div className={styles.button__container}>
        <button className={styles.button} onClick={onClick}>
            {children}
        </button>
		  <p className={styles.button__text}>Щоб видалити квест натисніть на нього</p>
		  </div>
    );
};

export default Button;