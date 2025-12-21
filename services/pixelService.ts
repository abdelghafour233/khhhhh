
export const injectPixels = (settings: { fbPixel: string, googleAnalytics: string, tiktokPixel: string }) => {
  // Clear old scripts to prevent duplicates if settings change
  document.querySelectorAll('.tracking-pixel').forEach(el => el.remove());

  if (settings.fbPixel) {
    const script = document.createElement('script');
    script.className = 'tracking-pixel';
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${settings.fbPixel}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }

  if (settings.googleAnalytics) {
    const scriptTag = document.createElement('script');
    scriptTag.className = 'tracking-pixel';
    scriptTag.async = true;
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`;
    document.head.appendChild(scriptTag);

    const configScript = document.createElement('script');
    configScript.className = 'tracking-pixel';
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${settings.googleAnalytics}');
    `;
    document.head.appendChild(configScript);
  }

  if (settings.tiktokPixel) {
    const script = document.createElement('script');
    script.className = 'tracking-pixel';
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","trackWithQuery","click","updateCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,i);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n;var o=d.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${settings.tiktokPixel}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(script);
  }
};
