// src/components/UI/Button/Button.tsx
import React from 'react';
import './Button.css';

export interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
    size?: 'small' | 'medium' | 'large';
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
                                                  onClick,
                                                  disabled = false,
                                                  children,
                                                  variant = 'primary',
                                                  size = 'medium',
                                                  fullWidth = false,
                                                  type = 'button',
                                                  icon,
                                                  iconPosition = 'left'
                                              }) => {
    const buttonClasses = [
        'button',
        variant,
        size,
        fullWidth ? 'full-width' : '',
        icon ? 'has-icon' : '',
        iconPosition === 'right' ? 'icon-right' : ''
    ].filter(Boolean).join(' ');

    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {icon && iconPosition === 'left' && (
                <span className="button-icon left">{icon}</span>
            )}
            <span className="button-text">{children}</span>
            {icon && iconPosition === 'right' && (
                <span className="button-icon right">{icon}</span>
            )}
        </button>
    );
};