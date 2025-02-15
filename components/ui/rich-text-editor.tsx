"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Button } from "./button"
import { useEffect, useState } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Image as ImageIcon, Link as LinkIcon,
  Heading1, Heading2, List, ListOrdered,
  Quote, Code, Palette
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  language: "ar" | "en"
}

export function RichTextEditor({
  content,
  onChange,
  language
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      Highlight,
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        dir: language === "ar" ? "rtl" : "ltr",
        lang: language,
      },
    },
    immediatelyRender:false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    setIsMounted(true)
    return () => editor?.destroy()
  }, [editor])

  if (!isMounted || !editor) return null

  const addImage = () => {
    const url = window.prompt('URL الصورة')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('URL الرابط')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-lg">
      <div className="bg-white border-b p-2 flex flex-wrap gap-2 sticky top-0 z-10">
        {/* History Controls */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Headings */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} data-active={editor.isActive('heading', { level: 1 })}>
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} data-active={editor.isActive('heading', { level: 2 })}>
            <Heading2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Text Formatting */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} data-active={editor.isActive('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} data-active={editor.isActive('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} data-active={editor.isActive('underline')}>
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} data-active={editor.isActive('strike')}>
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Lists */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} data-active={editor.isActive('bulletList')}>
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} data-active={editor.isActive('orderedList')}>
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Alignment */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('left').run()} data-active={editor.isActive({ textAlign: 'left' })}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('center').run()} data-active={editor.isActive({ textAlign: 'center' })}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().setTextAlign('right').run()} data-active={editor.isActive({ textAlign: 'right' })}>
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Special Formatting */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} data-active={editor.isActive('blockquote')}>
            <Quote className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleCode().run()} data-active={editor.isActive('code')}>
            <Code className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Media */}
        <div className="flex gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={addImage}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={addLink} data-active={editor.isActive('link')}>
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditorContent 
        editor={editor} 
        className="p-4 min-h-[200px] max-h-[800px] overflow-y-auto"
      />
    </div>
  )
}