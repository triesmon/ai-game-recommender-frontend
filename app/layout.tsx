import React from "react";
import './pages/App.css';
import {ContextProvider} from "@/app/search/contextProviderProps";
import Header from "@/app/components/header/header";
import {Metadata} from "next";

export const metadata : Metadata = {
    openGraph: {
        url: 'https://steam.jamiesalts.com',
        siteName: 'steam.jamiesalts.com',
        title: 'Steam Game Recommender',
        description: 'Find similar games to your favorites on Steam',
        images: 'https://steam.jamiesalts.com/logo.png'
    }
}

export default function RootLayout({children}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">

        <body className={"app"}>
            <ContextProvider>
                <Header></Header>
                {children}
            </ContextProvider>
        </body>
        </html>
    )
}
