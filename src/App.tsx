import { Theme, Card, Text, Flex, RadioGroup } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Slider } from "radix-ui";
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

  const addAmount = async (id: number, amount: number) => {
    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raktari_darabszam: amount + 1,
        }),
      });
      if (!res.ok) {
        alert("Hibás adatok");
        throw new Error("Hibás adatok");
      }
      fetchProducts();
    } catch (error) {
      throw new Error("Szerver hiba történt: " + error);
    }
  };

  const removeAmount = async (id: number, amount: number) => {
    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raktari_darabszam: amount - 1,
        }),
      });
      if (!res.ok) {
        alert("Hibás adatok");
        throw new Error("Hibás adatok");
      }
      fetchProducts();
    } catch (error) {
      throw new Error("Szerver hiba történt: " + error);
    }
  };

  const setAvailable = async (id: number, available: boolean) => {
    if (available) {
      alert("Termék már publikált");
      throw new Error("Termék már publikált");
    }

    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publikalt: true,
        }),
      });
      if (!res.ok) {
        alert("Hibás adatok");
        throw new Error("Hibás adatok");
      }
      fetchProducts();
    } catch (error) {
      throw new Error("Szerver hiba történt: " + error);
    }
  };

  const setUnavailable = async (id: number, available: boolean) => {
    if (!available) {
      alert("Termék még nem publikált");
      throw new Error("Termék még nem publikált");
    }

    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publikalt: false,
        }),
      });
      if (!res.ok) {
        alert("Hibás adatok");
        throw new Error("Hibás adatok");
      }
      fetchProducts();
    } catch (error) {
      throw new Error("Szerver hiba történt: " + error);
    }
  };

  const setRating = async (e) => {
    e.PreventDefault();
    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ertekeles: parseInt(e),
        }),
      });
      if (!res.ok) {
        alert("Hibás adatok");
        throw new Error("Hibás adatok");
      }
      fetchProducts()
    } catch (error) {
      throw new Error("Szerver hiba történt: " + error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Theme>
        <Flex gap="3" direction="row">
          {products.map((product) => (
            <Card key={product.id} size="1">
              <Text as="div">
                <h2>{product.nev}</h2>
              </Text>
              <Text as="div">
                <p>{product.ar}Ft</p>
                <p>
                  Raktáron: {product.raktari_darabszam}
                  <b
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() =>
                      addAmount(product.id, product.raktari_darabszam)
                    }
                  >
                    ➕
                  </b>
                  <b
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() =>
                      removeAmount(product.id, product.raktari_darabszam)
                    }
                  >
                    ➖
                  </b>
                </p>
                <p>Kiadva: {product.kiadas_eve}</p>
                <p>
                  {product.publikalt ? "Publikálva" : "Nincs publikálva"}
                  <b
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() => setAvailable(product.id, product.publikalt)}
                  >
                    ✅
                  </b>
                  <b
                    style={{ cursor: "pointer", userSelect: "none" }}
                    onClick={() =>
                      setUnavailable(product.id, product.publikalt)
                    }
                  >
                    ❌
                  </b>
                </p>
              </Text>
              <RadioGroup.Root
                aria-label="View density"
                defaultValue={product.szin}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r1">Piros: </label>
                  <RadioGroup.Item value="piros" id="r1" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r2">Zöld: </label>
                  <RadioGroup.Item value="zold" id="r2" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r3">Kék: </label>
                  <RadioGroup.Item value="kek" id="r3" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r4">Sárga: </label>
                  <RadioGroup.Item value="sarga" id="r4" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r5">Magenta: </label>
                  <RadioGroup.Item value="magenta" id="r5" />
                </div>
              </RadioGroup.Root>
              <Text>
                <label>{product.ertekeles}</label>
                <Slider.Root
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                  defaultValue={[product.ertekeles]}
                  max={10}
                  step={1}
                >
                  <Slider.Track
                    style={{
                      backgroundColor: "black",
                      position: "relative",
                      flexGrow: "1",
                      borderRadius: "9999px",
                      height: "3px",
                    }}
                  >
                    <Slider.Range
                      style={{
                        backgroundColor: "wheat",
                        position: "absolute",
                        borderRadius: "9999px",
                        height: "100%",
                      }}
                    />
                  </Slider.Track>
                  <Slider.Thumb
                    style={{
                      backgroundColor: "wheat",
                      display: "block",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  />
                </Slider.Root>
              </Text>
              <Text>
                <p style={{ cursor: "pointer" }} onClick={() => {}}>
                  🗑️
                </p>
              </Text>
            </Card>
          ))}
        </Flex>
      </Theme>
    </>
  );
}

export default App;
