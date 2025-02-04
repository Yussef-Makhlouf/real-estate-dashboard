"use client"

import type * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabComponentProps {
  arabicContent: React.ReactNode
  englishContent: React.ReactNode
}

export function TabComponent({ arabicContent, englishContent }: TabComponentProps) {
  return (
    <Tabs defaultValue="arabic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="arabic">المحتوى العربي</TabsTrigger>
        <TabsTrigger value="english">English Content</TabsTrigger>
      </TabsList>
      <TabsContent value="arabic">{arabicContent}</TabsContent>
      <TabsContent value="english">{englishContent}</TabsContent>
    </Tabs>
  )
}

