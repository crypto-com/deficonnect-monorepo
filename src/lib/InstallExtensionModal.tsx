import React, { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import ReactModal from 'react-modal'
import CryptoWalletIconLight from './assets/crypto-wallet-icon-light'
import ConnectStepCameraIcon from './assets/connect-step-camera-icon'
import LogoIcon from './assets/crypto-wallet-icon'
import FeatureGlobeIcon from './assets/feature-globe-icon'
import FeatureLinkIcon from './assets/feature-link-icon'
import FeatureLockIcon from './assets/feature-lock-icon'
import { formatToCWEURI } from './tools'
import QRCode from 'qrcode'
import { styles, BannerStyles } from './InstallExtensionModal.styles'
import { IQRCodeModal } from '@walletconnect/types'
import ReactDOM from 'react-dom'

export const InstallExtensionQRCodeModal: IQRCodeModal = {
  open: (uri: string, cb: Function, opts?: any): void => {
    const body = document.body
    const popup = document.createElement('div')
    popup.id = 'cryptoconnect-extension'
    body.appendChild(popup)
    ReactDOM.render(<InstallExtensionModal appElement={popup} uri={uri} closeCallback={cb} />, popup)
  },
  close: () => {
    window.dispatchEvent(new Event('InstallExtensionQRCodeModal_Event_close'))
  },
}

export const InstallExtensionModal = ({
  appElement,
  uri,
  closeCallback,
}: {
  appElement: HTMLElement
  uri: string
  closeCallback: Function
}) => {
  const [isOpen, setisOpen] = useState(true)
  const [qrcodeImageURL, setQRCodeImageURL] = useState('')
  ReactModal.setAppElement(appElement)
  const closeModal = useCallback(() => {
    closeCallback()
    appElement.parentElement?.removeChild(appElement)
    setisOpen(false)
  }, [appElement])
  const junpToInstallExtenson = useCallback(
    (event) => {
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      // appElement.parentElement?.removeChild(appElement)
      // setisOpen(false)
    },
    [appElement]
  )
  useEffect(() => {
    window.addEventListener('InstallExtensionQRCodeModal_Event_close', closeModal)
    return () => {
      window.removeEventListener('InstallExtensionQRCodeModal_Event_close', closeModal)
    }
  }, [closeModal])
  const overlayRef = useCallback(
    (instance: HTMLDivElement) => {
      if (instance) {
        // instance.onclick = closeModal
      }
    },
    [appElement]
  )
  useMemo(() => {
    const dappQRCode = formatToCWEURI(uri) + '&role=dapp'
    QRCode.toDataURL(dappQRCode, (_err: any, url: string) => {
      setQRCodeImageURL(url)
    })
  }, [uri])

  return (
    <ReactModal
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      shouldFocusAfterRender
      shouldReturnFocusAfterClose
      style={{
        content: {
          background: '#00000000',
          border: 'none',
          margin: '40px',
          display: 'flex',
          position: 'relative',
          padding: '0px',
        },
        overlay: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(12, 12, 15, 0.7)',
          zIndex: 1000,
        },
      }}
      onRequestClose={closeModal}
    >
      <div style={styles.container}>
        <div style={styles.containerLeft}>
          <div style={styles.header}>
            <LogoIcon />
            <div style={styles.headerText}>crypto.com</div>
            <div style={styles.headerTextDivide} />
            <div style={styles.headerText}>WALLET EXTENSION</div>
          </div>
          <div style={styles.title}>Connect your DeFi Wallet app with the Wallet Extension to access the DApps</div>
          <div style={styles.feature}>
            <FeatureLinkIcon />
            <div style={styles.featureText}>Stable connection with the DApps</div>
          </div>
          <div style={styles.feature}>
            <FeatureLockIcon />
            <div style={styles.featureText}>Secure signing on the DeFi Wallet</div>
          </div>
          <div style={styles.feature}>
            <FeatureGlobeIcon />
            <div style={styles.featureText}>Smooth app navigation with DApp connection</div>
          </div>
          <button style={styles.installButton} onClick={junpToInstallExtenson}>
            Install DeFi Wallet Extension
          </button>
        </div>
        <div style={styles.containerRight}>
          <img style={styles.rightQRcode} src={qrcodeImageURL} alt="cryptolink" />
          <span style={styles.rightTitle}>Scan to connect</span>
          <div style={styles.rightStep.container}>
            {/* <div style={styles.rightStep.dot} /> */}
            <div style={styles.rightStep.desc}>• Open DeFi Wallet mobile app</div>
          </div>
          <div style={styles.rightStep.container}>
            {/* <div style={styles.rightStep.dot} /> */}
            <div style={styles.rightStep.desc}>• Find the</div>
            <ConnectStepCameraIcon style={styles.rightStep.camera} />
            <div style={styles.rightStep.desc}>to open the camera</div>
          </div>
          <div style={styles.rightStep.container}>
            {/* <div style={styles.rightStep.dot} /> */}
            <div style={styles.rightStep.desc}>• Scan the above QR code</div>
          </div>
          <div style={styles.stretchContainer} />
          <div style={styles.terms.container}>
            <div style={styles.terms.text}>Crypto.com DeFi Wallet </div>
            <div
              style={styles.terms.link}
              onClick={() => {
                window.open('https://crypto.com/document/ncw_tnc')
              }}
            >
              Terms & Conditions
            </div>
            <div style={styles.terms.text}>and</div>
            <div
              style={styles.terms.link}
              onClick={() => {
                window.open('https://crypto.com/privacy/ncw')
              }}
            >
              Privacy Notice
            </div>
          </div>
          <DownloadAppBanner onDownloadClick={junpToInstallExtenson} />
        </div>
      </div>
    </ReactModal>
  )
}

const DownloadAppBanner = ({ onDownloadClick }: { onDownloadClick: MouseEventHandler }) => {
  return (
    <div style={BannerStyles.container}>
      <CryptoWalletIconLight />
      <div style={BannerStyles.textContainer}>
        <div style={BannerStyles.title}>Crypto.com Wallet Extension</div>
        <div style={BannerStyles.desc}>Your Keys, Your Crypto.</div>
      </div>
      <button style={BannerStyles.button} onClick={onDownloadClick}>
        Download
      </button>
    </div>
  )
}
