import type { h } from 'preact'
type CSSProperties = h.JSX.CSSProperties

export const styles: {
  overlay: CSSProperties
  container: CSSProperties
  deepLinkContainer: CSSProperties
  closeBtn: CSSProperties
  deepLinkHeader: CSSProperties
  deepLinkBody: CSSProperties
  deepLinkTips: CSSProperties
  linkBtn: CSSProperties
  btnWrap: CSSProperties
  containerLeft: CSSProperties
  header: CSSProperties
  headerLogo: CSSProperties
  headerText: CSSProperties
  headerTextDivide: CSSProperties
  title: CSSProperties
  feature: CSSProperties
  featureIcon: CSSProperties
  featureText: CSSProperties
  installButton: CSSProperties
} = {
  overlay: {
    background: 'rgba(12, 12, 15, 0.7)',
    display: 'flex',
    position: 'fixed',
    zIndex: 3,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '80px',
    background: 'linear-gradient(180deg, #021E3F 0%, #002A67 95.76%)',
    borderRadius: '16px',
    maxWidth: '1100px',
    overflow: 'hidden',
  },
  deepLinkContainer: {
    margin: '-80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: '#ffffff',
    borderRadius: '8px',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px'
  },
  deepLinkHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '52px',
    marginBottom: '32px',
  },
  deepLinkBody: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  deepLinkTips: {
    width: '300px',
    display: 'block',
    textAlign: 'center',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    margin: '0 auto',
    color: '#808C99'
  },
  linkBtn: {
    display: 'block',
    fontWeight: 600,
    lineHeight: '20px',
    color: '#1199FA',
    textAlign: 'center',
    marginBottom: '24px'
  },
  btnWrap: {
    display: 'flex',
    justifyContent: 'center',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '24px',
  },
  containerLeft: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 1,
    minWidth: '450px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerLogo: {},
  headerText: {
    color: '#828FA1',
    margin: '10px',
  },
  headerTextDivide: {
    backgroundColor: '#828FA1',
    width: '1px',
    height: '32px',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '28px',
    marginTop: '24px',
    marginBottom: '16px',
    maxWidth: '500px',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: '24px',
  },
  featureIcon: {},
  featureText: {
    marginLeft: '16px',
    color: '#FFFFFF',
    fontWeight: 600,
    fontSize: '16px',
  },
  installButton: {
    display: 'inline-block',
    textDecoration: 'none',
    marginTop: '40px',
    height: '48px',
    lineHeight: '48px',
    background: '#1199FA',
    borderRadius: '8px',
    padding: '0px 36px',
    border: '0px solid white',
    fontWeight: 600,
    fontSize: '18px',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    cursor: 'pointer',
    zIndex: 1001,
  },
}