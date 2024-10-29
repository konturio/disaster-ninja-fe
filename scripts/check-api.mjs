const apis = [];

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
