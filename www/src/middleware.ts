import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTenantData } from './utils/tenantUtils'

export async function middleware(request: NextRequest) {
    const url = request.nextUrl
    const hostname = request.headers.get('host') || ''
    let subdomain = hostname.split('.')[0]

    if (subdomain === "www") {
        return NextResponse.next()
    }

    if (hostname.includes("localhost") && !hostname.includes('.')) {
        subdomain = "sfds"
    }

    let tenantData = await getTenantData(subdomain)

    if (!tenantData) {
        return NextResponse.redirect('https://sfds.usualsmart.com')
    }

    const isProd = process.env.NODE_ENV === 'production';
    const prodDomain = process.env.PROD_DOMAIN || 'sfds.usualsmart.com';
    const prodDomainWithHttps = `https://${prodDomain}`;

    const hostNameWithProtocol = hostname.includes('safetyfirstds') ? `https://${hostname}` : `https://${hostname}`

    tenantData = {
        ...tenantData,
        // logo: tenantData?.logo
        //     ? (isProd ? `${hostNameWithProtocol}/${tenantData.logo}` : `${prodDomainWithHttps}/${tenantData.logo}`)
        //     : ""
        logo: tenantData?.logo
            ? `${prodDomainWithHttps}/${tenantData.logo}`
            : ""
    }

    // Pass tenant data as a query parameter
    url.searchParams.set('tenantData', JSON.stringify(tenantData))

    // Or, if you prefer, set it as a header
    // const response = NextResponse.next()
    // response.headers.set('X-Tenant-Data', JSON.stringify(tenantData))
    // return response

    return NextResponse.rewrite(url)
}

export const config = {
    matcher: ['/', '/drivers-ed', '/behind-the-wheel', '/traffic-school', '/pricing', '/blog', '/login', '/signup'],
}