import { getHeaderInfo, getUserStats, getTopLanguages } from '@/utils/fetcher';
import { format } from '@/utils/numberFormatter';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// GitHub's actual Primer color tokens, so the card blends into a README
// instead of using this app's own site theme.
const THEMES = {
    dark: {
        bg: '#0d1117',
        text: '#c9d1d9',
        subtext: '#8b949e',
        panel: '#161b22',
        border: '#30363d',
        accent: '#E3561E',
    },
    light: {
        bg: '#ffffff',
        text: '#1f2328',
        subtext: '#656d76',
        panel: '#f6f8fa',
        border: '#d0d7de',
        accent: '#E3561E',
    },
};

const COMPACT_WIDTH = 500;
const COMPACT_BASE_HEIGHT = 315; // avatar/header + stat grid + padding, before any language rows
const COMPACT_LANGUAGE_ROW_HEIGHT = 47;

const WIDE_WIDTH = 830;
const WIDE_HEIGHT_WITH_LANGUAGES = 200;
const WIDE_HEIGHT_NO_LANGUAGES = 150;

function errorCard(message: string, colors: typeof THEMES.dark, width: number, height: number) {
    return new ImageResponse(
        (
            <div
                tw="flex w-full h-full items-center justify-center text-center px-16 text-3xl"
                style={{ background: colors.bg, color: colors.text }}
            >
                {message}
            </div>
        ),
        { width, height }
    );
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const colors = searchParams.get('theme') === 'light' ? THEMES.light : THEMES.dark;
    const wide = searchParams.get('layout') === 'wide';

    if (!username) {
        return errorCard(
            'Missing "username" parameter',
            colors,
            wide ? WIDE_WIDTH : COMPACT_WIDTH,
            wide ? WIDE_HEIGHT_NO_LANGUAGES : COMPACT_BASE_HEIGHT
        );
    }

    const profile = await getHeaderInfo(username);

    if (profile.login === 'NOT FOUND') {
        return errorCard(
            `User "${username}" not found`,
            colors,
            wide ? WIDE_WIDTH : COMPACT_WIDTH,
            wide ? WIDE_HEIGHT_NO_LANGUAGES : COMPACT_BASE_HEIGHT
        );
    }

    const [stats, languages] = await Promise.all([
        getUserStats(username),
        getTopLanguages(username),
    ]);

    const topLanguages = languages.slice(0, 5);
    const otherPercent = Math.max(0, 100 - topLanguages.reduce((sum, lang) => sum + parseFloat(lang.percent), 0));

    const compactStatItems = [
        { label: 'Stars', value: format(stats.stars) },
        { label: 'Total contributions', value: format(stats.totalContributions) },
        { label: 'Total commits', value: format(stats.totalCommits) },
        { label: 'Contributions this year', value: format(stats.contributionsThisYear) },
    ];

    const wideStatItems = [
        { label: 'Stars', value: format(stats.stars) },
        { label: 'Contributions', value: format(stats.totalContributions) },
        { label: 'Commits', value: format(stats.totalCommits) },
        { label: 'This year', value: format(stats.contributionsThisYear) },
    ];

    const headers = {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    };

    if (wide) {
        const height = topLanguages.length > 0 ? WIDE_HEIGHT_WITH_LANGUAGES : WIDE_HEIGHT_NO_LANGUAGES;

        return new ImageResponse(
            (
                <div
                    tw="flex flex-col w-full h-full"
                    style={{ background: colors.bg, color: colors.text, padding: '28px 36px', fontFamily: 'Arial' }}
                >
                    <div tw="flex flex-row items-center" style={{ flex: 1 }}>
                        <img
                            src={profile.avatar_url}
                            alt=""
                            width={72}
                            height={72}
                            style={{ borderRadius: '16px', border: `2px solid ${colors.border}`, marginRight: '24px' }}
                        />
                        <div tw="flex flex-col" style={{ marginRight: '40px', minWidth: '180px' }}>
                            <span tw="text-3xl" style={{ fontWeight: 700 }}>{profile.login}</span>
                            <span tw="text-lg" style={{ color: colors.accent }}>GitHub Stats</span>
                        </div>

                        <div tw="flex flex-row" style={{ flex: 1, gap: '32px', borderLeft: `1px solid ${colors.border}`, paddingLeft: '40px' }}>
                            {wideStatItems.map((item) => (
                                <div key={item.label} tw="flex flex-col" style={{ flex: 1 }}>
                                    <span tw="text-2xl" style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{item.value}</span>
                                    <span tw="text-base" style={{ color: colors.subtext, whiteSpace: 'nowrap' }}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {topLanguages.length > 0 && (
                        <div tw="flex flex-col" style={{ marginTop: '20px' }}>
                            <div
                                tw="flex w-full flex-row overflow-hidden"
                                style={{ height: '10px', borderRadius: '6px', background: colors.panel }}
                            >
                                {topLanguages.map((lang) => (
                                    <div key={lang.name} style={{ width: `${lang.percent}%`, background: lang.color, height: '100%' }} />
                                ))}
                                {otherPercent > 0.5 && (
                                    <div style={{ width: `${otherPercent}%`, background: colors.border, height: '100%' }} />
                                )}
                            </div>
                            <div tw="flex flex-row" style={{ marginTop: '12px' }}>
                                {topLanguages.map((lang) => (
                                    <div key={lang.name} tw="flex flex-row items-center text-base" style={{ marginRight: '24px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '5px', background: lang.color, marginRight: '8px' }} />
                                        <span>{lang.name} {lang.percent}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ),
            { width: WIDE_WIDTH, height, headers }
        );
    }

    const height = COMPACT_BASE_HEIGHT + topLanguages.length * COMPACT_LANGUAGE_ROW_HEIGHT;

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
                    {compactStatItems.map((item) => (
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
        { width: COMPACT_WIDTH, height, headers }
    );
}
