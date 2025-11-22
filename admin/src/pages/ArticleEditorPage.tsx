import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Editor from '@monaco-editor/react'
import api from '../lib/api'
import { Save, X, Eye, ArrowLeft } from 'lucide-react'

const articleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  category_id: z.number(),
  status: z.enum(['draft', 'published', 'archived']),
  featured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof articleSchema>

export function ArticleEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isNew = !id || id === 'new'
  
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: { status: 'draft', featured: false, tags: [] },
  })
  
  const tags = watch('tags') || []
  
  const { data: article } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => (await api.get(`/articles/${id}`)).data,
    enabled: !isNew,
  })
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data.data,
  })
  
  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        slug: article.slug,
        description: article.description,
        content: article.content,
        category_id: article.category_id,
        featured: article.featured === 1,
        status: article.status,
        tags: article.tags?.map((t: any) => t.name) || [],
      })
      setContent(article.content || '')
    }
  }, [article, reset])
  
  const saveMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = { ...data, content }
      return isNew ? api.post('/articles', payload) : api.put(`/articles/${id}`, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      navigate('/articles')
    },
  })
  
  const onSubmit = (data: FormData) => saveMutation.mutate(data)
  
  const generateSlug = () => {
    const title = watch('title')
    if (title && isNew) {
      setValue('slug', title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'))
    }
  }
  
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()])
      setTagInput('')
    }
  }
  
  const removeTag = (tag: string) => setValue('tags', tags.filter(t => t !== tag))
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/articles')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">{isNew ? 'New Article' : 'Edit Article'}</h1>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input {...register('title')} onBlur={generateSlug} className="w-full px-4 py-2 border rounded-lg" />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input {...register('slug')} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-2 border rounded-lg" />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <label className="block text-sm font-medium mb-2">Content (Markdown) *</label>
            <div className="border rounded-lg overflow-hidden">
              <Editor
                height="600px"
                defaultLanguage="markdown"
                value={content}
                onChange={(v) => { setContent(v || ''); setValue('content', v || '') }}
                theme="vs-light"
                options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Publish</h3>
            <select {...register('status')} className="w-full px-4 py-2 border rounded-lg mb-4">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <label className="flex items-center gap-2">
              <input {...register('featured')} type="checkbox" className="rounded" />
              <span className="text-sm">Featured</span>
            </label>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Category *</h3>
            <select {...register('category_id', { valueAsNumber: true })} className="w-full px-4 py-2 border rounded-lg">
              <option value="">Select</option>
              {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold mb-4">Tags</h3>
            <div className="flex gap-2 mb-3">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:bg-primary-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
