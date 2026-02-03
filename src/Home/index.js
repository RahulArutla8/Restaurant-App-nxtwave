import {useState, useEffect} from 'react'
import Header from '../Header'
import DishItem from '../DishItem'
import './index.css'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [response, setResponse] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [restaurantName, setRestaurantName] = useState('')

  const addItemToCart = dish => {
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (!isAlreadyExists) {
      setCartItems(prev => [...prev, {...dish, quantity: 1}])
    } else {
      setCartItems(prev =>
        prev.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      )
    }
  }

  const removeItemFromCart = dish => {
    const isAlreadyExists = cartItems.find(item => item.dishId === dish.dishId)
    if (isAlreadyExists) {
      setCartItems(prev =>
        prev
          .map(item =>
            item.dishId === dish.dishId
              ? {...item, quantity: item.quantity - 1}
              : item,
          )
          .filter(item => item.quantity > 0),
      )
    }
  }

  const getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability:
          eachDish.dish_Availability ?? eachDish.dish_availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat || [],
      })),
    }))

  useEffect(() => {
    const fetchRestaurantApi = async () => {
      const api =
        'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
      const apiResponse = await fetch(api)
      const data = await apiResponse.json()

      setRestaurantName(data[0].restaurant_name)

      const updatedData = getUpdatedData(data[0].table_menu_list)
      setResponse(updatedData)
      setActiveCategoryId(updatedData[0].menuCategoryId)
      setIsLoading(false)
    }

    fetchRestaurantApi()
  }, [])

  const renderTabMenuList = () =>
    response.map(eachCategory => (
      <li
        key={eachCategory.menuCategoryId}
        className={`each-tab-item ${
          eachCategory.menuCategoryId === activeCategoryId
            ? 'active-tab-item'
            : ''
        }`}
        onClick={() => setActiveCategoryId(eachCategory.menuCategoryId)}
      >
        <button type="button" className="tab-category-button">
          {eachCategory.menuCategory}
        </button>
      </li>
    ))

  const renderDishes = () => {
    const activeCategory = response.find(
      each => each.menuCategoryId === activeCategoryId,
    )

    if (!activeCategory) return null

    return (
      <ul className="dishes-list-container">
        {activeCategory.categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner-border" role="status" />
      </div>
    )
  }

  return (
    <div className="home-background">
      <Header cartItems={cartItems} restaurantName={restaurantName} />
      <ul className="tab-container">{renderTabMenuList()}</ul>
      {renderDishes()}
    </div>
  )
}

export default Home
