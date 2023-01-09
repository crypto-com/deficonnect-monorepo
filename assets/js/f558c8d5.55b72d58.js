"use strict";(self.webpackChunkdeficonnect_monorepo_docs=self.webpackChunkdeficonnect_monorepo_docs||[]).push([[2758],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),s=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=s(e.components);return r.createElement(l.Provider,{value:t},e.children)},d="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,c=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=s(n),u=o,m=d["".concat(l,".").concat(u)]||d[u]||f[u]||c;return n?r.createElement(m,a(a({ref:t},p),{},{components:n})):r.createElement(m,a({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var c=n.length,a=new Array(c);a[0]=u;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[d]="string"==typeof e?e:o,a[1]=i;for(var s=2;s<c;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6243:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>c,metadata:()=>i,toc:()=>s});var r=n(7462),o=(n(7294),n(3905));const c={title:"Connect",sidebar_position:4},a="Connect",i={unversionedId:"defi-wallet/web-sdk/connect",id:"defi-wallet/web-sdk/connect",title:"Connect",description:"",source:"@site/docs/defi-wallet/web-sdk/connect.md",sourceDirName:"defi-wallet/web-sdk",slug:"/defi-wallet/web-sdk/connect",permalink:"/deficonnect-monorepo/docs/defi-wallet/web-sdk/connect",draft:!1,editUrl:"https://github.com/crypto-com/deficonnect-monorepo/tree/develop/docs/defi-wallet/web-sdk/connect.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"Connect",sidebar_position:4},sidebar:"defiWalletSidebar",previous:{title:"Setup",permalink:"/deficonnect-monorepo/docs/defi-wallet/web-sdk/setup"},next:{title:"Send Transaction & RPC Called",permalink:"/deficonnect-monorepo/docs/defi-wallet/web-sdk/send-transaction"}},l={},s=[],p={toc:s};function d(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"connect"},"Connect"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import Web3 from "web3";\n\nasync function connect() {\n  await connector.activate();\n  const provider = await connector.getProvider();\n  web3 = new Web3(provider);\n  accounts = await web3.eth.getAccounts();\n}\n')))}d.isMDXComponent=!0}}]);