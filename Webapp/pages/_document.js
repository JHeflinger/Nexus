import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head >
                <meta
                    name="description"
                    content="A site for demonstrating use of _document file" />
                <meta
                    http-equiv="Content-Type"
                    content="text/html;charset=UTF-8" />
                <meta
                    name="author"
                    content="Jacob Consalvi, Jason Heflinger" />
                <meta
                    name="keywords"
                    content="FillOut" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,200,300,400,500,600,700"></link>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"></link>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
                <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.13.0/css/all.css"></link>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}