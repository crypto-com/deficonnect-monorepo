import { createElement as CurtomCreateElement } from './CustomCreateElement'
import { IQRCodeModal } from '@deficonnect/types'
import { formatIOSMobile, isAndroid, isIOS, saveMobileLinkInfo } from '@deficonnect/browser-utils'
import DeFiLinkIconLight from './assets/defi-link-icon-light'
import ConnectStepCameraIcon from './assets/connect-step-camera-icon'
import LogoIcon from './assets/defi-link-icon'
import FeatureGlobeIcon from './assets/feature-globe-icon'
import FeatureLinkIcon from './assets/feature-link-icon'
import FeatureLockIcon from './assets/feature-lock-icon'
import { formatToCWEURI, replaceUriProtocol } from './tools/url-tools'
import QRCode from 'qrcode'
import { styles, BannerStyles } from './InstallExtensionModal.styles'

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
    window.open(deepLink)
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
export const InstallExtensionQRCodeModal: IQRCodeModal = {
  open: async function (uri: string, cb: Function, opts) {
    const CWEURI = formatToCWEURI(uri) + '&role=dapp'
    if (isIOS()) {
      const singleLinkHref = formatIOSMobile(CWEURI, iOSRegistryEntry)
      saveMobileLinkInfo({ name: 'Crypto.com DeFi Wallet', href: singleLinkHref })
      openDeeplinkOrInstall(singleLinkHref, downloadAppURL)
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

    const body = document.body
    const popup = document.createElement('div')
    popup.id = 'cryptoconnect-extension'
    body.appendChild(popup)
    try {
      const url = await new Promise<string>((resolve) => QRCode.toDataURL(CWEURI, (_err, url: string) => resolve(url)))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const overlay: any = <InstallExtensionModal qrUrl={url} />
      body.appendChild(overlay)
      const closeModal = (): void => {
        overlay.parentElement?.removeChild(overlay)
        popup.parentElement?.removeChild(popup)
        window.removeEventListener('InstallExtensionQRCodeModal_Event_close', closeModal)
      }
      window.addEventListener('InstallExtensionQRCodeModal_Event_close', closeModal)
      const closeModalClick = (): void => {
        cb()
        closeModal()
      }
      overlay.onclick = closeModalClick
    } catch (error) {
      console.log(error)
    }
  },
  close: function () {
    window.dispatchEvent(new Event('InstallExtensionQRCodeModal_Event_close'))
  },
}

interface InstallExtensionModalProps {
  qrUrl: string
}
export const InstallExtensionModal = (props: InstallExtensionModalProps): JSX.Element => {
  const { qrUrl } = props
  const onInstallButtonClick = (): void => {
    window.open('https://wallet.crypto.com/api/v1/extension/install')
  }
  const onTermsClick = (): void => {
    window.open('https://crypto.com/document/ncw_tnc')
  }
  const onPrivacyClick = (): void => {
    window.open('https://crypto.com/privacy/ncw')
  }
  const onDownloadClick = (): void => {
    window.open('https://bit.ly/3Bk4wzE')
  }
  const stopPropagation = (event: { stopPropagation: () => void }): void => event?.stopPropagation()
  return (
    <div style={styles.overlay}>
      <div style={styles.container} onClick={stopPropagation}>
        <div style={styles.containerLeft}>
          <div style={styles.header}>
            <LogoIcon />
            <div style={styles.headerText}>crypto.com</div>
            <div style={styles.headerTextDivide} />
            <div style={styles.headerText}>WALLET EXTENSION</div>
          </div>
          <div style={styles.title}>Access DApps on desktop by connecting DeFi Wallet to Wallet Extension</div>
          <div style={styles.feature}>
            <FeatureLinkIcon />
            <div style={styles.featureText}>Stable connection to DApps</div>
          </div>
          <div style={styles.feature}>
            <FeatureLockIcon />
            <div style={styles.featureText}>Secure signing via DeFi Wallet</div>
          </div>
          <div style={styles.feature}>
            <FeatureGlobeIcon />
            <div style={styles.featureText}>Smooth App navigation with DApp connection</div>
          </div>
          <button style={styles.installButton} onClick={onInstallButtonClick}>
            Install DeFi Wallet Extension
          </button>
        </div>
        <div style={styles.containerRight}>
          <img style={styles.rightQRcode} src={qrUrl} alt="qrcode" />
          <span style={styles.rightTitle}>Scan to Connect</span>
          <div style={styles.rightStep.container}>
            <div style={styles.rightStep.desc}>• Open DeFi Wallet Mobile App</div>
          </div>
          <div style={styles.rightStep.container}>
            <div style={styles.rightStep.desc}>• Tap</div>
            <ConnectStepCameraIcon style={styles.rightStep.camera} />
            <div style={styles.rightStep.desc}>to switch on the camera</div>
          </div>
          <div style={styles.rightStep.container}>
            <div style={styles.rightStep.desc}>• Scan the QR code above</div>
          </div>
          <div style={styles.stretchContainer} />
          <div style={styles.terms.container}>
            <div style={styles.terms.text}>Crypto.com DeFi Wallet </div>
            <div style={styles.terms.link} onClick={onTermsClick}>
              Terms & Conditions
            </div>
            <div style={styles.terms.text}>and</div>
            <div style={styles.terms.link} onClick={onPrivacyClick}>
              Privacy Notice
            </div>
          </div>
          <DownloadAppBanner onDownloadClick={onDownloadClick} />
        </div>
      </div>
    </div>
  )
}

interface DownloadAppBannerProps {
  onDownloadClick: () => void
}
const DownloadAppBanner = (props: DownloadAppBannerProps): JSX.Element => {
  const { onDownloadClick } = props
  return (
    <div style={BannerStyles.container}>
      <DeFiLinkIconLight />
      <div style={BannerStyles.textContainer}>
        <div style={BannerStyles.title}>Crypto.com DeFi Wallet</div>
        <div style={BannerStyles.desc}>Your Keys, Your Crypto.</div>
      </div>
      <button style={BannerStyles.button} onClick={onDownloadClick}>
        Download
      </button>
    </div>
  )
}
