import { useFrostbyte } from 'frostbyte';

export const Bird = ({ styles }) => {
  const { isDarkTheme } = useFrostbyte();
  return (
    <div className={`${styles.birdContainer} ${styles.birdContainerOne}`}>
      <div
        className={`${isDarkTheme ? styles.birdDark : styles.bird} ${
          styles.birdOne
        }`}
      ></div>
    </div>
  );
};
