/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
import '@types/chrome'
declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

type SvgrComponent = React.StatelessComponent<React.SVGAttributes<SVGElement>>

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}
declare global {
  interface Window {
    ethereum?: any
    cryptoconnectProviderGenerator?: (any: any) => Promise<WalletConnectProvider>
    deficonnectProviderGenerator?: (any: any) => Promise<WalletConnectProvider | DeFiCosmosProvider>
    cryptoconnectExtensionProvider?: any
  }
}
