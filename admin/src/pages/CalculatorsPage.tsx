import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { Plus, Edit, Trash2, Calculator, ExternalLink } from 'lucide-react'

export function CalculatorsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    calculator_type: 'battery-life',
    is_active: true,
  })
  
  const { data: calculators, isLoading } = useQuery({
    queryKey: ['calculators'],
    queryFn: async () => (await api.get('/calculators')).data.data,
  })
  
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/calculators', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculators'] })
      resetForm()
    },
  })
  
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/calculators/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculators'] })
      resetForm()
    },
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/calculators/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calculators'] }),
  })
  
  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      calculator_type: 'battery-life',
      is_active: true,
    })
  }
  
  const handleEdit = (calc: any) => {
    setEditingId(calc.id)
    setFormData({
      name: calc.name,
      slug: calc.slug,
      description: calc.description,
      calculator_type: calc.calculator_type,
      is_active: calc.is_active === 1,
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
  
  const calculatorTypes = [
    { value: 'battery-life', label: 'Battery Life Calculator' },
    { value: 'cost-savings', label: 'Cost Savings Calculator' },
    { value: 'roi', label: 'ROI Calculator' },
    { value: 'energy', label: 'Energy Consumption' },
    { value: 'comparison', label: 'Product Comparison' },
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calculators</h1>
          <p className="text-gray-600 mt-1">Manage interactive calculators</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'New Calculator'}
        </button>
      </div>
      
      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit' : 'New'} Calculator
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                Calculator Type *
              </label>
              <select
                value={formData.calculator_type}
                onChange={(e) => setFormData({ ...formData, calculator_type: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {calculatorTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Active
              </label>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : calculators?.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No calculators yet</p>
            <p className="text-sm mt-2">Click New Calculator to get started</p>
          </div>
        ) : (
          calculators?.map((calc: any) => (
            <div key={calc.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{calc.name}</h3>
                    <p className="text-sm text-gray-500">{calc.calculator_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {calc.is_active ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {calc.description || 'No description'}
              </p>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(calc)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => window.open(`/calculators/${calc.slug}`, '_blank')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => confirm('Delete?') && deleteMutation.mutate(calc.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
