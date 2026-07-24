import { useContext, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext.js";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../Components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, token } =
    useContext(ShopContext);

  const cartData = useMemo(() => {
    const items = []
    for (const productId in cartItems) {
      for (const variant in cartItems[productId]) {
        const quantity = cartItems[productId][variant]
        const product = products.find((item) => item._id === productId)
        if (quantity > 0 && product) items.push({product, variant, quantity})
      }
    }
    return items
  }, [cartItems, products])

  const proceedToCheckout = () => {
    if (cartData.length === 0) return
    navigate(token ? "/place-order" : "/login")
  }

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1="YOUR" text2="CART" />
      </div>

      {cartData.length === 0 && (
        <p className="py-12 text-center text-gray-500">Your cart is empty.</p>
      )}

      <div>
        {cartData.map(({product, variant, quantity}) => (
          <div
            key={`${product._id}-${variant}`}
            className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
          >
            <div className="flex items-start gap-6">
              <img src={product.image[0]} alt={product.name} className="w-16 sm:w-20" />
              <div>
                <p className="text-sm sm:text-lg font-medium">{product.name}</p>
                <div className="flex items-center gap-5 mt-2">
                  <p>{currency}{product.price}</p>
                  <p className="px-2 sm:px-3 sm:py-1 border rounded bg-slate-50">{variant}</p>
                </div>
              </div>
            </div>
            <input
              onChange={(event) => {
                const nextQuantity = Number(event.target.value)
                if (nextQuantity >= 1) updateQuantity(product._id, variant, nextQuantity)
              }}
              type="number"
              min={1}
              value={quantity}
              aria-label={`Quantity for ${product.name}, variant ${variant}`}
              className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
            />
            <button
              type="button"
              onClick={() => updateQuantity(product._id, variant, 0)}
              aria-label={`Remove ${product.name}, variant ${variant}`}
              className="cursor-pointer"
            >
              <img src={assets.bin_icon} alt="" className="w-4 sm:w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              type="button"
              disabled={cartData.length === 0}
              onClick={proceedToCheckout}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg disabled:bg-gray-400 text-white text-sm my-8 px-8 py-3 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
