/**
 * Cart Logic for AgriCulture Hydroponics
 */

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.updateCartBadge();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ 
                ...product, 
                quantity: 1, 
                price: parseFloat(product.price) || 0 
            });
        }
        this.save();
        this.updateCartBadge();
        this.showNotification(`${product.name} added to cart!`);
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.save();
                this.updateCartBadge();
                // Dispatch event for UI updates
                window.dispatchEvent(new CustomEvent('cartUpdated'));
            }
        }
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateCartBadge();
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    getCartTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.save();
        this.updateCartBadge();
    }

    save() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCartBadge() {
        const badge = document.querySelector('.cart-badge');
        if (badge) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    showNotification(message) {
        let notification = document.querySelector('.cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Global cart instance
window.cart = new Cart();

// Global helper for HTML ease of use
window.addToCart = (id, name, price, image) => {
    window.cart.addItem({ id, name, price, image });
};
