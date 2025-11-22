import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react'

export function CategoriesPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '📁' })
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  })
  
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setFormData({ name: '', slug: '', description: '', icon: '📁' })
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setEditingId(null)
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage article categories</p>
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'New'} Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="px-4 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Icon (emoji)"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
      
      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center">Loading...</td></tr>
            ) : categories?.map((cat: any) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-gray-600">{cat.slug}</td>
                <td className="px-6 py-4 text-gray-600">{cat.article_count || 0}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingId(cat.id)
                        setFormData({ name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon })
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirm('Delete?') && deleteMutation.mutate(cat.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
