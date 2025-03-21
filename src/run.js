export async function run(input) {
  const throw_on_failure = input.throw_on_failure || true;
  const [text, bin, json] = await Promise.all([
    load_text(input.text, throw_on_failure),
    load_bin(input.bin, throw_on_failure),
    load_json(input.json, throw_on_failure),
  ]);

  return { text, bin_encoded: bin, json };
}

async function load_urls(urls, process_response, throw_on_failure) {
  if (!urls) {
    return {};
  }

  const promises = Object.entries(urls).map(async ([name, url]) => {
    const response = await fetch(url);
    let body;
    if (response.ok) {
      body = await process_response(response);
    }
    else {
      console.error(`Failed to fetch ${url} with status ${response.status}`);
      body = await response.text();
      console.error(`Response body for ${url}: ${body}`);
      if (throw_on_failure) {
        throw new Error(`Failed to fetch ${url} with status ${response.status}`);
      }
    }
    return [
      name,
      {
        ok: response.ok,
        status: response.status,
        body,
      }
    ];
  });

  let results = await Promise.all(promises);

  return Object.fromEntries(results);
}

async function load_text(urls, throw_on_failure) {
  return await load_urls(urls, async (response) => {
    return await response.text();
  }, throw_on_failure);
}

async function load_bin(urls, throw_on_failure) {
  return await load_urls(urls, async (response) => {
    let bytes = await response.bytes();
    let encoded = slipway_host.encode_bin(bytes);
    return encoded;
  }, throw_on_failure);
}

async function load_json(urls, throw_on_failure) {
  return await load_urls(urls, async (response) => {
    return await response.json();
  }, throw_on_failure);
}