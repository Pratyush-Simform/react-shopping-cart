import { useState } from 'react'
import { useQuery } from 'react-query'
import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import Modal from '@material-ui/core/Modal'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'
import { Wrapper, StyledButton } from './App.styles'
import Item from './item/Item'
import Cart from './cart/Cart'
import Header from "./header/Header"

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> => 
 await (await fetch('https://fakestoreapi.com/products')).json();

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading, error } = useQuery<CartItemType[]>('products', getProducts);
  console.log(data);

  const getTotalItems = (items: CartItemType[]) => 
    items.reduce((ack: number, items) => ack + items.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);
      if(isItemInCart){
        return prev.map(item => 
          item.id === clickedItem.id
          ? {...item, amount: item.amount + 1}
          : item
        );
      }
      return [...prev, { ...clickedItem, amount: 1}];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev => 
      prev.reduce((ack, item) => {
        if(item.id === id){
          if(item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1}];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  // const handleGrid = (id: number) => {
  //   setCartItems(prev => 
  //     prev.map(items => {
  //       if(items.id === id){
  //         setModalOpen(true)
  //       } else (
  //         setModalOpen(false)
  //       )
  //     }, [] as CartItemType[])
  //     )
  // }
  // console.log(cartItems);
  

  if(isLoading) return <LinearProgress />
  if(error) return <div><h3>Something went Wrong</h3></div>
  
  return (
    <div>
    <Header />
    <Wrapper>
      {/**
      {data?.map((modalItem: any) => {
       return <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
         aria-labelledby="simple-modal-title"
         aria-describedby="simple-modal-description"
       >
        {modalItem}
       </Modal>
      })}
       */}
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart 
         cartItems={cartItems}
         addToCart={handleAddToCart}
         removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
      ))}
      </Grid>
    </Wrapper>
    </div>
  );
}

export default App;
