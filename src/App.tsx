import { Outlet } from 'react-router';
import { Header } from './components/header/Header';
import { Footer } from './components/footer/Footer';
import { Main } from './components/main/Main';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      <Header />
      <Main className="container mx-auto py-6">
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}
