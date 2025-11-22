import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { Save, Globe, Mail, Shield } from 'lucide-react'

export function SettingsPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<any>({})
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/settings')
      const data = response.data.data || []
      const obj: any = {}
      data.forEach((s: any) => { obj[s.key] = s.value })
      setFormData(obj)
      return obj
    },
  })
  
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const updates = Object.entries(data).map(([key, value]) => ({ key, value }))
      return api.post('/settings/batch', { settings: updates })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      alert('Settings saved!')
    },
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate(formData)
  }
  
  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your site settings</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Title
              </label>
              <input
                type="text"
                value={formData.site_title || ''}
                onChange={(e) => handleChange('site_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Smart Lock Hub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                value={formData.site_description || ''}
                onChange={(e) => handleChange('site_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Your complete guide to smart locks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={formData.site_url || ''}
                onChange={(e) => handleChange('site_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="https://smartlock.com"
              />
            </div>
          </div>
        </div>
        
        {/* Contact Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="contact@smartlock.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support Email
              </label>
              <input
                type="email"
                value={formData.support_email || ''}
                onChange={(e) => handleChange('support_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="support@smartlock.com"
              />
            </div>
          </div>
        </div>
        
        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">SEO & Analytics</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={formData.ga_id || ''}
                onChange={(e) => handleChange('ga_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
