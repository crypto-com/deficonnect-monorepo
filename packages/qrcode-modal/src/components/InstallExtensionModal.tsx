import { h, Component, FunctionComponent } from 'preact'
import DeFiLinkIconLight from '../icons/defi-link-icon-light'
import ConnectStepCameraIcon from '../icons/connect-step-camera-icon'
import LogoIcon from '../icons/defi-link-icon'
import FeatureGlobeIcon from '../icons/feature-globe-icon'
import FeatureLinkIcon from '../icons/feature-link-icon'
import FeatureLockIcon from '../icons/feature-lock-icon'
import { styles, BannerStyles } from './InstallExtensionModal.styles'

interface InstallExtensionModalProps {
  onClose?: Function
}

interface InstallExtensionModalStates {
  visible: boolean
  qrUrl: string
  singleLinkHref: string
}

export class InstallExtensionQRCodeModal extends Component<InstallExtensionModalProps, InstallExtensionModalStates> {
  constructor() {
    super()
    this.state = {
      qrUrl: '',
      visible: false,
      singleLinkHref: '',
    }
  }

  onInstallButtonClick() {
    window.open('https://wallet.crypto.com/api/v1/extension/install')
  }

  onTermsClick() {
    window.open('https://crypto.com/document/defiwallet_tnc')
  }

  onPrivacyClick() {
    window.open('https://crypto.com/privacy/ncw')
  }

  onDownloadClick() {
    window.open('https://bit.ly/3Bk4wzE')
  }

  stopPropagation(event: { stopPropagation: () => void }) {
    if (event?.stopPropagation) {
      event.stopPropagation()
    }
  }

  closeModalClick() {
    const { onClose } = this.props
    if (onClose) {
      onClose()
    }
  }

  closeSingleLinkModal () {
    this.setState({ visible: false })
  }

  render () {
    if (!this.state.visible) {
      return null
    }

    if (this.state.singleLinkHref) {
      return (
        <div style={styles.overlay} onClick={this.closeModalClick.bind(this)}>
          <div style={styles.container} onClick={this.stopPropagation}>
            <div style={styles.deepLinkContainer}>
              <div style={styles.deepLinkHeader}>
                <LogoIcon />
                <div style={styles.headerText}>crypto.com</div>
              </div>
              <div style={styles.btnWrap}>
                <a
                  style={styles.installButton}
                  href={this.state.singleLinkHref}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={this.closeSingleLinkModal.bind(this)}
                >
                  Open DeFi Wallet Mobile App
                </a>
              </div>
              <DownloadAppBanner onDownloadClick={this.onDownloadClick} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="cryptoconnect-extension-modal" style={styles.overlay} onClick={this.closeModalClick.bind(this)}>
        <div style={styles.container} onClick={this.stopPropagation}>
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
            <button style={styles.installButton} onClick={this.onInstallButtonClick}>
              Install DeFi Wallet Extension
            </button>
          </div>
          <div style={styles.containerRight}>
            <img style={styles.rightQRcode} src={this.state.qrUrl || ''} alt="qrcode" />
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
              <div style={styles.terms.link} onClick={this.onTermsClick}>
                Terms & Conditions
              </div>
              <div style={styles.terms.text}>and</div>
              <div style={styles.terms.link} onClick={this.onPrivacyClick}>
                Privacy Notice
              </div>
            </div>
            <DownloadAppBanner onDownloadClick={this.onDownloadClick} />
          </div>
        </div>
      </div>
    )
  }
}

interface DownloadAppBannerProps {
  onDownloadClick: () => void
}
const DownloadAppBanner: FunctionComponent<DownloadAppBannerProps> = (props) => {
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
