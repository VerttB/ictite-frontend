"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const measurementId =
    process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
        : undefined;

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        [key: `ga-disable-${string}`]: boolean | undefined;
    }
}

let previousLocation = "";
let pausedForInvite = false;

function reportPageView(pathname: string) {
    if (!measurementId) return;

    const analytics = window;
    const disableKey = `ga-disable-${measurementId}` as const;

    if (/(?:^|\/)convite(?:\/|$)/i.test(pathname)) {
        if (!analytics[disableKey]) {
            analytics[disableKey] = true;
            pausedForInvite = true;
        }
        previousLocation = "";
        return;
    }
    if (pausedForInvite) {
        delete analytics[disableKey];
        pausedForInvite = false;
    }
    if (analytics[disableKey]) return;

    const pageLocation = window.location.origin + window.location.pathname;
    if (pageLocation === previousLocation) return;

    const page = {
        page_location: pageLocation,
        page_referrer:
            previousLocation ||
            (document.referrer ? new URL(document.referrer).origin : ""),
        page_title: document.title,
    };
    analytics.dataLayer ??= [];
    const gtag = (analytics.gtag ??= function () {
        // eslint-disable-next-line prefer-rest-params -- Formato da fila do gtag.
        analytics.dataLayer?.push(arguments);
    });
    gtag("set", page);

    if (!document.getElementById("google-analytics-script")) {
        gtag("js", new Date());
        gtag("config", measurementId, { send_page_view: false });

        const script = document.createElement("script");
        script.id = "google-analytics-script";
        script.async = true;
        script.referrerPolicy = "origin";
        script.src =
            "https://www.googletagmanager.com/gtag/js?id=" +
            encodeURIComponent(measurementId);
        document.head.appendChild(script);
    }

    gtag("event", "page_view", { ...page, send_to: measurementId });
    previousLocation = pageLocation;
}

export function GoogleAnalytics() {
    const pathname = usePathname();

    useEffect(() => {
        if (pathname) reportPageView(pathname);
    }, [pathname]);

    return null;
}
