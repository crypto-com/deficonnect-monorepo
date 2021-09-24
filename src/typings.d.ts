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
    deficonnectClientGenerator?: (config: DeFiConnectorArguments) => Promise<DeFiConnectorClient>
    deficonnectProviderGenerator?: (params: {
      chainId: string | number
      networkId: string | number
      config: DeFiConnectorArguments
    }) => Promise<WalletConnectProvider | DeFiCosmosProvider>
  }
}
