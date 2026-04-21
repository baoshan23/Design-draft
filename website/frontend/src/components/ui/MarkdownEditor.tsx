'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    value: string;
    onChange: (next: string) => void;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    className?: string;
    textareaClassName?: string;
    previewClassName?: string;
    showTabs?: boolean;
    uploadImage?: (file: File) => Promise<string>; // returns URL
    labels?: {
        write: string;
        preview: string;
        previewEmpty: string;
        markdownGuide: string;
        uploading: string;
        uploadFailed: string;
        insertLink: string;
        insertImage: string;
        undo: string;
        redo: string;
        heading: string;
        bold: string;
        italic: string;
        inlineCode: string;
        bulletList: string;
        numberedList: string;
        table: string;
        mention: string;
    };
};

function wrapSelection(el: HTMLTextAreaElement, prefix: string, suffix = prefix) {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = el.value.slice(0, start);
    const selected = el.value.slice(start, end);
    const after = el.value.slice(end);
    const next = `${before}${prefix}${selected || ''}${suffix}${after}`;
    const cursorStart = start + prefix.length;
    const cursorEnd = cursorStart + (selected || '').length;
    return { next, cursorStart, cursorEnd };
}

function insertAtCursor(el: HTMLTextAreaElement, text: string) {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const before = el.value.slice(0, start);
    const after = el.value.slice(end);
    const next = `${before}${text}${after}`;
    const cursor = start + text.length;
    return { next, cursorStart: cursor, cursorEnd: cursor };
}

function setSelection(el: HTMLTextAreaElement, start: number, end: number) {
    try {
        el.focus();
        el.setSelectionRange(start, end);
    } catch {
        // ignore
    }
}

