import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <AnnouncementProvider>
            <AppRoutes />
          </AnnouncementProvider>
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
