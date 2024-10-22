import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

export type Repo = {
    name: string
    stargazers_count: number
}

export const getServerSideProps = (async () => {
    const res = await fetch('https://api.github.com/repos/vercel/next.js')
    const repo = await res.json()
    console.log(repo)
    return { props: { repo } }
}) satisfies GetServerSideProps<{
    repo: Repo
}>

export default function DataProvider({
                                 repo,
                             }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return repo.stargazers_count
}