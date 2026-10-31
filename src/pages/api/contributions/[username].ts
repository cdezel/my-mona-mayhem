import type { APIRoute } from 'astro';

export const prerender = false;

const CACHE_TTL_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 10 * 1000;
const MAX_CACHE_ENTRIES = 500;
const cache = new Map<string, { expiresAt: number; data: unknown }>();

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};
const successHeaders = {
	...corsHeaders,
	'Cache-Control': 'public, max-age=300, s-maxage=300',
};

const jsonError = (message: string, status: number) =>
	Response.json(
		{ error: message },
		{
			status,
			headers: { ...corsHeaders, 'Cache-Control': 'no-store' },
		},
	);

const jsonSuccess = (data: unknown) => Response.json(data, { headers: successHeaders });

export const OPTIONS: APIRoute = async () =>
	new Response(null, {
		status: 204,
		headers: {
			...corsHeaders,
			'Access-Control-Max-Age': '86400',
		},
	});

export const GET: APIRoute = async ({ params }) => {
	const username = params.username;
	if (
		!username ||
		username.length > 39 ||
		!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9]))*$/.test(username)
	) {
		return jsonError('Invalid GitHub username.', 400);
	}

	const cacheKey = username.toLowerCase();
	const cached = cache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) {
		return jsonSuccess(cached.data);
	}
	if (cached) cache.delete(cacheKey);

	const url = new URL(`${encodeURIComponent(username)}.contribs`, 'https://github.com');
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const upstream = await fetch(url, {
			headers: { Accept: 'application/json' },
			signal: controller.signal,
		});

		if (upstream.status === 404) {
			return jsonError('GitHub user not found.', 404);
		}
		if (!upstream.ok) {
			return jsonError('GitHub could not provide contribution data.', 502);
		}

		let data: unknown;
		try {
			data = await upstream.json();
		} catch {
			if (controller.signal.aborted) {
				return jsonError('GitHub contribution request timed out.', 504);
			}
			return jsonError('GitHub returned an invalid response.', 502);
		}

		cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
		if (cache.size > MAX_CACHE_ENTRIES) {
			const oldestKey = cache.keys().next().value;
			if (oldestKey) cache.delete(oldestKey);
		}
		return jsonSuccess(data);
	} catch {
		if (controller.signal.aborted) {
			return jsonError('GitHub contribution request timed out.', 504);
		}
		return jsonError('Unable to fetch contribution data from GitHub.', 502);
	} finally {
		clearTimeout(timeoutId);
	}
};
