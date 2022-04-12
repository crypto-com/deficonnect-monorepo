import * as CSS from 'csstype'
type CSSProperties = CSS.Properties<string | number>

export const styles: {
  overlay: CSSProperties
  container: CSSProperties
  containerLeft: CSSProperties
  containerRight: CSSProperties
  header: CSSProperties
  headerLogo: CSSProperties
  headerText: CSSProperties
  headerTextDivide: CSSProperties
  title: CSSProperties
  feature: CSSProperties
  featureIcon: CSSProperties
  featureText: CSSProperties
  installButton: CSSProperties
  rightQRcode: CSSProperties
  rightTitle: CSSProperties
  stretchContainer: CSSProperties
  terms: {
    container: CSSProperties
    text: CSSProperties
    link: CSSProperties
  }
  rightStep: {
    container: CSSProperties
    dot: CSSProperties
    desc: CSSProperties
    camera: CSSProperties
  }
} = {
  overlay: {
    background: 'rgba(12, 12, 15, 0.7)',
    display: 'flex',
    position: 'fixed',
    zIndex: 2,
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
  containerLeft: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '40px',
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
    marginTop: '40px',
    height: '48px',
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
  containerRight: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'stretch',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    width: '360px',
    height: '497px',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  rightQRcode: {
    flexGrow: 0,
    marginTop: '48px',
    width: '160px',
    height: '160px',
    filter: 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.16))',
    borderRadius: '8px',
  },
  rightTitle: {
    fontWeight: 600,
    fontSize: '22px',
    color: '#323C52',
    margin: '32px 0px 8px 0px',
  },
  stretchContainer: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
  },
  rightStep: {
    container: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '8px',
      alignSelf: 'flex-start',
      marginLeft: '46px',
    },
    dot: {},
    desc: {
      fontSize: '16px',
      color: '#5D667B',
    },
    camera: {
      margin: '0px 8px',
    },
  },
  terms: {
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'stretch',
      justifyContent: 'center',
      marginBottom: '16px',
    },
    text: {
      fontSize: '10px',
      color: '#5D667B',
    },
    link: {
      fontSize: '10px',
      color: '#4399F3',
      margin: '0px 4px',
      cursor: 'pointer',
    },
  },
}

export const BannerStyles: {
  container: CSSProperties
  logoIcon: CSSProperties
  textContainer: CSSProperties
  title: CSSProperties
  desc: CSSProperties
  button: CSSProperties
} = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'white',
  },
  logoIcon: {
    width: '30px',
    height: '30px',
    padding: '5px',
    backgroundColor: 'white',
    filter: 'drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.16))',
    borderRadius: '6px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  title: {
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '150%',
    color: '#323C52',
  },
  desc: {
    fontWeight: 500,
    fontSize: '10px',
    lineHeight: '150%',
    color: '#7B849B',
  },
  button: {
    width: '75px',
    height: '34px',
    background: '#1199FA',
    border: '0px solid white',
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '12px',
    color: '#FFFFFF',
    marginRight: '12px',
    cursor: 'pointer',
    zIndex: 1001,
  },
}
