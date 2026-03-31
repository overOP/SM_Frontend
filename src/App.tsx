import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExamProvider } from './context/ExamContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <AppRoutes />
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
