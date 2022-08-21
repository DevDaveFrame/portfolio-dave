import React from 'react';
import Image from 'next/image';
import logo from '../../public/DaveLogo.svg';
import styles from './Navbar.module.scss';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/">
          <Image src={logo} height="35" width="77" alt="Dave" />
        </a>
      </div>
      <div className={styles.menu}>
        Coming Soon...
      </div>
    </nav>
  );
};

export default Navbar;
