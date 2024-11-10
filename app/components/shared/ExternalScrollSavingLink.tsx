import React from 'react';
import {useSearchContext} from "@/app/page";
import SteamLogo from '../../../public/steam.svg';
import Image from 'next/image';
import {Button} from "@mui/material";


type ExternalLinkProps = {
    scrollTo: number;
    href: string;
    children: React.ReactNode;
};

export const ExternalScrollSavingLink: React.FC<ExternalLinkProps> = ({ href, children, scrollTo }) => {

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        // save scroll position to local storage
        localStorage.setItem('scrollTo', scrollTo.toString());

        window.location.href = href;
    };

    return (
        <>
            <Button variant={'outlined'} href={href} onClick={handleClick}>
                <Image height={20} src={SteamLogo} alt={'steampowered.com'}></Image>
                {children}
            </Button>
        </>

    );
};

