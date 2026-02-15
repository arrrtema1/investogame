// src/components/UI/Modal/Modal.tsx
import React, { useEffect } from 'react';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    showCloseButton?: boolean;
    closeOnClickOutside?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                children,
                                                size = 'medium',
                                                showCloseButton = true,
                                                closeOnClickOutside = true
                                            }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
        if (closeOnClickOutside && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClickOutside}>
            <div className={`modal-container ${size}`}>
                <div className="modal-header">
                    {title && <h3 className="modal-title">{title}</h3>}
                    {showCloseButton && (
                        <button className="modal-close" onClick={onClose}>
                            ✕
                        </button>
                    )}
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};