import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react'

export function PagesPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'published',
    show_in_nav: false,
  })
  
  const { data: pages, isLoading } = useQuery({
    queryKey: ['pages'],
    queryFn: async () => (await api.get('/pages')).data.data,
  })
  
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/pages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      resetForm()
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      resetForm()
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/pages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
  })
  
  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      title: '',
      slug: '',
      content: '',
      status: 'published',
      show_in_nav: false,
    })
  }
  
  const handleEdit = (page: any) => {
    setEditingId(page.id)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
      show_in_nav: page.show_in_nav === 1,
    })
    setShowForm(true)
  }
  
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
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600 mt-1">Manage static pages</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'New Page'}
        </button>
      </div>
      
      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit' : 'New'} Page
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                placeholder="Markdown content"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.show_in_nav}
                    onChange={(e) => setFormData({ ...formData, show_in_nav: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Show in Navigation
                  </span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">In Nav</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
            ) : pages?.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No pages yet</p>
                  <p className="text-sm mt-2">Click New Page to create one</p>
                </td>
              </tr>
            ) : (
              pages?.map((page: any) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 text-gray-600">/{page.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {page.show_in_nav ? (
                      <span className="text-green-600">✓</span>
                    ) : (
                      <span className="text-gray-400">−</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(page.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="View page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(page)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirm('Delete?') && deleteMutation.mutate(page.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
