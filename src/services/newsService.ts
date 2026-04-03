export interface ClimateNewsArticle {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

export async function fetchLocalClimateNews(locationName: string) {
  // 1. EXTRACT JUST THE CITY AND COUNTRY
  const parts = locationName.split(',');
  const shortLocation = parts.length > 1
    ? `${parts[parts.length - 2].trim()} ${parts[parts.length - 1].trim()}`
    : locationName;

  // 2. CREATE A CLEAN QUERY FOR GOOGLE NEWS
  const query = `climate OR weather OR disaster ${shortLocation}`;
  const googleSearchLink = `https://news.google.com/search?q=${encodeURIComponent(query)}`;

  // 3. FETCH THE LIVE NEWS
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&order_by=pubDate&_=${Date.now()}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      return data.items.slice(0, 4).map((item: any) => ({
        title: item.title.split(' - ')[0],
        link: item.link,
        pubDate: new Date(item.pubDate.replace(/-/g, '/')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: item.title.split(' - ')[1] || 'Local News',
      }));
    }
  } catch (e) {
    console.error("News fetch failed", e);
  }

  // 4. THE FALLBACK (GUARANTEES A WORKING LINK TO REAL NEWS)
  return [
    {
      title: `Click here for Live Climate & Weather updates in ${shortLocation}`,
      link: googleSearchLink,
      pubDate: "Live",
      source: "Google News",
    },
  ];
}
