import { h, render, createRef } from "preact";
import { formatToCWEURI, isIOS, isAndroid, formatIOSMobile, saveMobileLinkInfo, replaceUriProtocol } from '@deficonnect/utils'
import { InstallExtensionQRCodeModal } from './components/InstallExtensionModal'
import QRCode from 'qrcode'

const iOSRegistryEntry = {
  name: 'Crypto.com DeFi Wallet',
  shortName: 'DeFi Wallet',
  color: 'rgb(17, 153, 250)',
  logo: './logos/wallet-crypto-defi.png',
  universalLink: 'https://wallet.crypto.com',
  deepLink: 'cryptowallet:',
}

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

  public async open(options: { uri: string, cb: Function }): Promise<void> {
    this.closeModalCallback = options.cb
    const CWEURI = formatToCWEURI(options.uri) + '&role=dapp'
    if (isIOS()) {
      const singleLinkHref = formatIOSMobile(CWEURI, iOSRegistryEntry)
      saveMobileLinkInfo({ name: 'Crypto.com DeFi Wallet', href: singleLinkHref })
      this.elRef?.current?.setState({ visible: true, singleLinkHref });
      return
    }
    if (isAndroid()) {
      const lowercaseURI = replaceUriProtocol(CWEURI, 'cwe') + '&role=dapp'
      saveMobileLinkInfo({
        name: 'Unknown',
        href: lowercaseURI, // adnroid side only support lowercase
      })
      openDeeplinkOrInstall(lowercaseURI, downloadAppURL)
      return
    }
    try {
      const uri = await new Promise<string>((resolve) => QRCode.toDataURL(CWEURI, (_err, url: string) => resolve(url)))
      this.elRef?.current?.setState({ visible: true, qrUrl: uri });
    } catch (error) {
      //
    }
  }

  public close(): void {
    this.elRef?.current?.setState({ visible: false});
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
    );
  }
}
