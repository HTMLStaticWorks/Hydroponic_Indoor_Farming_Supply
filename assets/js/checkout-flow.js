/**
 * Checkout Flow Logic for AgriCulture Hydroponics
 */

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-content');
    const emptyContainer = document.getElementById('cart-empty');

    function renderCart() {
        if (!cartContainer || !emptyContainer) return;

        const items = window.cart.items;

        if (items.length === 0) {
            cartContainer.style.display = 'none';
            emptyContainer.style.display = 'block';
            return;
        }

        cartContainer.style.display = 'block';
        emptyContainer.style.display = 'none';

        let html = `
            <div class="table-responsive">
                <table class="table cart-table align-middle">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        items.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <span class="fw-bold cart-product-name">${item.name}</span>
                        </div>
                    </td>
                    <td>$${price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-control px-2 py-1 border rounded bg-light">
                            <button class="btn btn-sm btn-link p-0 quantity-btn" onclick="window.cart.updateQuantity('${item.id}', -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="mx-2 fw-bold">${quantity}</span>
                            <button class="btn btn-sm btn-link p-0 quantity-btn" onclick="window.cart.updateQuantity('${item.id}', 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </td>
                    <td class="item-total">$${(price * quantity).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-link text-danger p-0" onclick="window.cart.removeItem('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>

            <div class="row mt-4">
                <div class="col-lg-6">
                    <div class="mb-3">
                        <label class="form-label small fw-bold">Coupon Code</label>
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Enter code">
                            <button class="btn btn-outline-success" type="button">Apply</button>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card bg-light border-0">
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>$${window.cart.getCartTotal().toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Shipping:</span>
                                <span class="text-success">Free</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between mb-4">
                                <h4 class="fw-bold mb-0">Total:</h4>
                                <h4 class="fw-bold mb-0 text-success">$${window.cart.getCartTotal().toFixed(2)}</h4>
                            </div>
                            <a href="checkout.html" class="btn btn-success w-100 py-3 fw-bold">PROCEED TO CHECKOUT</a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        cartContainer.innerHTML = html;
    }

    // Initial render
    renderCart();

    // Listen for cart updates
    window.addEventListener('cartUpdated', () => {
        renderCart();
    });
});
