import { getHeaderInfo } from '@/utils/fetcher';
import { ImageResponse } from 'next/og';

export const runtime = "edge";

export const alt = 'GitHub Stats OG card';

export const size = {
    width: 1200,
    height: 630,
}

export const contentType = "image/png";

// Image generation
export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    const hasUsername = searchParams.has("username");

    let text: string = "GitHub Stats";

    if (hasUsername) {
        const { login } = await getHeaderInfo(searchParams.get("username"));
        if (login != "NOT FOUND") {
            text = login.slice(1) + "'s GitHub Stats";
        }
    }

    return new ImageResponse(
        (
            <div
                tw='text-8xl bg-[#181818] text-[#E3E3E3] flex flex-row gap-4 items-center justify-center w-full h-full'
                style={{ gap: '20px', padding: '150px' }}
            >
                <span tw='text-center'>{text}</span>
            </div>
        ),
        {
            ...size,
        }
    )
}