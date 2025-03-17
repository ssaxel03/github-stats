import { getHeaderInfo } from '@/utils/fetcher';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises'
import { join } from 'path';

export const runtime = 'edge'; // Enables edge rendering for performance

export const alt = 'GitHub Stats OG card';
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = "image/png";

// Image generation
export default async function Image({params} : {params: {username: string}}) {

    const user = await getHeaderInfo(params.username);

    // Font loading, process.cwd() is Next.js project directory
    const interSemiBold = await readFile(
        join(process.cwd(), 'assets/Inter-SemiBold.ttf')
    )

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 84,
                    background: '#181818',
                    color: '#E3E3E3',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '15px',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img style={{width: '85px', height: '85px'}} src={user.avatar_url} alt="GitHub Stats Icon" />
                <span>{user.login}&apos;s GitHub Stats</span>
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: 'Inter',
                    data: interSemiBold,
                    style: 'normal',
                    weight: 400,
                },
            ],
        }
    )
}