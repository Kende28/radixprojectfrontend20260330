import { Theme, Card } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  nev: string;
  ar: number;
  raktari_darabszam: number;
  szin: string;
  ertekeles: number;
  kiadas_eve: number;
  publikalt: boolean;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:3000/termekek");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <>
      <Theme>
        {products.map((product) => (
          <Card key={product.id}>
            <h2>{product.nev}</h2>
          </Card>
        ))}
      </Theme>
    </>
  );
}

export default App;
