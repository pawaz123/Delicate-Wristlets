import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../services/storage";
import { Product } from "../types";

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const allProducts = getProducts();
    const found = allProducts.find((p: Product) => p.id === id);

    if (found) {
      setProduct(found);

      if (Array.isArray(found.image)) {
        setSelectedImage(found.image[0]);
      } else if (typeof found.image === "string") {
        setSelectedImage(found.image);
      }
    }
  }, [id]);

  if (!product) {
    return <div className="pt-20 text-center text-gray-500">Product not found</div>;
  }

  const images: string[] = Array.isArray(product.image)
    ? product.image
    : [product.image];

  return (
    <div className="pt-24 px-6 md:px-20">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* IMAGE SECTION */}
        <div>
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full h-96 object-cover rounded-xl shadow-md"
          />

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                onClick={() => setSelectedImage(img)}
                className={`h-20 w-20 rounded-lg object-cover border cursor-pointer transition ${
                  selectedImage === img ? "border-black scale-105" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

          <p className="text-gray-600 mt-2 text-sm">Category: {product.category}</p>

          <p className="text-4xl font-semibold text-gold-600 mt-4">
            ₹ {product.price}
          </p>

          <p className="text-gray-700 mt-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4 mt-10">
            <button className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
              Add to Cart
            </button>

            <button className="flex-1 bg-gold-600 text-white py-3 rounded-lg font-semibold hover:bg-gold-700">
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductPage;
