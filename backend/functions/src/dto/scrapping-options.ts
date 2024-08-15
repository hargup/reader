import { Also, AutoCastable, Prop, AutoCastableMetaClass, Constructor } from 'civkit'; // Adjust the import based on where your decorators are defined
import type { Request, Response } from 'express';
import type { CookieParam } from 'puppeteer';
import { parseString as parseSetCookieString } from 'set-cookie-parser';


@Also({
    openapi: {
        operation: {
            parameters: {
                'Accept': {
                    description: `Specifies your preference for the response format.\n\n` +
                        `Supported formats: \n` +
                        `- text/event-stream\n` +
                        `- application/json or text/json\n` +
                        `- text/plain`
                    ,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Cache-Tolerance': {
                    description: `Sets internal cache tolerance in seconds if this header is specified with a integer.`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-No-Cache': {
                    description: `Ignores internal cache if this header is specified with a value.\n\nEquivalent to X-Cache-Tolerance: 0`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Respond-With': {
                    description: `Specifies the (non-default) form factor of the crawled data you prefer.\n\n` +
                        `Supported formats: \n` +
                        `- markdown\n` +
                        `- html\n` +
                        `- text\n` +
                        `- pageshot\n` +
                        `- screenshot\n`
                    ,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Wait-For-Selector': {
                    description: `Specifies a CSS selector to wait for the appearance of such an element before returning.\n\n` +
                        'Example: `X-Wait-For-Selector: .content-block`\n'
                    ,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Target-Selector': {
                    description: `Specifies a CSS selector for return target instead of the full html.\n\n` +
                        'Implies `X-Wait-For-Selector: (same selector)`'
                    ,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Remove-Selector': {
                    description: `Specifies a CSS selector to remove elements from the full html.\n\n` +
                        'Example `X-Remove-Selector: nav`'
                    ,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Keep-Img-Data-Url': {
                    description: `Keep data-url as it instead of transforming them to object-url. (Only applicable when targeting markdown format)\n\n` +
                        'Example `X-Keep-Img-Data-Url: true`'
                    ,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Proxy-Url': {
                    description: `Specifies your custom proxy if you prefer to use one.\n\n` +
                        `Supported protocols: \n` +
                        `- http\n` +
                        `- https\n` +
                        `- socks4\n` +
                        `- socks5\n\n` +
                        `For authentication, https://user:pass@host:port`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Set-Cookie': {
                    description: `Sets cookie(s) to the headless browser for your request. \n\n` +
                        `Syntax is the same with standard Set-Cookie`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-With-Generated-Alt': {
                    description: `Enable automatic alt-text generating for images without an meaningful alt-text.\n\n` +
                        `Note: Does not work when \`X-Respond-With\` is specified`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-With-Images-Summary': {
                    description: `Enable dedicated summary section for images on the page.`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-With-links-Summary': {
                    description: `Enable dedicated summary section for hyper links on the page.`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-User-Agent': {
                    description: `Override User-Agent.`,
                    in: 'header',
                    schema: { type: 'string' }
                },
                'X-Timeout': {
                    description: `Specify timeout in seconds. Max 180.`,
                    in: 'header',
                    schema: { type: 'string' }
                },
            }
        }
    }
})
export class CrawlerOptions extends AutoCastable implements AutoCastableMetaClass {

    @Prop()
    url?: string;

    @Prop()
    html?: string;

    @Prop({
        default: 'default',
    })
    respondWith!: string;

    @Prop({
        default: false,
    })
    withGeneratedAlt!: boolean;

    @Prop({
        default: false,
    })
    withLinksSummary!: boolean;

    @Prop({
        default: false,
    })
    withImagesSummary!: boolean;

    @Prop({
        default: false,
    })
    noCache!: boolean;

    @Prop()
    cacheTolerance?: number;

    @Prop({ arrayOf: String })
    targetSelector?: string | string[];

    @Prop({ arrayOf: String })
    waitForSelector?: string | string[];

    @Prop({ arrayOf: String })
    removeSelector?: string | string[];

    @Prop({
        default: false,
    })
    keepImgDataUrl!: boolean;

    @Prop({
        default: false,
    })
    withIframe!: boolean;

    @Prop({
        arrayOf: String,
    })
    setCookies?: CookieParam[];

    @Prop()
    proxyUrl?: string;

    @Prop()
    userAgent?: string;

    @Prop({
        validate: (v: number) => v > 0 && v <= 180,
        type: Number,
        nullable: true,
    })
    timeout?: number | null;

