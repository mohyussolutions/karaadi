"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import ChatInbox from "@/app/(storeFront)/components/chats/chat/ChatInbox"

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  const chatId = searchParams.get("chatId")
  const sellerId = searchParams.get("sellerId")
  const itemId = searchParams.get("itemId")
  const itemModel = searchParams.get("itemModel")

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/messages")
    }
  }, [loading, user, router])

  return (
    <div className="h-screen flex flex-col pt-12">
      <div className="flex-1 overflow-hidden p-0 sm:p-4 lg:p-6">
        <ChatInbox
          initialChatId={chatId ? Number(chatId) : undefined}
          sellerId={sellerId || undefined}
          itemId={itemId || undefined}
          itemModel={itemModel || undefined}
        />
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  )
}
