import { FC, useEffect } from "react";
import styles from "./header.module.scss";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { fetchGlobalCategories } from "../../features/globalCategorySlice";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { fetchProducts, filterProduct } from "../../features/productSlice";
import { getUser } from "../../features/userSlice";
import logo from "../../assets/icons/logo.png";
import ProfileSVG from "../../assets/icons/ProfileSVG";
import SettingsSVG from "../../assets/icons/SettingsSVG";

const Header: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const path: string[] = location.pathname.split("/");

  const userId: string | null | undefined = useAppSelector(
    (state) => state.applicationSlice.userId
  );
  const user = useAppSelector((state) => state.userSlice.user);
  const globalCategories = useAppSelector(
    (state) => state.globalCategory.globalCategories
  );

  const handleSort = () => {
    dispatch(fetchProducts());
    dispatch(filterProduct(""));
  };

  const handleNavProfile = () => {
    const token = localStorage.getItem("token");
    !token
      ? navigate("/authorization/signup")
      : navigate("/my_accaunt/personal_info");
  };

  useEffect(() => {
    dispatch(fetchGlobalCategories());
  }, [dispatch]);

  useEffect(() => {
    userId && dispatch(getUser({ id: userId }));
  }, [dispatch, userId]);

  return (
    <div className={styles.header}>
      <header>
        <Link to={"/"}>
          <img src={logo} alt="logo" />
        </Link>
        <ul>
          {globalCategories.map((item) => (
            <li
              key={item._id}
              className={item._id === id ? styles.active : styles.none}
            >
              <Link
                onClick={handleSort}
                className={styles.link}
                to={`/Gcategory/${item._id}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.input}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.6363 17.697C16.9292 17.9899 17.4041 17.9899 17.697 17.697C17.9899 17.4041 17.9899 16.9292 17.697 16.6363L16.6363 17.697ZM13.9167 8.83334C13.9167 11.6408 11.6408 13.9167 8.83334 13.9167V15.4167C12.4692 15.4167 15.4167 12.4692 15.4167 8.83334H13.9167ZM8.83334 13.9167C6.02589 13.9167 3.75 11.6408 3.75 8.83334H2.25C2.25 12.4692 5.19746 15.4167 8.83334 15.4167V13.9167ZM3.75 8.83334C3.75 6.02589 6.02589 3.75 8.83334 3.75V2.25C5.19746 2.25 2.25 5.19746 2.25 8.83334H3.75ZM8.83334 3.75C11.6408 3.75 13.9167 6.02589 13.9167 8.83334H15.4167C15.4167 5.19746 12.4692 2.25 8.83334 2.25V3.75ZM12.4697 13.5303L16.6363 17.697L17.697 16.6363L13.5303 12.4697L12.4697 13.5303Z"
              fill="#807D7E"
            />
          </svg>
          <input type="text" placeholder="Поиск..." />
        </div>

        <div className={styles.buttons}>
          <button
            onClick={handleNavProfile}
            className={
              path.includes("my_accaunt") ? styles.active : styles.none
            }
          >
            <ProfileSVG />
          </button>
          {user.admin && (
            <Link to={`/admin/${user._id}`}>
              <button
                className={path.includes("admin") ? styles.active : styles.none}
              >
                <SettingsSVG />
              </button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
