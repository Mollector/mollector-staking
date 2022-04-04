import React from 'react'
import { Link } from 'react-router-dom'
import LogoMenu from 'assets/img/menu.png'
import styles from './slider.module.scss'

const Slider = () => {
  return (
    <div className={styles.container}>
      <Link to="/">
        <img className={styles.logo} src={LogoMenu} alt="logo" />
      </Link>
      <button className={styles.sidebarActive}>LP Stake</button>
      <button className={styles.sidebarOption}>MOL Stake</button>
    </div>
  )
}

export default Slider
