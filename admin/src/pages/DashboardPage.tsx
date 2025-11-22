import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { FileText, Calculator, Eye, TrendingUp } from 'lucide-react'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await api.get('/analytics/stats')
      return response.data
    },
  })

  const cards = [
    {
      name: 'Total Articles',
      value: stats?.articles || 48,
      icon: FileText,
      change: '+12%',
      color: 'bg-blue-500',
    },
    {
      name: 'Calculators',
      value: stats?.calculators || 15,
      icon: Calculator,
      change: '+3',
      color: 'bg-green-500',
    },
    {
      name: 'Page Views',
      value: stats?.views || '12.5k',
      icon: Eye,
      change: '+18%',
      color: 'bg-purple-500',
    },
    {
      name: 'Engagement',
      value: stats?.engagement || '85%',
      icon: TrendingUp,
      change: '+5%',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className="text-sm text-green-600 mt-2">{card.change}</p>
              </div>
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/articles/new')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">New Article</p>
          </button>
          <button 
            onClick={() => navigate('/calculators')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Manage Calculators</p>
          </button>
          <button 
            onClick={() => navigate('/articles')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">View All Articles</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Welcome to your new CMS!</p>
                  <p className="text-xs text-gray-500">System initialized</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{stats?.articles || 48} articles ready</p>
                  <p className="text-xs text-gray-500">Start managing your content</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">All systems operational</p>
                  <p className="text-xs text-gray-500">Ready for action</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
