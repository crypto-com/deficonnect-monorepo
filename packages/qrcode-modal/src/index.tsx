import { h, render, createRef } from 'preact'
import { isIOS, isAndroid, saveMobileLinkInfo } from '@deficonnect/utils'
import { InstallExtensionQRCodeModal } from './components/InstallExtensionModal'

const openDeeplinkOrInstall = (deepLink: string, installURL: string): void => {
  if (isIOS()) {
    const newTab = window.open(deepLink) as any
    if (newTab?.location) {
      newTab.location.href = deepLink
    }
  } else {
    let isBlur = false
    window.addEventListener('blur', () => {
      isBlur = true
    })
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isBlur = true
      }
    })
    window.location.href = deepLink
    setTimeout(() => {
      if (isBlur) return
      window.open(installURL)
    }, 1500)
  }
}

const downloadAppURL = 'https://bit.ly/3Bk4wzE'
export class InstallExtensionModalProvider {
  private root: Element | null = null
  private elRef = createRef()
  private closeModalCallback: Function | null = null

  constructor() {
    const body = document.body
    const popup = document.createElement('div')
    popup.id = 'cryptoconnect-extension'
    body.appendChild(popup)
    this.root = popup
    this.render()
  }

  public async open(options: { deepLink: string }): Promise<void> {
    const singleLinkHref = options.deepLink
    if (isIOS()) {
      saveMobileLinkInfo({ name: 'Crypto.com DeFi Wallet', href: singleLinkHref })
      if (this.elRef?.current?.setState) {
        this.elRef.current.setState({ visible: true, singleLinkHref })
      }
      return
    }
    if (isAndroid()) {
      saveMobileLinkInfo({
        name: 'Unknown',
        href: singleLinkHref, // adnroid side only support lowercase
      })
      openDeeplinkOrInstall(singleLinkHref, downloadAppURL)
    }
    try {
      if (this.elRef?.current?.setState) {
        this.elRef.current.setState({ visible: true })
      }
    } catch (error) {
      //
    }
  }

  public openSingleLinkModal(singleLinkHref): void {
    this.elRef.current.setState({ visible: true, singleLinkHref })
  }

  public close(): void {
    if (this.elRef?.current?.setState) {
      this.elRef.current.setState({ visible: false })
    }
  }

  private onModalClose(): void {
    this.close()
    if (this.closeModalCallback) {
      this.closeModalCallback()
    }
  }

  private render(): void {
    if (!this.root) {
      return
    }
    render(
      <InstallExtensionQRCodeModal
        ref={this.elRef}
        onClose={this.onModalClose.bind(this)}
      />,
      this.root,
    )
  }
}
