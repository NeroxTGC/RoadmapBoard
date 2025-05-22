import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Eye, Edit2 } from 'lucide-react';

export const MarkdownEditor = ({ 
  value, 
  onChange, 
  placeholder = "Write your content here...",
  minHeight = "300px",
  maxHeight = "600px"
}) => {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="relative rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`p-1.5 rounded-md transition-colors flex items-center gap-2 ${
              !isPreview 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`p-1.5 rounded-md transition-colors flex items-center gap-2 ${
              isPreview 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
            title="Preview"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">Preview</span>
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div 
        className="relative"
        style={{ 
          minHeight,
          maxHeight
        }}
      >
        {!isPreview ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none resize-none font-mono text-sm leading-relaxed"
            style={{ 
              minHeight: '100%',
              maxHeight: '100%',
              height: minHeight
            }}
          />
        ) : (
          <div className="p-4 overflow-auto prose dark:prose-invert max-w-none h-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              className="text-gray-900 dark:text-white"
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-1 mb-4" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-1 mb-4" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-900 dark:text-white" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline ? (
                    <code className="bg-gray-100 dark:bg-gray-700 rounded px-1 py-0.5 text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-100 dark:bg-gray-700 rounded p-3 text-sm font-mono overflow-x-auto mb-4" {...props} />
                  ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-gray-200 dark:border-gray-600 pl-4 italic mb-4" {...props} />
                ),
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => (
                  <th className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-left text-sm font-medium text-gray-900 dark:text-white" {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300" {...props} />
                ),
              }}
            >
              {value || '*No content yet*'}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Markdown Hint */}
      {!isPreview && (
        <div className="absolute bottom-0 right-0 p-2 text-xs text-gray-500 dark:text-gray-400">
          Supports Markdown
        </div>
      )}
    </div>
  );
}; 