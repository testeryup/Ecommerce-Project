import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
        lastUpdated: Date.now() // Add timestamp for tracking changes

    },
    reducers: {
        addToCart: (state, action) => {
            console.log('addToCart action payload:', action.payload);
            const { product, sku, quantity } = action.payload;

            // Validate payload
            if (!product) {
                console.error('Product is missing in addToCart payload');
                return;
            }
            if (!sku) {
                console.error('SKU is missing in addToCart payload');
                return;
            }

            const existingItemIndex = state.items.findIndex(
                item => item.skuId === sku._id
            );

            // Create new item object
            const newItem = {
                productId: product._id,
                skuId: sku._id,
                name: product.name,
                skuName: sku.name,
                price: sku.price,
                quantity: Number(quantity),
                image: product.images && product.images.length > 0 ? product.images[0] : '/default-product.jpg'
            };

            console.log('Adding item to cart:', newItem);

            // If item exists, replace it entirely
            if (existingItemIndex !== -1) {
                state.items[existingItemIndex] = newItem;
            } else {
                state.items.push(newItem);
            }
            state.total = state.items.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );
            state.lastUpdated = Date.now();

        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                item => item.skuId !== action.payload
            );
            state.total = state.items.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );
        },
        updateQuantity: (state, action) => {
            const { skuId, quantity } = action.payload;
            const item = state.items.find(item => item.skuId === skuId);
            if (item) {
                item.quantity = Number(quantity);
            }
            state.total = state.items.reduce(
                (sum, item) => sum + item.price * item.quantity, 0
            );
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;