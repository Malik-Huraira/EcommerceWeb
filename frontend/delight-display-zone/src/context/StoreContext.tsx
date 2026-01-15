import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import api, { ProductDto, AuthResponse } from '@/services/api';
import { getImageUrl } from '@/lib/utils';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount?: number;
  tags?: string[];
  featured?: boolean;
  new?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

type StoreAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_WISHLIST'; payload: Product[] }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };


const initialState: StoreState = {
  cart: [],
  wishlist: [],
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'ADD_TO_CART': {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }],
      };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter(item => item.id !== action.payload.id) };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'ADD_TO_WISHLIST': {
      const exists = state.wishlist.find(item => item.id === action.payload.id);
      if (exists) return state;
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload) };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, cart: [], wishlist: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

function mapProductDtoToProduct(dto: ProductDto): Product {
  return {
    id: dto.id,
    name: dto.name,
    price: dto.price,
    originalPrice: dto.originalPrice,
    image: getImageUrl(dto.image),
    images: dto.images?.map(getImageUrl),
    category: dto.category,
    description: dto.description,
    rating: dto.rating,
    reviews: dto.reviews,
    inStock: dto.inStock,
    stockCount: dto.stockCount,
    tags: dto.tags,
    featured: dto.featured,
    new: dto.isNew,
  };
}


interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<AuthResponse>;
  registerUser: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  cartTotal: number;
  cartCount: number;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const refreshCart = async () => {
    if (!api.getToken()) return;
    try {
      const cartData = await api.getCart();
      const cartItems: CartItem[] = cartData.items.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        image: getImageUrl(item.image),
        category: item.category || '',
        description: '',
        rating: 0,
        reviews: 0,
        inStock: true,
        quantity: item.quantity,
      }));
      dispatch({ type: 'SET_CART', payload: cartItems });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const refreshWishlist = async () => {
    if (!api.getToken()) return;
    try {
      const wishlistData = await api.getWishlist();
      const wishlistItems = wishlistData.items.map(mapProductDtoToProduct);
      dispatch({ type: 'SET_WISHLIST', payload: wishlistItems });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const user = await api.getCurrentUser();
          dispatch({ type: 'LOGIN', payload: user });
          await Promise.all([refreshCart(), refreshWishlist()]);
        } catch {
          api.logout();
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    };
    initializeAuth();
  }, []);


  const addToCart = async (product: Product) => {
    if (state.isAuthenticated) {
      try {
        await api.addToCart(product.id, 1);
        await refreshCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
        dispatch({ type: 'ADD_TO_CART', payload: product });
      }
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (state.isAuthenticated) {
      try {
        await api.removeFromCart(productId);
        await refreshCart();
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
      }
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (state.isAuthenticated) {
      try {
        if (quantity <= 0) {
          await api.removeFromCart(productId);
        } else {
          await api.updateCartItem(productId, quantity);
        }
        await refreshCart();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
    }
  };

  const clearCart = async () => {
    if (state.isAuthenticated) {
      try {
        await api.clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
    dispatch({ type: 'CLEAR_CART' });
  };

  const addToWishlist = async (product: Product) => {
    if (state.isAuthenticated) {
      try {
        await api.addToWishlist(product.id);
        await refreshWishlist();
      } catch (error) {
        console.error('Failed to add to wishlist:', error);
        dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
      }
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (state.isAuthenticated) {
      try {
        await api.removeFromWishlist(productId);
        await refreshWishlist();
      } catch (error) {
        console.error('Failed to remove from wishlist:', error);
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      }
    } else {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    }
  };


  const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    // Save local cart before login
    const localCart = [...state.cart];
    
    const response = await api.login(email, password);
    dispatch({
      type: 'LOGIN',
      payload: {
        id: response.id,
        email: response.email,
        name: response.name,
        avatar: response.avatar,
        role: response.role,
      },
    });
    
    // Sync local cart items to backend
    if (localCart.length > 0) {
      for (const item of localCart) {
        try {
          await api.addToCart(item.id, item.quantity);
        } catch (error) {
          console.error('Failed to sync cart item:', error);
        }
      }
    }
    
    await Promise.all([refreshCart(), refreshWishlist()]);
    return response;
  };

  const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.register(name, email, password);
    dispatch({
      type: 'LOGIN',
      payload: {
        id: response.id,
        email: response.email,
        name: response.name,
        avatar: response.avatar,
        role: response.role,
      },
    });
    return response;
  };

  const logout = () => {
    api.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const cartTotal = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = state.cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        loginUser,
        registerUser,
        logout,
        cartTotal,
        cartCount,
        refreshCart,
        refreshWishlist,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
