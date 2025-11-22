import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Upload, Image as ImageIcon, Trash2, Copy, Check } from 'lucide-react'

export function MediaPage() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  
  const { data: media, isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: async () => (await api.get('/media')).data.data,
  })
  
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      setUploading(false)
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/media/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media'] }),
  })
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    setUploading(true)
    for (const file of Array.from(files)) {
      await uploadMutation.mutateAsync(file)
    }
  }
  
  const copyUrl = (url: string, id: number) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage your images and files</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Upload className="w-5 h-5" />
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700">Uploading files...</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : media?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No media files yet</p>
            <p className="text-sm mt-2">Click Upload Files to get started</p>
          </div>
        ) : (
          media?.map((item: any) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(item.url, item.id)}
                    className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => confirm('Delete?') && deleteMutation.mutate(item.id)}
                    className="p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{item.filename}</p>
                <p className="text-xs text-gray-400">{(item.size / 1024).toFixed(1)}KB</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
