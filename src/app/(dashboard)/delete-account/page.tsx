'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

export default function DeleteAccountPage() {
  const { data: session } = useSession()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/users/delete-account', { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Account deleted successfully' })
        window.location.href = '/'
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' })
      }
    } catch {
      toast({ title: 'Error deleting account', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-red-800 bg-red-900/20 p-6">
        <h1 className="mb-4 text-2xl font-bold text-white">Delete Account</h1>
        <p className="mb-4 text-gray-300">
          This action is irreversible. All your data, including saved filters, preferences, 
          and account information will be permanently deleted.
        </p>
        <p className="mb-6 text-sm text-gray-400">
          Account: <strong className="text-white">{session?.user?.email || 'Unknown'}</strong>
        </p>

        {!confirming ? (
          <Button variant="destructive" onClick={() => setConfirming(true)}>
            I want to delete my account
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="font-semibold text-red-400">Are you absolutely sure?</p>
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleDelete}>
                Yes, delete permanently
              </Button>
              <Button variant="outline" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
