import React, { useRef, useEffect, useState } from 'react';
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
  AlignJustify,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  RemoveFormatting,
  Maximize2,
  Minimize2,
  FileDown,
  Search,
  Undo2,
  Redo2,
  Minus,
  Sparkles,
} from 'lucide-react';
import { cleanWordHtml, parseWordDocument } from '../../services/importService';
import { sanitizeHtml } from '../../services/sanitizerService';
import { EDUCATION_BLOCKS } from './EducationBlocks';
import { MediaSelectorModal } from './MediaSelectorModal';
import type { MediaItem } from '../../types/media';
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

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [replaceText, setReplaceText] = useState('');

  // Sync value from props to contenteditable div when prop changes externally
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCmd = (command: string, val: string = '') => {
    document.execCommand(command, false, val);
    triggerChange();
  };

  const triggerChange = () => {
    if (contentRef.current) {
      const sanitized = sanitizeHtml(contentRef.current.innerHTML);
      onChange(sanitized);
    }
  };

  const handleInput = () => {
    triggerChange();
  };

  // Clean MS Word Paste listener (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const htmlData = e.clipboardData.getData('text/html');
    if (htmlData && htmlData.includes('mso-')) {
      e.preventDefault();
      const cleaned = cleanWordHtml(htmlData);
      document.execCommand('insertHTML', false, cleaned);
      triggerChange();
    }
  };

  // Insert Custom Educational Block
  const insertEducationBlock = (blockHtml: string) => {
    execCmd('insertHTML', blockHtml);
  };

  // Find and Replace Inside Article
  const handleFindAndReplace = () => {
    if (!searchText || !contentRef.current) return;
    const currentContent = contentRef.current.innerHTML;
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const replaced = currentContent.replace(regex, replaceText);
    contentRef.current.innerHTML = replaced;
    triggerChange();
  };

  const insertLink = () => {
    const url = prompt('Nhập địa chỉ đính kèm (URL):', 'https://');
    if (url) {
      execCmd('createLink', url);
    }
  };

  const [mediaFilterType, setMediaFilterType] = useState<'image' | 'video' | 'doc'>('image');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const insertImage = () => {
    setMediaFilterType('image');
    setIsMediaModalOpen(true);
  };

  const insertVideo = () => {
    setMediaFilterType('video');
    setIsMediaModalOpen(true);
  };

  const handleImportWord = () => {
    setMediaFilterType('doc');
    setIsMediaModalOpen(true);
  };

  const handleSelectMediaAsset = async (assets: MediaItem[]) => {
    if (assets.length === 0) return;
    const asset = assets[0];

    if (mediaFilterType === 'image') {
      const altText = asset.default_alt_vi || asset.default_alt_en || asset.original_filename;
      const imgHtml = `<img src="${asset.public_url}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 14px; margin: 1rem 0; display: block;" />`;
      execCmd('insertHTML', imgHtml);
    } else if (mediaFilterType === 'video') {
      const videoHtml = `<video controls style="max-width:100%; border-radius:12px; margin: 1rem 0;" src="${asset.public_url}"></video>`;
      execCmd('insertHTML', videoHtml);
    } else if (mediaFilterType === 'doc') {
      try {
        const response = await fetch(asset.public_url);
        const blob = await response.blob();
        const file = new File([blob], asset.original_filename, { type: asset.mime_type });
        const parsedHtml = await parseWordDocument(file);
        if (contentRef.current) {
          contentRef.current.innerHTML += parsedHtml;
          triggerChange();
        }
      } catch (err) {
        console.error('Error parsing Word document from system library:', err);
      }
    }
  };

  return (
    <div className={`${styles.editorContainer} ${isFullscreen ? styles.fullscreenEditor : ''}`}>
      {/* Word-like Formatting Toolbar */}
      <div className={styles.toolbar}>
        {/* Undo / Redo */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => execCmd('undo')}
            className={styles.toolBtn}
            title="Hoàn tác (Undo - Ctrl+Z)"
          >
            <Undo2 size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('redo')}
            className={styles.toolBtn}
            title="Làm lại (Redo - Ctrl+Shift+Z)"
          >
            <Redo2 size={15} />
          </button>
        </div>

        <div className={styles.divider} />

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
            <Bold size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('italic')}
            className={styles.toolBtn}
            title="In nghiêng (Italic - Ctrl+I)"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('underline')}
            className={styles.toolBtn}
            title="Gạch chân (Underline - Ctrl+U)"
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('strikeThrough')}
            className={styles.toolBtn}
            title="Gạch ngang (Strikethrough)"
          >
            <Strikethrough size={15} />
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
            <List size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className={styles.toolBtn}
            title="Danh sách đánh số (Numbered List)"
          >
            <ListOrdered size={15} />
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
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyCenter')}
            className={styles.toolBtn}
            title="Căn giữa"
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyRight')}
            className={styles.toolBtn}
            title="Căn phải"
          >
            <AlignRight size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('justifyFull')}
            className={styles.toolBtn}
            title="Căn đều hai bên (Justify)"
          >
            <AlignJustify size={15} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Custom Education Blocks Dropdown */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              insertEducationBlock(e.target.value);
              e.target.value = '';
            }
          }}
          className={styles.selectHeader}
          defaultValue=""
        >
          <option value="" disabled>
            ✨ Chèn Khung Giáo Dục iCANCAM...
          </option>
          {EDUCATION_BLOCKS.map((block) => (
            <option key={block.id} value={block.html}>
              {block.name}
            </option>
          ))}
        </select>

        <div className={styles.divider} />

        {/* Insertions */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<blockquote>')}
            className={styles.toolBtn}
            title="Trích dẫn (Blockquote)"
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            onClick={() => execCmd('insertHorizontalRule')}
            className={styles.toolBtn}
            title="Đường phân cách (Divider)"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            onClick={insertLink}
            className={styles.toolBtn}
            title="Chèn đường dẫn (Link)"
          >
            <LinkIcon size={15} />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className={styles.toolBtn}
            title="Chèn hình ảnh vào bài viết"
          >
            <ImageIcon size={15} />
          </button>
          <button
            type="button"
            onClick={insertVideo}
            className={styles.toolBtn}
            title="Chèn video clip ngắn / YouTube vào bài viết"
          >
            <Video size={15} />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Import & Search & Fullscreen */}
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={handleImportWord}
            className={styles.toolBtn}
            title="Nhập tài liệu MS Word từ Thư viện hệ thống"
          >
            <FileDown size={15} />
          </button>
          <button
            type="button"
            onClick={() => setShowSearch(!showSearch)}
            className={styles.toolBtn}
            title="Tìm kiếm & Thay thế"
          >
            <Search size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={styles.toolBtn}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Chế độ Tập Trung Soạn Thảo (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
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
          <RemoveFormatting size={15} />
        </button>
      </div>

      {/* Find and Replace Bar */}
      {showSearch && (
        <div className={styles.findReplaceBar}>
          <input
            type="text"
            placeholder="Từ cần tìm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />
          <input
            type="text"
            placeholder="Thay thế bằng..."
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className={styles.searchInput}
          />
          <button type="button" onClick={handleFindAndReplace} className={styles.replaceBtn}>
            <Sparkles size={14} /> Thay Thế All
          </button>
        </div>
      )}

      {/* Editable Visual Area */}
      <div
        ref={contentRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className={styles.editableContent}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <MediaSelectorModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        filterType={mediaFilterType === 'doc' ? 'pdf' : (mediaFilterType === 'video' ? 'all' : 'image')}
        title={
          mediaFilterType === 'doc'
            ? 'Chọn Tài Liệu Word từ Thư Viện Hệ Thống'
            : mediaFilterType === 'video'
            ? 'Chọn Video Clip từ Thư Viện Hệ Thống'
            : 'Chọn Hình Ảnh từ Thư Viện Hệ Thống'
        }
        onSelect={handleSelectMediaAsset}
      />
    </div>
  );
};
