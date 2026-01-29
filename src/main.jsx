import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ItemProvider } from './provider/ItemProvider.jsx'
import { SummaryProvider } from './provider/SummaryProvider.jsx'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './provider/AuthProvider.jsx'
import AppLayout from './layout/AppLayout.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ItemProvider>
          <SummaryProvider>
            <AppLayout>
              <Toaster position="top-center" reverseOrder={false} />
              <RouterProvider router={router}></RouterProvider>
            </AppLayout>
          </SummaryProvider>
        </ItemProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)