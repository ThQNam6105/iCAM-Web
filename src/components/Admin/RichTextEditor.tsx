import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  RemoveFormatting
} from 'lucide-react';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Nhập nội dung bài viết...',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync value from props to contenteditable div when prop changes externally
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCmd = (command: string, val: string = '') => {
    document.execCommand(command, false, val);
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Nhập địa chỉ đính kèm (URL):', 'https://');
    if (url) {
      execCmd('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Nhập đường dẫn hình ảnh (URL):', 'https://');
    if (url) {
      execCmd('insertImage', url);
    }
  };

  return (
    <div className={styles.editorContainer}>
      {/* Word-like Formatting Toolbar */}
      <div className={styles.toolbar}>
        {/* Headings */}
        <select
          onChange={(e) => execCmd('formatBlock', e.target.value)}
          className={styles.selectHeader}
          defaultValue="<p>"
        >
          <option value="<p>">Đoạn văn (Normal)</option>
          <option value="<h2>">Tiêu đề lớn (Heading 2)</option>
          <option value="<h3>">Tiêu đề vừa (Heading 3)</option>
        </select>

        <div className={styles.divider} />

        {/* Text Formatting */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className={styles.toolBtn}
            title="In đậm (Bold - Ctrl+B)"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className={styles.toolBtn}
            title="In nghiêng (Italic - Ctrl+I)"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className={styles.toolBtn}
            title="Gạch chân (Underline - Ctrl+U)"
          >
            <Underline size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className={styles.toolBtn}
            title="Gạch ngang (Strikethrough)"
          >
            <Strikethrough size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Lists */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className={styles.toolBtn}
            title="Danh sách gạch đầu dòng (Bullet List)"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className={styles.toolBtn}
            title="Danh sách đánh số (Numbered List)"
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Alignment */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => execCmd('justifyLeft')}
            className={styles.toolBtn}
            title="Căn trái"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className={styles.toolBtn}
            title="Căn giữa"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className={styles.toolBtn}
            title="Căn phải"
          >
            <AlignRight size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Insertions */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<blockquote>')}
            className={styles.toolBtn}
            title="Trích dẫn (Blockquote)"
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            onClick={insertLink}
            className={styles.toolBtn}
            title="Chèn đường dẫn (Link)"
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className={styles.toolBtn}
            title="Chèn hình ảnh vào bài viết"
          >
            <ImageIcon size={16} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => execCmd('removeFormat')}
          className={styles.toolBtn}
          title="Xóa định dạng (Clear Formatting)"
        >
          <RemoveFormatting size={16} />
        </button>
      </div>

      {/* Editable Visual Area */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        className={styles.editableContent}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};