    static override from<T extends CrawlerOptions>(this: Constructor<T>, input: any, ...args: any[]): T {
        const instance = super.from(input, ...args) as T;
        const req = args[0] as Request | undefined;

        if (req) {
            console.log('Request headers:', req.headers);

            const getHeader = (name: string): string | undefined => {
                const value = req.headers[name.toLowerCase()];
                return Array.isArray(value) ? value[0] : value;
            };

            const customMode = getHeader('X-Respond-With') || getHeader('X-Return-Format');
            if (customMode) {
                instance.respondWith = customMode;
            }

            const withGeneratedAlt = getHeader('X-With-Generated-Alt');
            if (withGeneratedAlt !== undefined) {
                instance.withGeneratedAlt = withGeneratedAlt.toLowerCase() === 'true';
            }

            const withLinksSummary = getHeader('x-with-links-summary');
            if (withLinksSummary !== undefined) {
                instance.withLinksSummary = Boolean(withLinksSummary);
            }

            const withImagesSummary = getHeader('x-with-images-summary');
            if (withImagesSummary !== undefined) {
                instance.withImagesSummary = Boolean(withImagesSummary);
            }

            const noCache = getHeader('x-no-cache');
            if (noCache !== undefined) {
                instance.noCache = Boolean(noCache);
            }

            if (instance.noCache && instance.cacheTolerance === undefined) {
                instance.cacheTolerance = 0;
            }

            let cacheTolerance = parseInt(getHeader('x-cache-tolerance') || '');
            if (!isNaN(cacheTolerance)) {
                instance.cacheTolerance = cacheTolerance;
            }

            let timeoutSeconds = parseInt(getHeader('x-timeout') || '');
            if (!isNaN(timeoutSeconds) && timeoutSeconds > 0) {
                instance.timeout = timeoutSeconds <= 180 ? timeoutSeconds : 180;
            } else if (getHeader('x-timeout')) {
                instance.timeout = null;
            }

            const removeSelector = getHeader('x-remove-selector')?.split(', ');
            instance.removeSelector ??= removeSelector;

            const targetSelector = getHeader('x-target-selector')?.split(', ');
            instance.targetSelector ??= targetSelector;

            const waitForSelector = getHeader('x-wait-for-selector')?.split(', ');
            instance.waitForSelector ??= waitForSelector || instance.targetSelector;

            instance.targetSelector = filterSelector(instance.targetSelector);

            const overrideUserAgent = getHeader('x-user-agent');
            instance.userAgent ??= overrideUserAgent;

            const keepImgDataUrl = getHeader('x-keep-img-data-url');
            if (keepImgDataUrl !== undefined) {
                instance.keepImgDataUrl = Boolean(keepImgDataUrl);
            }

            const withIframe = getHeader('x-with-iframe');
            if (withIframe !== undefined) {
                instance.withIframe = Boolean(withIframe);
            }

            if (instance.withIframe) {
                instance.timeout ??= null;
            }

            const cookies: CookieParam[] = [];
            const setCookieHeaders = getHeader('x-set-cookie')?.split(', ') || (instance.setCookies as any as string[]);
            if (Array.isArray(setCookieHeaders)) {
                for (const setCookie of setCookieHeaders) {
                    cookies.push({
                        ...parseSetCookieString(setCookie, { decodeValues: false }) as CookieParam,
                    });
                }
            } else if (setCookieHeaders && typeof setCookieHeaders === 'string') {
                cookies.push({
                    ...parseSetCookieString(setCookieHeaders, { decodeValues: false }) as CookieParam,
                });
            }

            const proxyUrl = getHeader('x-proxy-url');
            instance.proxyUrl ??= proxyUrl;

            if (instance.cacheTolerance) {
                instance.cacheTolerance = instance.cacheTolerance * 1000;
            }
        }

        return instance;
    }
}

export class CrawlerOptionsHeaderOnly extends CrawlerOptions {
    static override from<T extends CrawlerOptionsHeaderOnly>(this: Constructor<T>, ...args: any[]): T {
        const req = args[0] as Request;
        return super.from({}, req) as T;
    }
}

function filterSelector(s?: string | string[]) {
    if (!s) {
        return s;
    }
    const sr = Array.isArray(s) ? s : [s];
    const selectors = sr.filter((i)=> {
        const innerSelectors = i.split(',').map((s) => s.trim());
        const someViolation = innerSelectors.find((x) => x.startsWith('*') || x.startsWith(':') || x.includes('*:'));
        if (someViolation) {
            return false;
        }
        return true;
    })

    return selectors;
};
