import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { toast } from 'react-toastify'
import { backendUrl, currency } from '../config'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
)

const formatCurrency = (value) => `${currency}${Number(value || 0).toLocaleString()}`

const Chart = ({ token }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState('')
  const [notesLoading, setNotesLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 640)
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return

      try {
        const response = await axios.post(`${backendUrl}/api/order/analytics`, {}, { headers: { token } })
        if (response.data.success) {
          setAnalytics(response.data.analytics)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [token])

  const revenueChartData = useMemo(() => ({
    labels: analytics?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: analytics?.monthlyRevenue || [],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        tension: 0.35,
        fill: true,
        pointRadius: isMobile ? 2.5 : 3.5,
        pointHoverRadius: isMobile ? 3.5 : 5,
        borderWidth: isMobile ? 2 : 3,
      },
    ],
  }), [analytics, isMobile])

  const itemsChartData = useMemo(() => ({
    labels: analytics?.labels || [],
    datasets: [
      {
        label: 'Items sold',
        data: analytics?.monthlyItems || [],
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderRadius: 6,
      },
    ],
  }), [analytics])

  const orderStatusChartData = useMemo(() => ({
    labels: ['Delivered', 'In progress'],
    datasets: [
      {
        data: [analytics?.deliveredOrders || 0, analytics?.pendingOrders || 0],
        backgroundColor: ['#10b981', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  }), [analytics])

  const refreshAnalytics = async () => {
    if (!token) return

    try {
      const response = await axios.post(`${backendUrl}/api/order/analytics`, {}, { headers: { token } })
      if (response.data.success) {
        setAnalytics(response.data.analytics)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshAnalytics()
  }, [token])

  const handleAddNote = async (event) => {
    event.preventDefault()
    if (!noteText.trim()) return

    try {
      setNotesLoading(true)
      const response = await axios.post(`${backendUrl}/api/note/add`, { text: noteText.trim() }, { headers: { token } })
      if (response.data.success) {
        setNoteText('')
        await refreshAnalytics()
        toast.success('Note added')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setNotesLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/note/delete`, { noteId }, { headers: { token } })
      if (response.data.success) {
        await refreshAnalytics()
        toast.success('Note deleted')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const stats = [
    { title: 'Total Sales ( not revenue )', value: analytics ? formatCurrency(analytics.totalRevenue) : '—' },
    { title: 'Orders', value: analytics ? analytics.totalOrders : '—' },
    { title: 'Total Item', value: analytics ? analytics.totalItems : '—' },
    { title: 'Registered Customers', value: analytics ? analytics.totalCustomers : '—' },
  ]

  if (loading) {
    return <div className='rounded border border-slate-200 bg-white p-6 text-sm text-slate-500'>Loading analytics...</div>
  }

  return (
    <div className='w-full max-w-full space-y-4 sm:space-y-6'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-semibold text-slate-800 sm:text-xl'>Sales Overview</h3>
        <p className='text-sm text-slate-500'>Track sales, order flow, product sales, and customer growth from one dashboard.</p>
      </div>

      <div className='grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((item) => (
          <div key={item.title} className='animate-[fadeIn_0.4s_ease-out] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
            <p className='text-sm text-slate-500'>{item.title}</p>
            <p className='mt-2 text-xl font-semibold text-slate-800 sm:text-2xl'>{item.value}</p>
          </div>
        ))}
      </div>

      <div className='grid gap-4 xl:grid-cols-[2fr_1fr]'>
        <div className='rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
          <div className='mb-3 flex items-center justify-between'>
            <div>
              <h4 className='font-semibold text-slate-800'>Sales per month</h4>
              <p className='text-sm text-slate-500'>Monthly sales performance</p>
            </div>
          </div>
          <div className='h-64 w-full sm:h-72'>
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    left: isMobile ? 2 : 6,
                    right: isMobile ? 12 : 8,
                    top: 8,
                    bottom: isMobile ? 2 : 4,
                  },
                },
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    offset: false,
                    ticks: {
                      maxRotation: 0,
                      minRotation: 0,
                      autoSkip: true,
                      maxTicksLimit: isMobile ? 4 : 6,
                      font: { size: isMobile ? 9 : 12 },
                    },
                    grid: { display: false },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${currency}${value}`,
                      font: { size: isMobile ? 9 : 12 },
                    },
                    grid: { color: 'rgba(148, 163, 184, 0.16)' },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
          <h4 className='font-semibold text-slate-800'>Order status</h4>
          <p className='mb-3 text-sm text-slate-500'>Delivered vs. pending orders</p>
          <div className='mx-auto h-56 max-w-xs sm:h-60'>
            <Doughnut data={orderStatusChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
      </div>

      <div className='animate-[fadeIn_0.6s_ease-out] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
        <div className='mb-3'>
          <h4 className='font-semibold text-slate-800'>Items sold per month</h4>
          <p className='text-sm text-slate-500'>Track how many units were sold over the last year</p>
        </div>
        <div className='h-64 w-full sm:h-72'>
          <Bar
            data={itemsChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className='animate-[fadeIn_0.7s_ease-out] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4'>
        <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h4 className='font-semibold text-slate-800'>Admin notes</h4>
            <p className='text-sm text-slate-500'>Add short reminders about pricing or business notes.</p>
          </div>
        </div>

        <form onSubmit={handleAddNote} className='mb-4 flex flex-col gap-2'>
          <textarea
            value={noteText}
            onChange={(event) => setNoteText(event.target.value)}
            rows='3'
            placeholder='For saying something important...'
            className='w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500'
          />
          <button
            type='submit'
            disabled={notesLoading}
            className='w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-indigo-400 sm:w-auto'
          >
            {notesLoading ? 'Adding...' : 'Add note'}
          </button>
        </form>

        <div className='space-y-3'>
          {analytics?.notes?.length ? analytics.notes.map((note) => (
            <div key={note._id} className='flex flex-col gap-2 rounded border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <p className='text-sm text-slate-700'>{note.text}</p>
                <p className='mt-1 text-xs text-slate-500'>By {note.adminName || 'Admin'}</p>
              </div>
              <button
                type='button'
                onClick={() => handleDeleteNote(note._id)}
                className='text-sm font-medium text-red-600 hover:text-red-700'
              >
                Delete
              </button>
            </div>
          )) : (
            <div className='rounded border border-dashed border-slate-300 p-4 text-sm text-slate-500'>No notes yet. Add your first admin note above.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Chart