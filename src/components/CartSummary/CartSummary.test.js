import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CartContext from '../../context/CartContext'
import CartSummary from './index'

const renderCartSummary = cartList =>
  render(
    <CartContext.Provider
      value={{
        cartList,
        addCartItem: jest.fn(),
        removeCartItem: jest.fn(),
        incrementCartItemQuantity: jest.fn(),
        decrementCartItemQuantity: jest.fn(),
        removeAllCartItems: jest.fn(),
      }}
    >
      <CartSummary />
    </CartContext.Provider>,
  )

describe('CartSummary payment popup', () => {
  test('should open a payment popup and require cash on delivery to confirm', async () => {
    renderCartSummary([
      {id: 1, title: 'Test product', price: 120, quantity: 2, imageUrl: 'x'},
    ])

    userEvent.click(screen.getByRole('button', {name: /checkout/i}))

    expect(screen.getByText(/payment method/i)).toBeInTheDocument()
    expect(screen.getByText(/items: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/total: rs 240\/-/i)).toBeInTheDocument()

    const confirmOrderButton = screen.getByRole('button', {
      name: /confirm order/i,
    })
    expect(confirmOrderButton).toBeDisabled()

    const codOption = screen.getByLabelText(/cash on delivery/i)
    expect(codOption).not.toBeDisabled()

    userEvent.click(codOption)

    expect(confirmOrderButton).not.toBeDisabled()

    userEvent.click(confirmOrderButton)

    expect(
      screen.getByText(/your order has been placed successfully/i),
    ).toBeInTheDocument()
  })
})
