import { ChangeEvent, useState } from 'react';
import { useDebouncedCallback } from '../../../hooks/useDebouncedCallback';
import { SearchBar } from '../../ui/SeachBar/SearchBar';
import styles from './Header.module.css';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

interface Props {
  toggleSidebar: () => void;
}

export const Header = ({ toggleSidebar }: Props) => {
  const [search, setSearch] = useState<string>('');

  const handleSearchChange = useDebouncedCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, 500);

  return (
    <header>
      <button className={styles['toggle-sidebar']} onClick={toggleSidebar}>
        <DensityMediumIcon />
      </button>
      <SearchBar inputMode="search" onChange={handleSearchChange} />
    </header>
  );
};
