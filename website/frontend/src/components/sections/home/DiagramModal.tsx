'use client';

import { useState, useEffect, useRef } from 'react';
import BusinessDiagram3D from './BusinessDiagram3D';
import './DiagramModal.css';

declare global {
    interface Window {
        openDiagramModal?: () => void;
    }
}

export default function DiagramModal() {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        window.openDiagramModal = () => setIsOpen(true);
        return () => {
            delete window.openDiagramModal;
        };
    }, []);

    return (
        <>
            <button
                ref={triggerRef}
                style={{ display: 'none' }}
                aria-hidden="true"
            />

            {/* Modal */}
            {isOpen && (
                <div className="diagram-modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="diagram-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="diagram-modal-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                        <div className="diagram-modal-body">
                            <BusinessDiagram3D />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
