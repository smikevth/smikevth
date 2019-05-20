define([], function(){

  function delay(ms) {
    return function(x) {
      return new Promise(resolve => setTimeout(()=>resolve(x), ms));
    }
  }

  async function supportsWebp() {
    if (!self.createImageBitmap) return false;

    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
    const blob = await fetch(webpData).then(r => r.blob());
    return createImageBitmap(blob).then(() => true, () => false);
  }

  async function webPNess(html) {
    if(await supportsWebp()) {
      return html.replace(/%jpg/g, "webp").replace(/%png/g, "webp");
    }
    else {
      return html.replace(/%jpg/g, "jpg").replace(/%png/g, "png");
    }
  }

  function scrollToTop() {
    $("html, body").animate({scrollTop: 0}, 300);
  }

  return {
    delay: delay,
    supportsWebp: supportsWebp,
    webPNess: webPNess,
    scrollToTop: scrollToTop
  }
});
