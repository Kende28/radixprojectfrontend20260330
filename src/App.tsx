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
  const [newProduct, setNewProduct] = useState({
    nev: "",
    ar: 0,
    raktari_darabszam: 0,
    szin: "piros",
    ertekeles: 0,
    kiadas_eve: 0,
    publikalt: true,
  });

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

  const setRating = async (id: number, e: any) => {
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
      fetchProducts();
    } catch (error) {
      throw new Error("Szerver hiba történt: " + error);
    }
  };

  const setColour = async (id: number, colour: string) => {
    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          szin: colour,
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

  const deleteProduct = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/termekek/${id}`, {
        method: "DELETE",
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

  const createNewProduct = async () => {
    let ok = true;
    if (!newProduct.nev || newProduct.nev == "") {
      alert("Név nem lehet üres!");
      ok = false;
    }
    if (!newProduct.ar || newProduct.ar == 0) {
      alert("Ár nem lehet nulla vagy üres!");
      ok = false;
    }
    if (newProduct.raktari_darabszam < 0) {
      alert("Raktári darabszám nem lehet negatív!");
      ok = false;
    }

    if (ok) {
      try {
        const res = await fetch("http://localhost:3000/termekek", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nev: newProduct.nev,
            ar: newProduct.ar,
            raktari_darabszam: newProduct.raktari_darabszam,
            szin: newProduct.szin,
            ertekeles: newProduct.ertekeles,
            kiadas_eve: newProduct.kiadas_eve,
            publikalt: newProduct.publikalt,
          })
        });
        if (!res.ok) {
          alert("Hibás adatok")
          throw new Error("Hibás adatok")
        }
      } catch (error) {
        throw new Error("Szerver hiba történt: " + error);
      }
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
                onValueChange={(e) => setColour(product.id, e.toString())}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r1">Piros: </label>
                  <RadioGroup.Item value="piros" id="r1" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r2">Zöld: </label>
                  <RadioGroup.Item value="zöld" id="r2" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r3">Kék: </label>
                  <RadioGroup.Item value="kék" id="r3" />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label htmlFor="r4">Sárga: </label>
                  <RadioGroup.Item value="sárga" id="r4" />
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
                  onValueChange={(e) => setRating(product.id, e)}
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
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => deleteProduct(product.id)}
                >
                  🗑️
                </p>
              </Text>
            </Card>
          ))}
        </Flex>

        <Flex>
          <form onSubmit={() => createNewProduct()}>
            <label htmlFor="nev">Név: </label>
            <input
              type="text"
              id="nev"
              value={newProduct.nev}
              onChange={(e) =>
                setNewProduct({ ...newProduct, nev: e.target.value.toString() })
              }
            />{" "}
            <br />
            <label htmlFor="ar">Ár: </label>
            <input
              type="number"
              id="ar"
              value={newProduct.ar}
              onChange={(e) =>
                setNewProduct({ ...newProduct, ar: parseInt(e.target.value) })
              }
            />{" "}
            <br />
            <label htmlFor="raktaron">Raktáron: </label>
            <input
              type="number"
              id="raktaron"
              value={newProduct.raktari_darabszam}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  raktari_darabszam: parseInt(e.target.value),
                })
              }
            />{" "}
            <br />
            <label htmlFor="szin">Szín: </label>
            <RadioGroup.Root
              id="szin"
              aria-label="View density"
              defaultValue={newProduct.szin}
              onValueChange={(e) =>
                setNewProduct({ ...newProduct, szin: e.toString() })
              }
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="r1">Piros: </label>
                <RadioGroup.Item value="piros" id="r1" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="r2">Zöld: </label>
                <RadioGroup.Item value="zöld" id="r2" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="r3">Kék: </label>
                <RadioGroup.Item value="kék" id="r3" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="r4">Sárga: </label>
                <RadioGroup.Item value="sárga" id="r4" />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="r5">Magenta: </label>
                <RadioGroup.Item value="magenta" id="r5" />
              </div>
            </RadioGroup.Root>
            <label htmlFor="kiadva">Kiadás éve: </label>
            <input
              type="number"
              id="kiadva"
              value={newProduct.kiadas_eve}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  kiadas_eve: parseInt(e.target.value),
                })
              }
            />{" "}
            <br />
            <button type="submit">Új termék felvétele</button>
          </form>
        </Flex>
      </Theme>
    </>
  );
}

export default App;
