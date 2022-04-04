import React from 'react'
import cx from 'classnames'
import LogoMenu from 'assets/img/menu.png'
import FacebookIcon from 'assets/img/facebook.png'
import TwitterIcon from 'assets/img/twitter.png'
import YoutubeIcon from 'assets/img/youtube.png'
import DiscordIcon from 'assets/img/discord.png'
import TelegramIcon from 'assets/img/telegram.png'
import Appstore from 'assets/img/appstore.png'
import GGplay from 'assets/img/ggplay.png'
import styles from './styles.module.scss'

const Footer = () => {
  return (
    <footer className={cx(styles.flex, styles.wrapper)}>
      <div className={cx(styles.flex, styles.row)}>
        <div className={cx(styles.part, styles.partFirst)}>
          <img className={styles.logo} src={LogoMenu} alt="logo" />
          <div className={styles.description}>
            <div>@2021 Mollector Studio </div>
            <div>All trademarks referenced herein are the properties of their respective owners.</div>
          </div>
        </div>
        <div className={cx(styles.part, styles.partSecond)}>
          <div className={styles.title}>Find out more</div>
          <div className={styles.linkInfo}>Whitepaper</div>
          <div className={styles.linkInfo}>Pitch Deck</div>
          <div
            className={styles.title}
            style={{
              marginTop: '15px',
            }}
          >
            Sign up for newsletter
          </div>
          <input className={styles.input} placeholder="Your email here" />
        </div>
        <div className={cx(styles.partSecond, styles.part)}>
          <div className={styles.title}>Join our community</div>
          <div className={styles.flex}>
            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/MollectorGame">
              <img className={styles.socialIcon} src={FacebookIcon} alt="facebook" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/MollectorGame">
              <img className={styles.socialIcon} src={TwitterIcon} alt="twitter" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/c/MollectorOfficial/videos">
              <img className={styles.socialIcon} src={YoutubeIcon} alt="youtube" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://discord.com/invite/QzBCXBxrcV">
              <img className={styles.socialIcon} src={DiscordIcon} alt="discord" />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://t.me/MollectorGame">
              <img className={styles.socialIcon} src={TelegramIcon} alt="telegram" />
            </a>
          </div>
          <br />
          <div className={styles.title}>Available soon on</div>
          <div className={styles.flex}>
            <img className={styles.socialIcon} src={Appstore} alt="appstore" />
            <img className={styles.socialIcon} src={GGplay} alt="ggplay" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
