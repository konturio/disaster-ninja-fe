const apis = [
  {
    id: 'api/events',
    fetcher: () =>
      fetch(
        'https://test-apps-ninja01.konturlabs.com/active/api/events/?feed=kontur-public',
        {
          credentials: 'include',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0',
            Accept: 'application/json',
            'Accept-Language': 'en-US,en;q=0.5',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
          },
          referrer:
            'https://test-apps-ninja01.konturlabs.com/active/?map=6.610/12.282/121.356&app=58851b50-9574-4aec-a3a6-425fa18dcb54&event=078df105-2d7d-474a-82ce-8bf0ecdc91d3&feed=kontur-public&layers=BIV__Kontur+OpenStreetMap+Quantity%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cfocused-geometry',
          method: 'GET',
          mode: 'cors',
        },
      ),
  },
  {
    id: 'event',
    fetcher: () => fetch("https://test-apps-ninja01.konturlabs.com/active/api/events/kontur-public/078df105-2d7d-474a-82ce-8bf0ecdc91d3", {
      "credentials": "include",
      "headers": {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0",
          "Accept": "application/json",
          "Accept-Language": "en-US,en;q=0.5",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin"
      },
      "referrer": "https://test-apps-ninja01.konturlabs.com/active/?map=6.610/12.282/121.356&app=58851b50-9574-4aec-a3a6-425fa18dcb54&event=078df105-2d7d-474a-82ce-8bf0ecdc91d3&feed=kontur-public&layers=BIV__Kontur+OpenStreetMap+Quantity%2CactiveContributors%2CeventShape%2ChotProjects_outlines%2Cfocused-geometry",
      "method": "GET",
      "mode": "cors"
  })
  }
];

async function measure({ id, fetcher }) {
  const t0 = performance.now();
  const result = {
    id,
    responseTime: 0,
    status: 'unknown',
  };
  try {
    const response = await fetcher();
    result.status = response.status;
  } catch (e) {
    result.status = e.message || e;
  } finally {
    const diff = performance.now() - t0;
    result.responseTime =
      diff > 1000 ? `${Math.floor(diff / 1000)} s` : `${Math.floor(diff)} ms`;
    return result;
  }
}

function wait(time) {
  return new Promise((r) => setTimeout(r, time));
}

async function testApis(apis, timeout = 10000) {
  while (true) {
    const results = await Promise.allSettled(apis.map(measure));
    updateTable(results.map((r) => r.value));
    await wait(timeout);
  }
}

function alignCols(cols, rightAlignment = false) {
  const max = cols.reduce((acc, col) => Math.max(acc, col.length), 0);
  const pad = rightAlignment
    ? (str) => String(str).padStart(max)
    : (str) => String(str).padEnd(max);
  return cols.map((col) => pad(col));
}

function updateTable(results) {
  let cols = [['id'], ['time'], ['status']];
  results.forEach((r) => {
    cols[0].push(r.id);
    cols[1].push(r.responseTime);
    cols[2].push(r.status);
  });
  cols = cols.map((c) => alignCols(c));

  const rows = [];
  cols.forEach((col, i) => {
    col.forEach((c, k) => {
      if (i === 0) {
        rows.push([c]);
      } else {
        rows[k].push(c);
      }
    });
  });

  rows.forEach((r) => {
    console.log(r.join('  |  '));
  });
  console.log('--- --- ---');
}

testApis(apis);
