import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, MoreVertical,
  CheckSquare, Square, ChevronDown
} from 'lucide-react'

export function ArticlesPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  
  // 获取文章列表
  const { data, isLoading } = useQuery({
    queryKey: ['articles', page, search, category, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(category && { category }),
        ...(status && { status }),
      })
      const response = await api.get(`/articles?${params}`)
      return response.data
    },
  })
  
  // 获取分类列表
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories')
      return response.data.data
    },
  })
  
  // 删除文章
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/articles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
    },
  })
  
  // 批量操作
  const batchMutation = useMutation({
    mutationFn: (data: { action: string; ids: number[] }) => 
      api.post('/articles/batch', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      setSelectedIds([])
    },
  })
  
  const handleSelectAll = () => {
    if (selectedIds.length === data?.data.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(data?.data.map((a: any) => a.id) || [])
    }
  }
  
  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }
  
  const handleBatchAction = (action: string) => {
    if (selectedIds.length === 0) return
    if (confirm(`确定要${action === 'delete' ? '删除' : action === 'publish' ? '发布' : '归档'}选中的 ${selectedIds.length} 篇文章吗？`)) {
      batchMutation.mutate({ action, ids: selectedIds })
    }
  }
  
  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || colors.draft
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">Manage your articles and content</p>
        </div>
        <Link
          to="/articles/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Article
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          
          {/* Batch Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{selectedIds.length} selected</span>
              <button
                onClick={() => handleBatchAction('publish')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                Publish
              </button>
              <button
                onClick={() => handleBatchAction('archive')}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Archive
              </button>
              <button
                onClick={() => handleBatchAction('delete')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <button onClick={handleSelectAll} className="hover:bg-gray-100 rounded p-1">
                  {selectedIds.length === data?.data.length && data?.data.length > 0 ? (
                    <CheckSquare className="w-5 h-5 text-primary-600" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No articles found
                </td>
              </tr>
            ) : (
              data?.data.map((article: any) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelect(article.id)}
                      className="hover:bg-gray-100 rounded p-1"
                    >
                      {selectedIds.includes(article.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {article.featured && (
                        <span className="text-yellow-500">★</span>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{article.title}</div>
                        <div className="text-sm text-gray-500">{article.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{article.category_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(article.status)}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-4 h-4" />
                      {article.view_count || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/articles/${article.id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这篇文章吗？')) {
                            deleteMutation.mutate(article.id)
                          }
                        }}
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
      
      {/* Pagination */}
      {data?.pagination && (
        <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.pagination.total)} of {data.pagination.total} articles
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {page} of {data.pagination.pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
              disabled={page === data.pagination.pages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
