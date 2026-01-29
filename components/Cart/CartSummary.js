import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import apiClient from '../../lib/api-client'
import styles from './Cart.module.css'

const CartSummary = ({ items, onItemUpdate, onItemRemove }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const subtotal = items.reduce((total, item) => {
    return total + (parseFloat(item.product.price) * item.quantity)
  }, 0)

  const shippingCost = subtotal > 100 ? 0 : 15 // Free shipping over EUR100
  const taxAmount = (subtotal + shippingCost) * 0.20 // 20% VAT
  const total = subtotal + shippingCost + taxAmount

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return handleRemoveItem(itemId)
    }

    try {
      setIsLoading(true)
      await apiClient.updateCartItem(itemId, { quantity: newQuantity })
      onItemUpdate(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating cart item:', error)
      alert('Erreur lors de la mise à jour du panier')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      setIsLoading(true)
      await apiClient.removeFromCart(itemId)
      onItemRemove(itemId)
    } catch (error) {
      console.error('Error removing cart item:', error)
      alert('Erreur lors de la suppression de l\'article')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Votre panier est vide')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos collections et ajoutez des articles à votre panier</p>
        <button 
          onClick={() => router.push('/boutique')}
          className={styles.shopButton}
        >
          Continuer mes achats
        </button>
      </div>
    )
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartItems}>
        <h1>Mon Panier ({items.length} article{items.length > 1 ? 's' : ''})</h1>
        
        {items.map((item) => (
          <div key={item.id} className={styles.cartItem}>
            <div className={styles.itemImage}>
              <Image width={600} height={750} src={item.product.image} 
                alt={item.product.name}
                onError={(e) => {
                  e.target.src = '/placeholder-product.png'
                }}
              />
            </div>
            
            <div className={styles.itemDetails}>
              <h3>{item.product.name}</h3>
              {item.size && <p className={styles.variant}>Taille: {item.size}</p>}
              {item.color && <p className={styles.variant}>Couleur: {item.color}</p>}
              <p className={styles.price}>{parseFloat(item.product.price).toFixed(2)} EUR</p>
            </div>
            
            <div className={styles.itemControls}>
              <div className={styles.quantityControls}>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={isLoading}
                  className={styles.quantityBtn}
                >
                  -
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={isLoading}
                  className={styles.quantityBtn}
                >
                  +
                </button>
              </div>
              
              <button 
                onClick={() => handleRemoveItem(item.id)}
                disabled={isLoading}
                className={styles.removeBtn}
              >
                Supprimer
              </button>
            </div>
            
            <div className={styles.itemTotal}>
              {(parseFloat(item.product.price) * item.quantity).toFixed(2)} EUR
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.cartSummary}>
        <h2>Récapitulatif</h2>
        
        <div className={styles.summaryLine}>
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)} EUR</span>
        </div>
        
        <div className={styles.summaryLine}>
          <span>Livraison</span>
          <span>{shippingCost === 0 ? 'Gratuite' : `${shippingCost.toFixed(2)} EUR`}</span>
        </div>
        
        <div className={styles.summaryLine}>
          <span>TVA (20%)</span>
          <span>{taxAmount.toFixed(2)} EUR</span>
        </div>
        
        <div className={styles.summaryTotal}>
          <span>Total</span>
          <span>{total.toFixed(2)} EUR</span>
        </div>
        
        {subtotal < 100 && (
          <p className={styles.shippingNote}>
            Livraison gratuite dès 100EUR d'achat
          </p>
        )}
        
        <button 
          onClick={handleCheckout}
          disabled={isLoading || items.length === 0}
          className={styles.checkoutBtn}
        >
          {isLoading ? 'Chargement...' : 'Passer commande'}
        </button>
        
        <button 
          onClick={() => router.push('/boutique')}
          className={styles.continueShoppingBtn}
        >
          Continuer mes achats
        </button>
      </div>
    </div>
  )
}

export default CartSummary