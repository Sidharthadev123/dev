import {useState} from 'react'
import Popup from 'reactjs-popup'

import CartContext from '../../context/CartContext'

import './index.css'

const paymentOptions = [
  {id: 'card', label: 'Card'},
  {id: 'netBanking', label: 'Net Banking'},
  {id: 'upi', label: 'UPI'},
  {id: 'wallet', label: 'Wallet'},
  {id: 'cashOnDelivery', label: 'Cash on Delivery'},
]

const CartSummary = () => (
  <CartContext.Consumer>
    {value => {
      const {cartList} = value
      let total = 0
      cartList.forEach(eachCartItem => {
        total += eachCartItem.price * eachCartItem.quantity
      })

      const CheckoutPopup = () => {
        const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
        const [isOrderPlaced, setIsOrderPlaced] = useState(false)
        const isCashOnDeliverySelected =
          selectedPaymentMethod === 'cashOnDelivery'

        const onChangePaymentMethod = event => {
          setSelectedPaymentMethod(event.target.value)
          setIsOrderPlaced(false)
        }

        const onConfirmOrder = () => {
          if (isCashOnDeliverySelected) {
            setIsOrderPlaced(true)
          }
        }

        return (
          <Popup
            modal
            trigger={
              <button type="button" className="checkout-button">
                Checkout
              </button>
            }
            onOpen={() => {
              setSelectedPaymentMethod('')
              setIsOrderPlaced(false)
            }}
            closeOnDocumentClick={false}
          >
            {close => (
              <div className="payment-popup-container">
                <button
                  type="button"
                  className="payment-popup-close-button"
                  onClick={close}
                  aria-label="Close payment popup"
                >
                  ×
                </button>
                <h1 className="payment-popup-title">Payment Method</h1>
                <div className="payment-options-container">
                  {paymentOptions.map(eachOption => {
                    const isDisabled = eachOption.id !== 'cashOnDelivery'
                    const isChecked = selectedPaymentMethod === eachOption.id

                    return (
                      <label
                        key={eachOption.id}
                        className={`payment-option ${
                          isDisabled ? 'disabled' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          value={eachOption.id}
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={onChangePaymentMethod}
                          aria-label={eachOption.label}
                        />
                        <span>{eachOption.label}</span>
                      </label>
                    )
                  })}
                </div>

                <div className="payment-summary-box">
                  <p className="payment-summary-text">
                    Items: {cartList.length}
                  </p>
                  <p className="payment-summary-text">Total: Rs {total}/-</p>
                </div>

                <button
                  type="button"
                  className="confirm-order-button"
                  disabled={!isCashOnDeliverySelected}
                  onClick={onConfirmOrder}
                >
                  Confirm Order
                </button>

                {isOrderPlaced && (
                  <p className="order-success-message">
                    Your order has been placed successfully
                  </p>
                )}
              </div>
            )}
          </Popup>
        )
      }

      return (
        <div className="cart-summary-container">
          <h1 className="order-total-value">
            <span className="order-total-label">Order Total:</span> Rs {total}/-
          </h1>
          <p className="total-items">{cartList.length} Items in cart</p>
          <CheckoutPopup />
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default CartSummary
