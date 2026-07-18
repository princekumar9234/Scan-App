import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function Barcode() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
      },
      false
    );

    const success = async (decodedText) => {
      scanner.clear();

      try {
        const res = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${decodedText}`
        );

        const data = await res.json();

        if (data.status === 1) {
          setProduct(data.product);
        } else {
          alert("Product Not Found");
        }
      } catch (err) {
        console.log(err);
      }
    };

    scanner.render(success);

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div>
      <h1>Barcode Scanner</h1>

      <div id="reader"></div>

      {product && (
        <div>

          <img
            src={product.image_front_url}
            width={200}
            alt=""
          />

          <h2>{product.product_name}</h2>

          <h3>{product.brands}</h3>

          <p>
            <b>Nutri Score :</b> {product.nutriscore_grade?.toUpperCase()}
          </p>

          <p>
            <b>Calories :</b>{" "}
            {product.nutriments["energy-kcal_100g"]} kcal
          </p>

          <p>
            <b>Fat :</b> {product.nutriments.fat_100g} g
          </p>

          <p>
            <b>Sugar :</b> {product.nutriments.sugars_100g} g
          </p>

          <p>
            <b>Protein :</b> {product.nutriments.proteins_100g} g
          </p>

          <p>
            <b>Salt :</b> {product.nutriments.salt_100g} g
          </p>

          <p>
            <b>Fiber :</b> {product.nutriments.fiber_100g} g
          </p>

          <p>
            <b>Ingredients :</b>
            {product.ingredients_text}
          </p>
        </div>
      )}
    </div>
  );
}

export default Barcode;