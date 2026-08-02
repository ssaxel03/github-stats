import { getHeaderInfo, getUserStats, getTopLanguages } from '@/utils/fetcher';
import { format } from '@/utils/numberFormatter';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const WIDTH = 500;
const BASE_HEIGHT = 315; // avatar/header + stat grid + padding, before any language rows
const LANGUAGE_ROW_HEIGHT = 47;

const THEMES = {
    dark: {
        bg: '#181818',
        text: '#E3E3E3',
        subtext: '#A3A3A3',
        panel: '#383838',
        border: '#282828',
        accent: '#E3561E',
    },
    light: {
        bg: '#E3E3E3',
        text: '#181818',
        subtext: '#5A5A5A',
        panel: '#FFFFFF',
        border: '#181818',
        accent: '#E3561E',
    },
};

function errorCard(message: string, colors: typeof THEMES.dark) {
    return new ImageResponse(
        (
            <div
                tw="flex w-full h-full items-center justify-center text-center px-16 text-3xl"
                style={{ background: colors.bg, color: colors.text }}
            >
                {message}
            </div>
        ),
        { width: WIDTH, height: BASE_HEIGHT }
    );
}

// Renders a README-embeddable stats card for a given GitHub user
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const colors = searchParams.get('theme') === 'light' ? THEMES.light : THEMES.dark;

    if (!username) {
        return errorCard('Missing "username" parameter', colors);
    }

    const profile = await getHeaderInfo(username);

    if (profile.login === 'NOT FOUND') {
        return errorCard(`User "${username}" not found`, colors);
    }

    const [stats, languages] = await Promise.all([
        getUserStats(username),
        getTopLanguages(username),
    ]);

    const topLanguages = languages.slice(0, 5);
    const height = BASE_HEIGHT + topLanguages.length * LANGUAGE_ROW_HEIGHT;

    const statItems = [
        { label: 'Stars', value: format(stats.stars) },
        { label: 'Total contributions', value: format(stats.totalContributions) },
        { label: 'Total commits', value: format(stats.totalCommits) },
        { label: 'Contributions this year', value: format(stats.contributionsThisYear) },
    ];

    return new ImageResponse(
        (
            <div
                tw="flex flex-col w-full h-full"
                style={{ background: colors.bg, color: colors.text, padding: '32px', fontFamily: 'Arial' }}
            >
                <div tw="flex flex-row items-center">
                    <img
                        src={profile.avatar_url}
                        alt=""
                        width={64}
                        height={64}
                        style={{ borderRadius: '16px', border: `2px solid ${colors.border}`, marginRight: '20px' }}
                    />
                    <div tw="flex flex-col">
                        <span tw="text-3xl" style={{ fontWeight: 700 }}>{profile.login}</span>
                        <span tw="text-xl" style={{ color: colors.accent }}>GitHub Stats</span>
                    </div>
                </div>

                <div tw="flex flex-row flex-wrap" style={{ marginTop: '28px' }}>
                    {statItems.map((item) => (
                        <div key={item.label} tw="flex flex-col" style={{ width: '50%', marginBottom: '20px' }}>
                            <span tw="text-2xl" style={{ fontWeight: 700 }}>{item.value}</span>
                            <span tw="text-lg" style={{ color: colors.subtext }}>{item.label}</span>
                        </div>
                    ))}
                </div>

                {topLanguages.length > 0 && (
                    <div tw="flex flex-col" style={{ marginTop: '4px' }}>
                        {topLanguages.map((lang) => (
                            <div key={lang.name} tw="flex flex-col" style={{ marginBottom: '10px' }}>
                                <div tw="flex flex-row justify-between text-lg" style={{ marginBottom: '4px' }}>
                                    <span>{lang.name}</span>
                                    <span>{lang.percent}%</span>
                                </div>
                                <div
                                    tw="flex w-full overflow-hidden"
                                    style={{ height: '10px', borderRadius: '6px', background: colors.panel }}
                                >
                                    <div style={{ width: `${lang.percent}%`, background: lang.color, borderRadius: '6px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ),
        {
            width: WIDTH,
            height,
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        }
    );
}
