import styles from './Sidebar.module.css';
import clsx from 'clsx';

interface Props {
  isOpen: boolean;
}

export const Sidebar = ({ isOpen }: Props) => {
  return (
    <div className={clsx(styles.sidebar, { [styles.open]: isOpen })}>
      <ul>
        <li>Элемент 1</li>
        <li>Элемент 2</li>
        <li>Элемент 3</li>
        <li>Элемент 4</li>
      </ul>
    </div>
  );
};
