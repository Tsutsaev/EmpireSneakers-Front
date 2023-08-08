import { FC } from "react";
import styles from "./productCard.module.scss";
import shirt from "../../assets/icons/Tshirt.png";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { addToFavorite } from "../../features/favoriteSlice";
import { addToBasket } from "../../features/basketSlice";

interface sizesProps {
  size: number;
  quantity: number;
}

interface ProductCardProps {
  _id: string;
  name: string;
  title: string;
  price: number;
  photo: string;
  sizes: sizesProps[];
}

const ProductCard: FC<ProductCardProps> = ({
  _id,
  name,
  title,
  price,
  sizes,
}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.applicationSlice.userId);
  const user = useAppSelector((state) => state.userSlice.user);

  const currentSize = sizes[0].size;

  const handleAddFavorite = () => {
    if (userId) {
      dispatch(
        addToFavorite({
          id: user.favorite,
          productId: _id,
          size: currentSize,
        })
      );
    }
  };

  const handleAddBasket = () => {
    if (userId) {
      dispatch(
        addToBasket({ id: user.basket, productId: _id, size: currentSize })
      );
    }
  };

  return (
    <div className={styles.product}>
      <img src={shirt} alt="Футболка" />
      <div className={styles.favorite} onClick={handleAddFavorite}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.99486 4.93029C8.49535 3.18277 5.99481 2.7127 4.11602 4.3129C2.23723 5.9131 1.97273 8.58855 3.44815 10.4811C4.67486 12.0547 8.38733 15.3734 9.60407 16.4475C9.7402 16.5677 9.80827 16.6278 9.88766 16.6514C9.95695 16.672 10.0328 16.672 10.1021 16.6514C10.1815 16.6278 10.2495 16.5677 10.3857 16.4475C11.6024 15.3734 15.3149 12.0547 16.5416 10.4811C18.017 8.58855 17.7848 5.89627 15.8737 4.3129C13.9626 2.72953 11.4944 3.18277 9.99486 4.93029Z"
            stroke="#807D7E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={styles.productInfo}>
        <div className={styles.description}>
          <div className={styles.title}>
            <span>{name}</span>
            <span>{title}</span>
          </div>
          <button>${price}</button>
        </div>
        <button onClick={handleAddBasket} className={styles.buy}>
          В корзину
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