export default function MarkdownEditor({
    value,
    onChange,
    placeholder,
    disabled,
    id,
    className,
    textareaClassName,
    previewClassName,
    showTabs = true,
    uploadImage,
    labels,
}: Props) {
    const t = useMemo(
        () =>
            labels || {
                write: 'Write',
                preview: 'Preview',
                previewEmpty: 'Nothing to preview yet.',
                markdownGuide: 'Markdown guide',
                uploading: 'Uploading…',
                uploadFailed: 'Upload failed',
                insertLink: 'Insert link',
                insertImage: 'Upload image',
                undo: 'Undo',
                redo: 'Redo',
                heading: 'Heading',
                bold: 'Bold',
                italic: 'Italic',
                inlineCode: 'Inline code',
                bulletList: 'Bullet list',
                numberedList: 'Numbered list',
                table: 'Table',
                mention: 'Mention',
            },
        [labels],
    );

    const [mode, setMode] = useState<'write' | 'preview'>('write');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // Very lightweight undo/redo stack (value is controlled by parent).
    const historyRef = useRef<{ stack: string[]; idx: number; last: string }>(
        { stack: [value], idx: 0, last: value },
    );

    useEffect(() => {
        const h = historyRef.current;
        if (value === h.last) return;
        h.last = value;

        // Only push when we are at the end; otherwise fork history.
        const atEnd = h.idx === h.stack.length - 1;
        const prev = h.stack[h.idx];
        if (value === prev) return;

        if (!atEnd) {
            h.stack = h.stack.slice(0, h.idx + 1);
        }
        h.stack.push(value);
        h.idx = h.stack.length - 1;

        // Cap history size.
        if (h.stack.length > 60) {
            const overflow = h.stack.length - 60;
            h.stack = h.stack.slice(overflow);
            h.idx = Math.max(0, h.idx - overflow);
        }
    }, [value]);

    const applyOp = useCallback(
        (op: (el: HTMLTextAreaElement) => { next: string; cursorStart: number; cursorEnd: number }) => {
            const el = textareaRef.current;
            if (!el) return;
            const { next, cursorStart, cursorEnd } = op(el);
            onChange(next);
            // Wait a tick for controlled value to propagate.
            setTimeout(() => {
                const el2 = textareaRef.current;
                if (!el2) return;
                setSelection(el2, cursorStart, cursorEnd);
            }, 0);
        },
        [onChange],
    );

    const onUndo = useCallback(() => {
        const h = historyRef.current;
        if (h.idx <= 0) return;
        h.idx -= 1;
        onChange(h.stack[h.idx]);
    }, [onChange]);

    const onRedo = useCallback(() => {
        const h = historyRef.current;
        if (h.idx >= h.stack.length - 1) return;
        h.idx += 1;
        onChange(h.stack[h.idx]);
    }, [onChange]);

    const pickImage = useCallback(() => {
        if (!uploadImage) return;
        if (disabled) return;
        fileRef.current?.click();
    }, [uploadImage, disabled]);

    const onFilePicked = useCallback(
        async (file: File | null) => {
            if (!file) return;
            if (!uploadImage) return;
            setUploadError(null);
            setUploading(true);
            try {
                const url = await uploadImage(file);
                applyOp((el) => insertAtCursor(el, `![${file.name}](${url})`));
            } catch (e) {
                setUploadError(e instanceof Error ? e.message : t.uploadFailed);
            } finally {
                setUploading(false);
            }
        },
        [applyOp, uploadImage, t.uploadFailed],
    );

    return (
        <div className={`md-editor${className ? ` ${className}` : ''}`}>
            <div className="md-editor-top">
                {showTabs ? (
                    <div className="md-editor-tabs" role="tablist" aria-label="Markdown editor">
                        {mode === 'write' ? (
                            <button
                                type="button"
                                className="active"
                                role="tab"
                                aria-selected="true"
                                onClick={() => setMode('write')}
                                disabled={disabled}
                            >
                                {t.write}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className=""
                                role="tab"
                                aria-selected="false"
                                onClick={() => setMode('write')}
                                disabled={disabled}
                            >
                                {t.write}
                            </button>
                        )}

                        {mode === 'preview' ? (
                            <button
                                type="button"
                                className="active"
                                role="tab"
                                aria-selected="true"
                                onClick={() => setMode('preview')}
                                disabled={disabled}
                            >
                                {t.preview}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className=""
                                role="tab"
                                aria-selected="false"
                                onClick={() => setMode('preview')}
                                disabled={disabled}
                            >
                                {t.preview}
                            </button>
                        )}
                    </div>
                ) : null}

                <a
                    className="md-editor-guide"
                    href="https://www.markdownguide.org/basic-syntax/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t.markdownGuide}
                </a>
            </div>

            {mode === 'write' ? (
                <>
                    <div className="md-editor-toolbar" role="toolbar" aria-label="Markdown formatting">
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => insertAtCursor(el, '# '))} disabled={disabled} title={t.heading}>
                            H
                        </button>
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => wrapSelection(el, '**'))} disabled={disabled} title={t.bold}>
                            <strong>B</strong>
                        </button>
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => wrapSelection(el, '*'))} disabled={disabled} title={t.italic}>
                            <em>I</em>
                        </button>
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => wrapSelection(el, '`'))} disabled={disabled} title={t.inlineCode}>
                            <span className="md-editor-mono">&lt;/&gt;</span>
                        </button>
                        <span className="md-editor-sep" />
                        <button
                            type="button"
                            className="md-editor-btn"
                            onClick={() =>
                                applyOp((el) => {
                                    const { next, cursorStart, cursorEnd } = insertAtCursor(el, '[text](https://)');
                                    // highlight url
                                    return { next, cursorStart: cursorStart - 8, cursorEnd: cursorEnd - 1 };
                                })
                            }
                            disabled={disabled}
                            title={t.insertLink}
                        >
                            🔗
                        </button>
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => insertAtCursor(el, '\n- '))} disabled={disabled} title={t.bulletList}>
                            •
                        </button>
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => insertAtCursor(el, '\n1. '))} disabled={disabled} title={t.numberedList}>
                            1.
                        </button>
                        <button
                            type="button"
                            className="md-editor-btn"
                            onClick={() =>
                                applyOp((el) =>
                                    insertAtCursor(
                                        el,
                                        '\n| Column | Column |\n|---|---|\n| Value | Value |\n',
                                    ),
                                )
                            }
                            disabled={disabled}
                            title={t.table}
                        >
                            ▦
                        </button>
                        <button type="button" className="md-editor-btn" onClick={() => applyOp((el) => insertAtCursor(el, '@'))} disabled={disabled} title={t.mention}>
                            @
                        </button>

                        <span className="md-editor-spacer" />

                        {uploadImage ? (
                            <button type="button" className="md-editor-btn" onClick={pickImage} disabled={disabled || uploading} title={t.insertImage}>
                                {uploading ? t.uploading : '🖼️'}
                            </button>
                        ) : null}

                        <button type="button" className="md-editor-btn" onClick={onUndo} disabled={disabled} title={t.undo}>
                            ↶
                        </button>
                        <button type="button" className="md-editor-btn" onClick={onRedo} disabled={disabled} title={t.redo}>
                            ↷
                        </button>

                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                            className="md-editor-file-input"
                            aria-label={t.insertImage}
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                // reset input so same file can be picked again
                                e.currentTarget.value = '';
                                void onFilePicked(file);
                            }}
                        />
                    </div>

                    <textarea
                        ref={textareaRef}
                        id={id}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={textareaClassName || 'md-editor-textarea'}
                        disabled={disabled}
                    />

                    {uploadError ? <div className="md-editor-error">{uploadError}</div> : null}
                </>
            ) : (
                <div className={previewClassName || 'md-editor-preview'} role="tabpanel">
                    {value.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
                    ) : (
                        <p className="muted">{t.previewEmpty}</p>
                    )}
                </div>
            )}
        </div>
    );
}
