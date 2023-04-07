import '../styles/global.scss';
import "../scripts/_global.jsx";

export default function App({ Component, pageProps }) {
    return(<Component {...pageProps} />);
}