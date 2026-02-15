// src/components/UI/Card/Card.tsx
import React from 'react';
import './Card.css';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
    padding?: 'none' | 'small' | 'medium' | 'large';
    hoverable?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              title,
                                              subtitle,
                                              icon,
                                              actions,
                                              className = '',
                                              variant = 'default',
                                              size = 'medium',
                                              padding = 'medium',
                                              hoverable = false,
                                              onClick
                                          }) => {
    const cardClasses = [
        'card',
        `card-${variant}`,
        `card-size-${size}`,
        `card-padding-${padding}`,
        hoverable ? 'card-hoverable' : '',
        onClick ? 'card-clickable' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={cardClasses} onClick={onClick}>
            {(title || subtitle || icon || actions) && (
                <div className="card-header">
                    <div className="card-header-left">
                        {icon && <div className="card-icon">{icon}</div>}
                        <div className="card-titles">
                            {title && <h4 className="card-title">{title}</h4>}
                            {subtitle && <div className="card-subtitle">{subtitle}</div>}
                        </div>
                    </div>
                    {actions && <div className="card-actions">{actions}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};