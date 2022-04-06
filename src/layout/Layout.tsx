import { FC, ReactNode, useState } from 'react'
import Sidebar from 'react-sidebar'
import classNames from 'classnames'
import { Header } from 'modules/header'
import Footer from 'modules/footer'
import Slider from './Slider'
import styles from './Layout.module.scss'
import theme from 'ui/styles/Theme.module.scss'
import mobileTheme from 'ui/styles/MobileTheme.module.scss'
import { getModeClassName } from 'ui/utils/get-theme-class-name'

type LayoutType = {
  children?: ReactNode
  title?: string
  description?: string
  keywords?: string
  className?: string
  mode?: 'dark' | 'light' | 'transparent'
  fixedHeader?: boolean
  withDecoration?: boolean
  web3?: boolean
}

export const Layout: FC<LayoutType> = ({
  children,
  className,
  mode = 'dark',
  fixedHeader = true,
  withDecoration = true,
}) => {
  return (
    <div>
      {/* <Sidebar
        sidebar={<Slider />}
        sidebarClassName={styles.sidebar}
        docked
        styles={{ sidebar: { background: 'white' } }}
      /> */}
      <div
        className={classNames(
          styles.component,
          getModeClassName(mode, theme),
          getModeClassName(mode, mobileTheme),
          className,
        )}
      >
        <Header className={styles.header} fixed={fixedHeader} />
        <main className={styles.main}>
          <div className={styles.row}>{children}</div>

          <div style={{textAlign: 'center', marginTop: 20, color: '#239ef7', fontWeight: 'normal'}}>
            <a href='https://docs.mollector.com/about-mollector/introduction' target="_blank">Help</a> | <a href='#' target="_blank">Terms & Conditions</a> | <a href='https://t.me/MollectorGame' target="_blank">Telegram</a>
          </div>
          <br/>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  )
}
