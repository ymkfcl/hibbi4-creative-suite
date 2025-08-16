"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const head_1 = __importDefault(require("next/head"));
const react_1 = require("react");
function App({ Component, pageProps }) {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }
    return (<>
      <head_1.default>
        <title>HIBBI4 Creative Suite - Outils créatifs IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
      </head_1.default>
      <Component {...pageProps}/>
    </>);
}
exports.default = App;
