import { CartProvider } from './context/CartContext';
import CatalogPage from './pages/CatalogPage';

function App() {
  return (
    <CartProvider>
      <CatalogPage />
    </CartProvider>
  );
}

export default App;
